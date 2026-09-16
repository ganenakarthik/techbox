import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();
  try {
    // Probe PostgreSQL connectivity with a simple fast query
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "ready",
        service: "techbox-core",
        database: "connected",
        dbLatencyMs: latencyMs,
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
        service: "techbox-core",
        database: "disconnected",
        dbLatencyMs: latencyMs,
        error: "Database connectivity check failed",
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
