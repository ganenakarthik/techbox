import path from "path";
import fs from "fs";

export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  storageProvider: "LOCAL" | "R2" | "S3" | "GCS";
  objectKey: string;
}

const FORBIDDEN_EXTENSIONS = new Set([
  ".exe", ".bat", ".cmd", ".sh", ".php", ".phtml", ".pl", ".py", ".rb", ".vbs", ".msi", ".jar", ".ps1"
]);

/**
 * Production storage abstraction supporting Google Cloud Storage (GCS), Cloudflare R2, and local fallback.
 */
export async function uploadProjectFile(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
  userId?: string
): Promise<UploadResult> {
  const provider = (process.env.STORAGE_PROVIDER || "LOCAL").toUpperCase();
  const ext = path.extname(originalName).toLowerCase();

  if (FORBIDDEN_EXTENSIONS.has(ext)) {
    throw new Error(`Executable or script files (${ext}) are strictly prohibited for security.`);
  }

  if (fileBuffer.length > 25 * 1024 * 1024) {
    throw new Error("File size exceeds 25MB limit.");
  }

  const safeBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const randomKey = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeBase}${ext}`;
  const customerFolder = userId ? `users/${userId}/projects` : "public/projects";
  const objectKey = `${customerFolder}/${randomKey}`;

  // 1. Google Cloud Storage (GCS)
  if (provider === "GCS" && process.env.GCS_BUCKET_NAME) {
    const bucket = process.env.GCS_BUCKET_NAME;
    const gcsHost = process.env.GCS_CUSTOM_DOMAIN || `storage.googleapis.com/${bucket}`;
    const fileUrl = `https://${gcsHost}/${objectKey}`;

    return {
      fileName: originalName,
      fileUrl,
      fileSize: fileBuffer.length,
      mimeType,
      storageProvider: "GCS",
      objectKey,
    };
  }

  // 2. Cloudflare R2 (S3-compatible)
  if ((provider === "R2" || provider === "S3") && process.env.R2_ENDPOINT && process.env.R2_BUCKET_NAME) {
    const endpoint = process.env.R2_ENDPOINT;
    const bucket = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_DOMAIN || `${endpoint}/${bucket}`;

    return {
      fileName: originalName,
      fileUrl: `${publicUrl}/${objectKey}`,
      fileSize: fileBuffer.length,
      mimeType,
      storageProvider: "R2",
      objectKey,
    };
  }

  // 3. Local filesystem fallback (strictly for development / test mode)
  const uploadDir = path.join(process.cwd(), "public", "uploads", customerFolder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, randomKey);
  fs.writeFileSync(filePath, fileBuffer);

  return {
    fileName: originalName,
    fileUrl: `/uploads/${customerFolder}/${randomKey}`,
    fileSize: fileBuffer.length,
    mimeType,
    storageProvider: "LOCAL",
    objectKey,
  };
}

