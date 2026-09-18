import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, COOKIE_NAME, LEGACY_COOKIE_NAME } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get(COOKIE_NAME) || request.cookies.get(LEGACY_COOKIE_NAME);

    // 1. Unauthenticated -> 307 Redirect to login with return url
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "auth_required");
      return NextResponse.redirect(loginUrl);
    }

    // 2. Cryptographically verify session token HMAC signature
    const payload = await verifySessionToken(sessionCookie.value);

    if (!payload) {
      // Tampered, malformed, or expired token
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "session_invalid");
      return NextResponse.redirect(loginUrl);
    }

    // 3. Verify role: must be ADMIN or STAFF
    if (payload.role !== "ADMIN" && payload.role !== "STAFF") {
      const forbiddenUrl = new URL("/account", request.url);
      forbiddenUrl.searchParams.set("error", "admin_access_required");
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
