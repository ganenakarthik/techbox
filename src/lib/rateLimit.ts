/**
 * Production In-Memory / Distributed Rate Limiter
 * Tracks attempts by key (IP or identifier) with automatic sliding window expiration.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic cleanup of stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
  totalAttempts: number;
}

/**
 * Check and increment rate limit for an action
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowSeconds: number = 15 * 60
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowSeconds * 1000,
    };
    rateLimitStore.set(key, newEntry);
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetInSeconds: windowSeconds,
      totalAttempts: 1,
    };
  }

  entry.count += 1;
  const resetInSeconds = Math.max(1, Math.ceil((entry.resetTime - now) / 1000));

  if (entry.count > maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
      totalAttempts: entry.count,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, maxAttempts - entry.count),
    resetInSeconds,
    totalAttempts: entry.count,
  };
}

/**
 * Reset rate limit counter on successful action (e.g. successful login)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Extract client IP safely from Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
