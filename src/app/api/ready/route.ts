import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const startTime = Date.now();
  const url = new URL(req.url);
  const forceInit = url.searchParams.get("init") === "true";

  const envAudit = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    POSTGRES_PRISMA_URL: Boolean(process.env.POSTGRES_PRISMA_URL),
    POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
    DIRECT_URL: Boolean(process.env.DIRECT_URL),
    REMOTE_DATABASE_URL: Boolean(process.env.REMOTE_DATABASE_URL),
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
  };

  try {
    // Check if User table exists
    const userTableExists: any[] = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'User'
    `;

    let initLogs = "";
    if (forceInit || userTableExists.length === 0) {
      try {
        console.log("⚡ Auto-initializing Neon PostgreSQL tables via Prisma db push...");
        const pushOutput = execSync("npx prisma db push --accept-data-loss --skip-generate", {
          encoding: "utf8",
          env: { ...process.env },
        });
        
        console.log("🌱 Auto-seeding Neon PostgreSQL database...");
        const seedOutput = execSync("npx tsx prisma/seed.ts", {
          encoding: "utf8",
          env: { ...process.env },
        });

        initLogs = `Push: ${pushOutput}\nSeed: ${seedOutput}`;
      } catch (initErr: any) {
        console.error("Auto-init error:", initErr.message || initErr);
        initLogs = `Init error: ${initErr.message || initErr}`;
      }
    }

    // Probe PostgreSQL connectivity with user count check
    const userCount = await prisma.user.count().catch(() => 0);
    const latencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "ready",
        service: "partsly-core",
        database: "connected",
        dbLatencyMs: latencyMs,
        userCount,
        initLogs: initLogs || "Tables already exist",
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
    console.error("Readiness check failed:", error.message);

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

