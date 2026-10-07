import { neon } from "@neondatabase/serverless";
import { COMPONENTS_CATALOG, ComponentItem } from "@/data/componentsCatalog";

// Database Connection String from Environment
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "";

export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

export interface DBOrder {
  id: string;
  customerName: string;
  email: string;
  address: string;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  grandTotal: number;
  utrNumber: string;
  status: "UTR_PENDING" | "VERIFIED" | "DISPATCHED" | "DELIVERED";
  createdAt: string;
}

export interface DBRFQ {
  id: string;
  bomItems: Array<{ partNumber: string; description: string; quantity: number; targetPrice: number }>;
  totalTargetPrice: number;
  contactEmail: string;
  status: "SUBMITTED" | "IN_REVIEW" | "QUOTED";
  createdAt: string;
}

// In-Memory Fallback Ledger for active session persistence
const inMemoryOrders: DBOrder[] = [
  {
    id: "ORD-98241",
    customerName: "Karthik Engineer",
    email: "engineer@partsly.com",
    address: "Lab 4B, Electronic City, Bangalore - 560100",
    items: [
      { id: "esp32-wroom-32d", name: "ESP32-WROOM-32D Wi-Fi + BT Module", price: 249, quantity: 2 },
      { id: "nema17-stepper-motor", name: "NEMA 17 Stepper Motor", price: 649, quantity: 1 }
    ],
    subtotal: 1147,
    gstAmount: 206,
    shippingFee: 0,
    grandTotal: 1353,
    utrNumber: "384792019482",
    status: "DISPATCHED",
    createdAt: new Date().toISOString(),
  }
];

const inMemoryRFQs: DBRFQ[] = [];

/**
 * Full-Stack Neon Database Query Helpers
 */
export async function getProductsFromDB(category?: string, query?: string): Promise<ComponentItem[]> {
  if (sql) {
    try {
      // Execute Neon serverless query when DATABASE_URL is configured
      const rows = await sql`SELECT * FROM products ORDER BY rating DESC`;
      if (rows && rows.length > 0) {
        return rows as unknown as ComponentItem[];
      }
    } catch (err) {
      console.warn("Neon DB Query fallback to static catalog:", err);
    }
  }

  // Fallback catalog query filtering
  let items = COMPONENTS_CATALOG;
  if (category && category !== "All Categories") {
    items = items.filter((p) => p.category === category);
  }
  if (query) {
    const q = query.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.manufacturer.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }
  return items;
}

export async function createOrderInDB(orderData: Omit<DBOrder, "id" | "status" | "createdAt">): Promise<DBOrder> {
  const newOrder: DBOrder = {
    ...orderData,
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    status: orderData.utrNumber.length >= 10 ? "VERIFIED" : "UTR_PENDING",
    createdAt: new Date().toISOString(),
  };

  if (sql) {
    try {
      await sql`
        INSERT INTO orders (id, customer_name, email, items, grand_total, utr_number, status, created_at)
        VALUES (${newOrder.id}, ${newOrder.customerName}, ${newOrder.email}, ${JSON.stringify(newOrder.items)}, ${newOrder.grandTotal}, ${newOrder.utrNumber}, ${newOrder.status}, ${newOrder.createdAt})
      `;
    } catch (err) {
      console.warn("Neon DB Order insert fallback:", err);
    }
  }

  inMemoryOrders.unshift(newOrder);
  return newOrder;
}

export async function getOrdersFromDB(): Promise<DBOrder[]> {
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
      if (rows && rows.length > 0) return rows as unknown as DBOrder[];
    } catch (err) {
      console.warn("Neon DB Orders fetch fallback:", err);
    }
  }
  return inMemoryOrders;
}

export async function submitBOMRFQToDB(rfqData: Omit<DBRFQ, "id" | "status" | "createdAt">): Promise<DBRFQ> {
  const newRFQ: DBRFQ = {
    ...rfqData,
    id: `RFQ-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "SUBMITTED",
    createdAt: new Date().toISOString(),
  };

  if (sql) {
    try {
      await sql`
        INSERT INTO rfqs (id, bom_items, total_target_price, contact_email, status, created_at)
        VALUES (${newRFQ.id}, ${JSON.stringify(newRFQ.bomItems)}, ${newRFQ.totalTargetPrice}, ${newRFQ.contactEmail}, ${newRFQ.status}, ${newRFQ.createdAt})
      `;
    } catch (err) {
      console.warn("Neon DB RFQ insert fallback:", err);
    }
  }

  inMemoryRFQs.unshift(newRFQ);
  return newRFQ;
}
