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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { action, quoteId, remarks } = body;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { projectCode: id }],
      },
      include: {
        quotes: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const latestQuote = project.quotes[0];
    if (!latestQuote) {
      return NextResponse.json({ error: "No quote found for this project" }, { status: 400 });
    }

    if (action === "ACCEPT") {
      await prisma.$transaction([
        prisma.projectQuote.update({
          where: { id: latestQuote.id },
          data: { status: "ACCEPTED" },
        }),
        prisma.project.update({
          where: { id: project.id },
          data: { status: "APPROVED" },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: "Quote approved! Project transitioned to APPROVED.",
        projectStatus: "APPROVED",
        quoteStatus: "ACCEPTED",
      });
    } else if (action === "REVISE" || action === "REJECT") {
      await prisma.$transaction([
        prisma.projectQuote.update({
          where: { id: latestQuote.id },
          data: {
            status: action === "REVISE" ? "REVISION_REQUESTED" : "REJECTED",
            studentRemarks: remarks || null,
          },
        }),
        prisma.project.update({
          where: { id: project.id },
          data: { status: "REQUIREMENTS_READY" },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: action === "REVISE" ? "Revision requested from engineering team" : "Quote declined",
        projectStatus: "REQUIREMENTS_READY",
        quoteStatus: action === "REVISE" ? "REVISION_REQUESTED" : "REJECTED",
      });
    }

    return NextResponse.json({ error: "Invalid action. Must be ACCEPT, REVISE, or REJECT." }, { status: 400 });
  } catch (error) {
    console.error("Project PATCH error:", error);
    return NextResponse.json({ error: "Failed to update project quote status" }, { status: 500 });
  }
}

