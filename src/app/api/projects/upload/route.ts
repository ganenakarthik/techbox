import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Allowed extensions for engineering design files, BOMs, datasheets, firmware ZIPs, CAD/Gerbers
const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".csv",
  ".txt",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
  ".stl",
  ".step",
  ".stp",
  ".gerber",
  ".gbr",
  ".drl",
  ".kicad_pcb",
  ".sch",
  ".brd",
]);

// Explicitly blocked dangerous executable extensions
const DISALLOWED_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".php",
  ".js",
  ".mjs",
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
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to upload project files. Please sign in or create an account." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const originalName = file.name || "upload";
    const ext = path.extname(originalName).toLowerCase();

    // Check against dangerous extensions
    if (DISALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Executable or script files (${ext}) are strictly prohibited for security.` },
        { status: 400 }
      );
    }

    // Must be in whitelist
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          error: `Unsupported file extension (${ext}). Please upload PDF, CSV, TXT, images, ZIP/Gerber, or 3D STL files.`,
        },
        { status: 400 }
      );
    }

    // Size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 15MB limit" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { uploadProjectFile } = await import("@/lib/storage");
    const uploaded = await uploadProjectFile(
      buffer,
      originalName,
      file.type || "application/octet-stream",
      user.id
    );

    const fileUrl = uploaded.fileUrl;

    // Extract text content only if it is a genuine text/csv file
    let extractedText = "";
    if (ext === ".csv" || ext === ".txt") {
      extractedText = buffer.toString("utf8");
    } else {
      extractedText = `Received ${originalName} (${(file.size / 1024).toFixed(1)} KB) — Partsly engineering team will review your project specifications and generate an itemized quote.`;
    }

    return NextResponse.json({
      success: true,
      fileName: originalName,
      fileUrl,
      fileSize: file.size,
      mimeType: file.type || "application/octet-stream",
      extractedText,
    });
  } catch (error) {
    console.error("Project upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload and process file" },
      { status: 500 }
    );
  }
}
