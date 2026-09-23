/**
 * Frontend Validation Utilities
 * PARTSLY Platform
 */

/**
 * Normalizes and validates Indian phone numbers.
 * Strips +91, 0, spaces, dashes. Must yield exactly 10 digits starting with 6, 7, 8, or 9.
 */
export function validateIndianPhone(input: string): { isValid: boolean; normalized: string; error?: string } {
  const digits = input.replace(/\D/g, "");
  let normalized = digits;
  if (digits.length === 12 && digits.startsWith("91")) {
    normalized = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    normalized = digits.slice(1);
  }

  if (normalized.length !== 10) {
    return { isValid: false, normalized, error: "Please enter a valid 10-digit mobile number." };
  }

  if (!/^[6-9]/.test(normalized)) {
    return { isValid: false, normalized, error: "Mobile number must begin with 6, 7, 8, or 9." };
  }

  return { isValid: true, normalized };
}

/**
 * Validates bank UTR / reference numbers.
 * Accepts standard bank alphanumeric references (8 to 22 characters).
 */
export function validateUTR(utr: string): { isValid: boolean; error?: string } {
  const clean = utr.trim();
  if (!clean) {
    return { isValid: false, error: "Please enter the UTR or bank reference number from your payment receipt." };
  }
  if (!/^[a-zA-Z0-9]{8,22}$/.test(clean)) {
    return { isValid: false, error: "UTR must be between 8 and 22 alphanumeric characters." };
  }
  return { isValid: true };
}

export function validateClientFile(
  file: File,
  allowedExtensionsOrOptions?: string[] | { allowedExtensions?: string[]; maxSizeBytes?: number },
  maxSizeBytesArg?: number
): { isValid: boolean; error?: string } {
  let allowedExtensions: string[] = [".pdf", ".txt", ".csv", ".doc", ".docx", ".png", ".jpg", ".zip"];
  let maxSizeBytes = 15 * 1024 * 1024; // 15 MB

  if (Array.isArray(allowedExtensionsOrOptions)) {
    allowedExtensions = allowedExtensionsOrOptions;
    if (typeof maxSizeBytesArg === "number") {
      maxSizeBytes = maxSizeBytesArg;
    }
  } else if (allowedExtensionsOrOptions && typeof allowedExtensionsOrOptions === "object") {
    if (allowedExtensionsOrOptions.allowedExtensions) {
      allowedExtensions = allowedExtensionsOrOptions.allowedExtensions;
    }
    if (typeof allowedExtensionsOrOptions.maxSizeBytes === "number") {
      maxSizeBytes = allowedExtensionsOrOptions.maxSizeBytes;
    }
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !allowedExtensions.map((e) => e.replace(/^\./, "").toLowerCase()).includes(ext)) {
    return {
      isValid: false,
      error: `Invalid file type. Supported formats: ${allowedExtensions.join(", ")}`,
    };
  }
  if (file.size > maxSizeBytes) {
    const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      isValid: false,
      error: `File exceeds the ${maxMb}MB size limit.`,
    };
  }
  return { isValid: true };
}
