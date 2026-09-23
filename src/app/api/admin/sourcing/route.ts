import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const requests = await prisma.componentSourcingRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    console.error("Admin sourcing GET error:", error);
    return NextResponse.json({ error: "Failed to fetch sourcing requests" }, { status: 500 });
  }
}
