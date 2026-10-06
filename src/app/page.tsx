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
  MapPin,
  User,
  Heart,
  Star,
  ArrowUp,
  Tag,
  Clock,
  Check,
} from "lucide-react";
import { MAINTENANCE_CONFIG } from "@/config/maintenance";
import { MaintenanceView } from "@/components/maintenance/MaintenanceView";
import { PartslyLogo } from "@/components/ui/Logo";
import { COMPONENTS_CATALOG, ComponentItem } from "@/data/componentsCatalog";

const CATEGORIES = [
  "All Categories",
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
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
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
        selectedCategory === "All Categories" || item.category === selectedCategory;
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

  const totalOriginalPrice = Object.entries(cartItems).reduce((sum, [id, qty]) => {
    const p = COMPONENTS_CATALOG.find((item) => item.id === id);
    return sum + (p ? p.originalPrice * qty : 0);
  }, 0);

  const totalSavings = totalOriginalPrice - totalCartPrice;

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-zinc-900 font-sans selection:bg-[#ff6a00] selection:text-white flex flex-col justify-between">
      {/* 1. Amazon/Flipkart Top Bar */}
      <div className="bg-[#131921] text-white text-xs py-1.5 px-4 border-b border-zinc-800 font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-zinc-300">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Deliver to <strong>Campus Lab / Gate</strong></span>
            </div>
            <span className="hidden md:inline text-zinc-600">|</span>
            <span className="hidden md:inline text-emerald-400 font-bold">10-30 Min Express Gate Dispatch</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={MAINTENANCE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Helpdesk ({MAINTENANCE_CONFIG.whatsappDisplay})</span>
            </a>
            <a href="/admin" className="text-zinc-400 hover:text-white font-bold transition-colors">
              Ops Console →
            </a>
          </div>
        </div>
      </div>

      {/* 2. Amazon/Flipkart Main Header */}
      <header className="sticky top-0 z-40 bg-[#131921] text-white border-b border-zinc-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <PartslyLogo isLight={false} />

          {/* Amazon-style Large Integrated Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl relative items-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold px-3 rounded-l-md border-r border-zinc-300 focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100+ electronic components, Arduino, ESP32, sensors, ICs..."
              className="w-full h-10 bg-white text-zinc-900 px-4 text-xs focus:outline-none"
            />

            <button className="h-10 px-5 bg-[#ff6a00] hover:bg-orange-600 text-white rounded-r-md font-bold transition-colors flex items-center justify-center">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Account & Cart Controls */}
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex flex-col text-xs cursor-pointer">
              <span className="text-[10px] text-zinc-400">Hello, Engineer</span>
              <span className="font-bold flex items-center gap-1">
                Account & Orders <ChevronDown className="w-3 h-3 text-zinc-400" />
              </span>
            </div>

            {/* Cart Button with Flipkart Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#ff6a00] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              <span className="font-black text-xs border-l border-orange-400 pl-2 ml-1">
                ₹{totalCartPrice}
              </span>
            </button>
          </div>
        </div>

        {/* Amazon Sub-Header Category Navigation Strip */}
        <div className="bg-[#232f3e] text-white text-xs px-4 border-t border-zinc-700 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-6 py-2 whitespace-nowrap font-medium">
            <button
              onClick={() => setSelectedCategory("All Categories")}
              className={`flex items-center gap-1 font-bold ${
                selectedCategory === "All Categories" ? "text-[#ff6a00]" : "hover:text-[#ff6a00]"
              }`}
            >
              ☰ All Categories
            </button>

            {CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`transition-colors ${
                  selectedCategory === cat
                    ? "text-[#ff6a00] font-bold underline underline-offset-4"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}

            <span className="text-zinc-600">|</span>
            <a href="#deals" className="text-amber-400 font-bold hover:underline">
              ⚡ Today's Deals
            </a>
            <a href="#services" className="text-emerald-400 font-bold hover:underline">
              🛠️ PCB & 3D Print Services
            </a>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#09090b] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#ff6a00] text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#ff6a00]" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Main E-Commerce Content */}
      <main className="flex-1 space-y-6 py-4">
        {/* Flipkart-style Quick Category Icon Row */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg p-4 border border-zinc-200 shadow-sm grid grid-cols-3 sm:grid-cols-6 gap-4 text-center text-xs">
            <button
              onClick={() => setSelectedCategory("Microcontrollers")}
              className="p-3 rounded-lg hover:bg-orange-50 transition-all flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 text-[#ff6a00] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="font-bold text-zinc-800 group-hover:text-[#ff6a00]">Microcontrollers</span>
            </button>

            <button
              onClick={() => setSelectedCategory("Sensors")}
              className="p-3 rounded-lg hover:bg-orange-50 transition-all flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <span className="font-bold text-zinc-800 group-hover:text-blue-600">Sensors & Modules</span>
            </button>

            <button
              onClick={() => setSelectedCategory("Motors & Actuators")}
              className="p-3 rounded-lg hover:bg-orange-50 transition-all flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <span className="font-bold text-zinc-800 group-hover:text-emerald-600">Motors & Robotics</span>
            </button>

            <button
              onClick={() => setSelectedCategory("Power & Batteries")}
              className="p-3 rounded-lg hover:bg-orange-50 transition-all flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="font-bold text-zinc-800 group-hover:text-amber-600">Power & Batteries</span>
            </button>

            <button
              onClick={() => setSelectedCategory("PCB & Custom Services")}
              className="p-3 rounded-lg hover:bg-orange-50 transition-all flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <span className="font-bold text-zinc-800 group-hover:text-purple-600">PCB & 3D Print</span>
            </button>

            <button
              onClick={() => setSelectedCategory("Passives & ICs")}
              className="p-3 rounded-lg hover:bg-orange-50 transition-all flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-bold text-zinc-800 group-hover:text-zinc-900">Passives & Tools</span>
            </button>
          </div>
        </section>

        {/* Amazon/Flipkart Hero Banner & Promo Slider */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="rounded-lg bg-gradient-to-r from-[#131921] via-zinc-900 to-[#ff6a00]/30 p-8 sm:p-12 text-white border border-zinc-800 relative overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ff6a00] text-white text-xs font-black uppercase tracking-wider">
                ⚡ EXPRESS CAMPUS DISPATCH
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                100+ Hardware Parts <br />
                <span className="text-[#ff6a00]">Delivered to Your Gate in 10-30 Mins</span>
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Genuine lab-tested microcontrollers, sensors, custom PCB fabrication, and 3D print enclosures. Built for engineering students and creators.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="#catalog"
                  className="px-6 py-3 rounded-md bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  Shop All 100+ Parts →
                </a>
                <a
                  href={MAINTENANCE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-md bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Quote</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Amazon 4-Tile Deal Grid Block */}
        <section id="deals" className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tile 1: Bestselling Microcontrollers */}
            <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-black text-base text-zinc-950">Top Microcontrollers</h3>
                <p className="text-xs text-zinc-500">ESP32, Arduino, Raspberry Pi Pico W</p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-zinc-50 p-2 rounded border border-zinc-100 text-center">
                    <img src={COMPONENTS_CATALOG[0].image} alt="ESP32" className="h-20 w-full object-cover rounded mb-1" />
                    <span className="text-[11px] font-bold block truncate">ESP32 DevKit</span>
                    <span className="text-xs text-[#ff6a00] font-black">₹389</span>
                  </div>
                  <div className="bg-zinc-50 p-2 rounded border border-zinc-100 text-center">
                    <img src={COMPONENTS_CATALOG[1].image} alt="Arduino Uno" className="h-20 w-full object-cover rounded mb-1" />
                    <span className="text-[11px] font-bold block truncate">Arduino UNO</span>
                    <span className="text-xs text-[#ff6a00] font-black">₹449</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory("Microcontrollers")}
                className="text-xs text-[#ff6a00] font-bold hover:underline text-left pt-2"
              >
                See all Microcontrollers →
              </button>
            </div>

            {/* Tile 2: Robotics Sensors */}
            <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-black text-base text-zinc-950">Robotics & IoT Sensors</h3>
                <p className="text-xs text-zinc-500">MPU6050, Ultrasonic, DHT11</p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-zinc-50 p-2 rounded border border-zinc-100 text-center">
                    <img src={COMPONENTS_CATALOG[20].image} alt="MPU6050" className="h-20 w-full object-cover rounded mb-1" />
                    <span className="text-[11px] font-bold block truncate">MPU6050</span>
                    <span className="text-xs text-[#ff6a00] font-black">₹149</span>
                  </div>
                  <div className="bg-zinc-50 p-2 rounded border border-zinc-100 text-center">
                    <img src={COMPONENTS_CATALOG[21].image} alt="HC-SR04" className="h-20 w-full object-cover rounded mb-1" />
                    <span className="text-[11px] font-bold block truncate">HC-SR04</span>
                    <span className="text-xs text-[#ff6a00] font-black">₹79</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory("Sensors")}
                className="text-xs text-[#ff6a00] font-bold hover:underline text-left pt-2"
              >
                See all Sensors →
              </button>
            </div>

            {/* Tile 3: Motors & Actuators */}
            <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-black text-base text-zinc-950">Motors & Drivers</h3>
                <p className="text-xs text-zinc-500">SG90 Servos, L298N, Steppers</p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-zinc-50 p-2 rounded border border-zinc-100 text-center">
                    <img src={COMPONENTS_CATALOG[40].image} alt="SG90" className="h-20 w-full object-cover rounded mb-1" />
                    <span className="text-[11px] font-bold block truncate">SG90 Servo</span>
                    <span className="text-xs text-[#ff6a00] font-black">₹119</span>
                  </div>
                  <div className="bg-zinc-50 p-2 rounded border border-zinc-100 text-center">
                    <img src={COMPONENTS_CATALOG[42].image} alt="L298N" className="h-20 w-full object-cover rounded mb-1" />
                    <span className="text-[11px] font-bold block truncate">L298N Driver</span>
                    <span className="text-xs text-[#ff6a00] font-black">₹189</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory("Motors & Actuators")}
                className="text-xs text-[#ff6a00] font-bold hover:underline text-left pt-2"
              >
                See all Motors →
              </button>
            </div>

            {/* Tile 4: Custom PCB & 3D Print */}
            <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-black text-base text-zinc-950">PCB & 3D Printing</h3>
                <p className="text-xs text-zinc-500">Custom FR-4 PCBs & CAD Cases</p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-zinc-50 p-2 rounded border border-zinc-100 text-center">
                    <img src={COMPONENTS_CATALOG[80].image} alt="PCB Fab" className="h-20 w-full object-cover rounded mb-1" />
                    <span className="text-[11px] font-bold block truncate">PCB Fab</span>
                    <span className="text-xs text-[#ff6a00] font-black">₹499</span>
                  </div>
                  <div className="bg-zinc-50 p-2 rounded border border-zinc-100 text-center">
                    <img src={COMPONENTS_CATALOG[81].image} alt="3D Case" className="h-20 w-full object-cover rounded mb-1" />
                    <span className="text-[11px] font-bold block truncate">3D Enclosure</span>
                    <span className="text-xs text-[#ff6a00] font-black">₹399</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory("PCB & Custom Services")}
                className="text-xs text-[#ff6a00] font-bold hover:underline text-left pt-2"
              >
                See Custom Services →
              </button>
            </div>
          </div>
        </section>

        {/* 100-Component E-Commerce Storefront Grid (Flipkart / Amazon Style) */}
        <section id="catalog" className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg p-6 border border-zinc-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
              <div>
                <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6a00] uppercase">
                  STOREFRONT CATALOG ({filteredProducts.length} ITEMS)
                </h2>
                <p className="text-2xl font-black text-zinc-950">100+ Hardware Parts & Components</p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#ff6a00] text-white shadow-sm"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid (Flipkart Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => {
                const qtyInCart = cartItems[product.id] || 0;
                const discountPercent = Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) * 100
                );

                return (
                  <div
                    key={product.id}
                    className="p-4 rounded-lg bg-white border border-zinc-200 hover:border-[#ff6a00] hover:shadow-lg transition-all flex flex-col justify-between group space-y-3"
                  >
                    <div className="space-y-3">
                      {/* Product Image */}
                      <div className="relative h-48 w-full bg-zinc-50 rounded-md overflow-hidden flex items-center justify-center p-2 border border-zinc-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
                        />
                        {discountPercent > 0 && (
                          <span className="absolute top-2 left-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#ff6a00] text-white shadow">
                            {discountPercent}% OFF
                          </span>
                        )}
                        {product.badge && (
                          <span className="absolute top-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-white">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                          {product.category}
                        </span>
                        <h3 className="font-bold text-zinc-950 text-sm leading-snug group-hover:text-[#ff6a00] transition-colors line-clamp-2">
                          {product.name}
                        </h3>

                        {/* Rating Star Badge (Flipkart Style) */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-0.5">
                            {product.rating} <Star className="w-2.5 h-2.5 fill-current" />
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">In Stock ({product.inStockCount})</span>
                        </div>

                        <p className="text-[11px] text-zinc-500 font-mono line-clamp-2 leading-relaxed pt-1">
                          {product.specs}
                        </p>
                      </div>
                    </div>

                    {/* Pricing & Add to Cart (Amazon Style) */}
                    <div className="space-y-3 pt-3 border-t border-zinc-100">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-zinc-950">₹{product.price}</span>
                          <span className="text-xs text-zinc-400 line-through">₹{product.originalPrice}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold">Free Gate Dispatch</span>
                      </div>

                      {qtyInCart === 0 ? (
                        <button
                          onClick={() => addToCart(product.id, product.name)}
                          className="w-full py-2 rounded-md bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-md px-2 py-1.5 text-xs font-bold text-[#ff6a00]">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="p-1 hover:bg-orange-100 rounded text-[#ff6a00] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span>{qtyInCart} in Cart</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="p-1 hover:bg-orange-100 rounded text-[#ff6a00] cursor-pointer"
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
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg p-6 border border-zinc-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6a00] uppercase">
                PARTSLY ENGINEERING SERVICES
              </h2>
              <p className="text-2xl font-black text-zinc-950">What We Build & Deliver</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MAINTENANCE_CONFIG.services.map((service, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-lg bg-zinc-50 border border-zinc-200 hover:border-[#ff6a00] transition-all space-y-2.5 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-md bg-[#ff6a00] text-white flex items-center justify-center font-bold">
                      {idx === 0 && <DollarSign className="w-5 h-5" />}
                      {idx === 1 && <Layers className="w-5 h-5" />}
                      {idx === 2 && <Search className="w-5 h-5" />}
                      {idx === 3 && <Cpu className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-orange-100 text-[#ff6a00]">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-zinc-950 text-sm group-hover:text-[#ff6a00] transition-colors">
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
      </main>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#ff6a00]" />
                  <h2 className="text-lg font-black text-zinc-950">Your Cart ({totalCartCount} Items)</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart List */}
              <div className="space-y-3">
                {Object.entries(cartItems).map(([id, qty]) => {
                  const item = COMPONENTS_CATALOG.find((c) => c.id === id);
                  if (!item || qty <= 0) return null;
                  return (
                    <div
                      key={id}
                      className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-3"
                    >
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded border border-zinc-200" />
                      <div className="space-y-0.5 flex-1">
                        <div className="font-bold text-xs text-zinc-950 line-clamp-1">{item.name}</div>
                        <div className="text-xs text-[#ff6a00] font-black">₹{item.price * qty}</div>
                      </div>

                      <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded px-2 py-1 text-xs font-bold">
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
                {totalSavings > 0 && (
                  <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>You save ₹{totalSavings} on this order!</span>
                  </div>
                )}

                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal ({totalCartCount} items):</span>
                    <span>₹{totalCartPrice}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>10-30 Min Gate Delivery:</span>
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
                  className="w-full py-3.5 rounded-md bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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
          <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
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
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-md px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
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
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-md px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-zinc-700">Pickup Location / Lab Note (Optional)</label>
                  <textarea
                    rows={2}
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="Gate number, lab room, or specific request..."
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-md px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div className="p-4 rounded-md bg-orange-50 border border-orange-200 text-xs text-zinc-700 space-y-1 font-mono">
                  <div className="font-bold text-[#ff6a00]">Order Summary (₹{totalCartPrice}):</div>
                  <div>{totalCartCount} items queued for 10-30 min express dispatch.</div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-md bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Dispatch on WhatsApp</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-pulse">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-zinc-950">Order Dispatch Initiated!</h3>
                <p className="text-xs text-zinc-600">Redirecting to WhatsApp to send your order directly to our campus runners...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Amazon-style Multi-Column Footer */}
      <footer className="bg-[#131921] text-white pt-6 pb-8 border-t border-zinc-800 mt-12">
        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="w-full bg-[#232f3e] hover:bg-zinc-700 py-3 text-center text-xs font-mono font-bold text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer mb-8"
        >
          <ArrowUp className="w-4 h-4 text-[#ff6a00]" />
          <span>Back to Top</span>
        </button>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-zinc-800 text-xs font-mono">
            {/* Col 1 */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Get to Know Us</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#catalog" className="hover:underline">About Partsly</a></li>
                <li><a href="#services" className="hover:underline">Engineering Services</a></li>
                <li><a href="#catalog" className="hover:underline">BOM Sourcing</a></li>
                <li><a href="/admin" className="hover:underline">Ops Team Console</a></li>
              </ul>
            </div>

            {/* Col 2 */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Connect with Us</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href={MAINTENANCE_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-400">WhatsApp Helpdesk</a></li>
                <li><a href={MAINTENANCE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-pink-400">Instagram Updates</a></li>
                <li><a href={MAINTENANCE_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">Direct Campus Runner Desk</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Custom Engineering Services</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#services" className="hover:underline">2-Layer & 4-Layer PCB Fabrication</a></li>
                <li><a href="#services" className="hover:underline">3D Printed ABS Enclosures</a></li>
                <li><a href="#services" className="hover:underline">BOM Cost Reduction</a></li>
                <li><a href="#services" className="hover:underline">Technical SEO Indexing</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Let Us Help You</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#catalog" className="hover:underline">Track Gate Order</a></li>
                <li><a href="#catalog" className="hover:underline">Zero-DOA Replacement Policy</a></li>
                <li><a href={MAINTENANCE_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">Help & WhatsApp Support</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
            <PartslyLogo isLight={false} />
            <div>© 2026 Partsly Inc. All rights reserved. • Express Hardware Platform</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
