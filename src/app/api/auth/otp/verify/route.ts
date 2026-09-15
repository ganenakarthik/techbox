import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OtpService } from "@/lib/otp";
import { validateAndNormalizeIndianPhone } from "@/lib/phone";
import { signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone: rawPhone, otp, purpose = "LOGIN", guestCartItems = [] } = body;

    if (!rawPhone || !otp) {
      return NextResponse.json(
        { error: "Phone number and 6-digit OTP code are required" },
        { status: 400 }
      );
    }

    const validated = validateAndNormalizeIndianPhone(rawPhone);
    if (!validated.isValid) {
      return NextResponse.json(
        { error: validated.error || "Invalid mobile number" },
        { status: 400 }
      );
    }

    const phone = validated.normalized;

    // Verify OTP using OtpService
    const verifyResult = await OtpService.verifyOtp(phone, otp, purpose);

    if (!verifyResult.success) {
      return NextResponse.json(
        {
          error: verifyResult.message,
          attemptsRemaining: verifyResult.attemptsRemaining,
        },
        { status: 400 }
      );
    }

    // Check if user exists with this verified phone number
    const user = await prisma.user.findFirst({
      where: { phone },
      include: { college: true },
    });

    if (!user) {
      // New User Flow: Mobile is verified, prompt for Name (+ optional email)
      return NextResponse.json({
        success: true,
        isNewUser: true,
        phone,
        formattedPhone: validated.formatted,
        message: "Mobile verified successfully! Please enter your name to complete setup.",
      });
    }

    // Existing User Flow: User found, mark phoneVerified if not already
    if (!user.phoneVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true },
      });
    }

    // Merge guest cart if items are present
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
      isNewUser: false,
      message: `Welcome back, ${user.name}!`,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        phoneVerified: true,
        emailVerified: user.emailVerified,
        hasPassword: Boolean(user.passwordHash),
        role: user.role,
        collegeId: user.collegeId,
        collegeName: user.college?.name || null,
      },
    });
  } catch (error: any) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Authentication verification failed. Please try again." },
      { status: 500 }
    );
  }
}
