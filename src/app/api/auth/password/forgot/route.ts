import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OtpService } from "@/lib/otp";
import { validateAndNormalizeIndianPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier } = body;

    if (!identifier) {
      return NextResponse.json({ error: "Mobile number or email is required" }, { status: 400 });
    }

    const clean = String(identifier).trim();
    let targetPhone = "";

    const phoneCheck = validateAndNormalizeIndianPhone(clean);
    if (phoneCheck.isValid) {
      targetPhone = phoneCheck.normalized;
    } else {
      // Check if it's an email
      const user = await prisma.user.findUnique({
        where: { email: clean.toLowerCase() },
      });
      if (user && user.phone) {
        targetPhone = user.phone;
      } else {
        return NextResponse.json(
          { error: "No account found with this email, or no verified mobile is linked." },
          { status: 404 }
        );
      }
    }

    // Verify user exists with this phone
    const user = await prisma.user.findFirst({
      where: { phone: targetPhone },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No Partsly account found with this mobile number." },
        { status: 404 }
      );
    }

    // Send OTP for password reset
    const result = await OtpService.sendOtp(targetPhone, "RESET_PASSWORD");

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Password reset OTP sent to ${targetPhone.slice(0, 6)}XXXXXX`,
      phone: targetPhone,
      resendAfterSeconds: result.resendAfterSeconds,
      devOtp: result.devOtp,
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to initiate password reset" },
      { status: 500 }
    );
  }
}
