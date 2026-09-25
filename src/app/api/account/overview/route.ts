import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const [
      orders,
      quotes,
      sourcingRequests,
      pcbOrders,
      printOrders,
      documentOrders,
      projects,
      notifications,
      storedFiles,
    ] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        include: { items: { include: { variant: { include: { product: true } } } }, shipment: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.quote.findMany({
        where: { userId: user.id },
        include: { items: true, sourcingRequest: true, project: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.componentSourcingRequest.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.pCBOrder.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.printOrder.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.documentOrder.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.project.findMany({
        where: { userId: user.id },
        include: { files: true, quotes: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.storedFile.findMany({
        where: { userId: user.id },
        orderBy: { id: "desc" },
        take: 10,
      }),
    ]);

    // Calculate real stats from persisted database records
    const stats = {
      totalOrders: orders.length,
      activeOrders: orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED").length,
      actionRequiredQuotes: quotes.filter((q) => q.status === "SENT" || q.status === "VIEWED" || q.status === "PAYMENT_PENDING").length,
      pendingPayments: quotes.filter((q) => q.status === "PAYMENT_PENDING" || q.status === "PAYMENT_SUBMITTED").length,
      totalSourcingRequests: sourcingRequests.length,
      totalProjects: projects.length,
      totalFiles: storedFiles.length,
    };

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      stats,
      orders,
      quotes,
      sourcingRequests,
      pcbOrders,
      printOrders,
      documentOrders,
      projects,
      notifications,
      storedFiles,
    });
  } catch (error: any) {
    console.error("Account overview GET error:", error);
    return NextResponse.json({ error: "Failed to load customer workspace overview" }, { status: 500 });
  }
}
