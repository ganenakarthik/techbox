import crypto from "crypto";
import { prisma } from "./prisma";
import { validateAndNormalizeIndianPhone } from "./phone";

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

  if (!secret || secret.trim().length < 16) {
    if (isProduction) {
      throw new Error(
        "[FATAL AUTH CONFIGURATION ERROR] AUTH_SECRET is not configured or is too short in production. Refusing to operate with an insecure OTP key."
      );
    }
    return "partsly_dev_only_local_session_signing_secret_do_not_use_in_prod";
  }
  return secret.trim();
}

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
    const secret = getAuthSecret();
    const hmac = crypto.createHmac("sha256", secret);
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

    // 3. Provider Configuration Check
    const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
    const configuredProvider = (process.env.OTP_PROVIDER || (isProduction ? "FAST2SMS" : "DEV")).toUpperCase();

    const hasSmsConfigured = Boolean(
      (configuredProvider === "FAST2SMS" && process.env.FAST2SMS_API_KEY) ||
      (configuredProvider === "TWILIO" && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) ||
      (configuredProvider === "MSG91" && process.env.MSG91_AUTH_KEY)
    );

    if (isProduction && !hasSmsConfigured) {
      return {
        success: false,
        error: "SMS_GATEWAY_NOT_CONFIGURED",
        message: "SMS gateway is not configured in production. Please configure FAST2SMS_API_KEY, TWILIO_ACCOUNT_SID, or MSG91_AUTH_KEY.",
        resendAfterSeconds: 0,
      };
    }

    const otp = this.generateOtp();
    let dispatchSuccess = false;

    // 4. Dispatch SMS first through configured provider
    if (configuredProvider === "FAST2SMS" && process.env.FAST2SMS_API_KEY) {
      try {
        const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
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

        if (res.ok) {
          const json = await res.json().catch(() => ({}));
          dispatchSuccess = json.return === true || json.status_code === 200;
          if (!dispatchSuccess) {
            console.error("Fast2SMS gateway returned error status:", json.message || "Unknown provider error");
          }
        } else {
          console.error(`Fast2SMS HTTP error: ${res.status} ${res.statusText}`);
        }
      } catch (smsErr) {
        console.error("Fast2SMS network failure:", smsErr);
      }
    } else if (
      configuredProvider === "TWILIO" &&
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN
    ) {
      try {
        const auth = Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString("base64");
        const res = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              To: `+91${validated.national}`,
              From: process.env.TWILIO_PHONE_NUMBER || "",
              Body: `Your Partsly verification code is ${otp}. Valid for 5 minutes. Do not share this code.`,
            }),
          }
        );
        dispatchSuccess = res.ok;
        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          console.error(`Twilio gateway HTTP error (${res.status}):`, errText);
        }
      } catch (twilioErr) {
        console.error("Twilio network failure:", twilioErr);
      }
    } else if (configuredProvider === "MSG91" && process.env.MSG91_AUTH_KEY) {
      try {
        const res = await fetch("https://api.msg91.com/api/v5/otp", {
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
        dispatchSuccess = res.ok;
        if (!res.ok) {
          console.error(`MSG91 gateway HTTP error (${res.status})`);
        }
      } catch (msgErr) {
        console.error("MSG91 network failure:", msgErr);
      }
    } else if (!isProduction) {
      // Local development only: log to console
      dispatchSuccess = true;
      console.log(`\n======================================================`);
      console.log(`[DEV OTP SERVICE] Mobile: ${phone} | Purpose: ${purpose}`);
      console.log(`[DEV OTP CODE] >>> ${otp} <<< (Expires in 5 mins)`);
      console.log(`======================================================\n`);
    }

    if (!dispatchSuccess) {
      return {
        success: false,
        error: "SMS_DISPATCH_FAILED",
        message: "Failed to dispatch SMS verification code. Please try again or use password login.",
        resendAfterSeconds: 0,
      };
    }

    // 5. Provider confirmed -> Commit OTP record (hash only, never plaintext)
    const otpHash = this.hashOtp(phone, otp);
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
    const resendAfter = new Date(now.getTime() + OTP_RESEND_COOLDOWN_SECONDS * 1000);

    // Invalidate any previous unverified OTPs for this phone & purpose
    await prisma.otpVerification.deleteMany({
      where: {
        phone,
        purpose,
        verified: false,
      },
    });

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

    return {
      success: true,
      message: `Verification code sent to ${validated.formatted}`,
      resendAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS,
      devOtp: !isProduction ? otp : undefined,
    };
  }

  /**
   * Verifies an OTP code for a given phone and purpose
   */
  static async verifyOtp(
    rawPhone: string,
    inputOtp: string,
    purpose: string = "LOGIN"
  ): Promise<OtpVerifyResult> {
    const validated = validateAndNormalizeIndianPhone(rawPhone);
    if (!validated.isValid) {
      return {
        success: false,
        message: validated.error || "Invalid mobile number",
        phone: rawPhone,
        error: validated.error,
      };
    }

    const phone = validated.normalized;
    const now = new Date();

    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        phone,
        purpose,
        verified: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return {
        success: false,
        message: "No active verification code found. Please request a new OTP.",
        phone,
        error: "OTP_NOT_FOUND",
      };
    }

    // 1. Check expiration
    if (now > otpRecord.expiresAt) {
      await prisma.otpVerification.delete({ where: { id: otpRecord.id } });
      return {
        success: false,
        message: "Verification code has expired. Please request a new code.",
        phone,
        error: "OTP_EXPIRED",
      };
    }

    // 2. Check maximum attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await prisma.otpVerification.delete({ where: { id: otpRecord.id } });
      return {
        success: false,
        message: "Maximum verification attempts exceeded. Please request a new OTP.",
        phone,
        error: "MAX_ATTEMPTS_EXCEEDED",
      };
    }

    // 3. Timing-safe cryptographic comparison of hash
    const inputHash = this.hashOtp(phone, inputOtp.trim());
    const expectedHash = otpRecord.otpHash;

    const inputBuf = Buffer.from(inputHash, "hex");
    const expectedBuf = Buffer.from(expectedHash, "hex");

    const isMatch =
      inputBuf.length === expectedBuf.length &&
      crypto.timingSafeEqual(inputBuf, expectedBuf);

    if (!isMatch) {
      const newAttempts = otpRecord.attempts + 1;
      const attemptsRemaining = otpRecord.maxAttempts - newAttempts;

      if (attemptsRemaining <= 0) {
        await prisma.otpVerification.delete({ where: { id: otpRecord.id } });
        return {
          success: false,
          message: "Incorrect code. Maximum attempts reached. Please request a new OTP.",
          phone,
          error: "INCORRECT_OTP_LOCKED",
          attemptsRemaining: 0,
        };
      }

      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { attempts: newAttempts },
      });

      return {
        success: false,
        message: `Incorrect code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} remaining.`,
        phone,
        error: "INCORRECT_OTP",
        attemptsRemaining,
      };
    }

    // 4. Success -> Mark as verified
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    return {
      success: true,
      message: "Mobile number verified successfully",
      phone,
    };
  }
}
