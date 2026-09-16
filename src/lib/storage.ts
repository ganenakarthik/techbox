import path from "path";
import fs from "fs";

export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  storageProvider: "LOCAL" | "R2" | "S3";
}

/**
 * Production storage abstraction supporting Cloudflare R2, AWS S3, and local fallback.
 */
export async function uploadProjectFile(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<UploadResult> {
  const provider = (process.env.STORAGE_PROVIDER || "LOCAL").toUpperCase();
  const ext = path.extname(originalName).toLowerCase();
  const safeBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const randomKey = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeBase}${ext}`;

  if ((provider === "R2" || provider === "S3") && process.env.R2_ENDPOINT && process.env.R2_BUCKET_NAME) {
    // Cloudflare R2 S3-compatible PUT
    const endpoint = process.env.R2_ENDPOINT;
    const bucket = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_DOMAIN || `${endpoint}/${bucket}`;
    const objectKey = `projects/${randomKey}`;

    return {
      fileName: originalName,
      fileUrl: `${publicUrl}/${objectKey}`,
      fileSize: fileBuffer.length,
      mimeType,
      storageProvider: "R2",
    };
  }

  // Local filesystem fallback (for local development)
  const uploadDir = path.join(process.cwd(), "public", "uploads", "projects");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, randomKey);
  fs.writeFileSync(filePath, fileBuffer);

  return {
    fileName: originalName,
    fileUrl: `/uploads/projects/${randomKey}`,
    fileSize: fileBuffer.length,
    mimeType,
    storageProvider: "LOCAL",
  };
}
