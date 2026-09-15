import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { sendNotification } from "@/lib/email";
import { OrderStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { status, checkpointNote, location = "Campus Hub" } = body;

    if (!status) {
      return NextResponse.json({ error: "New status is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        shipment: true,
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const prevStatus = order.status;
    const newStatus = status as OrderStatus;

    // Handle cancellation: restore inventory if needed
    if (newStatus === OrderStatus.CANCELLED && prevStatus !== OrderStatus.CANCELLED) {
      for (const item of order.items) {
        if (item.variantId) {
          await prisma.inventory.update({
            where: { variantId: item.variantId },
            data: {
              available: { increment: item.quantity },
              reserved: { decrement: item.quantity },
            },
          });
        }
      }
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: newStatus,
      },
    });

    // Update shipment checkpoints if shipment exists
    if (order.shipment) {
      const history = (order.shipment.checkpointHistory as any[]) || [];
      const newCheckpoint = {
        status: newStatus,
        title: checkpointNote || `Order marked ${newStatus}`,
        time: new Date().toISOString(),
        location,
        updatedBy: user.name,
      };

      const updatedHistory = [...history, newCheckpoint];

      await prisma.shipment.update({
        where: { id: order.shipment.id },
        data: {
          currentCheckpoint: newCheckpoint.title,
          checkpointHistory: updatedHistory,
          dispatchedAt: newStatus === OrderStatus.SHIPPED ? new Date() : order.shipment.dispatchedAt,
          deliveredAt: newStatus === OrderStatus.DELIVERED ? new Date() : order.shipment.deliveredAt,
        },
      });
    }

    // Log admin action to AdminAuditLog
    await logAdminAction({
      adminId: user.id,
      action: "UPDATE_ORDER_STATUS",
      target: `Order:${order.orderNumber}`,
      previousValue: { status: prevStatus },
      newValue: { status: newStatus, note: checkpointNote },
      details: `Changed order ${order.orderNumber} status from ${prevStatus} to ${newStatus}`,
    });

    // Notify student
    await sendNotification({
      userId: order.userId,
      title: `Order ${order.orderNumber} Status Updated`,
      message: `Your order is now ${newStatus}. ${checkpointNote || ""}`,
      link: `/orders/${order.orderNumber}`,
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `Order status updated to ${newStatus}`,
    });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
