import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { OrderStatus, Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const q = searchParams.get("q")?.trim();

    const where: Prisma.OrderWhereInput = {};

    if (status && status !== "ALL") {
      if (status === "PAYMENT_SUBMITTED" || status === "PAYMENT_PENDING" || status === "PAYMENT_VERIFIED") {
        where.paymentStatus = status as any;
      } else {
        where.status = status as OrderStatus;
      }
    }

    if (paymentStatus && paymentStatus !== "ALL") {
      where.paymentStatus = paymentStatus as any;
    }

    if (q) {
      where.OR = [
        { orderNumber: { contains: q, mode: "insensitive" } },
        { recipientName: { contains: q, mode: "insensitive" } },
        { recipientPhone: { contains: q, mode: "insensitive" } },
        { utrNumber: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        items: true,
        shipment: true,
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
      utrNumber: o.utrNumber,
      utrSubmittedAt: o.utrSubmittedAt ? o.utrSubmittedAt.toISOString() : null,
      total: Number(o.total),
      customerName: o.user.name,
      customerEmail: o.user.email,
      recipientName: o.recipientName,
      recipientPhone: o.recipientPhone,
      campusDetail: o.campusDetail,
      itemCount: o.items.length,
      trackingNumber: o.shipment?.trackingNumber || null,
      currentCheckpoint: o.shipment?.currentCheckpoint || "Pending Dispatch",
    }));

    return NextResponse.json({ orders: formatted });
  } catch (error) {
    console.error("Admin orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
