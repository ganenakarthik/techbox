import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: `${BRAND.displayName} — ${BRAND.tagline} | College & Engineering Platform`,
  description:
    `${BRAND.displayName} is the student project infrastructure platform. Buy electronic components, upload project documents, auto-detect BOM requirements, order custom PCBs, 3D enclosures, and working prototypes with rapid campus dropzone delivery.`,
  keywords: [
    "Partsly",
    "partsly",
    "electronics components",
    "engineering college projects",
    "ESP32",
    "Arduino",
    "Sensors",
    "PCB manufacturing",
    "3D printing",
    "campus delivery",
    "student project kits",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: `${BRAND.displayName} — ${BRAND.tagline}`,
    description: "Components, project kits, prototypes and documentation — delivered directly to your campus dropzone.",
    url: BRAND.appUrl,
    siteName: BRAND.displayName,
    type: "website",
  },
};

import { MobileStickyCartBar } from "@/components/layout/MobileStickyCartBar";
import { PartslyAiAssistant } from "@/components/ui/PartslyAiAssistant";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
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
