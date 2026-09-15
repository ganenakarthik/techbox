import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "@/components/ui/SearchOverlay";
import { AuthModal } from "@/components/ui/AuthModal";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { TechBoxBootSequence } from "@/components/boot/TechBoxBootSequence";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechBox — Everything for your project | College & Engineering Platform",
  description:
    "TechBox is the student project infrastructure platform. Buy electronic components, upload project documents, auto-detect BOM requirements, order custom PCBs, 3D enclosures, and prototypes with direct campus delivery.",
  keywords: [
    "TechBox",
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
  openGraph: {
    title: "TechBox — Everything for your project",
    description: "Components, project kits, prototypes and documentation — delivered to your campus.",
    url: "https://techbox.in",
    siteName: "TechBox",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#080808] text-white">
        <AppProvider>
          <TechBoxBootSequence />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <AuthModal />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
