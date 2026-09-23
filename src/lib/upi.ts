/**
 * Dynamic UPI QR Code & Intent Link Generator for Partsly Zero-KYC Payments
 */

export interface UpiPaymentDetails {
  upiId?: string;
  payeeName?: string;
  amount: number | string;
  transactionNote: string;
}

export function generateUpiDeepLink(details: UpiPaymentDetails): string {
  const upiId = details.upiId || process.env.NEXT_PUBLIC_TECHBOX_UPI_ID || "7032635858@ybl";
  const payeeName = details.payeeName || process.env.NEXT_PUBLIC_TECHBOX_UPI_NAME || "PINNAM CHARLA CHARLA";
  const amount = Number(details.amount).toFixed(2);
  const note = encodeURIComponent(details.transactionNote || "Partsly Order Payment");

  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&tn=${note}&cu=INR`;
}

/**
 * Returns a high-resolution QR code image URL using QRServer API for dynamic instant scanning
 */
export function generateUpiQrCodeUrl(details: UpiPaymentDetails): string {
  const upiUrl = generateUpiDeepLink(details);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}&margin=10`;
}
