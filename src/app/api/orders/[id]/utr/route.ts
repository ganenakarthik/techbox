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

    // Look up order
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

    // Update order with UTR and move to PAYMENT_SUBMITTED
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        utrNumber: cleanUtr,
        utrSubmittedAt: new Date(),
        paymentStatus: PaymentStatus.PAYMENT_SUBMITTED,
      },
    });

    // Also update or create transaction
    const existingTxn = await prisma.paymentTransaction.findFirst({
      where: { orderId: order.id },
    });

    if (existingTxn) {
      await prisma.paymentTransaction.update({
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
      await prisma.paymentTransaction.create({
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

    return NextResponse.json({
      success: true,
      message: "UTR submitted successfully. Our operations team will verify your payment.",
      order: updated,
      orderNumber: updated.orderNumber,
      paymentStatus: updated.paymentStatus,
      utrNumber: cleanUtr,
    });
  } catch (error: any) {
    console.error("UTR submission error:", error);
    return NextResponse.json({ error: "Failed to submit UTR" }, { status: 500 });
  }
}
