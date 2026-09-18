import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { OrderStatus, PaymentStatus } from "@prisma/client";

// Strict state transition map to prevent impossible order jumps
const ALLOWED_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PACKED, OrderStatus.CANCELLED],
  [OrderStatus.PACKED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

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
      location = "Partsly Operations Hub",
      packingNotes,
      deliveryMethod = "PARTSLY_CAMPUS_DELIVERY",
      carrier = "Partsly Campus Delivery",
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

    // 1. Strict State Machine Transition Validation
    if (newStatus !== prevStatus) {
      const allowed = ALLOWED_ORDER_TRANSITIONS[prevStatus] || [];
      if (!allowed.includes(newStatus)) {
        return NextResponse.json(
          {
            error: `Illegal status transition from ${prevStatus} to ${newStatus}. Allowed transitions from ${prevStatus}: [${allowed.join(", ") || "none"}]`,
            code: "INVALID_ORDER_TRANSITION",
          },
          { status: 400 }
        );
      }
    }

    // 2. Execute entire order transition, inventory allocation, shipment update, events, and audit logs atomically in one Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // Inventory Lifecycle Transitions
      if (newStatus === OrderStatus.PACKED && prevStatus !== OrderStatus.PACKED) {
        for (const item of order.items) {
          if (item.variantId) {
            await tx.inventory.updateMany({
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
            await tx.inventory.updateMany({
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
              await tx.inventory.updateMany({
                where: { variantId: item.variantId },
                data: {
                  allocated: { decrement: item.quantity },
                  available: { increment: item.quantity },
                },
              });
            } else {
              await tx.inventory.updateMany({
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

      // Update Order
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

      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: updatePayload,
      });

      // Update or Create Shipment
      const trackingNo = trackingNumber || (runnerPhone ? `PRT-RUNNER-${runnerPhone.replace(/\D/g, "")}` : `PRT-DEL-${order.orderNumber}`);
      const actualCarrier = (deliveryMethod === "PARTSLY_CAMPUS_DELIVERY" || deliveryMethod === "TECHBOX_CAMPUS_DELIVERY") ? "Partsly Campus Delivery" : (carrier || "Courier Partner");

      let updatedShipment = order.shipment;

      if (!updatedShipment) {
        updatedShipment = await tx.shipment.create({
          data: {
            orderId: order.id,
            carrier: actualCarrier,
            trackingNumber: trackingNo,
            currentCheckpoint: checkpointNote || `Order ${newStatus}`,
            estimatedDelivery: new Date(Date.now() + 4 * 3600 * 1000),
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

        updatedShipment = await tx.shipment.update({
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

      // Order Event
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
        await tx.orderEvent.create({
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

      // Customer Notification
      await tx.notification.create({
        data: {
          userId: order.userId,
          title: `Order Update: #${order.orderNumber} is now ${newStatus.replace(/_/g, " ")}`,
          message: checkpointNote || `Your order status has been updated to ${newStatus.replace(/_/g, " ")}.`,
          link: `/orders/${order.orderNumber}`,
        },
      });

      // Admin Audit Log
      await tx.adminAuditLog.create({
        data: {
          adminId: user.id,
          action: `ORDER_${newStatus}`,
          target: `Order:${order.orderNumber}`,
          previousValue: { status: prevStatus },
          newValue: { status: newStatus, runnerName, runnerPhone, note: checkpointNote },
          details: `Operator ${user.name} transitioned order ${order.orderNumber} from ${prevStatus} to ${newStatus}`,
        },
      });

      return { updatedOrder, updatedShipment };
    }, { maxWait: 15000, timeout: 30000 });

    return NextResponse.json({
      success: true,
      order: result.updatedOrder,
      shipment: result.updatedShipment,
    });
  } catch (error: any) {
    console.error("Order status update failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
