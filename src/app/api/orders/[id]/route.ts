import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    // Look up by either orderNumber or id
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
        shipment: true,
        transactions: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security & Data Isolation: User can only access their own order unless Admin/Staff
    if (order.userId && (!user || (order.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF"))) {
      return NextResponse.json({ error: "Access denied: You do not have permission to view this order" }, { status: 403 });
    }

    const formatted = {
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      utrNumber: order.utrNumber,
      utrSubmittedAt: order.utrSubmittedAt ? order.utrSubmittedAt.toISOString() : null,
      paymentVerifiedAt: order.paymentVerifiedAt ? order.paymentVerifiedAt.toISOString() : null,
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      shippingFee: Number(order.shippingFee),
      tax: Number(order.tax),
      total: Number(order.total),
      recipientName: order.recipientName,
      recipientPhone: order.recipientPhone,
      campusDetail: order.campusDetail,
      deliveryMethod: order.deliveryMethod || "TECHBOX_CAMPUS_DELIVERY",
      runnerName: order.runnerName || null,
      runnerPhone: order.runnerPhone || null,
      packedAt: order.packedAt ? order.packedAt.toISOString() : null,
      packedBy: order.packedBy || null,
      packingNotes: order.packingNotes || null,
      items: order.items.map((i) => ({
        id: i.id,
        productName: i.productName,
        sku: i.sku,
        variantName: i.variantName,
        price: Number(i.unitPrice),
        quantity: i.quantity,
        total: Number(i.totalPrice),
        specs: i.specSnapshot || {},
      })),
      transactions: order.transactions.map((t) => ({
        id: t.id,
        transactionRef: t.transactionRef,
        gateway: t.gateway,
        amount: Number(t.amount),
        currency: t.currency,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
      })),
      shipment: order.shipment
        ? {
            trackingNumber: order.shipment.trackingNumber,
            carrier: order.shipment.carrier,
            currentCheckpoint: order.shipment.currentCheckpoint,
            estimatedDelivery: order.shipment.estimatedDelivery.toISOString(),
            dispatchedAt: order.shipment.dispatchedAt?.toISOString() || null,
            deliveredAt: order.shipment.deliveredAt?.toISOString() || null,
            checkpointHistory: (order.shipment.checkpointHistory as any[]) || [],
            checkpoints: (order.shipment.checkpointHistory as any[]) || [],
          }
        : null,
    };

    return NextResponse.json({ order: formatted });
  } catch (error) {
    console.error("Order GET by ID error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
