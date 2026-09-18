import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  const envAudit = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    POSTGRES_PRISMA_URL: Boolean(process.env.POSTGRES_PRISMA_URL),
    POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
    DIRECT_URL: Boolean(process.env.DIRECT_URL),
    REMOTE_DATABASE_URL: Boolean(process.env.REMOTE_DATABASE_URL),
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
    FAST2SMS_API_KEY: Boolean(process.env.FAST2SMS_API_KEY),
    TWILIO_AUTH_TOKEN: Boolean(process.env.TWILIO_AUTH_TOKEN),
  };

  try {
    // Probe PostgreSQL connectivity with a fast query
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "ready",
        service: "partsly-core",
        database: "connected",
        dbLatencyMs: latencyMs,
        environmentVariables: envAudit,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error("Readiness check failed - PostgreSQL unreachable:", error.message);

    return NextResponse.json(
      {
        status: "unavailable",
        service: "partsly-core",
        database: "disconnected",
        dbLatencyMs: latencyMs,
        environmentVariables: envAudit,
        error: error?.message || "Database connectivity check failed",
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
