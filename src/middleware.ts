import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, COOKIE_NAME, LEGACY_COOKIE_NAME } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // 1. CSRF Protection for state-mutating requests to /api/*
  if (pathname.startsWith("/api/") && ["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (origin) {
      try {
        const originHost = new URL(origin).host;
        const allowedHosts = [host, "partsly.in", "www.partsly.in", "techbox.vercel.app"];
        if (host && !allowedHosts.some((h) => h && originHost.endsWith(h.split(":")[0]))) {
          return new NextResponse(
            JSON.stringify({ error: "CSRF check failed. Cross-origin request denied." }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch {
        return new NextResponse(
          JSON.stringify({ error: "Invalid origin header." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  // 2. Protect all /admin routes
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

  // 3. Web Security Hardening: Apply Security Headers to all HTTP responses
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

  // Prevent caching of sensitive data for API & Admin routes
  if (pathname.startsWith("/api/") || pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  // Content-Security-Policy (CSP)
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:",
    "style-src 'self' 'unsafe-inline' https: http:",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data: https: http:",
    "connect-src 'self' https: http: wss: ws:",
    "frame-ancestors 'none'",
  ].join("; ");
  response.headers.set("Content-Security-Policy", cspHeader);

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

