import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FloatingCartBar } from "@/components/cart/FloatingCartBar";
import { SearchOverlay } from "@/components/ui/SearchOverlay";
import { AuthModal } from "@/components/ui/AuthModal";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { BRAND } from "@/config/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.appUrl || "https://partsly.in"),
  title: {
    default: `${BRAND.displayName} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.displayName}`,
  },
  description:
    "Partsly (partsly.in) is India's leading campus hardware platform. 10-30 minute delivery for Arduino, ESP32, sensors, custom PCBs, 3D printing & engineering project kits directly to college hostels & lab dropzones.",
  keywords: [
    "Partsly",
    "partsly.in",
    "partsly",
    "partsly store",
    "partsly electronics",
    "partsly campus delivery",
    "techbox",
    "electronics components India",
    "engineering college projects",
    "ESP32 Wi-Fi module",
    "Arduino Uno R3",
    "Sensors Hyderabad",
    "PCB manufacturing India",
    "3D printing STL",
    "quick commerce hardware",
    "student project kits",
  ],
  authors: [{ name: "Partsly Infrastructure Team", url: "https://partsly.in" }],
  creator: "Partsly",
  publisher: "Partsly",
  alternates: {
    canonical: "https://partsly.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: `${BRAND.displayName} — ${BRAND.tagline}`,
    description: "10-30 minute campus delivery for electronic components, sensors, custom PCBs, 3D printing & engineering project kits.",
    url: "https://partsly.in",
    siteName: BRAND.displayName,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.displayName} — ${BRAND.tagline}`,
    description: "Everything for your engineering project. Delivered to your campus hostel in minutes.",
  },
};

import { MobileStickyCartBar } from "@/components/layout/MobileStickyCartBar";
import { PartslyAiAssistant } from "@/components/ui/PartslyAiAssistant";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Partsly",
  alternateName: ["partsly.in", "Partsly India", "Techbox"],
  url: "https://partsly.in",
  logo: "https://partsly.in/favicon.ico",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-7032635858",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Telugu", "Hindi"],
  },
  sameAs: ["https://instagram.com/partsly.in", "https://partsly.in"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Partsly",
  alternateName: "partsly.in",
  url: "https://partsly.in",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://partsly.in/shop?q={search_term_string}",
    queryInput: "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingCartBar />
          <MobileStickyCartBar />
          <SearchOverlay />
          <AuthModal />
          <PartslyAiAssistant />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
