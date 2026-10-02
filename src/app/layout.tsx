import React from "react";
import "./globals.css";

export const metadata = {
  title: "Partsly - Scheduled Maintenance",
  description: "Partsly hardware platform undergoing database and operations optimization.",
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
