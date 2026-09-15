import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { BuildLevel, ProjectStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      buildLevel = "COMPONENTS_ONLY",
      matchedComponents = [],
      fileInfo,
      notes,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 });
    }

    const projectCode = `PRJ-${Math.floor(10000 + Math.random() * 90000)}`;

    let level: BuildLevel = BuildLevel.COMPONENTS_ONLY;
    if (buildLevel === "PROJECT_KIT") level = BuildLevel.PROJECT_KIT;
    else if (buildLevel === "WORKING_PROTOTYPE") level = BuildLevel.WORKING_PROTOTYPE;
    else if (buildLevel === "COMPLETE_BUILD") level = BuildLevel.COMPLETE_BUILD;

    const project = await prisma.project.create({
      data: {
        projectCode,
        userId: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        buildLevel: level,
        status: ProjectStatus.REQUIREMENTS_READY,
        detectedBOM: matchedComponents,
        notes: notes || null,
        files: fileInfo
          ? {
              create: {
                fileName: fileInfo.fileName,
                fileUrl: fileInfo.fileUrl,
                fileType: fileInfo.fileName.split(".").pop() || "bin",
                fileSize: fileInfo.fileSize || 0,
                mimeType: fileInfo.mimeType || "application/octet-stream",
              },
            }
          : undefined,
      },
      include: {
        files: true,
      },
    });

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        projectCode: project.projectCode,
        title: project.title,
        status: project.status,
        buildLevel: project.buildLevel,
        files: project.files,
      },
    });
  } catch (error) {
    console.error("Project create error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
