import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const [
      totalOrders,
      ordersAgg,
      pendingOrders,
      totalUsers,
      lowStockCount,
      totalProjects,
      recentOrders,
      recentAudits,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "PAYMENT_VERIFIED" },
      }),
      prisma.order.count({
        where: { status: { in: ["PENDING", "CONFIRMED", "PACKED"] } },
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.inventory.count({
        where: { available: { lte: 5 } },
      }),
      prisma.project.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: true,
        },
      }),
      prisma.adminAuditLog.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          adminUser: { select: { name: true, email: true } },
        },
      }),
    ]);

    const grossRevenue = ordersAgg._sum?.total ? Number(ordersAgg._sum.total) : 0;

    return NextResponse.json({
      metrics: {
        totalOrders,
        grossRevenue,
        pendingOrders,
        totalUsers,
        lowStockCount,
        totalProjects,
      },
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.user.name,
        customerEmail: o.user.email,
        total: Number(o.total),
        status: o.status,
        paymentStatus: o.paymentStatus,
        itemCount: o.items.length,
        createdAt: o.createdAt.toISOString(),
      })),
      recentAudits: recentAudits.map((a) => ({
        id: a.id,
        action: a.action,
        target: a.target,
        adminName: a.adminUser?.name || "Operations Lead",
        details: a.details,
        createdAt: a.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    return NextResponse.json({ error: "Failed to fetch admin metrics" }, { status: 500 });
  }
}
