import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const configuredSecret = process.env.ADMIN_BOOTSTRAP_SECRET;
    if (!configuredSecret || configuredSecret.trim().length < 16) {
      return NextResponse.json(
        { error: "Admin bootstrap is disabled in this environment. Configure ADMIN_BOOTSTRAP_SECRET with minimum 16 characters to enable." },
        { status: 503 }
      );
    }

    const authHeader = req.headers.get("x-bootstrap-secret");
    const body = await req.json().catch(() => ({}));
    const secretAttempt = authHeader || body.bootstrapSecret;

    if (!secretAttempt || typeof secretAttempt !== "string") {
      return NextResponse.json({ error: "Invalid bootstrap authorization." }, { status: 403 });
    }

    // Timing safe comparison
    const secretBuffer = Buffer.from(secretAttempt);
    const expectedBuffer = Buffer.from(configuredSecret);

    if (secretBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(secretBuffer, expectedBuffer)) {
      return NextResponse.json({ error: "Invalid bootstrap authorization." }, { status: 403 });
    }
    // Check if an admin already exists. If so, bootstrap is permanently disabled.
    const existingAdminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });
    if (existingAdminCount > 0) {
      return NextResponse.json(
        { error: "Bootstrap is disabled. An administrator account already exists. Use the administrative security settings to manage credentials." },
        { status: 403 }
      );
    }

    const { email, password, name = "Partsly Operations Lead" } = body;

    if (!email || !password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Email and secure password (minimum 8 characters) are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    const adminUser = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        passwordHash,
        role: "ADMIN",
        name,
      },
      create: {
        email: cleanEmail,
        name,
        passwordHash,
        role: "ADMIN",
      },
    });

    // Record in audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId: adminUser.id,
        action: "ADMIN_BOOTSTRAP",
        target: `User:${adminUser.id}`,
        details: `Admin account provisioned/updated via secure bootstrap token. Email: ${cleanEmail}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Admin account "${cleanEmail}" provisioned securely in PostgreSQL. You can now log in via /login.`,
      userId: adminUser.id,
    });
  } catch (err: any) {
    console.error("Admin bootstrap error:", err);
    return NextResponse.json({ error: "Bootstrap operation failed." }, { status: 500 });
  }
}
