import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";
import {
  COOKIE_NAME,
  LEGACY_COOKIE_NAME,
  SESSION_MAX_AGE,
  SessionPayload,
  verifySessionToken as verifySessionTokenWebCrypto,
} from "./session";

export { COOKIE_NAME, LEGACY_COOKIE_NAME, SESSION_MAX_AGE };
export type { SessionPayload };

export interface SessionUser {
  id: string;
  email?: string | null;
  name: string;
  role: Role;
  phone?: string | null;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  hasPassword?: boolean;
  collegeId?: string | null;
  collegeName?: string | null;
}

/**
 * Validates that AUTH_SECRET is properly set in production.
 * Refuses to use predictable fallbacks in production environments.
 */
function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

  if (!secret || secret.trim().length < 16) {
    if (isProduction) {
      throw new Error(
        "[FATAL AUTH CONFIGURATION ERROR] AUTH_SECRET is not configured or is too short in production. Refusing to operate with an insecure session key."
      );
    }
    console.warn(
      "[DEV WARNING] AUTH_SECRET not configured. Using local development key. Set AUTH_SECRET in .env for production."
    );
    return "partsly_dev_only_local_session_signing_secret_do_not_use_in_prod";
  }

  return secret.trim();
}

/**
 * Production password hashing using Node crypto.scrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Timing-safe password verification
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    if (keyBuffer.length !== derivedKey.length) return false;
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Sign session payload with HMAC-SHA256
 */
export function signSession(payload: Omit<SessionPayload, "exp">): string {
  const secret = getAuthSecret();
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const data = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);
  const sig = hmac.digest("base64url");
  return `${data}.${sig}`;
}

/**
 * Verify and decode session token using timing-safe comparison
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, sig] = parts;

    const secret = getAuthSecret();
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(data);
    const expectedSig = hmac.digest("base64url");

    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Date.now()) {
      return null; // Expired
    }
    if (!payload.userId) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Set HTTP-only secure cookie for the session
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Clear session cookie on logout
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete(LEGACY_COOKIE_NAME);
}

/**
 * Retrieve current authenticated user from request cookie and verify database record
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME) || cookieStore.get(LEGACY_COOKIE_NAME);
    if (!sessionCookie?.value) return null;

    const payload = verifySessionToken(sessionCookie.value);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        college: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      emailVerified: user.emailVerified,
      hasPassword: Boolean(user.passwordHash),
      collegeId: user.collegeId,
      collegeName: user.college?.name || null,
    };
  } catch {
    return null;
  }
}
