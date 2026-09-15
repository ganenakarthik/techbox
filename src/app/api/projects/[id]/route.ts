import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { projectCode: id }],
      },
      include: {
        files: true,
        quotes: {
          orderBy: { version: "desc" },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!user || (project.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Access denied: You do not have permission to view this project" }, { status: 403 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Project GET by ID error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
