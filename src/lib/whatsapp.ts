/**
 * Formats order information into a WhatsApp dispatch URL
 */
export function generateWhatsAppOrderUrl(order: {
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  campusDetail?: string | null;
  items: Array<{
    productName: string;
    quantity: number;
    price?: number;
    unitPrice?: number;
    total?: number;
  }>;
  total: number;
  paymentStatus: string;
  utrNumber?: string | null;
}): string {
  const whatsappNumber = process.env.NEXT_PUBLIC_TECHBOX_WHATSAPP || "917032635858";
  
  const itemsText = order.items
    .map((item) => {
      const p = item.price ?? item.unitPrice ?? 0;
      return `• ${item.quantity}x ${item.productName} (₹${p})`;
    })
    .join("\n");

  const lines = [
    `⚡ *TECHBOX ORDER SUBMISSION*`,
    `--------------------------------`,
    `*Order Number:* ${order.orderNumber}`,
    `*Customer:* ${order.recipientName} (${order.recipientPhone})`,
    order.campusDetail ? `*Campus / Pickup:* ${order.campusDetail}` : "",
    ``,
    `*ITEMS ORDERED:*`,
    itemsText,
    ``,
    `*Total Amount:* ₹${order.total}`,
    `*Payment Status:* ${order.paymentStatus}`,
    order.utrNumber ? `*Bank UTR / Ref:* ${order.utrNumber}` : `*Bank UTR:* Awaiting verification`,
    `--------------------------------`,
    `Hello TechBox team, I have placed an order and would like to confirm my payment & campus delivery status.`,
  ].filter((line) => line !== undefined && line !== null);

  const message = lines.join("\n");
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
