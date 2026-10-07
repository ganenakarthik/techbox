import { NextResponse } from "next/server";
import { getUserByEmailFromDB, createUserInDB } from "@/lib/neon";
import { isSoleAdminEmail, hashPassword, sanitizeInput, recordSecurityEvent } from "@/lib/security";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawName = body.name || "";
    const rawIdentifier = body.identifier || body.email || "";
    const rawPassword = body.password || "";

    const name = sanitizeInput(rawName.trim());
    const email = sanitizeInput(rawIdentifier.trim().toLowerCase());

    if (!name || !email || !rawPassword) {
      return NextResponse.json(
        { success: false, message: "Name, Email or Mobile Number, and Password are required fields." },
        { status: 400 }
      );
    }

    if (rawPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmailFromDB(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this Email or Mobile Number already exists. Please sign in." },
        { status: 409 }
      );
    }

    // Dynamic Admin Check: Only ganenakartiks7@gmail.com becomes Admin
    const role: "admin" | "customer" = isSoleAdminEmail(email) ? "admin" : "customer";

    const passwordHash = await hashPassword(rawPassword);

    const newUser = await createUserInDB({
      name,
      email,
      role,
      passwordHash,
    });

    recordSecurityEvent(
      "AUTH_SIGNUP",
      email,
      `User signed up with role [${role}]`,
      role === "admin" ? "HIGH" : "LOW"
    );

    const token = `token_${Buffer.from(`${newUser.id}:${newUser.email}:${Date.now()}`).toString("base64")}`;

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (err: any) {
    recordSecurityEvent("AUTH_LOGIN_FAILED", "unknown", `Signup exception: ${err.message}`, "HIGH");
    return NextResponse.json(
      { success: false, message: "Server error during registration." },
      { status: 500 }
    );
  }
}
