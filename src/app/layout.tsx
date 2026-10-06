import React from "react";
import "./globals.css";

export const metadata = {
  title: "Partsly - High-Speed Hardware Engineering & Component Sourcing Platform",
  description: "Order microcontrollers, sensors, turn-key project kits, custom PCB fabrication, and 3D print enclosures with 10-30 min express campus delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#09090b] text-white font-sans antialiased selection:bg-[#ff6a00] selection:text-white">
        {children}
      </body>
    </html>
  );
}
