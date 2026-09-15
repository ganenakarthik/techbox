import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { sendNotification } from "@/lib/email";
import { OrderStatus, PaymentStatus } from "@prisma/client";

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
    const { action = "APPROVE", reason = "" } = body;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        shipment: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      // 1. Update Order status
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAYMENT_VERIFIED,
          status: order.status === OrderStatus.PENDING ? OrderStatus.CONFIRMED : order.status,
          paymentVerifiedAt: new Date(),
          paymentVerifiedBy: user.id,
        },
      });

      // 2. Update PaymentTransaction
      await prisma.paymentTransaction.updateMany({
        where: { orderId: order.id },
        data: {
          status: PaymentStatus.PAYMENT_VERIFIED,
        },
      });

      // 3. Append checkpoint to Shipment
      if (order.shipment) {
        const history = Array.isArray(order.shipment.checkpointHistory)
          ? (order.shipment.checkpointHistory as any[])
          : [];
        history.push({
          status: "PAYMENT_VERIFIED",
          location: "TechBox Financial Clearance Desk",
          timestamp: new Date().toISOString(),
          note: `UTR ${order.utrNumber || "Verified"} cleared. Order confirmed for campus packing.`,
        });

        await prisma.shipment.update({
          where: { id: order.shipment.id },
          data: {
            currentCheckpoint: "Payment Verified • Queued for Packing",
            checkpointHistory: history,
          },
        });
      }

      // 4. Send customer notification
      await sendNotification({
        userId: order.userId,
        title: `Payment Verified for Order ${order.orderNumber}!`,
        message: `Your payment of ₹${order.total} has been verified by our operations desk. Your hardware kit is now confirmed!`,
        link: `/orders/${order.orderNumber}`,
      });

      // 5. Audit Log
      await logAdminAction({
        adminId: user.id,
        action: "VERIFY_PAYMENT",
        target: `Order ${order.orderNumber}`,
        previousValue: { paymentStatus: order.paymentStatus, status: order.status },
        newValue: { paymentStatus: PaymentStatus.PAYMENT_VERIFIED, status: updatedOrder.status },
        details: `Verified UTR ${order.utrNumber || "N/A"} for ₹${order.total}`,
      });

      return NextResponse.json({
        success: true,
        message: "Payment successfully verified and order marked CONFIRMED.",
        order: updatedOrder,
      });
    } else {
      // REJECT action
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAYMENT_FAILED,
        },
      });

      await prisma.paymentTransaction.updateMany({
        where: { orderId: order.id },
        data: {
          status: PaymentStatus.PAYMENT_FAILED,
        },
      });

      await sendNotification({
        userId: order.userId,
        title: `Payment Verification Issue - Order ${order.orderNumber}`,
        message: `The UTR provided (${order.utrNumber || "None"}) could not be verified: ${reason || "Invalid transaction details"}. Please re-submit your UTR or contact support.`,
        link: `/orders/${order.orderNumber}`,
      });

      await logAdminAction({
        adminId: user.id,
        action: "REJECT_PAYMENT",
        target: `Order ${order.orderNumber}`,
        previousValue: { paymentStatus: order.paymentStatus },
        newValue: { paymentStatus: PaymentStatus.PAYMENT_FAILED },
        details: `Rejected UTR. Reason: ${reason || "Invalid bank transaction reference"}`,
      });

      return NextResponse.json({
        success: true,
        message: "Payment marked FAILED. Customer notified to re-submit UTR.",
        order: updatedOrder,
      });
    }
  } catch (error: any) {
    console.error("Admin verify payment error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
