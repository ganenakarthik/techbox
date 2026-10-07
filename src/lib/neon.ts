import { neon } from "@neondatabase/serverless";
import { COMPONENTS_CATALOG, ComponentItem } from "@/data/componentsCatalog";
import { SOLE_ADMIN_EMAIL, hashPassword, securityLogsLedger, SecurityLog } from "@/lib/security";

// Database Connection String from Environment
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "";

export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

export interface DBUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  passwordHash: string;
  createdAt: string;
}

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
  status: "UTR_PENDING" | "VERIFIED" | "DISPATCHED" | "DELIVERED" | "REJECTED";
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

// Default Admin Password Pre-hashed (password: "admin123")
const ADMIN_INIT_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";

// In-Memory Ledger for Active Session Data
export const inMemoryUsers: DBUser[] = [
  {
    id: "USR-0001",
    name: "Ganen Karthik (Sole Admin)",
    email: SOLE_ADMIN_EMAIL,
    role: "admin",
    passwordHash: ADMIN_INIT_HASH,
    createdAt: new Date().toISOString(),
  },
  {
    id: "USR-0002",
    name: "Sample Customer",
    email: "customer@techbox.com",
    role: "customer",
    passwordHash: ADMIN_INIT_HASH,
    createdAt: new Date().toISOString(),
  }
];

export const inMemoryOrders: DBOrder[] = [
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

export const inMemoryRFQs: DBRFQ[] = [];

/**
 * Find User By Email
 */
export async function getUserByEmailFromDB(email: string): Promise<DBUser | null> {
  const targetEmail = email.trim().toLowerCase();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM users WHERE LOWER(email) = ${targetEmail} LIMIT 1`;
      if (rows && rows.length > 0) {
        const u = rows[0];
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          passwordHash: u.password_hash || u.passwordHash,
          createdAt: u.created_at || u.createdAt,
        };
      }
    } catch (err) {
      console.warn("Neon DB User query fallback:", err);
    }
  }

  const found = inMemoryUsers.find((u) => u.email.toLowerCase() === targetEmail);
  return found || null;
}

/**
 * Register User in DB
 */
export async function createUserInDB(user: Omit<DBUser, "id" | "createdAt">): Promise<DBUser> {
  const newUser: DBUser = {
    ...user,
    id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };

  if (sql) {
    try {
      await sql`
        INSERT INTO users (id, name, email, role, password_hash, created_at)
        VALUES (${newUser.id}, ${newUser.name}, ${newUser.email}, ${newUser.role}, ${newUser.passwordHash}, ${newUser.createdAt})
      `;
    } catch (err) {
      console.warn("Neon DB User insert fallback:", err);
    }
  }

  inMemoryUsers.unshift(newUser);
  return newUser;
}

/**
 * Query products from DB or fallback catalog
 */
export async function getProductsFromDB(category?: string, query?: string): Promise<ComponentItem[]> {
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM products ORDER BY rating DESC`;
      if (rows && rows.length > 0) {
        return rows as unknown as ComponentItem[];
      }
    } catch (err) {
      console.warn("Neon DB Query fallback to static catalog:", err);
    }
  }

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

/**
 * Order creation
 */
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

/**
 * Fetch orders for admin or user
 */
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

/**
 * Update Order Status (Admin only)
 */
export async function updateOrderStatusInDB(orderId: string, status: DBOrder["status"]): Promise<boolean> {
  if (sql) {
    try {
      await sql`UPDATE orders SET status = ${status} WHERE id = ${orderId}`;
    } catch (err) {
      console.warn("Neon DB Order update fallback:", err);
    }
  }

  const order = inMemoryOrders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    return true;
  }
  return false;
}

/**
 * Submit BOM RFQ
 */
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
