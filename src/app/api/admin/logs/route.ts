import { NextResponse } from "next/server";
import { isSoleAdminEmail, securityLogsLedger, recordSecurityEvent } from "@/lib/security";
import { inMemoryUsers } from "@/lib/neon";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const adminEmail = searchParams.get("adminEmail") || req.headers.get("x-admin-email") || "";

  if (!isSoleAdminEmail(adminEmail)) {
    recordSecurityEvent(
      "ADMIN_ACCESS_ATTEMPT",
      adminEmail || "anonymous",
      "Unauthorized fetch of security logs",
      "CRITICAL"
    );
    return NextResponse.json(
      { success: false, message: "403 Forbidden: Sole Admin access required." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    logs: securityLogsLedger,
    usersCount: inMemoryUsers.length,
    usersList: inMemoryUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    })),
  });
}
