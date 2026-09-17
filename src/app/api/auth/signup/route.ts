import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";
import { validateAndNormalizeIndianPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, collegeId } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    let normalizedPhone: string | null = null;

    if (phone && phone.trim()) {
      const phoneResult = validateAndNormalizeIndianPhone(phone.trim());
      normalizedPhone = phoneResult.isValid ? phoneResult.normalized : phone.trim();
    }

    // Check if user already exists by email
    const existingByEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingByEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please Sign In." },
        { status: 409 }
      );
    }

    // Check if user already exists by phone
    if (normalizedPhone) {
      const existingByPhone = await prisma.user.findFirst({
        where: { phone: normalizedPhone },
      });

      if (existingByPhone) {
        return NextResponse.json(
          { error: "An account with this mobile number already exists. Please Sign In." },
          { status: 409 }
        );
      }
    }

    const passwordHash = await hashPassword(password);

    // Create user and initial cart & wishlist in transaction
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        name: name.trim(),
        passwordHash,
        phone: normalizedPhone,
        collegeId: collegeId || null,
        role: "CUSTOMER",
        cart: {
          create: {},
        },
        wishlist: {
          create: {},
        },
      },
      include: {
        college: true,
      },
    });

    // Create session token
    const token = signSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        collegeId: user.collegeId,
        collegeName: user.college?.name || null,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);

    // Handle Prisma unique constraint error gracefully
    if (error?.code === "P2002") {
      const target = error?.meta?.target;
      if (Array.isArray(target) && target.includes("phone")) {
        return NextResponse.json(
          { error: "This mobile number is already registered. Please Sign In." },
          { status: 409 }
        );
      }
      if (Array.isArray(target) && target.includes("email")) {
        return NextResponse.json(
          { error: "This email is already registered. Please Sign In." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: error?.message || "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
