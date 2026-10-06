"use client";

import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  Zap,
  MessageSquare,
  Instagram,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Layers,
  Cpu,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronDown,
  Wrench,
  Plus,
  Minus,
} from "lucide-react";
import { MAINTENANCE_CONFIG } from "@/config/maintenance";
import { MaintenanceView } from "@/components/maintenance/MaintenanceView";
import { PartslyLogo } from "@/components/ui/Logo";

const FEATURED_PRODUCTS = [
  {
    id: "esp32-v1",
    name: "ESP32 DevKit V1 30-Pin NodeMCU WiFi + Bluetooth",
    category: "Microcontrollers",
    price: 389,
    originalPrice: 489,
    badge: "Bestseller",
    stock: "In Stock (Campus Lab)",
  },
  {
    id: "arduino-uno",
    name: "Arduino UNO R3 Compatible Development Board",
    category: "Microcontrollers",
    price: 449,
    originalPrice: 529,
    badge: "100% Tested",
    stock: "In Stock",
  },
  {
    id: "mpu6050",
    name: "MPU6050 6-DOF Gyroscope & Accelerometer Sensor",
    category: "Sensors",
    price: 149,
    originalPrice: 199,
    badge: "Popular",
    stock: "In Stock",
  },
  {
    id: "hcsr04",
    name: "HC-SR04 Ultrasonic Distance Sensor Module",
    category: "Sensors",
    price: 79,
    originalPrice: 119,
    badge: "30% OFF",
    stock: "In Stock",
  },
  {
    id: "l298n",
    name: "L298N Dual H-Bridge Motor Driver Module",
    category: "Power & Drivers",
    price: 189,
    originalPrice: 229,
    badge: "Robotics Essential",
    stock: "In Stock",
  },
  {
    id: "sg90",
    name: "SG90 9g Micro Servo Motor (180 Degree)",
    category: "Actuators",
    price: 119,
    originalPrice: 149,
    badge: "High Torque",
    stock: "In Stock",
  },
];

export default function Page() {
  if (MAINTENANCE_CONFIG.enabled) {
    return <MaintenanceView />;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({
    "esp32-v1": 2,
    "arduino-uno": 1,
  });
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const totalCartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);
  const totalCartPrice = Object.entries(cartItems).reduce((sum, [id, qty]) => {
    const p = FEATURED_PRODUCTS.find((item) => item.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const addToCart = (id: string, name: string) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setAddedToast(`Added ${name} to cart!`);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-zinc-900 font-sans selection:bg-[#ff6a00] selection:text-white flex flex-col justify-between">
      {/* Top Announcement Bar */}
      <div className="bg-[#09090b] text-white text-xs py-2 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-zinc-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Campus Express Dispatch: <strong>10–30 Min Gate Delivery</strong></span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#ff6a00] font-bold">⚡ Up to 45% Off on Selected Components</span>
            <a
              href={MAINTENANCE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-white font-mono flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Helpdesk: {MAINTENANCE_CONFIG.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200/90 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <PartslyLogo isLight={true} />

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 10,000+ electronic parts, Arduino, sensors, ICs..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-full pl-11 pr-24 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00] focus:bg-white transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#ff6a00] hover:bg-orange-600 text-white rounded-full text-xs font-bold transition-colors">
              Search
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="bg-white text-[#ff6a00] px-2 py-0.5 rounded-full font-black text-xs">
                  {totalCartCount}
                </span>
              </button>
            </div>

            {/* Admin Console Shortcut */}
            <a
              href="/admin"
              className="px-3.5 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-700 text-xs font-mono font-bold transition-colors"
            >
              Ops Console →
            </a>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 10,000+ parts, Arduino..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-full pl-10 pr-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#09090b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#ff6a00] text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#ff6a00]" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 space-y-12 py-8">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#ff6a00]/20 p-8 sm:p-14 text-white overflow-hidden shadow-2xl border border-zinc-800">
            {/* Glow Blobs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff6a00]/25 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6a00]/20 border border-[#ff6a00]/40 text-[#ff6a00] text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FUTURE-READY ROBOTICS & IOT KITS</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                ENGINEER THE <span className="text-[#ff6a00]">FUTURE</span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                High-quality microcontrollers, sensors, turn-key project kits, custom PCB fabrication, and 3D printing. Built for engineering students and creators with rapid delivery.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#products"
                  className="px-6 py-3.5 rounded-full bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/25 transition-all inline-flex items-center gap-2"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={MAINTENANCE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-bold text-xs sm:text-sm transition-all inline-flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Custom Project Quote</span>
                </a>
              </div>

              {/* Guarantees Badges */}
              <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff6a00]" />
                  <span>100% Genuine Lab-Tested</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Same-Day Campus Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Zero-DOA Replacement</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services We Provide Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6a00] uppercase">
                  ENGINEERING SERVICES
                </h2>
                <p className="text-2xl font-black text-zinc-950">What We Build & Deliver</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MAINTENANCE_CONFIG.services.map((service, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-gradient-to-b from-white to-orange-50/20 border border-zinc-200 hover:border-[#ff6a00]/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all space-y-3 group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#ff6a00]/10 text-[#ff6a00] flex items-center justify-center font-bold border border-[#ff6a00]/20">
                      {idx === 0 && <DollarSign className="w-5 h-5" />}
                      {idx === 1 && <Layers className="w-5 h-5" />}
                      {idx === 2 && <Search className="w-5 h-5" />}
                      {idx === 3 && <Cpu className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/25">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-zinc-950 text-base group-hover:text-[#ff6a00] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Component Storefront */}
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-4">
              <div>
                <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6a00] uppercase">
                  STOREFRONT CATALOG
                </h2>
                <p className="text-2xl font-black text-zinc-950">Deals of the Day in Electronics</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  ● LIVE CAMPUS STOCK
                </span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-[#ff6a00] hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                        {product.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff6a00]">
                        {product.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-zinc-950 text-base leading-snug group-hover:text-[#ff6a00] transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-zinc-100">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-zinc-950">₹{product.price}</span>
                        <span className="text-xs text-zinc-400 line-through">₹{product.originalPrice}</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-600 font-bold">{product.stock}</span>
                    </div>

                    <button
                      onClick={() => addToCart(product.id, product.name)}
                      className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-[#ff6a00] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Project Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WhatsApp Support & Order Desk Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-200/60 text-emerald-900 text-xs font-mono font-bold">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>DIRECT WHATSAPP DESK</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-zinc-950">Need Custom Parts or Urgent Project Assistance?</h3>
              <p className="text-xs sm:text-sm text-zinc-700">Chat directly with our hardware engineering runners on WhatsApp.</p>
            </div>

            <a
              href={MAINTENANCE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp ({MAINTENANCE_CONFIG.whatsappDisplay})</span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#09090b] text-white pt-12 pb-8 border-t border-zinc-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
            <PartslyLogo isLight={false} />

            <div className="flex items-center gap-4 text-xs font-mono">
              <a href={MAINTENANCE_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                WhatsApp
              </a>
              <a href={MAINTENANCE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="/admin" className="text-zinc-400 hover:text-white transition-colors">
                Staff Operations Console
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
            <div>© 2026 Partsly Inc. All rights reserved. • Express Hardware Dispatch</div>
            <div>High-Speed Hardware Engineering & Sourcing Platform</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
