import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OtpService } from "@/lib/otp";
import { validateAndNormalizeIndianPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone: rawPhone, purpose = "LOGIN" } = body;

    if (!rawPhone) {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 }
      );
    }

    const validated = validateAndNormalizeIndianPhone(rawPhone);
    if (!validated.isValid) {
      return NextResponse.json(
        { error: validated.error || "Please enter a valid 10-digit Indian mobile number" },
        { status: 400 }
      );
    }

    const phone = validated.normalized;

    // Check if user already exists in database
    const existingUser = await prisma.user.findFirst({
      where: { phone },
      select: { id: true, name: true, phone: true },
    });

    // Send OTP via OtpService
    const result = await OtpService.sendOtp(phone, purpose);

    if (!result.success) {
      const statusCode = result.error === "RATE_LIMITED" ? 429 : result.error === "COOLDOWN_ACTIVE" ? 429 : 400;
      return NextResponse.json(
        { error: result.message, resendAfterSeconds: result.resendAfterSeconds },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      phone,
      formattedPhone: validated.formatted,
      isExistingUser: Boolean(existingUser),
      userName: existingUser?.name || null,
      resendAfterSeconds: result.resendAfterSeconds,
      devOtp: result.devOtp,
    });
  } catch (error: any) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { error: "Unable to send verification OTP. Please try again." },
      { status: 500 }
    );
  }
}
