/**
 * Direct Team Member Order Confirmation Alert & Webhook Dispatcher
 * Sends instant notifications to the assigned Operations Lead (+91 70326 35858) and external webhooks.
 */

export interface DispatchNotificationOrderPayload {
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  campusDetail: string;
  pickupPoint?: string;
  hostelBlock?: string;
  items: { productName?: string; name?: string; quantity: number; price: number }[];
  total: number;
  paymentStatus: string;
  paymentMethod?: string;
  utrNumber?: string | null;
  createdAt?: string;
}

/**
 * Returns the configured team member phone number for receiving order alerts
 */
export function getOpsTeamPhone(): string {
  const envPhone = process.env.OPS_ALERT_PHONE || process.env.NEXT_PUBLIC_TECHBOX_WHATSAPP || "917032635858";
  const clean = envPhone.replace(/[^0-9]/g, "");
  return clean.length === 10 ? `91${clean}` : clean;
}

/**
 * Formats a high-priority dispatch alert for the team member / warehouse operator
 */
export function formatTeamMemberOrderAlert(order: DispatchNotificationOrderPayload): string {
  const itemsList = order.items
    .map((item) => `• ${item.productName || item.name || "Component"} (Qty: ${item.quantity})`)
    .join("\n");

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "Just Now";

  return `🚨 *NEW PARTSLY ORDER CONFIRMED!*
──────────────────────
*Order #:* ${order.orderNumber}
*Time:* ${formattedDate}

👤 *STUDENT RECIPIENT:*
*Name:* ${order.recipientName}
*Phone:* ${order.recipientPhone}
*Campus/Hub:* ${order.campusDetail}
${order.pickupPoint ? `*Pickup Point:* ${order.pickupPoint}\n` : ""}${order.hostelBlock ? `*Hostel/Room:* ${order.hostelBlock}\n` : ""}
🛒 *COMPONENTS TO PACK:*
${itemsList}

💰 *TOTAL PAYABLE:* *₹${order.total}*
💳 *Payment:* ${order.paymentStatus}${order.utrNumber ? ` (UTR: ${order.utrNumber})` : ""}

⚡ *OPEN DISPATCH BOARD:*
https://partsly.in/admin/orders`;
}

/**
 * Generates direct WhatsApp URL to send alert to the Team Member
 */
export function generateTeamMemberWhatsAppUrl(order: DispatchNotificationOrderPayload): string {
  const teamPhone = getOpsTeamPhone();
  const alertText = formatTeamMemberOrderAlert(order);
  return `https://wa.me/${teamPhone}?text=${encodeURIComponent(alertText)}`;
}

/**
 * Asynchronous background webhook dispatcher (Telegram, Discord, SMS Gateway, or WhatsApp API)
 */
export async function dispatchOrderWebhookNotification(order: DispatchNotificationOrderPayload) {
  const webhookUrl = process.env.ORDER_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const payload = {
      event: "ORDER_CONFIRMED",
      timestamp: new Date().toISOString(),
      orderNumber: order.orderNumber,
      recipientName: order.recipientName,
      recipientPhone: order.recipientPhone,
      campusDetail: order.campusDetail,
      total: order.total,
      paymentStatus: order.paymentStatus,
      utrNumber: order.utrNumber || null,
      items: order.items,
      message: formatTeamMemberOrderAlert(order),
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Failed to dispatch order webhook notification:", err);
  }
}
