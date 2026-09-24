/**
 * Utility functions for exporting data to CSV formatted files in the browser
 */

export function exportOrdersToCSV(orders: any[], filename = `partsly-orders-${Date.now()}.csv`) {
  if (!orders || orders.length === 0) return;

  const headers = [
    "Order Number",
    "Created At",
    "Recipient Name",
    "Phone",
    "Email",
    "College / Campus",
    "Shipping Address",
    "Items Count",
    "Items Summary",
    "Subtotal (INR)",
    "Tax (INR)",
    "Shipping (INR)",
    "Grand Total (INR)",
    "Payment Method",
    "Payment Status",
    "Order Status",
    "Runner Name",
    "Tracking Number",
  ];

  const rows = orders.map((o) => {
    const itemsSummary = (o.items || [])
      .map((item: any) => `${item.productName || item.title} (x${item.quantity || 1})`)
      .join(" | ");

    return [
      `"${o.orderNumber || ""}"`,
      `"${new Date(o.createdAt).toLocaleString("en-IN")}"`,
      `"${(o.recipientName || "").replace(/"/g, '""')}"`,
      `"${o.recipientPhone || ""}"`,
      `"${o.user?.email || ""}"`,
      `"${(o.collegeName || "").replace(/"/g, '""')}"`,
      `"${(o.shippingAddress || "").replace(/"/g, '""')}"`,
      o.items?.length || 0,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      o.subtotal || o.total || 0,
      o.tax || 0,
      o.shipping || 0,
      o.total || 0,
      `"${o.paymentMethod || "UPI"}"`,
      `"${o.paymentStatus || "PAID"}"`,
      `"${o.status || "PENDING"}"`,
      `"${o.runnerName || ""}"`,
      `"${o.shipment?.trackingNumber || ""}"`,
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  downloadCSV(csvContent, filename);
}

export function exportInventoryToCSV(items: any[], filename = `partsly-inventory-${Date.now()}.csv`) {
  if (!items || items.length === 0) return;

  const headers = [
    "SKU ID",
    "Product Name",
    "Category",
    "Brand",
    "Price (INR)",
    "Available Stock",
    "Stock Status",
    "Bin Location",
    "Last Restocked",
  ];

  const rows = items.map((item) => {
    return [
      `"${item.sku || item.id || ""}"`,
      `"${(item.name || "").replace(/"/g, '""')}"`,
      `"${(item.category || "").replace(/"/g, '""')}"`,
      `"${(item.brand || "").replace(/"/g, '""')}"`,
      item.price || 0,
      item.available || 0,
      `"${item.available <= 0 ? "OUT_OF_STOCK" : item.available < 10 ? "LOW_STOCK" : "IN_STOCK"}"`,
      `"${item.binLocation || "Warehouse Bay 1"}"`,
      `"${item.updatedAt ? new Date(item.updatedAt).toLocaleString("en-IN") : ""}"`,
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  downloadCSV(csvContent, filename);
}

function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
