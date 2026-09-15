import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      include: {
        files: true,
        quotes: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = projects.map((p) => {
      const components = (p.detectedBOM as any[]) || [];
      const availableCount = components.filter((c) => c.available).length;

      return {
        id: p.id,
        projectCode: p.projectCode,
        title: p.title,
        description: p.description,
        status: p.status,
        buildLevel: p.buildLevel,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        componentsCount: components.length,
        availableComponentsCount: availableCount,
        filesCount: p.files.length,
        files: p.files,
        quote: p.quotes[0]
          ? {
              status: p.quotes[0].status,
              totalCost: Number(p.quotes[0].totalCost),
              version: p.quotes[0].version,
            }
          : null,
      };
    });

    return NextResponse.json({ projects: formatted });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
