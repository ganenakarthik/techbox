import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OtpService } from "@/lib/otp";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";
import { validateAndNormalizeIndianPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone: rawPhone, otp, newPassword } = body;

    if (!rawPhone || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Mobile number, OTP code, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const validated = validateAndNormalizeIndianPhone(rawPhone);
    if (!validated.isValid) {
      return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 });
    }

    const phone = validated.normalized;

    // Verify OTP
    const verifyResult = await OtpService.verifyOtp(phone, otp, "RESET_PASSWORD");
    if (!verifyResult.success) {
      return NextResponse.json(
        { error: verifyResult.message, attemptsRemaining: verifyResult.attemptsRemaining },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash and update password
    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Sign new session and set cookie
    const token = signSession({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You are now logged in.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
