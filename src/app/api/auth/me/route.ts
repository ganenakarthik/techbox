import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user });
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone } = body;

    const dataToUpdate: any = {};
    if (name !== undefined && typeof name === "string") {
      dataToUpdate.name = name.trim();
    }
    if (phone !== undefined && typeof phone === "string" && phone.trim()) {
      const { validateAndNormalizeIndianPhone } = await import("@/lib/phone");
      const val = validateAndNormalizeIndianPhone(phone);
      if (!val.isValid) {
        return NextResponse.json({ error: val.error || "Invalid mobile number" }, { status: 400 });
      }
      dataToUpdate.phone = val.normalized;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        phoneVerified: true,
        emailVerified: true,
        collegeId: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
