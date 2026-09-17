import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      {
        status: "ready",
        service: "partsly-core",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unavailable",
        service: "partsly-core",
        database: "disconnected",
        error: error.message || "Database unreachable",
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      }
    );
  }
}
