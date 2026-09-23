/**
 * Canonical Frontend Domain Models
 * PARTSLY Platform — Single Source of Truth
 */

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus =
  | "PAYMENT_PENDING"
  | "PAYMENT_SUBMITTED"
  | "PAYMENT_VERIFIED"
  | "PAYMENT_FAILED"
  | "REFUNDED";

export type UserRole = "CUSTOMER" | "ADMIN" | "STAFF";

export interface User {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: UserRole;
  college?: string;
  campus?: string;
  room?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  hasPassword?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  details: string;
  specs: Record<string, string>;
  pinoutUrl?: string;
  datasheetUrl?: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestseller: boolean;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count?: number;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface InventorySummary {
  productId: string;
  variantId: string;
  sku: string;
  available: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

export interface CartItem {
  id: string;
  productId?: string;
  variantId?: string;
  projectKitId?: string;
  name: string;
  sku: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  stock?: number;
  isKit?: boolean;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  discountAmount: number;
  finalTotal: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product?: Product;
  addedAt: string;
}

export interface Address {
  name: string;
  phone: string;
  alternatePhone?: string;
  collegeName: string;
  department: string;
  pickupPoint: string;
  hostelBlock: string;
  cityState: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  shippingAddress: Address;
  utrNumber?: string | null;
  deliverySlot?: string;
  deliverySpeed?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Campus {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  pincode: string;
  pickupLocations: string[];
  deliverySlots: string[];
  deliveryAreas?: string[];
  campuses?: any[];
}

export interface ProjectKit {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  buildTime: string;
  price: number;
  mrp: number;
  description: string;
  circuitDiagramUrl?: string;
  sourceCodeUrl?: string;
  assemblyGuideUrl?: string;
  includes: string[];
  optionalAddons?: {
    name: string;
    price: number;
    description: string;
  }[];
  images: string[];
  rating: number;
  reviewsCount: number;
}

export interface ProjectFile {
  id: string;
  name: string;
  sizeBytes: number;
  type: string;
  uploadedAt: string;
}

export interface ProjectQuote {
  id: string;
  projectId?: string;
  status: "ESTIMATING" | "QUOTED" | "ACCEPTED" | "REJECTED";
  estimatedTotal: number;
  partsTotal: number;
  fabricationTotal: number;
  notes?: string;
  createdAt: string;
}

export type ServiceType =
  | "PCB_MANUFACTURING"
  | "3D_PRINTING"
  | "WORKING_PROTOTYPE"
  | "DOCUMENTATION";

export interface ServiceRequest {
  id: string;
  serviceType: ServiceType;
  customerName: string;
  customerPhone: string;
  college: string;
  specifications: Record<string, any>;
  status: "SUBMITTED" | "REVIEWING" | "QUOTED" | "IN_FABRICATION" | "COMPLETED";
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId?: string;
  subject: string;
  category: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  messages: {
    sender: string;
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
}

// Backward compatibility & convenience aliases
export type College = Campus;
export type Project = ProjectKit;
