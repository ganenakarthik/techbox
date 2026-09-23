import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getObjectBuffer } from "@/lib/storage";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required to download files." }, { status: 401 });
    }

    const storedFile = await prisma.storedFile.findUnique({ where: { id } });
    if (!storedFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Authorization check
    if (storedFile.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden: Access denied to this file." }, { status: 403 });
    }

    const fileData = await getObjectBuffer(storedFile.storageKey);
    if (!fileData) {
      return NextResponse.json({ error: "File content unavailable" }, { status: 404 });
    }

    return new Response(new Uint8Array(fileData.buffer), {
      headers: {
        "Content-Type": storedFile.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(storedFile.originalName)}"`,
      },
    });
  } catch (error: any) {
    console.error("GET /api/files/[id]/download error:", error);
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}
