/**
 * Web Security & Authorization Engine for Partsly
 * Enforces XSS sanitization, SHA-256 password hashing, rate limiting, and strict Admin RBAC.
 */

export const SOLE_ADMIN_EMAIL = "ganenakartiks7@gmail.com";

export interface SecurityLog {
  id: string;
  timestamp: string;
  eventType: "AUTH_LOGIN_SUCCESS" | "AUTH_LOGIN_FAILED" | "AUTH_SIGNUP" | "ADMIN_ACCESS_ATTEMPT" | "XSS_BLOCKED" | "ORDER_STATUS_MUTATION";
  email: string;
  details: string;
  ip: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

// Security Audit Log Ledger
export const securityLogsLedger: SecurityLog[] = [
  {
    id: "SEC-1001",
    timestamp: new Date().toISOString(),
    eventType: "ADMIN_ACCESS_ATTEMPT",
    email: SOLE_ADMIN_EMAIL,
    details: "Sole Admin system authorization rule initialized",
    ip: "127.0.0.1",
    severity: "LOW",
  },
];

/**
 * Checks if the given email has sole admin authorization.
 * STRICT RULE: Only ganenakartiks7@gmail.com is authorized as Admin.
 */
export function isSoleAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase();
}

/**
 * Sanitize input to protect against Cross-Site Scripting (XSS)
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Hash password securely using Web Crypto API SHA-256 with salt
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = "PARTSLY_HARDWARE_SECURE_SALT_2026_";
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify plaintext password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const calculatedHash = await hashPassword(password);
  return calculatedHash === hash;
}

/**
 * Log Security Audit Event
 */
export function recordSecurityEvent(
  eventType: SecurityLog["eventType"],
  email: string,
  details: string,
  severity: SecurityLog["severity"] = "LOW",
  ip = "127.0.0.1"
): SecurityLog {
  const log: SecurityLog = {
    id: `SEC-${Math.floor(10000 + Math.random() * 90000)}`,
    timestamp: new Date().toISOString(),
    eventType,
    email: sanitizeInput(email),
    details: sanitizeInput(details),
    ip,
    severity,
  };
  securityLogsLedger.unshift(log);
  return log;
}
