/**
 * Canonical Web Crypto session token signing and verification.
 * Runs seamlessly in Edge Middleware, Serverless Functions, and Node.js runtimes.
 * Does NOT import native Node modules or Prisma.
 */

export interface SessionPayload {
  userId: string;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
  email?: string | null;
  phone?: string | null;
  exp: number;
}

export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds
export const COOKIE_NAME = "partsly_session";
export const LEGACY_COOKIE_NAME = "techbox_session";

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

  if (!secret || secret.trim().length < 16) {
    if (isProduction) {
      throw new Error(
        "[FATAL AUTH CONFIGURATION ERROR] AUTH_SECRET is not configured or is too short in production. Refusing to operate with an insecure session key."
      );
    }
    // Development-only fallback warning
    console.warn(
      "[DEV WARNING] AUTH_SECRET not configured. Using local development key. Set AUTH_SECRET in .env for production."
    );
    return "partsly_dev_only_local_session_signing_secret_do_not_use_in_prod";
  }

  return secret.trim();
}

/**
 * Import HMAC key for Web Crypto
 */
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Convert ArrayBuffer to Base64URL
 */
function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Convert Base64URL to Uint8Array
 */
function base64UrlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Sign session payload with Web Crypto HMAC-SHA256
 */
export async function signSessionToken(
  payload: Omit<SessionPayload, "exp"> & { exp?: number },
  customSecret?: string
): Promise<string> {
  const secret = customSecret || getAuthSecret();
  const fullPayload: SessionPayload = {
    ...payload,
    exp: payload.exp || Date.now() + SESSION_MAX_AGE * 1000,
  };

  const encoder = new TextEncoder();
  const dataString = btoa(unescape(encodeURIComponent(JSON.stringify(fullPayload))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(dataString));
  const signatureString = bufferToBase64Url(signatureBuffer);

  return `${dataString}.${signatureString}`;
}

/**
 * Cryptographically verify and decode a session token
 */
export async function verifySessionToken(
  token: string,
  customSecret?: string
): Promise<SessionPayload | null> {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [dataString, signatureString] = parts;
    if (!dataString || !signatureString) return null;

    const secret = customSecret || getAuthSecret();
    const key = await getCryptoKey(secret);
    const encoder = new TextEncoder();

    const signatureBytes = base64UrlToUint8Array(signatureString);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      encoder.encode(dataString)
    );

    if (!isValid) {
      return null; // Tampered or invalid signature
    }

    const decodedString = decodeURIComponent(escape(atob(dataString.replace(/-/g, "+").replace(/_/g, "/"))));
    const payload = JSON.parse(decodedString) as SessionPayload;

    // Check expiration
    if (!payload.exp || payload.exp < Date.now()) {
      return null; // Expired session
    }

    if (!payload.userId) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
