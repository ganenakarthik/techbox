import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
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
        items: true,
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
      // ATOMIC TRANSACTION: Order + Inventory Allocation + Payment + Shipment + OrderEvent + Notification + AuditLog
      const result = await prisma.$transaction(async (tx) => {
        // 1. Verify current status is PAYMENT_SUBMITTED or PENDING
        if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
          throw new Error(`Order in state ${order.status} cannot undergo payment verification.`);
        }

        // 2. Move inventory from reserved to allocated
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

        // 3. Update Order
        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: PaymentStatus.PAYMENT_VERIFIED,
            status: OrderStatus.CONFIRMED,
            paymentVerifiedAt: new Date(),
            paymentVerifiedBy: user.id,
          },
        });

        // 4. Update PaymentTransaction
        await tx.paymentTransaction.updateMany({
          where: { orderId: order.id },
          data: {
            status: PaymentStatus.PAYMENT_VERIFIED,
          },
        });

        // 5. Update Shipment Checkpoints
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

        // 6. Create OrderEvent
        await tx.orderEvent.create({
          data: {
            orderId: order.id,
            eventType: "PAYMENT_VERIFIED",
            actor: `OPERATOR:${user.id}`,
            message: `Bank payment verified by ${user.name}. Order status moved to CONFIRMED.`,
            metadata: { utrNumber: order.utrNumber, paymentStatus: PaymentStatus.PAYMENT_VERIFIED },
          },
        });

        // 7. Customer Notification
        await tx.notification.create({
          data: {
            userId: order.userId,
            title: `Payment Confirmed - Order #${order.orderNumber}`,
            message: `Your payment of ₹${order.total} has been verified successfully. Your order is now confirmed and queued for packing!`,
            link: `/orders/${order.orderNumber}`,
          },
        });

        // 8. Persist AdminAuditLog
        await tx.adminAuditLog.create({
          data: {
            adminId: user.id,
            action: "VERIFY_PAYMENT",
            target: `Order ${order.orderNumber}`,
            previousValue: { paymentStatus: order.paymentStatus, status: order.status },
            newValue: { paymentStatus: PaymentStatus.PAYMENT_VERIFIED, status: OrderStatus.CONFIRMED },
            details: `Atomic verification of UTR ${order.utrNumber || "N/A"} for ₹${order.total}. Allocated reserved inventory.`,
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
      // ATOMIC REJECT TRANSACTION: Restore reserved inventory back to available stock
      const result = await prisma.$transaction(async (tx) => {
        // 1. Release reserved stock back to available inventory
        for (const item of order.items) {
          if (item.variantId) {
            await tx.inventory.updateMany({
              where: { variantId: item.variantId },
              data: {
                reserved: { decrement: item.quantity },
                available: { increment: item.quantity },
              },
            });
          }
        }

        // 2. Update Order
        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: PaymentStatus.PAYMENT_FAILED,
          },
        });

        // 3. Update Payment Transactions
        await tx.paymentTransaction.updateMany({
          where: { orderId: order.id },
          data: {
            status: PaymentStatus.PAYMENT_FAILED,
          },
        });

        // 4. Create Order Event
        await tx.orderEvent.create({
          data: {
            orderId: order.id,
            eventType: "PAYMENT_FAILED",
            actor: `OPERATOR:${user.id}`,
            message: `Bank payment rejected: ${reason || "Invalid transaction details"}. Released reserved inventory.`,
            metadata: { reason, utrNumber: order.utrNumber },
          },
        });

        // 5. Customer Notification
        await tx.notification.create({
          data: {
            userId: order.userId,
            title: `Payment Verification Issue - Order #${order.orderNumber}`,
            message: `The UTR provided (${order.utrNumber || "None"}) could not be verified: ${reason || "Invalid transaction details"}. Please re-submit your UTR or contact support.`,
            link: `/orders/${order.orderNumber}`,
          },
        });

        // 6. Admin Audit Log
        await tx.adminAuditLog.create({
          data: {
            adminId: user.id,
            action: "REJECT_PAYMENT",
            target: `Order ${order.orderNumber}`,
            previousValue: { paymentStatus: order.paymentStatus },
            newValue: { paymentStatus: PaymentStatus.PAYMENT_FAILED },
            details: `Rejected UTR. Reason: ${reason || "Invalid bank transaction reference"}. Restored reserved inventory.`,
          },
        });

        return updatedOrder;
      }, { maxWait: 15000, timeout: 30000 });

      return NextResponse.json({
        success: true,
        message: "Payment marked FAILED. Reserved inventory released back to available stock.",
        order: result,
      });
    }
  } catch (error: any) {
    console.error("Admin verify payment error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 });
  }
}
