import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, cartTotal = 0 } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check database
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon) {
      // Check built-in fallback launch codes
      if (cleanCode === "TECHBOX10") {
        const discountAmount = Math.round(cartTotal * 0.1);
        return NextResponse.json({
          valid: true,
          code: cleanCode,
          discountPercent: 10,
          discountAmount,
          message: "10% Campus Welcome Discount applied!",
        });
      }
      if (cleanCode === "CAMPUSFIRST") {
        const discountAmount = Math.min(150, Math.round(cartTotal * 0.15));
        return NextResponse.json({
          valid: true,
          code: cleanCode,
          discountPercent: 15,
          discountAmount,
          message: "15% Campus First Order Discount applied (Max ₹150)!",
        });
      }
      return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    if (new Date() > new Date(coupon.validUntil)) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    const minSpend = Number(coupon.minSpend);
    if (cartTotal < minSpend) {
      return NextResponse.json(
        { error: `Minimum cart value of ₹${minSpend} required for this coupon` },
        { status: 400 }
      );
    }

    const rawDiscount = Math.round(cartTotal * (coupon.discountPercent / 100));
    const discountAmount = coupon.maxDiscount
      ? Math.min(Number(coupon.maxDiscount), rawDiscount)
      : rawDiscount;

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount,
      message: `${coupon.discountPercent}% discount applied! Saved ₹${discountAmount}`,
    });
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
