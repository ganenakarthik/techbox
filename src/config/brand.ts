/**
 * Centralized Brand Configuration for Partsly
 * Single Source of Truth for brand name, tags, doctrines, contact details, and session keys.
 */
export const BRAND = {
  name: "partsly",
  displayName: "Partsly",
  formalName: "Partsly Technologies Inc.",
  shortName: "partsly",
  tagline: "Everything for your project.",
  doctrine: "BUILD • CONNECT • DELIVER",
  description: "The student hardware & project infrastructure platform for engineering campuses across India — from certified electronic components to custom PCB manufacturing, 3D printing, and rapid campus dropzone delivery.",
  domain: "partsly.in",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://partsly.in",

  // Contacts
  supportEmail: "orders@partsly.in",
  supportPhone: "+91 70326 35858",
  whatsappNumber: process.env.NEXT_PUBLIC_TECHBOX_WHATSAPP || "917032635858",
  whatsappDisplay: "+91 70326 35858",

  // Logos & Visual Assets (Official Black & Orange on Transparent/White)
  logo: "/logo.png",
  logoDark: "/logo.png",
  logoIcon: "/logo-icon.png",
  logoIconDark: "/logo-icon.png",
  favicon: "/favicon.ico",

  // Storage & Session Keys
  sessionCookie: "partsly_session",
  legacySessionCookie: "techbox_session",
  bootSeenKey: "partsly_boot_seen",
  legacyBootSeenKey: "techbox_boot_seen",
  cartStorageKey: "partsly_cart",
  wishlistStorageKey: "partsly_wishlist",
  collegeStorageKey: "partsly_college",

  // Promotions
  defaultCoupon: "PARTSLY10",

  // Services & Infrastructure
  serviceId: "partsly-core",
  carrierName: "Partsly Campus Delivery",
  runnerBadge: "Partsly Campus Runner",
  labGradeBrand: "Partsly Lab Grade",
} as const;
