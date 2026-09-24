/**
 * Utility for generating high-resolution QR Code URLs for Partsly website and deep links
 */

export function generateWebsiteQrCodeUrl(url: string = "https://partsly.in", size: number = 500): string {
  const targetUrl = url || "https://partsly.in";
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(targetUrl)}&margin=15`;
}
