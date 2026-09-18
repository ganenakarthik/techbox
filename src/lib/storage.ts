import path from "path";
import fs from "fs";

export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  storageProvider: "LOCAL" | "R2" | "S3";
  objectKey: string;
}

const FORBIDDEN_EXTENSIONS = new Set([
  ".exe", ".bat", ".cmd", ".sh", ".php", ".phtml", ".pl", ".py", ".rb", ".vbs", ".msi", ".jar", ".ps1", ".dll", ".scr"
]);

/**
 * Storage abstraction for Partsly.
 * Stored securely in a private directory accessible strictly through authenticated API proxies.
 */
export async function uploadProjectFile(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
  userId?: string
): Promise<UploadResult> {
  const ext = path.extname(originalName).toLowerCase();

  // 1. Strict Security Validation
  if (FORBIDDEN_EXTENSIONS.has(ext)) {
    throw new Error(`Executable or script files (${ext}) are strictly prohibited for security.`);
  }

  if (fileBuffer.length > 25 * 1024 * 1024) {
    throw new Error("File size exceeds 25MB limit.");
  }

  const safeBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const randomKey = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeBase}${ext}`;
  const customerFolder = userId ? `users/${userId}/projects` : "anonymous/projects";
  const objectKey = `${customerFolder}/${randomKey}`;

  // Private Local / Serverless Storage
  const baseDir = process.env.VERCEL
    ? path.join("/tmp", ".private_storage")
    : path.join(process.cwd(), ".private_storage");

  const privateStorageDir = path.join(baseDir, customerFolder);
  if (!fs.existsSync(privateStorageDir)) {
    fs.mkdirSync(privateStorageDir, { recursive: true });
  }

  const filePath = path.join(privateStorageDir, randomKey);
  fs.writeFileSync(filePath, fileBuffer);

  return {
    fileName: originalName,
    fileUrl: `local://${objectKey}`,
    fileSize: fileBuffer.length,
    mimeType,
    storageProvider: "LOCAL",
    objectKey,
  };
}

/**
 * Retrieves file buffer securely from storage provider
 */
export async function getProjectFileBuffer(fileUrl: string, objectKey?: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const cleanKey = objectKey || fileUrl.replace("local://", "").replace(/^\/uploads\//, "");
  const pathsToCheck = [
    path.join("/tmp", ".private_storage", cleanKey),
    path.join(process.cwd(), ".private_storage", cleanKey),
    path.join(process.cwd(), "public", "uploads", cleanKey),
  ];

  for (const candidate of pathsToCheck) {
    if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) {
      return { buffer: fs.readFileSync(/*turbopackIgnore: true*/ candidate), mimeType: "application/octet-stream" };
    }
  }

  return null;
}
