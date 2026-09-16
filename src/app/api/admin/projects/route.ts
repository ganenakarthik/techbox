import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
        files: true,
        quotes: {
          orderBy: { version: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = projects.map((p) => ({
      id: p.id,
      projectCode: p.projectCode,
      title: p.title,
      description: p.description,
      status: p.status,
      buildLevel: p.buildLevel,
      customerName: p.user.name,
      customerEmail: p.user.email,
      customerPhone: p.user.phone,
      createdAt: p.createdAt.toISOString(),
      filesCount: p.files.length,
      files: p.files,
      detectedBOM: (p.detectedBOM as any[]) || [],
      activeQuote: p.quotes[0]
        ? {
            id: p.quotes[0].id,
            status: p.quotes[0].status,
            totalCost: Number(p.quotes[0].totalCost),
            version: p.quotes[0].version,
          }
        : null,
    }));

    return NextResponse.json({ projects: formatted });
  } catch (error) {
    console.error("Admin projects GET error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
