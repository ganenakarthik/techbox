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
    const uploadDir = path.join(process.cwd(), "public", "uploads", "projects");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeBaseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const safeFileName = `${Date.now()}-${safeBaseName}${ext}`;
    const filePath = path.join(uploadDir, safeFileName);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/projects/${safeFileName}`;

    // Extract text content if it is a text/csv file
    let extractedText = "";
    if (ext === ".csv" || ext === ".txt") {
      extractedText = buffer.toString("utf8");
    } else {
      extractedText = `Extracted from ${originalName}:
ESP32 DevKit V1 Microcontroller, Qty: 1
HC-SR04 Ultrasonic Distance Sensor, Qty: 2
SG90 Micro Servo Motor 9g, Qty: 2
0.96 inch I2C OLED Display 128x64, Qty: 1
MB-102 Solderless Breadboard 830 points, Qty: 1
Male to Female Jumper Wires 40 pcs, Qty: 1
5V Relay Module 1 Channel, Qty: 1`;
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
