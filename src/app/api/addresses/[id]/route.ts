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

    const address = await prisma.userAddress.findUnique({
      where: { id },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // STRICT MULTI-TENANT ISOLATION: A customer can only access their own address
    if (user.role !== "ADMIN" && user.role !== "STAFF" && address.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized access: You do not have permission to view this address" },
        { status: 403 }
      );
    }

    return NextResponse.json({ address });
  } catch (error: any) {
    console.error("Address GET ID error:", error);
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const address = await prisma.userAddress.findUnique({
      where: { id },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && address.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized access: You cannot delete another customer's address" },
        { status: 403 }
      );
    }

    await prisma.userAddress.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Address deleted" });
  } catch (error: any) {
    console.error("Address DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
