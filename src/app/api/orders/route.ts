import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: true,
        shipment: true,
        transactions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      createdAt: o.createdAt.toISOString(),
      status: o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      total: Number(o.total),
      subtotal: Number(o.subtotal),
      shippingFee: Number(o.shippingFee),
      discount: Number(o.discount),
      campusDetail: o.campusDetail,
      recipientName: o.recipientName,
      recipientPhone: o.recipientPhone,
      items: o.items.map((i) => ({
        id: i.id,
        productName: i.productName,
        sku: i.sku,
        variantName: i.variantName,
        price: Number(i.unitPrice),
        quantity: i.quantity,
        total: Number(i.totalPrice),
      })),
      shipment: o.shipment
        ? {
            trackingNumber: o.shipment.trackingNumber,
            carrier: o.shipment.carrier,
            currentCheckpoint: o.shipment.currentCheckpoint,
            estimatedDelivery: o.shipment.estimatedDelivery.toISOString(),
          }
        : null,
    }));

    return NextResponse.json({ orders: formatted });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
