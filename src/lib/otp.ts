import crypto from "crypto";
import { prisma } from "./prisma";
import { validateAndNormalizeIndianPhone } from "./phone";

const AUTH_SECRET = process.env.AUTH_SECRET || "techbox_super_secret_session_key_production_grade";
const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 45;
const OTP_MAX_ATTEMPTS = 4;
const OTP_MAX_HOURLY_REQUESTS = 5;

export interface OtpSendResult {
  success: boolean;
  message: string;
  resendAfterSeconds: number;
  devOtp?: string;
  error?: string;
}

export interface OtpVerifyResult {
  success: boolean;
  message: string;
  phone: string;
  error?: string;
  attemptsRemaining?: number;
}

export class OtpService {
  /**
   * Hashes the 6-digit OTP using HMAC-SHA256 for secure storage in database
   */
  static hashOtp(phone: string, otp: string): string {
    const hmac = crypto.createHmac("sha256", AUTH_SECRET);
    hmac.update(`${phone}:${otp}`);
    return hmac.digest("hex");
  }

  /**
   * Generates a cryptographically random 6-digit OTP
   */
  static generateOtp(): string {
    return crypto.randomInt(100000, 1000000).toString();
  }

  /**
   * Sends an OTP for a given phone and purpose (LOGIN, SIGNUP, RESET_PASSWORD)
   */
  static async sendOtp(rawPhone: string, purpose: string = "LOGIN"): Promise<OtpSendResult> {
    const validated = validateAndNormalizeIndianPhone(rawPhone);
    if (!validated.isValid) {
      return {
        success: false,
        message: validated.error || "Invalid mobile number",
        resendAfterSeconds: 0,
        error: validated.error,
      };
    }

    const phone = validated.normalized;
    const now = new Date();

    // 1. Rate Limiting: Check number of requests in the last hour
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentRequestsCount = await prisma.otpVerification.count({
      where: {
        phone,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentRequestsCount >= OTP_MAX_HOURLY_REQUESTS) {
      return {
        success: false,
        message: "Too many OTP requests for this number. Please try again after 1 hour.",
        resendAfterSeconds: 3600,
        error: "RATE_LIMITED",
      };
    }

    // 2. Cooldown check: Check if an active OTP was created recently within cooldown period
    const latestOtp = await prisma.otpVerification.findFirst({
      where: { phone, purpose },
      orderBy: { createdAt: "desc" },
    });

    if (latestOtp && now < latestOtp.resendAfter) {
      const waitSeconds = Math.ceil((latestOtp.resendAfter.getTime() - now.getTime()) / 1000);
      return {
        success: false,
        message: `Please wait ${waitSeconds} seconds before requesting a new OTP.`,
        resendAfterSeconds: waitSeconds,
        error: "COOLDOWN_ACTIVE",
      };
    }

    // 3. Generate secure OTP
    // In production, NEVER use fallback or hardcoded OTP
    const isProduction = process.env.NODE_ENV === "production";
    const configuredProvider = (process.env.OTP_PROVIDER || (isProduction ? "FAST2SMS" : "DEV")).toUpperCase();
    const isDev = !isProduction && configuredProvider === "DEV";
    const otp = this.generateOtp();
    const otpHash = this.hashOtp(phone, otp);

    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
    const resendAfter = new Date(now.getTime() + OTP_RESEND_COOLDOWN_SECONDS * 1000);

    // 4. Invalidate any existing unverified OTPs for this phone & purpose
    await prisma.otpVerification.deleteMany({
      where: {
        phone,
        purpose,
        verified: false,
      },
    });

    // 5. Save new OTP record (hash only, never plaintext)
    await prisma.otpVerification.create({
      data: {
        phone,
        otpHash,
        purpose,
        expiresAt,
        resendAfter,
        attempts: 0,
        maxAttempts: OTP_MAX_ATTEMPTS,
        verified: false,
      },
    });

    // 6. Dispatch SMS through configured provider
    if (configuredProvider === "FAST2SMS" && process.env.FAST2SMS_API_KEY) {
      try {
        await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route: "otp",
            variables_values: otp,
            numbers: validated.national,
          }),
        });
      } catch (smsErr) {
        console.error("Fast2SMS dispatch error:", smsErr);
      }
    } else if (configuredProvider === "TWILIO" && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: `+91${validated.national}`,
            From: process.env.TWILIO_PHONE_NUMBER || "",
            Body: `Your TechBox verification code is ${otp}. Valid for 5 minutes. Do not share this code.`,
          }),
        });
      } catch (twilioErr) {
        console.error("Twilio dispatch error:", twilioErr);
      }
    } else if (configuredProvider === "MSG91" && process.env.MSG91_AUTH_KEY) {
      try {
        await fetch("https://api.msg91.com/api/v5/otp", {
          method: "POST",
          headers: {
            authkey: process.env.MSG91_AUTH_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            template_id: process.env.MSG91_OTP_TEMPLATE_ID,
            mobile: `91${validated.national}`,
            otp,
          }),
        });
      } catch (msgErr) {
        console.error("MSG91 dispatch error:", msgErr);
      }
    } else {
      // In DEV provider mode:
      console.log(`\n======================================================`);
      console.log(`[DEV OTP SERVICE] Mobile: ${phone} | Purpose: ${purpose}`);
      console.log(`[DEV OTP CODE] >>> ${otp} <<< (Expires in 5 mins)`);
      console.log(`======================================================\n`);
    }

    return {
      success: true,
      message: `OTP sent successfully to ${validated.formatted}`,
      resendAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS,
      devOtp: isDev ? otp : undefined,
    };
  }

  /**
   * Verifies an OTP submitted by the user
   */
  static async verifyOtp(
    rawPhone: string,
    inputOtp: string,
    purpose: string = "LOGIN"
  ): Promise<OtpVerifyResult> {
    const validated = validateAndNormalizeIndianPhone(rawPhone);
    if (!validated.isValid) {
      return { success: false, message: validated.error || "Invalid mobile number", phone: rawPhone, error: "INVALID_PHONE" };
    }

    const phone = validated.normalized;
    const cleanOtp = String(inputOtp).trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      return { success: false, message: "Please enter a valid 6-digit OTP code", phone, error: "INVALID_FORMAT" };
    }

    const now = new Date();

    // 1. Fetch latest OTP record for this phone & purpose
    const record = await prisma.otpVerification.findFirst({
      where: { phone, purpose },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return {
        success: false,
        message: "No active OTP request found. Please request a new OTP.",
        phone,
        error: "NO_OTP_REQUEST",
      };
    }

    // 2. Check if already verified (prevent reuse)
    if (record.verified) {
      return {
        success: false,
        message: "This OTP has already been used. Please request a new OTP.",
        phone,
        error: "ALREADY_USED",
      };
    }

    // 3. Check expiration
    if (now > record.expiresAt) {
      await prisma.otpVerification.delete({ where: { id: record.id } }).catch(() => {});
      return {
        success: false,
        message: "This OTP has expired. Please request a fresh OTP.",
        phone,
        error: "OTP_EXPIRED",
      };
    }

    // 4. Check maximum attempts
    if (record.attempts >= record.maxAttempts) {
      await prisma.otpVerification.delete({ where: { id: record.id } }).catch(() => {});
      return {
        success: false,
        message: "Too many incorrect attempts. For your security, please request a new OTP.",
        phone,
        error: "MAX_ATTEMPTS_EXCEEDED",
      };
    }

    // 5. Compare hash
    const expectedHash = this.hashOtp(phone, cleanOtp);
    if (record.otpHash !== expectedHash) {
      const updatedAttempts = record.attempts + 1;
      const remaining = record.maxAttempts - updatedAttempts;

      await prisma.otpVerification.update({
        where: { id: record.id },
        data: { attempts: updatedAttempts },
      });

      if (remaining <= 0) {
        await prisma.otpVerification.delete({ where: { id: record.id } }).catch(() => {});
        return {
          success: false,
          message: "Too many incorrect attempts. This OTP has been invalidated.",
          phone,
          error: "MAX_ATTEMPTS_EXCEEDED",
          attemptsRemaining: 0,
        };
      }

      return {
        success: false,
        message: `Incorrect OTP. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining.`,
        phone,
        error: "INCORRECT_OTP",
        attemptsRemaining: remaining,
      };
    }

    // 6. Success! Invalidate immediately to prevent reuse
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    return {
      success: true,
      message: "Mobile number verified successfully!",
      phone,
    };
  }
}
