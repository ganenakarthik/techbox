import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const { validateAndNormalizeIndianPhone } = await import("@/lib/phone");
    const { OtpService } = await import("@/lib/otp");

    // Re-use verified OTP dispatch pipeline
    const phoneCheck = validateAndNormalizeIndianPhone(cleanEmail);
    let targetPhone = cleanEmail;

    if (!phoneCheck.isValid) {
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (user && user.phone) {
        targetPhone = user.phone;
      }
    }

    // Trigger secure OTP dispatch with rate limiting and HMAC hashing
    const otpResult = await OtpService.sendOtp(targetPhone, "RESET_PASSWORD");

    return NextResponse.json({
      success: true,
      message: otpResult.success
        ? `Password reset code sent to your registered mobile number (${targetPhone.slice(-4).padStart(targetPhone.length, "*")}).`
        : "If an account exists, a reset code has been dispatched.",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
