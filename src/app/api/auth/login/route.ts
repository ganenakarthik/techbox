import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";
import { validateAndNormalizeIndianPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, email, phone, password, guestCartItems = [] } = body;

    const input = identifier || email || phone;

    if (!input || !password) {
      return NextResponse.json(
        { error: "Mobile number/Email and password are required" },
        { status: 400 }
      );
    }

    const cleanInput = String(input).trim();
    let user = null;

    // Check if input is a phone number
    const phoneCheck = validateAndNormalizeIndianPhone(cleanInput);
    if (phoneCheck.isValid) {
      user = await prisma.user.findFirst({
        where: { phone: phoneCheck.normalized },
        include: { college: true },
      });
    }

    // If not found by phone, check by email
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: cleanInput.toLowerCase() },
        include: { college: true },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid mobile/email or password" },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        {
          error: "This account does not have a password set. Please log in using Mobile OTP.",
        },
        { status: 400 }
      );
    }

    // Verify password strictly against database scrypt hash
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid mobile/email or password" },
        { status: 401 }
      );
    }

    // Merge guest cart if provided
    if (Array.isArray(guestCartItems) && guestCartItems.length > 0) {
      let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId: user.id } });
      }

      for (const item of guestCartItems) {
        if (!item.variantId) continue;
        const existing = await prisma.cartItem.findFirst({
          where: { cartId: cart.id, variantId: item.variantId },
        });

        if (existing) {
          await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + (item.quantity || 1) },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              variantId: item.variantId,
              quantity: item.quantity || 1,
            },
          });
        }
      }
    }

    // Sign session
    const token = signSession({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        emailVerified: user.emailVerified,
        hasPassword: true,
        role: user.role,
        collegeId: user.collegeId,
        collegeName: user.college?.name || null,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
