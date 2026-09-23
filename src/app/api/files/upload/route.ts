import { NextResponse } from "next/server";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { uploadObject } from "@/lib/storage";
import { FileCategory } from "@prisma/client";

// Explicitly blocked executable extensions
const DISALLOWED_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".php",
  ".js",
  ".mjs",
  ".cjs",
  ".vbs",
  ".msi",
  ".dll",
  ".scr",
  ".bin",
  ".com",
  ".ps1",
  ".jar",
  ".py",
]);

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to upload files. Please log in." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const categoryInput = (formData.get("category") as string) || "OTHER";
    const entityType = formData.get("entityType") as string | null;
    const entityId = formData.get("entityId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file attached to upload request" }, { status: 400 });
    }

    const originalName = file.name || "upload";
    const ext = path.extname(originalName).toLowerCase();

    // 1. Security Check against executables
    if (DISALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Executable or script files (${ext}) are strictly prohibited for security.` },
        { status: 400 }
      );
    }

    // 2. Validate Category
    let category: FileCategory = FileCategory.OTHER;
    if (Object.values(FileCategory).includes(categoryInput as FileCategory)) {
      category = categoryInput as FileCategory;
    }

    // 3. Size Limits based on service category
    let maxSizeBytes = 25 * 1024 * 1024; // Default 25MB
    if (category === FileCategory.PCB || category === FileCategory.THREE_D_MODEL) {
      maxSizeBytes = 100 * 1024 * 1024; // 100MB for Gerbers and STL CAD files
    }

    if (file.size > maxSizeBytes) {
      const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
      return NextResponse.json(
        { error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum ${maxMb}MB limit for this service.` },
        { status: 400 }
      );
    }

    // 4. Upload actual file bytes via Storage Abstraction
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadObject(
      buffer,
      originalName,
      file.type || "application/octet-stream",
      category,
      user.id
    );

    // 5. Create persistent database record in Neon PostgreSQL
    let storedFile: any;
    try {
      storedFile = await prisma.storedFile.create({
        data: {
          userId: user.id,
          originalName,
          storageKey: uploaded.storageKey,
          fileUrl: uploaded.fileUrl,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          category,
          entityType: entityType ? String(entityType).trim() : null,
          entityId: entityId ? String(entityId).trim() : null,
        },
      });
    } catch (dbErr: any) {
      // Cleanup orphaned storage object if database persistence fails
      const { deleteObject } = await import("@/lib/storage");
      await deleteObject(uploaded.storageKey);
      throw dbErr;
    }

    return NextResponse.json({
      success: true,
      fileId: storedFile.id,
      originalName: storedFile.originalName,
      fileUrl: storedFile.fileUrl,
      sizeBytes: storedFile.sizeBytes,
      mimeType: storedFile.mimeType,
      category: storedFile.category,
      storageKey: storedFile.storageKey,
    });
  } catch (error: any) {
    console.error("POST /api/files/upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file to persistent storage." },
      { status: 500 }
    );
  }
}
