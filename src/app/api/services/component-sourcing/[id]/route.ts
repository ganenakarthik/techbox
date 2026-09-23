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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const request = await prisma.componentSourcingRequest.findFirst({
      where: {
        OR: [{ id }, { requestNumber: id }],
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!request) {
      return NextResponse.json({ error: "Sourcing request not found" }, { status: 404 });
    }

    // Authorization: User can only access their own sourcing request unless Admin/Staff
    if (request.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden: You do not have permission to view this request" }, { status: 403 });
    }

    return NextResponse.json({ success: true, request });
  } catch (error: any) {
    console.error("Component sourcing GET [id] error:", error);
    return NextResponse.json({ error: "Failed to fetch sourcing request" }, { status: 500 });
  }
}
