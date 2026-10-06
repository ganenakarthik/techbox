import React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://partsly.in"),
  title: "Partsly - High-Speed Hardware Engineering & Component Sourcing Platform",
  description: "Order microcontrollers, sensors, turn-key project kits, custom PCB fabrication, and 3D print enclosures with 10-30 min express campus delivery.",
  keywords: ["partsly", "hardware engineering", "electronics components", "microcontrollers", "sensors", "custom PCB", "3D printing India"],
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
  openGraph: {
    title: "Partsly - High-Speed Hardware Engineering & Component Sourcing Platform",
    description: "Order microcontrollers, sensors, turn-key project kits, custom PCB fabrication, and 3D print enclosures with 10-30 min express campus delivery.",
    url: "https://partsly.in",
    siteName: "Partsly",
    images: [
      {
        url: "/pa-logo.png",
        width: 800,
        height: 800,
        alt: "Partsly Emblem Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Partsly - High-Speed Hardware Engineering & Component Sourcing Platform",
    description: "Order microcontrollers, sensors, turn-key project kits, custom PCB fabrication, and 3D print enclosures with 10-30 min express campus delivery.",
    images: ["/pa-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Partsly",
    "url": "https://partsly.in",
    "logo": "https://partsly.in/pa-logo.png",
    "image": "https://partsly.in/pa-logo.png",
    "description": "High-Speed Hardware Engineering & Component Sourcing Platform"
  };

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Partsly",
    "url": "https://partsly.in"
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="bg-[#09090b] text-white font-sans antialiased selection:bg-[#ff6a00] selection:text-white">
        {children}
      </body>
    </html>
  );
}
