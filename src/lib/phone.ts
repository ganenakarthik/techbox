/**
 * Indian Mobile Phone Number Validator & Normalizer
 * Enforces standard 10-digit Indian numbers starting with 6, 7, 8, or 9.
 * Standardizes to canonical format: +91XXXXXXXXXX
 */

export interface PhoneValidationResult {
  isValid: boolean;
  normalized: string; // e.g. +919876543210
  national: string;   // e.g. 9876543210
  formatted: string;  // e.g. +91 98765 43210
  error?: string;
}

export function validateAndNormalizeIndianPhone(input: string): PhoneValidationResult {
  if (!input || typeof input !== "string") {
    return { isValid: false, normalized: "", national: "", formatted: "", error: "Mobile number is required" };
  }

  // Strip all whitespace, dashes, parens, and leading dots
  let digits = input.replace(/[\s\-\(\)\.]/g, "");

  // If starts with +, strip +
  if (digits.startsWith("+")) {
    digits = digits.substring(1);
  }

  // If starts with 91 and has 12 digits, strip country code
  if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.substring(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    // If starts with trunk prefix 0 and has 11 digits, strip 0
    digits = digits.substring(1);
  }

  // Must be exactly 10 digits
  if (!/^\d{10}$/.test(digits)) {
    return {
      isValid: false,
      normalized: "",
      national: "",
      formatted: "",
      error: "Please enter a valid 10-digit Indian mobile number",
    };
  }

  // Indian mobile numbers must start with 6, 7, 8, or 9
  if (!/^[6-9]/.test(digits)) {
    return {
      isValid: false,
      normalized: "",
      national: "",
      formatted: "",
      error: "Indian mobile numbers must start with 6, 7, 8, or 9",
    };
  }

  const normalized = `+91${digits}`;
  const formatted = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;

  return {
    isValid: true,
    normalized,
    national: digits,
    formatted,
  };
}
