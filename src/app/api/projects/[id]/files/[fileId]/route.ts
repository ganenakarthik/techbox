import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getProjectFileBuffer } from "@/lib/storage";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id: projectId, fileId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required to access project files." }, { status: 401 });
    }

    const projectFile = await prisma.projectFile.findUnique({
      where: { id: fileId },
      include: {
        project: {
          select: {
            id: true,
            projectCode: true,
            userId: true,
          },
        },
      },
    });

    if (!projectFile || (projectFile.projectId !== projectId && projectFile.project.projectCode !== projectId)) {
      return NextResponse.json({ error: "Project file not found." }, { status: 404 });
    }

    // Strict Authorization: Project Owner, Admin, or Staff ONLY
    const isOwner = projectFile.project.userId === user.id;
    const isAuthorizedStaff = user.role === "ADMIN" || user.role === "STAFF";

    if (!isOwner && !isAuthorizedStaff) {
      return NextResponse.json(
        { error: "Access denied: You do not have permission to access files for this project." },
        { status: 403 }
      );
    }

    const fileData = await getProjectFileBuffer(projectFile.fileUrl);
    if (!fileData) {
      return NextResponse.json({ error: "File content unavailable." }, { status: 404 });
    }

    return new Response(new Uint8Array(fileData.buffer), {
      headers: {
        "Content-Type": projectFile.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(projectFile.fileName)}"`,
        "Content-Length": String(fileData.buffer.length),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Project file download error:", error);
    return NextResponse.json({ error: "Failed to retrieve project file." }, { status: 500 });
  }
}
