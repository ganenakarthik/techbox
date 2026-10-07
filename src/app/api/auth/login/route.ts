import { NextResponse } from "next/server";
import { getUserByEmailFromDB } from "@/lib/neon";
import { verifyPassword, sanitizeInput, recordSecurityEvent, isSoleAdminEmail } from "@/lib/security";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawIdentifier = body.identifier || body.email || "";
    const rawPassword = body.password || "";

    const identifier = sanitizeInput(rawIdentifier.trim().toLowerCase());

    if (!identifier || !rawPassword) {
      return NextResponse.json(
        { success: false, message: "Email or Mobile Phone Number and password are required." },
        { status: 400 }
      );
    }

    // Try finding user by email or phone identifier
    const user = await getUserByEmailFromDB(identifier);

    if (!user) {
      recordSecurityEvent("AUTH_LOGIN_FAILED", identifier, "User account not found", "MEDIUM");
      return NextResponse.json(
        { success: false, message: "No account found with this Email or Mobile Number. Please create an account." },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(rawPassword, user.passwordHash);

    if (!isValidPassword) {
      recordSecurityEvent("AUTH_LOGIN_FAILED", user.email, "Invalid password attempt", "HIGH");
      return NextResponse.json(
        { success: false, message: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    // Dynamic Admin check for ganenakartiks7@gmail.com
    const verifiedRole: "admin" | "customer" = isSoleAdminEmail(user.email) ? "admin" : "customer";

    recordSecurityEvent(
      "AUTH_LOGIN_SUCCESS",
      user.email,
      `User authenticated with role [${verifiedRole}]`,
      verifiedRole === "admin" ? "HIGH" : "LOW"
    );

    const token = `token_${Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString("base64")}`;

    return NextResponse.json({
      success: true,
      message: verifiedRole === "admin"
        ? "Signed in as Administrator"
        : "Successfully signed in",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: verifiedRole,
      },
      token,
    });
  } catch (err: any) {
    recordSecurityEvent("AUTH_LOGIN_FAILED", "unknown", `Login exception: ${err.message}`, "HIGH");
    return NextResponse.json(
      { success: false, message: "Server error during authentication." },
      { status: 500 }
    );
  }
}
