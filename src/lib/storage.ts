import path from "path";
import fs from "fs";
import crypto from "crypto";

export interface UploadResult {
  originalName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  storageProvider: "LOCAL" | "R2" | "S3";
  storageKey: string;
}

const FORBIDDEN_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".php",
  ".phtml",
  ".pl",
  ".py",
  ".rb",
  ".vbs",
  ".msi",
  ".jar",
  ".ps1",
  ".dll",
  ".scr",
  ".js",
  ".mjs",
  ".cjs",
]);

// Read S3 / R2 environment variables safely
const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT;
const STORAGE_REGION = process.env.STORAGE_REGION || "us-east-1";
const STORAGE_BUCKET = process.env.STORAGE_BUCKET;
const STORAGE_ACCESS_KEY_ID = process.env.STORAGE_ACCESS_KEY_ID;
const STORAGE_SECRET_ACCESS_KEY = process.env.STORAGE_SECRET_ACCESS_KEY;

const isS3Configured = Boolean(
  STORAGE_ENDPOINT &&
  STORAGE_BUCKET &&
  STORAGE_ACCESS_KEY_ID &&
  STORAGE_SECRET_ACCESS_KEY
);

/**
 * Universal Server-Side Object Storage Layer for Partsly
 */
export async function uploadObject(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
  category: string = "OTHER",
  userId: string = "anonymous"
): Promise<UploadResult> {
  const ext = path.extname(originalName).toLowerCase();

  // 1. Strict Security Extension Check
  if (FORBIDDEN_EXTENSIONS.has(ext)) {
    throw new Error(`Executable or script files (${ext}) are strictly prohibited for security.`);
  }

  // 2. Generate safe storage key
  const safeBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const randomId = crypto.randomBytes(8).toString("hex");
  const safeExt = ext || ".bin";
  const storageKey = `users/${userId}/${category.toLowerCase()}/${Date.now()}-${randomId}-${safeBase}${safeExt}`;

  // 3. S3 / Cloudflare R2 Provider (if credentials configured in env)
  if (isS3Configured) {
    try {
      const s3Url = `${STORAGE_ENDPOINT!.replace(/\/$/, "")}/${STORAGE_BUCKET}/${storageKey}`;
      const res = await fetch(s3Url, {
        method: "PUT",
        headers: {
          "Content-Type": mimeType || "application/octet-stream",
          "Content-Length": String(fileBuffer.length),
        },
        body: new Uint8Array(fileBuffer),
      });

      if (res.ok) {
        return {
          originalName,
          fileUrl: `/api/files/proxy?key=${encodeURIComponent(storageKey)}`,
          fileSize: fileBuffer.length,
          mimeType,
          storageProvider: "R2",
          storageKey,
        };
      }
    } catch (s3Err) {
      console.warn("S3/R2 storage upload failed, using secure private local storage fallback:", s3Err);
    }
  }

  // 4. Fallback Private Local / Serverless Storage
  const baseDir = process.env.VERCEL
    ? path.join("/tmp", ".private_storage")
    : path.join(process.cwd(), ".private_storage");

  const fullPath = path.join(baseDir, storageKey);
  const dirPath = path.dirname(fullPath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(fullPath, fileBuffer);

  return {
    originalName,
    fileUrl: `/api/files/proxy?key=${encodeURIComponent(storageKey)}`,
    fileSize: fileBuffer.length,
    mimeType,
    storageProvider: "LOCAL",
    storageKey,
  };
}

/**
 * Backward compatibility alias for uploadProjectFile
 */
export async function uploadProjectFile(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
  userId?: string
): Promise<UploadResult> {
  return uploadObject(fileBuffer, originalName, mimeType, "PROJECT_REFERENCE", userId || "anonymous");
}

/**
 * Retrieves file buffer securely from private storage provider
 */
export async function getObjectBuffer(storageKey: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const cleanKey = storageKey
    .replace(/^local:\/\//, "")
    .replace(/^\/api\/files\/proxy\?key=/, "")
    .replace(/^\/uploads\//, "");

  const decodedKey = decodeURIComponent(cleanKey);

  const pathsToCheck = [
    path.join("/tmp", ".private_storage", decodedKey),
    path.join(process.cwd(), ".private_storage", decodedKey),
    path.join("/tmp", ".private_storage", cleanKey),
    path.join(process.cwd(), ".private_storage", cleanKey),
    path.join(process.cwd(), "public", "uploads", cleanKey),
  ];

  for (const candidate of pathsToCheck) {
    if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) {
      return {
        buffer: fs.readFileSync(/*turbopackIgnore: true*/ candidate),
        mimeType: "application/octet-stream",
      };
    }
  }

  return null;
}

/**
 * Deletes object from storage provider (cleanup orphan)
 */
export async function deleteObject(storageKey: string): Promise<boolean> {
  try {
    const cleanKey = storageKey
      .replace(/^local:\/\//, "")
      .replace(/^\/api\/files\/proxy\?key=/, "")
      .replace(/^\/uploads\//, "");
    const decodedKey = decodeURIComponent(cleanKey);

    const baseDir = process.env.VERCEL
      ? path.join("/tmp", ".private_storage")
      : path.join(process.cwd(), ".private_storage");

    const filePath = path.join(baseDir, decodedKey);
    if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      fs.unlinkSync(/*turbopackIgnore: true*/ filePath);
      return true;
    }
  } catch (err) {
    console.error("Error deleting object:", err);
  }
  return false;
}

/**
 * Backward compatibility alias for getProjectFileBuffer
 */
export async function getProjectFileBuffer(fileUrl: string, objectKey?: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  return getObjectBuffer(objectKey || fileUrl);
}
