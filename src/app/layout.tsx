import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawerGlobal } from "@/components/layout/CartDrawerGlobal";

export const metadata: Metadata = {
  metadataBase: new URL("https://partsly.in"),
  title: "Partsly | Hardware Procurement & On-Demand Manufacturing Desk",
  description: "India's engineering hardware distributor. Factory-direct microcontrollers, ICs, sensors, custom 2/4-layer PCB fabrication, 3D printing STL quotes, and bulk BOM sourcing.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
      { url: "/pa-logo.png", type: "image/png" }
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ThemeProvider>
          <CartProvider>
            <div className="app-shell min-h-screen flex flex-col justify-between">
              <div>
                <Navbar />
                <main>{children}</main>
              </div>

              {/* Global Footer */}
              <footer className="footer border-t border-[var(--line)] mt-16 pt-8 pb-6 text-xs text-[var(--muted)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="brand-mark" aria-hidden="true"><span /></span>
                    <span className="font-bold text-[var(--text)]">PARTSLY HARDWARE DISTRIBUTOR</span>
                  </div>
                  <div>© 2026 Partsly TechBox Inc. All rights reserved. • ISO 9001 Certified Quality</div>
                </div>
              </footer>

              {/* Persistent Cart & Checkout Drawer */}
              <CartDrawerGlobal />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
