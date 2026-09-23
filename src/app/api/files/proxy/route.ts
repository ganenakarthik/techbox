import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getObjectBuffer } from "@/lib/storage";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required to access files." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const id = searchParams.get("id");

    if (!key && !id) {
      return NextResponse.json({ error: "File key or ID required" }, { status: 400 });
    }

    let storedFile: any = null;
    if (id) {
      storedFile = await prisma.storedFile.findUnique({ where: { id } });
    } else if (key) {
      storedFile = await prisma.storedFile.findUnique({ where: { storageKey: key } });
    }

    if (!storedFile) {
      // Check legacy ProjectFile as fallback
      if (key || id) {
        const legacyProjectFile = await prisma.projectFile.findFirst({
          where: { OR: [{ id: id || undefined }, { fileUrl: key || undefined }] },
          include: { project: true },
        });
        if (legacyProjectFile) {
          if (legacyProjectFile.project.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF") {
            return NextResponse.json({ error: "Forbidden: Access denied to this file." }, { status: 403 });
          }
          const fileData = await getObjectBuffer(legacyProjectFile.fileUrl);
          if (!fileData) {
            return NextResponse.json({ error: "File content not found on server." }, { status: 404 });
          }
          return new Response(new Uint8Array(fileData.buffer), {
            headers: {
              "Content-Type": legacyProjectFile.mimeType || "application/octet-stream",
              "Content-Disposition": `attachment; filename="${encodeURIComponent(legacyProjectFile.fileName)}"`,
            },
          });
        }
      }
      return NextResponse.json({ error: "File record not found." }, { status: 404 });
    }

    // Strict Authorization Check: Owner or Admin/Staff
    const isOwner = storedFile.userId === user.id;
    const isAdmin = user.role === "ADMIN" || user.role === "STAFF";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden: You do not have permission to access this file." }, { status: 403 });
    }

    const fileData = await getObjectBuffer(storedFile.storageKey);
    if (!fileData) {
      return NextResponse.json({ error: "Stored object bytes unavailable on server." }, { status: 404 });
    }

    return new Response(new Uint8Array(fileData.buffer), {
      headers: {
        "Content-Type": storedFile.mimeType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${encodeURIComponent(storedFile.originalName)}"`,
      },
    });
  } catch (error: any) {
    console.error("GET /api/files/proxy error:", error);
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}
