import path from "path";
import fs from "fs";

export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  storageProvider: "SUPABASE" | "LOCAL" | "R2" | "GCS";
  objectKey: string;
}

const FORBIDDEN_EXTENSIONS = new Set([
  ".exe", ".bat", ".cmd", ".sh", ".php", ".phtml", ".pl", ".py", ".rb", ".vbs", ".msi", ".jar", ".ps1", ".dll", ".scr"
]);

const ALLOWED_MIME_PREFIXES = [
  "application/pdf",
  "text/csv",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "image/jpeg",
  "image/png",
  "image/webp",
  "model/stl",
  "application/octet-stream",
];

/**
 * Production storage abstraction for TechBox.
 * Primary Provider: Supabase Storage (Private bucket `project-files`).
 * Local Fallback: Stored in a private, non-public directory accessed strictly via authenticated API proxy.
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lflqghccqvohstanpgly.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "project-files";

  // 2. Primary Production Storage: Supabase Storage Private Bucket
  if (supabaseKey) {
    try {
      const uploadEndpoint = `${supabaseUrl}/storage/v1/object/${bucketName}/${objectKey}`;
      const res = await fetch(uploadEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": mimeType || "application/octet-stream",
          "x-upsert": "true",
        },
        body: new Uint8Array(fileBuffer),
      });

      if (res.ok) {
        return {
          fileName: originalName,
          fileUrl: `supabase://${bucketName}/${objectKey}`,
          fileSize: fileBuffer.length,
          mimeType,
          storageProvider: "SUPABASE",
          objectKey,
        };
      } else {
        const errText = await res.text();
        console.warn(`Supabase Storage upload warning (${res.status}): ${errText}`);
      }
    } catch (sbErr) {
      console.error("Supabase Storage upload error:", sbErr);
    }
  }

  // 3. Fallback: Private Local Storage (NOT served via /public web root)
  // Stored in private storage directory accessible ONLY through /api/projects/[id]/files/[fileId]
  // In serverless / Vercel, /tmp is the only writable directory
  const baseDir = process.env.VERCEL ? path.join("/tmp", ".private_storage") : path.join(process.cwd(), ".private_storage");
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lflqghccqvohstanpgly.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "project-files";

  if (fileUrl.startsWith("supabase://") && supabaseKey) {
    const key = fileUrl.replace(`supabase://${bucketName}/`, "");
    const downloadEndpoint = `${supabaseUrl}/storage/v1/object/authenticated/${bucketName}/${key}`;
    const res = await fetch(downloadEndpoint, {
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    if (res.ok) {
      const arrayBuf = await res.arrayBuffer();
      const mime = res.headers.get("content-type") || "application/octet-stream";
      return { buffer: Buffer.from(arrayBuf), mimeType: mime };
    }
  }

  // Local private storage fallback (checks /tmp for Vercel serverless and local cwd)
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
