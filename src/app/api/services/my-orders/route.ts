import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [pcbOrders, printOrders, documentOrders] = await Promise.all([
      prisma.pCBOrder.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.printOrder.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.documentOrder.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      pcbOrders,
      printOrders,
      documentOrders,
    });
  } catch (error) {
    console.error("Service orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch service orders" }, { status: 500 });
  }
}
