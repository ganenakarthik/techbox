import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAndNormalizeIndianPhone } from "@/lib/phone";
import { signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone: rawPhone, name, email, collegeId, guestCartItems = [] } = body;

    if (!rawPhone || !name) {
      return NextResponse.json(
        { error: "Phone number and full name are required to create an account" },
        { status: 400 }
      );
    }

    const validated = validateAndNormalizeIndianPhone(rawPhone);
    if (!validated.isValid) {
      return NextResponse.json({ error: validated.error || "Invalid mobile number" }, { status: 400 });
    }

    const phone = validated.normalized;
    const cleanName = name.trim();

    // Verify that phone was recently verified via OTP in the last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const verifiedOtp = await prisma.otpVerification.findFirst({
      where: {
        phone,
        verified: true,
        updatedAt: { gte: fifteenMinutesAgo },
      },
    });

    if (!verifiedOtp) {
      return NextResponse.json(
        { error: "Mobile number has not been verified. Please request and verify an OTP first." },
        { status: 403 }
      );
    }

    // Check if phone already registered
    const existingPhone = await prisma.user.findFirst({
      where: { phone },
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: "An account with this mobile number already exists. Please log in." },
        { status: 409 }
      );
    }

    // If email provided, check email uniqueness
    let cleanEmail: string | null = null;
    if (email && typeof email === "string" && email.trim()) {
      cleanEmail = email.trim().toLowerCase();
      const existingEmail = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "An account with this email address already exists" },
          { status: 409 }
        );
      }
    }

    // Create user atomically
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          phone,
          phoneVerified: true,
          name: cleanName,
          email: cleanEmail,
          emailVerified: false,
          role: "CUSTOMER",
          collegeId: collegeId || null,
          cart: { create: {} },
          wishlist: { create: {} },
        },
        include: {
          college: true,
        },
      });

      // Merge guest cart if present
      if (Array.isArray(guestCartItems) && guestCartItems.length > 0) {
        const cart = await tx.cart.findUnique({ where: { userId: newUser.id } });
        if (cart) {
          for (const item of guestCartItems) {
            if (!item.variantId) continue;
            await tx.cartItem.create({
              data: {
                cartId: cart.id,
                variantId: item.variantId,
                quantity: item.quantity || 1,
              },
            });
          }
        }
      }

      // Invalidate OTP verification record after successful registration
      await tx.otpVerification.deleteMany({ where: { phone } });

      return newUser;
    });

    // Create session token and set HTTP-only cookie
    const token = signSession({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: `Account created successfully. Welcome to TechBox, ${user.name}!`,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        phoneVerified: true,
        emailVerified: user.emailVerified,
        hasPassword: false,
        role: user.role,
        collegeId: user.collegeId,
        collegeName: user.college?.name || null,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("OTP registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
