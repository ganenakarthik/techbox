import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("techbox_session");

    // 1. Unauthenticated -> 307 Redirect to login with return url
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "auth_required");
      return NextResponse.redirect(loginUrl);
    }

    // 2. Decode session payload to verify role
    try {
      const parts = sessionCookie.value.split(".");
      if (parts.length !== 2) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      const rawData = parts[0];
      const decodedStr = Buffer.from(rawData, "base64url").toString("utf8");
      const payload = JSON.parse(decodedStr);

      // Check expiration
      if (payload.exp && payload.exp < Date.now()) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        loginUrl.searchParams.set("reason", "session_expired");
        return NextResponse.redirect(loginUrl);
      }

      // Check role: must be ADMIN or STAFF
      if (payload.role !== "ADMIN" && payload.role !== "STAFF") {
        // Customer attempting to view admin panel -> Redirect to account dashboard with error
        const forbiddenUrl = new URL("/account", request.url);
        forbiddenUrl.searchParams.set("error", "admin_access_required");
        return NextResponse.redirect(forbiddenUrl);
      }
    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
