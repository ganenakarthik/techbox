import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serviceType = searchParams.get("serviceType");
    const status = searchParams.get("status");

    const where: any = {
      userId: user.id,
    };

    if (serviceType) {
      where.serviceType = serviceType;
    }

    if (status) {
      where.status = status;
    }

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        items: true,
        sourcingRequest: {
          select: {
            requestNumber: true,
            componentName: true,
            quantity: true,
          },
        },
        project: {
          select: {
            projectCode: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quotes });
  } catch (error: any) {
    console.error("GET /api/quotes error:", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}
