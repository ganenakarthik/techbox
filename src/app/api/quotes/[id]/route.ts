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

    const quote = await prisma.quote.findFirst({
      where: {
        OR: [{ id }, { quoteNumber: id }],
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        sourcingRequest: true,
        project: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // IDOR Protection: Must belong to user or user must be ADMIN/STAFF
    if (quote.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden: Access denied to this quote" }, { status: 403 });
    }

    return NextResponse.json({ quote });
  } catch (error: any) {
    console.error("GET /api/quotes/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch quote details" }, { status: 500 });
  }
}
