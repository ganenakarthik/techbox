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
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
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

    // Check for idempotency: if already verified, return safely
    if (action === "APPROVE" && order.paymentStatus === PaymentStatus.PAYMENT_VERIFIED) {
      return NextResponse.json({
        success: true,
        message: "Payment is already verified for this order.",
        order,
      });
    }

    if (action === "APPROVE") {
      // ATOMIC TRANSACTION: Order + Payment + Shipment + OrderEvent + Notification + AuditLog
      const result = await prisma.$transaction(async (tx) => {
        // 1. Verify current status is PAYMENT_SUBMITTED or PENDING
        if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
          throw new Error(`Order in state ${order.status} cannot undergo payment verification.`);
        }

        // 2. Update Order
        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: PaymentStatus.PAYMENT_VERIFIED,
            status: OrderStatus.CONFIRMED,
            paymentVerifiedAt: new Date(),
            paymentVerifiedBy: user.id,
          },
        });

        // 3. Update PaymentTransaction
        await tx.paymentTransaction.updateMany({
          where: { orderId: order.id },
          data: {
            status: PaymentStatus.PAYMENT_VERIFIED,
          },
        });

        // 4. Update Shipment Checkpoints
        if (order.shipment) {
          const history = Array.isArray(order.shipment.checkpointHistory)
            ? (order.shipment.checkpointHistory as any[])
            : [];
          history.push({
            status: "PAYMENT_VERIFIED",
            location: "Partsly Financial Clearance Desk",
            timestamp: new Date().toISOString(),
            note: `UTR ${order.utrNumber || "Verified"} cleared. Order confirmed for campus packing.`,
          });

          await tx.shipment.update({
            where: { id: order.shipment.id },
            data: {
              currentCheckpoint: "Payment Verified • Queued for Packing",
              checkpointHistory: history,
            },
          });
        }

        // 5. Create OrderEvent
        await tx.orderEvent.create({
          data: {
            orderId: order.id,
            eventType: "PAYMENT_VERIFIED",
            actor: `OPERATOR:${user.id}`,
            message: `Bank payment verified by operator for UTR ${order.utrNumber || "N/A"} (₹${order.total})`,
            metadata: {
              utrNumber: order.utrNumber,
              amount: Number(order.total),
              verifiedBy: user.name || user.email,
            },
          },
        });

        await tx.orderEvent.create({
          data: {
            orderId: order.id,
            eventType: "ORDER_CONFIRMED",
            actor: `OPERATOR:${user.id}`,
            message: `Order marked CONFIRMED following payment verification`,
            metadata: { confirmedAt: new Date().toISOString() },
          },
        });

        // 6. Persist customer in-app Notification
        await tx.notification.create({
          data: {
            userId: order.userId,
            title: `Payment Verified for Order ${order.orderNumber}!`,
            message: `Your payment of ₹${order.total} has been verified by our operations desk. Your hardware kit is now confirmed!`,
            link: `/orders/${order.orderNumber}`,
          },
        });

        // 7. Persist AdminAuditLog
        await tx.adminAuditLog.create({
          data: {
            adminId: user.id,
            action: "VERIFY_PAYMENT",
            target: `Order ${order.orderNumber}`,
            previousValue: { paymentStatus: order.paymentStatus, status: order.status },
            newValue: { paymentStatus: PaymentStatus.PAYMENT_VERIFIED, status: OrderStatus.CONFIRMED },
            details: `Atomic verification of UTR ${order.utrNumber || "N/A"} for ₹${order.total}`,
          },
        });

        return updatedOrder;
      }, { maxWait: 15000, timeout: 30000 });

      return NextResponse.json({
        success: true,
        message: "Payment successfully verified and order marked CONFIRMED.",
        order: result,
      });
    } else {
      // ATOMIC REJECT TRANSACTION
      const result = await prisma.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: PaymentStatus.PAYMENT_FAILED,
          },
        });

        await tx.paymentTransaction.updateMany({
          where: { orderId: order.id },
          data: {
            status: PaymentStatus.PAYMENT_FAILED,
          },
        });

        await tx.orderEvent.create({
          data: {
            orderId: order.id,
            eventType: "PAYMENT_FAILED",
            actor: `OPERATOR:${user.id}`,
            message: `Bank payment rejected: ${reason || "Invalid transaction details"}`,
            metadata: { reason, utrNumber: order.utrNumber },
          },
        });

        await tx.notification.create({
          data: {
            userId: order.userId,
            title: `Payment Verification Issue - Order ${order.orderNumber}`,
            message: `The UTR provided (${order.utrNumber || "None"}) could not be verified: ${reason || "Invalid transaction details"}. Please re-submit your UTR or contact support.`,
            link: `/orders/${order.orderNumber}`,
          },
        });

        await tx.adminAuditLog.create({
          data: {
            adminId: user.id,
            action: "REJECT_PAYMENT",
            target: `Order ${order.orderNumber}`,
            previousValue: { paymentStatus: order.paymentStatus },
            newValue: { paymentStatus: PaymentStatus.PAYMENT_FAILED },
            details: `Rejected UTR. Reason: ${reason || "Invalid bank transaction reference"}`,
          },
        });

        return updatedOrder;
      }, { maxWait: 15000, timeout: 30000 });

      return NextResponse.json({
        success: true,
        message: "Payment marked FAILED. Customer notified to re-submit UTR.",
        order: result,
      });
    }
  } catch (error: any) {
    console.error("Admin verify payment error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 });
  }
}

