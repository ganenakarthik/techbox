import { NextResponse } from "next/server";
import { getUserByEmailFromDB } from "@/lib/neon";
import { verifyPassword, sanitizeInput, recordSecurityEvent, isSoleAdminEmail } from "@/lib/security";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawEmail = body.email || "";
    const rawPassword = body.password || "";

    const email = sanitizeInput(rawEmail.trim().toLowerCase());

    if (!email || !rawPassword) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await getUserByEmailFromDB(email);

    if (!user) {
      recordSecurityEvent("AUTH_LOGIN_FAILED", email, "Non-existent user login attempt", "MEDIUM");
      return NextResponse.json(
        { success: false, message: "No account found with this email. Please sign up." },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(rawPassword, user.passwordHash);

    if (!isValidPassword) {
      recordSecurityEvent("AUTH_LOGIN_FAILED", email, "Invalid password attempt", "HIGH");
      return NextResponse.json(
        { success: false, message: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    // Ensure role is enforced strictly dynamically as well
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
        ? "Welcome back, Sole Admin! Control panel unlocked."
        : "Successfully logged in!",
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
