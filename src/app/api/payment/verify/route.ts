import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { processPayment } from "@/lib/payment";
import { sendNotification } from "@/lib/email";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderNumber, paymentMethod = "test_mode", upiId } = body;

    if (!orderNumber) {
      return NextResponse.json({ error: "orderNumber is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Process payment through provider abstraction
    const paymentResult = await processPayment({
      orderNumber,
      amount: Number(order.total),
      method: paymentMethod,
      upiId,
    });

    // Create PaymentTransaction in database
    await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        transactionRef: paymentResult.transactionRef,
        gateway: paymentResult.gateway,
        amount: order.total,
        currency: "INR",
        status: paymentResult.status,
        gatewayPayload: paymentResult.metadata,
      },
    });

    // Update Order Status
    const isPaid = paymentResult.status === PaymentStatus.PAYMENT_VERIFIED;
    const newOrderStatus = isPaid ? OrderStatus.CONFIRMED : OrderStatus.PENDING;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: paymentResult.status,
        status: newOrderStatus,
      },
    });

    // Automatically initialize genuine Shipment with tracking code and initial checkpoint
    const trackingNumber = `TRK-TB-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date();
    const estDelivery = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

    const initialCheckpoints = [
      {
        status: "CONFIRMED",
        title: "Order Confirmed & Payment Verified",
        time: now.toISOString(),
        location: "TechBox Campus Dispatch Hub",
        description: "Your electronic components have been reserved and routed to the campus packing bench.",
      },
    ];

    await prisma.shipment.upsert({
      where: { orderId: order.id },
      update: {},
      create: {
        orderId: order.id,
        carrier: "TechBox Campus Express Runner",
        trackingNumber,
        currentCheckpoint: "Order Confirmed & Payment Verified",
        checkpointHistory: initialCheckpoints,
        estimatedDelivery: estDelivery,
      },
    });

    // Send in-app notification
    await sendNotification({
      userId: user.id,
      title: `Order ${orderNumber} Confirmed!`,
      message: `Your campus hardware order of ₹${order.total} has been confirmed. Tracking code: ${trackingNumber}.`,
      link: `/orders/${orderNumber}`,
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      transactionRef: paymentResult.transactionRef,
      trackingNumber,
      paymentStatus: paymentResult.status,
      orderStatus: newOrderStatus,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
