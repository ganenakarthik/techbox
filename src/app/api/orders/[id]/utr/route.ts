import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PaymentStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { utrNumber } = body;

    if (!utrNumber || String(utrNumber).trim().length < 6) {
      return NextResponse.json(
        { error: "Valid Bank Reference / UTR Number is required (minimum 6 digits)" },
        { status: 400 }
      );
    }

    const cleanUtr = String(utrNumber).trim();

    // Look up order first to verify access
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security check: Only the customer who owns the order or staff/admin can submit UTR
    if (order.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Transactional UTR Submission: Lock and check duplicates atomically
    const updated = await prisma.$transaction(async (tx) => {
      // Fraud Prevention: Check if this UTR was already submitted for another order
      const duplicateOrder = await tx.order.findFirst({
        where: {
          utrNumber: cleanUtr,
          id: { not: order.id },
        },
      });

      if (duplicateOrder) {
        throw new Error(
          `This UTR/reference number has already been submitted for order ${duplicateOrder.orderNumber}. Each bank transaction reference may only be used once.`
        );
      }

      // Update order with UTR and move to PAYMENT_SUBMITTED
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          utrNumber: cleanUtr,
          utrSubmittedAt: new Date(),
          paymentStatus: PaymentStatus.PAYMENT_SUBMITTED,
        },
      });

      // Update or create payment transaction
      const existingTxn = await tx.paymentTransaction.findFirst({
        where: { orderId: order.id },
      });

      if (existingTxn) {
        await tx.paymentTransaction.update({
          where: { id: existingTxn.id },
          data: {
            transactionRef: `TXN-UTR-${cleanUtr}-${order.orderNumber}`,
            status: PaymentStatus.PAYMENT_SUBMITTED,
            gatewayPayload: {
              utr: cleanUtr,
              submittedAt: new Date().toISOString(),
            },
          },
        });
      } else {
        await tx.paymentTransaction.create({
          data: {
            orderId: order.id,
            transactionRef: `TXN-UTR-${cleanUtr}-${order.orderNumber}`,
            gateway: order.paymentMethod,
            amount: order.total,
            status: PaymentStatus.PAYMENT_SUBMITTED,
            gatewayPayload: {
              utr: cleanUtr,
              submittedAt: new Date().toISOString(),
            },
          },
        });
      }

      // Emit OrderEvent: PAYMENT_SUBMITTED
      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          eventType: "PAYMENT_SUBMITTED",
          actor: `CUSTOMER:${user.id}`,
          message: `Customer submitted bank transaction reference UTR: ${cleanUtr}`,
          metadata: { utrNumber: cleanUtr, amount: Number(order.total) },
        },
      });

      // Persist customer notification
      await tx.notification.create({
        data: {
          userId: order.userId,
          title: `Payment Reference Submitted: #${order.orderNumber}`,
          message: `We received your UTR ${cleanUtr}. Our operations desk will verify with bank credits shortly.`,
          link: `/orders/${order.orderNumber}`,
        },
      });

      return updatedOrder;
    }, { maxWait: 10000, timeout: 20000 });

    return NextResponse.json({
      success: true,
      message: "UTR submitted successfully! Operations team will verify payment against bank records.",
      order: {
        id: updated.id,
        orderNumber: updated.orderNumber,
        utrNumber: updated.utrNumber,
        paymentStatus: updated.paymentStatus,
      },
    });
  } catch (error: any) {
    console.error("UTR submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit UTR reference" },
      { status: 400 }
    );
  }
}
