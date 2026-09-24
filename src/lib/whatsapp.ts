/**
 * Automated Itemized WhatsApp Order Receipt & Dispatch Alert Link Generator
 */

export interface OrderItemReceiptPayload {
  name?: string;
  productName?: string;
  quantity: number;
  price: number;
  variant?: string;
}

export interface OrderReceiptPayload {
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  campusDetail: string;
  items: OrderItemReceiptPayload[];
  subtotal?: number;
  shipping?: number;
  total: number;
  paymentStatus: string;
  utrNumber?: string | null;
  createdAt?: string;
}

/**
 * Formats an itemized WhatsApp receipt text message
 */
export function formatWhatsAppReceiptText(order: OrderReceiptPayload): string {
  const itemsText = order.items
    .map(
      (item) =>
        `• *${item.name || item.productName || "Component"}*${item.variant ? ` (${item.variant})` : ""}\n  Qty: ${item.quantity} × ₹${item.price} = *₹${item.quantity * item.price}*`
    )
    .join("\n");

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Today";

  return `📦 *PARTSLY OFFICIAL ORDER RECEIPT*
──────────────────────
*Order #:* ${order.orderNumber}
*Date:* ${formattedDate}

👤 *CUSTOMER DETAILS:*
Name: ${order.recipientName}
Phone: ${order.recipientPhone}
Delivery Hub: ${order.campusDetail}

🛒 *ORDERED COMPONENTS:*
${itemsText}

──────────────────────
Subtotal: ₹${order.subtotal}
Shipping (Campus Runner): ₹${order.shipping}
💰 *TOTAL PAID:* *₹${order.total}*
💳 *Payment Status:* ${order.paymentStatus}${order.utrNumber ? ` (UTR: ${order.utrNumber})` : ""}

🚚 *Track Order Live:*
https://partsly.in/account/orders

_Thank you for ordering with Partsly! Your campus lab runner is preparing your gear._`;
}

/**
 * Generates a direct wa.me link to send the receipt to customer's WhatsApp or Partsly support
 */
export function generateWhatsAppReceiptUrl(order: OrderReceiptPayload, targetPhone?: string): string {
  const phone = (targetPhone || order.recipientPhone || process.env.NEXT_PUBLIC_TECHBOX_WHATSAPP || "917032635858").replace(/[^0-9]/g, "");
  const formattedPhone = phone.length === 10 ? `91${phone}` : phone;
  const messageText = formatWhatsAppReceiptText(order);

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;
}

export const generateWhatsAppOrderUrl = generateWhatsAppReceiptUrl;

