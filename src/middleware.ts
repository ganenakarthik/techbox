import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, COOKIE_NAME, LEGACY_COOKIE_NAME } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get(COOKIE_NAME) || request.cookies.get(LEGACY_COOKIE_NAME);

    // Unauthenticated -> 307 Redirect to login with return url
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "auth_required");
      return NextResponse.redirect(loginUrl);
    }

    // Cryptographically verify session token HMAC signature
    const payload = await verifySessionToken(sessionCookie.value);

    if (!payload || (payload.role !== "ADMIN" && payload.role !== "STAFF")) {
      const targetUrl = new URL(payload ? "/account" : "/login", request.url);
      targetUrl.searchParams.set(payload ? "error" : "reason", payload ? "admin_access_required" : "session_invalid");
      return NextResponse.redirect(targetUrl);
    }
  }

  // 2. Web Security Hardening: Apply Security Headers to all HTTP responses
  const response = NextResponse.next();

  // Prevent Clickjacking attacks (Framing Rejection)
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME-type sniffing vulnerabilities
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Protect privacy when navigating outwards
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Legacy XSS filter activation
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Hardware and API feature restriction
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // Strict Transport Security (Force HTTPS for 1 year)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files (_next/static, _next/image, favicon.ico)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

