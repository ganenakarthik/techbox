"use client";

import React, { useState, useMemo } from "react";
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
  X,
  Filter,
  Star,
  Check,
  Lock,
} from "lucide-react";
import { MAINTENANCE_CONFIG } from "@/config/maintenance";
import { MaintenanceView } from "@/components/maintenance/MaintenanceView";
import { PartslyLogo } from "@/components/ui/Logo";
import { COMPONENTS_CATALOG, ComponentItem } from "@/data/componentsCatalog";

const CATEGORIES = [
  "All",
  "Microcontrollers",
  "Sensors",
  "Motors & Actuators",
  "Power & Batteries",
  "Passives & ICs",
  "PCB & Custom Services",
] as const;

export default function Page() {
  if (MAINTENANCE_CONFIG.enabled) {
    return <MaintenanceView />;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({
    "esp32-devkit-v1": 2,
    "arduino-uno-r3": 1,
    "mpu6050-sensor": 1,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Client Order Details Form
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Filter Catalog Items
  const filteredProducts = useMemo(() => {
    return COMPONENTS_CATALOG.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const totalCartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);
  const totalCartPrice = Object.entries(cartItems).reduce((sum, [id, qty]) => {
    const p = COMPONENTS_CATALOG.find((item) => item.id === id);
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

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    setOrderConfirmed(true);
    setTimeout(() => {
      const text = `Hi Partsly Team! I placed an order on partsly.in.\nName: ${clientName}\nPhone: ${clientPhone}\nTotal: ₹${totalCartPrice}\nItems: ${Object.entries(
        cartItems
      )
        .map(([id, qty]) => {
          const item = COMPONENTS_CATALOG.find((c) => c.id === id);
          return `${item?.name || id} (x${qty})`;
        })
        .join(", ")}\nNote: ${deliveryNote}`;
      const url = `https://wa.me/917032635858?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-zinc-900 font-sans selection:bg-[#ff6a00] selection:text-white flex flex-col justify-between">
      {/* Top Announcement Bar */}
      <div className="bg-[#09090b] text-white text-xs py-2 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-zinc-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Express Gate Dispatch: <strong>10–30 Min Direct Runner Delivery</strong></span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#ff6a00] font-bold">⚡ Up to 45% Off on 100+ Hardware Parts</span>
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
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/90 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <PartslyLogo isLight={true} />

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100+ electronic parts, Arduino, ESP32, sensors, ICs..."
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
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white text-[#ff6a00] px-2 py-0.5 rounded-full font-black text-xs">
                {totalCartCount}
              </span>
            </button>

            {/* Ops Console */}
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
              placeholder="Search 100+ electronic parts, Arduino..."
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
        {/* Hero Banner Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#ff6a00]/25 p-8 sm:p-14 text-white overflow-hidden shadow-2xl border border-zinc-800">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff6a00]/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6a00]/20 border border-[#ff6a00]/40 text-[#ff6a00] text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100+ HARDWARE PARTS CATALOG</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                ENGINEER THE <span className="text-[#ff6a00]">FUTURE</span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                High-quality microcontrollers, sensors, actuators, power modules, custom PCB fabrication, and 3D printing. Built for engineering projects with rapid campus gate delivery.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalog"
                  className="px-6 py-3.5 rounded-full bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/25 transition-all inline-flex items-center gap-2"
                >
                  <span>Explore 100+ Components</span>
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
                  <span>Same-Day Gate Dispatch</span>
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
            <div>
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6a00] uppercase">
                ENGINEERING SERVICES
              </h2>
              <p className="text-2xl font-black text-zinc-950">What We Build & Deliver</p>
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
                  <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 100+ Component Catalog Section */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
              <div>
                <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6a00] uppercase">
                  STOREFRONT CATALOG ({filteredProducts.length} ITEMS)
                </h2>
                <p className="text-2xl font-black text-zinc-950">100+ Hardware Parts & Components</p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#ff6a00] text-white shadow-md shadow-orange-500/20"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => {
                const qtyInCart = cartItems[product.id] || 0;
                return (
                  <div
                    key={product.id}
                    className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-[#ff6a00] hover:shadow-xl transition-all space-y-3 flex flex-col justify-between group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                          {product.category}
                        </span>
                        {product.badge && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#ff6a00]">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-zinc-950 text-sm leading-snug group-hover:text-[#ff6a00] transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="text-[11px] text-zinc-500 font-mono line-clamp-2 leading-relaxed">
                        {product.specs}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-zinc-100">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-zinc-950">₹{product.price}</span>
                          <span className="text-xs text-zinc-400 line-through">₹{product.originalPrice}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold">{product.stock}</span>
                      </div>

                      {qtyInCart === 0 ? (
                        <button
                          onClick={() => addToCart(product.id, product.name)}
                          className="w-full py-2 rounded-xl bg-zinc-950 hover:bg-[#ff6a00] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-2 py-1 text-xs font-bold text-[#ff6a00]">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="p-1 hover:bg-orange-100 rounded-lg text-[#ff6a00] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span>{qtyInCart} in Cart</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="p-1 hover:bg-orange-100 rounded-lg text-[#ff6a00] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 space-y-3 bg-zinc-50 rounded-3xl border border-zinc-200">
                <Search className="w-10 h-10 text-zinc-400 mx-auto" />
                <p className="text-sm font-bold text-zinc-700">No components found for "{searchQuery}"</p>
                <p className="text-xs text-zinc-500">Need rare ICs or custom parts? Use our custom WhatsApp sourcing desk.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="px-4 py-2 bg-[#ff6a00] text-white rounded-full text-xs font-bold"
                >
                  Reset Catalog Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Direct WhatsApp Support Banner */}
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

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#ff6a00]" />
                  <h2 className="text-lg font-black text-zinc-950">Your Project Cart</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart List */}
              <div className="space-y-4">
                {Object.entries(cartItems).map(([id, qty]) => {
                  const item = COMPONENTS_CATALOG.find((c) => c.id === id);
                  if (!item || qty <= 0) return null;
                  return (
                    <div
                      key={id}
                      className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="font-bold text-xs text-zinc-950 line-clamp-1">{item.name}</div>
                        <div className="text-xs text-[#ff6a00] font-black">₹{item.price * qty}</div>
                      </div>

                      <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-lg px-2 py-1 text-xs font-bold">
                        <button
                          onClick={() => updateQuantity(id, -1)}
                          className="text-zinc-600 hover:text-[#ff6a00] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span>{qty}</span>
                        <button
                          onClick={() => updateQuantity(id, 1)}
                          className="text-zinc-600 hover:text-[#ff6a00] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {totalCartCount === 0 && (
                  <div className="text-center py-12 text-zinc-500 space-y-2">
                    <ShoppingCart className="w-8 h-8 mx-auto text-zinc-300" />
                    <p className="text-xs font-bold">Your cart is empty.</p>
                  </div>
                )}
              </div>
            </div>

            {totalCartCount > 0 && (
              <div className="pt-6 border-t border-zinc-200 space-y-4">
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal ({totalCartCount} items):</span>
                    <span>₹{totalCartPrice}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Gate Delivery:</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-base text-zinc-950 font-black pt-2 border-t border-zinc-200">
                    <span>Total Amount:</span>
                    <span className="text-[#ff6a00]">₹{totalCartPrice}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Gate Dispatch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Drawer Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <h2 className="text-lg font-black text-zinc-950">Gate Pickup & Contact Info</h2>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!orderConfirmed ? (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-zinc-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-zinc-700">WhatsApp Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-zinc-700">Pickup Location / Lab Note (Optional)</label>
                  <textarea
                    rows={2}
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="Gate number, lab room, or specific request..."
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-zinc-700 space-y-1 font-mono">
                  <div className="font-bold text-[#ff6a00]">Order Summary (₹{totalCartPrice}):</div>
                  <div>{totalCartCount} items queued for 10-30 min express dispatch.</div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Dispatch on WhatsApp</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg animate-pulse">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-zinc-950">Order Dispatch Initiated!</h3>
                <p className="text-xs text-zinc-600">Redirecting to WhatsApp to send your order directly to our campus runners...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#09090b] text-white pt-12 pb-8 border-t border-zinc-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
            <PartslyLogo isLight={false} />

            <div className="flex items-center gap-4 text-xs font-mono">
              <a href={MAINTENANCE_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                WhatsApp Helpdesk
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
