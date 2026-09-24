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
  // Always default target to Partsly Official Operations Helpline (+91 70326 35858)
  const defaultOpsPhone = process.env.NEXT_PUBLIC_TECHBOX_WHATSAPP || "917032635858";
  const rawPhone = targetPhone || defaultOpsPhone;
  const phone = rawPhone.replace(/[^0-9]/g, "");
  const formattedPhone = phone.length === 10 ? `91${phone}` : phone;
  const messageText = formatWhatsAppReceiptText(order);

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;
}

export const generateWhatsAppOrderUrl = generateWhatsAppReceiptUrl;

/**
 * Format Status Dispatch Updates for WhatsApp Customer Alerts
 */
export function formatWhatsAppStatusAlert(
  orderNumber: string,
  status: string,
  recipientName: string,
  runnerName?: string | null,
  runnerPhone?: string | null,
  trackingCode?: string | null
): string {
  const statusUpper = status.toUpperCase();

  let statusEmoji = "⚡";
  let statusHeadline = `Order #${orderNumber} Update`;

  if (statusUpper === "CONFIRMED") {
    statusEmoji = "✅";
    statusHeadline = `Order #${orderNumber} Payment Verified & Confirmed!`;
  } else if (statusUpper === "PACKED") {
    statusEmoji = "📦";
    statusHeadline = `Order #${orderNumber} Sealed in ESD Anti-Static Parcel!`;
  } else if (statusUpper === "SHIPPED" || statusUpper === "OUT_FOR_DELIVERY") {
    statusEmoji = "🏃‍♂️";
    statusHeadline = `Order #${orderNumber} Out for Live Campus Delivery!`;
  } else if (statusUpper === "DELIVERED") {
    statusEmoji = "🎉";
    statusHeadline = `Order #${orderNumber} Delivered Successfully!`;
  }

  return `${statusEmoji} *PARTSLY CAMPUS DISPATCH UPDATE*
──────────────────────
Hi *${recipientName}*,

${statusHeadline}

*Status:* ${statusUpper.replace(/_/g, " ")}
${runnerName ? `*Runner:* ${runnerName}${runnerPhone ? ` (${runnerPhone})` : ""}\n` : ""}${trackingCode ? `*Tracking ID:* ${trackingCode}\n` : ""}
📍 *Track Live:* https://partsly.in/orders/${orderNumber}

_Partsly Campus Express Delivery — 10-30 Minute Hostel & Lab Dropoff_`;
}

export function generateWhatsAppStatusUrl(
  customerPhone: string,
  orderNumber: string,
  status: string,
  recipientName: string,
  runnerName?: string | null,
  runnerPhone?: string | null,
  trackingCode?: string | null
): string {
  const phone = customerPhone.replace(/[^0-9]/g, "");
  const formattedPhone = phone.length === 10 ? `91${phone}` : phone;
  const text = formatWhatsAppStatusAlert(
    orderNumber,
    status,
    recipientName,
    runnerName,
    runnerPhone,
    trackingCode
  );

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
}


