import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { sendNotification } from "@/lib/email";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: {
            variant: {
              include: {
                inventory: true,
                product: { select: { name: true, images: true } },
              },
            },
            projectKit: true,
          },
        },
        shipment: true,
        transactions: true,
        college: true,
        campus: true,
        pickupLocation: true,
        deliverySlot: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      status,
      checkpointNote,
      location = "TechBox Operations Hub",
      packingNotes,
      deliveryMethod = "TECHBOX_CAMPUS_DELIVERY",
      carrier = "TechBox Campus Delivery",
      runnerName,
      runnerPhone,
      trackingNumber,
      dispatchNotes,
      cancellationReason,
      refundReason,
    } = body;

    if (!status) {
      return NextResponse.json({ error: "New status is required" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        shipment: true,
        items: {
          include: {
            variant: {
              include: { inventory: true },
            },
          },
        },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const prevStatus = order.status;
    const newStatus = status as OrderStatus;

    // Physical Inventory Lifecycle State Transitions:
    // 1. Order Placed: available -> reserved (handled at checkout)
    // 2. Order Packed: reserved -> allocated
    // 3. Order Delivered: allocated -> sold
    // 4. Order Cancelled: reserved/allocated -> available

    if (newStatus === OrderStatus.PACKED && prevStatus !== OrderStatus.PACKED) {
      for (const item of order.items) {
        if (item.variantId) {
          await prisma.inventory.updateMany({
            where: { variantId: item.variantId },
            data: {
              reserved: { decrement: item.quantity },
              allocated: { increment: item.quantity },
            },
          });
        }
      }
    } else if (newStatus === OrderStatus.DELIVERED && prevStatus !== OrderStatus.DELIVERED) {
      for (const item of order.items) {
        if (item.variantId) {
          await prisma.inventory.updateMany({
            where: { variantId: item.variantId },
            data: {
              allocated: { decrement: item.quantity },
              sold: { increment: item.quantity },
            },
          });
        }
      }
    } else if (newStatus === OrderStatus.CANCELLED && prevStatus !== OrderStatus.CANCELLED) {
      for (const item of order.items) {
        if (item.variantId) {
          if (prevStatus === OrderStatus.PACKED || prevStatus === OrderStatus.SHIPPED || prevStatus === OrderStatus.OUT_FOR_DELIVERY) {
            await prisma.inventory.updateMany({
              where: { variantId: item.variantId },
              data: {
                allocated: { decrement: item.quantity },
                available: { increment: item.quantity },
              },
            });
          } else {
            await prisma.inventory.updateMany({
              where: { variantId: item.variantId },
              data: {
                reserved: { decrement: item.quantity },
                available: { increment: item.quantity },
              },
            });
          }
        }
      }
    }

    // Prepare order update payload
    const updatePayload: any = {
      status: newStatus,
    };

    if (newStatus === OrderStatus.PACKED) {
      updatePayload.packedAt = new Date();
      updatePayload.packedBy = user.name;
      if (packingNotes) updatePayload.packingNotes = packingNotes;
    }

    if (newStatus === OrderStatus.SHIPPED) {
      updatePayload.deliveryMethod = deliveryMethod;
      if (runnerName) updatePayload.runnerName = runnerName;
      if (runnerPhone) updatePayload.runnerPhone = runnerPhone;
      if (dispatchNotes) updatePayload.dispatchNotes = dispatchNotes;
    }

    if (newStatus === OrderStatus.CANCELLED && cancellationReason) {
      updatePayload.cancellationReason = cancellationReason;
    }

    if (refundReason) {
      updatePayload.refundReason = refundReason;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: updatePayload,
    });

    // Handle Shipment updates / creation
    const trackingNo = trackingNumber || (runnerPhone ? `TBX-RUNNER-${runnerPhone.replace(/\D/g, "")}` : `TBX-DEL-${order.orderNumber}`);
    const actualCarrier = deliveryMethod === "TECHBOX_CAMPUS_DELIVERY" ? "TechBox Campus Delivery" : (carrier || "Courier Partner");

    let updatedShipment = order.shipment;

    if (!updatedShipment) {
      // Create shipment record
      updatedShipment = await prisma.shipment.create({
        data: {
          orderId: order.id,
          carrier: actualCarrier,
          trackingNumber: trackingNo,
          currentCheckpoint: checkpointNote || `Order ${newStatus}`,
          estimatedDelivery: new Date(Date.now() + 4 * 3600 * 1000), // default 4 hours for campus delivery
          dispatchedAt: newStatus === OrderStatus.SHIPPED ? new Date() : null,
          deliveredAt: newStatus === OrderStatus.DELIVERED ? new Date() : null,
          checkpointHistory: [
            {
              status: newStatus,
              title: checkpointNote || `Order marked ${newStatus}`,
              time: new Date().toISOString(),
              location,
              updatedBy: user.name,
              runner: runnerName ? `${runnerName} (${runnerPhone})` : null,
            },
          ],
        },
      });
    } else {
      const history = (updatedShipment.checkpointHistory as any[]) || [];
      const newCheckpoint = {
        status: newStatus,
        title: checkpointNote || (
          newStatus === OrderStatus.PACKED ? "Packed into sealed ESD anti-static parcel" :
          newStatus === OrderStatus.SHIPPED ? `Dispatched with ${actualCarrier}` :
          newStatus === OrderStatus.OUT_FOR_DELIVERY ? `Campus Runner is out for delivery to ${order.campusDetail || "Campus"}` :
          newStatus === OrderStatus.DELIVERED ? `Delivered to ${order.recipientName}` :
          `Order marked ${newStatus}`
        ),
        time: new Date().toISOString(),
        location,
        updatedBy: user.name,
        runner: runnerName ? `${runnerName} (${runnerPhone})` : null,
      };

      updatedShipment = await prisma.shipment.update({
        where: { id: updatedShipment.id },
        data: {
          carrier: actualCarrier,
          currentCheckpoint: newCheckpoint.title,
          checkpointHistory: [...history, newCheckpoint],
          dispatchedAt: newStatus === OrderStatus.SHIPPED ? (updatedShipment.dispatchedAt || new Date()) : updatedShipment.dispatchedAt,
          deliveredAt: newStatus === OrderStatus.DELIVERED ? new Date() : updatedShipment.deliveredAt,
        },
      });
    }

    // Map OrderStatus to OrderEventType
    const eventTypeMap: Record<string, string> = {
      CONFIRMED: "ORDER_CONFIRMED",
      PACKED: "ORDER_PACKED",
      SHIPPED: "ORDER_SHIPPED",
      OUT_FOR_DELIVERY: "ORDER_OUT_FOR_DELIVERY",
      DELIVERED: "ORDER_DELIVERED",
      CANCELLED: "ORDER_CANCELLED",
    };

    const targetEventType = eventTypeMap[newStatus];
    if (targetEventType) {
      await prisma.orderEvent.create({
        data: {
          orderId: order.id,
          eventType: targetEventType as any,
          actor: `OPERATOR:${user.id}`,
          message: checkpointNote || `Order status updated to ${newStatus.replace(/_/g, " ")}`,
          metadata: {
            runnerName,
            runnerPhone,
            location,
            previousStatus: prevStatus,
            newStatus,
          },
        },
      });
    }

    // Persist customer in-app notification in PostgreSQL
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: `Order Update: ${order.orderNumber} is now ${newStatus.replace(/_/g, " ")}`,
        message: checkpointNote || `Your order status has been updated to ${newStatus.replace(/_/g, " ")}.`,
        link: `/orders/${order.orderNumber}`,
      },
    });

    // Immutable Audit Log
    await logAdminAction({
      adminId: user.id,
      action: `ORDER_${newStatus}`,
      target: `Order:${order.orderNumber}`,
      previousValue: { status: prevStatus },
      newValue: { status: newStatus, runnerName, runnerPhone, note: checkpointNote },
      details: `Operator ${user.name} transitioned order ${order.orderNumber} from ${prevStatus} to ${newStatus}`,
    });

    // Notify customer via email/SMS if configured
    await sendNotification({
      userId: order.userId,
      title: `Order Update: ${order.orderNumber} is now ${newStatus.replace(/_/g, " ")}`,
      message: checkpointNote || `Your order status has been updated to ${newStatus.replace(/_/g, " ")}.`,
      link: `/orders/${order.orderNumber}`,
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      shipment: updatedShipment,
    });
  } catch (error: any) {
    console.error("Order status update failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
