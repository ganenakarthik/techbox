import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";
import { validateAndNormalizeIndianPhone } from "@/lib/phone";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const body = await req.json();
    const { identifier, email, phone, password, guestCartItems = [] } = body;

    const input = identifier || email || phone;

    if (!input || !password) {
      return NextResponse.json(
        { error: "Mobile number/Email and password are required" },
        { status: 400 }
      );
    }

    const cleanInput = String(input).trim().toLowerCase();

    // 1. IP & Identifier Rate Limiting (Brute-force protection: max 5 attempts per 15 mins)
    const ipLimit = checkRateLimit(`login:ip:${clientIp}`, 5, 15 * 60);
    const idLimit = checkRateLimit(`login:id:${cleanInput}`, 5, 15 * 60);

    if (!ipLimit.allowed || !idLimit.allowed) {
      const waitSeconds = Math.max(ipLimit.resetInSeconds, idLimit.resetInSeconds);
      const waitMinutes = Math.ceil(waitSeconds / 60);
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${waitMinutes} minutes.`,
          code: "TOO_MANY_ATTEMPTS",
          retryAfterSeconds: waitSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": String(waitSeconds) },
        }
      );
    }

    let user = null;

    // Check if input is an Indian phone number
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
        where: { email: cleanInput },
        include: { college: true },
      });
    }

    // Generic rejection if user not found or no password hash (prevents account enumeration)
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid mobile/email or password" },
        { status: 401 }
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

    // Auto-promote Super Admin email if not already ADMIN
    if (user.email && user.email.toLowerCase().trim() === "ganenakartiks7@gmail.com" && user.role !== "ADMIN") {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" },
        include: { college: true },
      });
    }

    // 2. Authentication Succeeded -> Reset rate limits
    resetRateLimit(`login:ip:${clientIp}`);
    resetRateLimit(`login:id:${cleanInput}`);

    // 3. Merge guest cart with strict inventory validation
    if (Array.isArray(guestCartItems) && guestCartItems.length > 0) {
      let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId: user.id } });
      }

      for (const item of guestCartItems) {
        if (!item.variantId) continue;

        // Verify available stock before merging
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { inventory: true },
        });

        const available = variant?.inventory?.available ?? 0;
        if (available <= 0) continue; // Skip out-of-stock items

        const requestedQty = Math.max(1, Number(item.quantity) || 1);
        const cappedQty = Math.min(requestedQty, available);

        const existing = await prisma.cartItem.findFirst({
          where: { cartId: cart.id, variantId: item.variantId },
        });

        if (existing) {
          const finalQty = Math.min(existing.quantity + cappedQty, available);
          await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: finalQty },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              variantId: item.variantId,
              quantity: cappedQty,
            },
          });
        }
      }
    }

    // 4. Sign session token and set HTTP-only cookie
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
