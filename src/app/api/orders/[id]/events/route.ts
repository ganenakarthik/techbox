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
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        status: true,
        paymentStatus: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Strict multi-tenant authorization
    if (order.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to access events for this order" },
        { status: 403 }
      );
    }

    const events = await prisma.orderEvent.findMany({
      where: { orderId: order.id },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        eventType: true,
        message: true,
        actor: user.role === "ADMIN" ? true : false, // Mask internal actor ID for customer
        createdAt: true,
        metadata: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      paymentStatus: order.paymentStatus,
      events,
    });
  } catch (error: any) {
    console.error("Order events fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch order events" }, { status: 500 });
  }
}
