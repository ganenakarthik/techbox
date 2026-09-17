"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BRAND } from "@/config/brand";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  Layers,
  Printer,
  Wrench,
  FileText,
  Phone,
  Truck,
  Cpu,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const {
    cartCount,
    setIsCartDrawerOpen,
    setIsSearchOpen,
    setIsAuthModalOpen,
    wishlist,
    user,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close services dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(e.target as Node)
      ) {
        setIsServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const services = [
    {
      name: "PCB Manufacturing",
      desc: "1 to 4 layer rapid FR-4 custom boards",
      href: "/services/pcb",
      icon: Layers,
    },
    {
      name: "3D Print Enclosures",
      desc: "Custom PLA, ABS & Resin sensor cases",
      href: "/services/3d-printing",
      icon: Printer,
    },
    {
      name: "Working Prototypes",
      desc: "Bench-tested assembly & firmware flash",
      href: "/services/prototypes",
      icon: Wrench,
    },
    {
      name: "Project Documentation",
      desc: "IEEE reports, PPT decks & viva defense",
      href: "/services/documents",
      icon: FileText,
    },
  ];

  const categoryLinks = [
    { name: "All Components", href: "/shop" },
    { name: "Dev Boards & MCUs", href: "/shop?category=development-boards" },
    { name: "Sensors & Modules", href: "/shop?category=sensors-modules" },
    { name: "Motors & Drivers", href: "/shop?category=motors-drivers" },
    { name: "Wireless & IoT", href: "/shop?category=esp32-iot" },
    { name: "Project Kits", href: "/projects" },
    { name: "PCB Fabrication", href: "/services/pcb" },
    { name: "Viva & Reports", href: "/services/documents" },
  ];

  const isServicesActive = pathname.startsWith("/services");
  const isAdminRoute = pathname.startsWith("/admin");

  // Dedicated Staff Operations Console Header (Clean Light Professional Style)
  if (isAdminRoute) {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Brand + Console Identifier */}
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/admin" className="flex items-center gap-3">
                <Image
                  src={BRAND.logo}
                  alt={BRAND.displayName}
                  width={120}
                  height={34}
                  priority
                  className="h-8 w-auto object-contain"
                />
                <span className="px-2 py-0.5 rounded-md bg-orange-50 text-[#ff6a00] border border-orange-200 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Staff Console
                </span>
              </Link>

              {/* Console Navigation Links */}
              <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200">
                <Link
                  href="/admin"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/admin"
                      ? "text-[#ff6a00] bg-orange-50 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Overview
                </Link>
                <Link
                  href="/admin/orders"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/admin/orders"
                      ? "text-[#ff6a00] bg-orange-50 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Orders & Dispatch
                </Link>
                <Link
                  href="/admin/projects"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/admin/projects"
                      ? "text-[#ff6a00] bg-orange-50 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Quote Studio
                </Link>
                <Link
                  href="/admin/products"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/admin/products"
                      ? "text-[#ff6a00] bg-orange-50 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Catalog
                </Link>
                <Link
                  href="/admin/inventory"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/admin/inventory"
                      ? "text-[#ff6a00] bg-orange-50 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Inventory Ledger
                </Link>
              </nav>
            </div>

            {/* Right: Quick Actions & Exit to Storefront */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Production Dispatch Live</span>
              </div>

              {/* Staff Switcher / Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="w-5 h-5 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center text-[10px] font-bold text-[#ff6a00]">
                  SU
                </div>
                <span className="hidden sm:inline text-slate-700 font-medium text-[11px]">
                  Operations Lead
                </span>
              </div>

              {/* Return to Customer Storefront Link */}
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-800 transition-all shadow-xs"
              >
                <span>â† Exit to Store</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* 1. MAIN STORE HEADER (Pure White Flipkart/Amazon/Robu Style) */}
      <header
        className={`sticky top-0 z-40 bg-white border-b border-slate-200 transition-shadow duration-200 ${
          isScrolled ? "shadow-md" : "shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            {/* Logo: Original Black & Orange Partsly Logo on White */}
            <Link href="/" className="flex items-center shrink-0 group">
              <Image
                src={BRAND.logo}
                alt={BRAND.displayName}
                width={150}
                height={42}
                priority
                className="h-10 w-auto object-contain transition-transform group-hover:scale-102"
              />
            </Link>

            {/* Central Prominent Search Bar (Robu.in Style) */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between h-11 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-[#ff6a00] rounded-xl text-slate-500 text-xs transition-all shadow-inner cursor-pointer"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Search className="w-4 h-4 text-[#ff6a00] shrink-0" />
                  <span className="truncate text-slate-500 text-xs font-normal">
                    Search 2,000+ electronic components, Arduino, ESP32, sensors, kits, BOM...
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] text-slate-500 bg-white border border-slate-200 rounded font-mono font-semibold shadow-xs">
                    âŒ˜K
                  </kbd>
                  <span className="px-3 py-1.5 rounded-lg bg-[#ff6a00] text-slate-900 font-bold text-xs shadow-xs hover:bg-[#ea580c] transition-colors">
                    Search
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Icons & Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-[#ff6a00] hover:bg-slate-50 transition-colors"
                title="Search components"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Track Order Link */}
              <Link
                href="/account/orders"
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#ff6a00] transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-[#ff6a00]" />
                <span>Track Order</span>
              </Link>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="relative p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-[#ff6a00] bg-white transition-colors"
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff6a00] text-slate-900 text-[10px] font-bold flex items-center justify-center shadow">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Student Profile / Account */}
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-[#ff6a00] bg-white transition-colors"
                title="Account"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-semibold">
                  {user ? user.name.split(" ")[0] : "Login / Sign Up"}
                </span>
              </button>

              {/* Cart Button (Blinkit / Flipkart Style) */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-slate-900 font-extrabold text-xs transition-all shadow-sm active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-[#ff6a00] text-[11px] font-black flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. CATEGORY NAVIGATION STRIP (Robu.in Style) */}
        <div className="bg-slate-50 border-t border-slate-200 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 py-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1 xl:gap-2">
                {categoryLinks.map((cat) => {
                  const isActive = pathname === cat.href;
                  return (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-white text-[#ff6a00] font-bold shadow-xs border border-slate-200"
                          : "text-slate-700 hover:text-[#ff6a00] hover:bg-white"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}

                {/* Services Dropdown */}
                <div className="relative" ref={servicesDropdownRef}>
                  <button
                    onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                      isServicesActive || isServicesDropdownOpen
                        ? "bg-white text-[#ff6a00] font-bold shadow-xs border border-slate-200"
                        : "text-slate-700 hover:text-[#ff6a00] hover:bg-white"
                    }`}
                  >
                    <span>Fabrication Hub</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        isServicesDropdownOpen ? "rotate-180 text-[#ff6a00]" : "text-slate-500"
                      }`}
                    />
                  </button>

                  {isServicesDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                        Rapid Fabrication Services
                      </div>
                      <div className="space-y-1">
                        {services.map((srv) => {
                          const Icon = srv.icon;
                          return (
                            <Link
                              key={srv.name}
                              href={srv.href}
                              onClick={() => setIsServicesDropdownOpen(false)}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00] shrink-0 group-hover:bg-[#ff6a00] group-hover:text-slate-900 transition-colors">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold group-hover:text-[#ff6a00] transition-colors">
                                  {srv.name}
                                </div>
                                <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                  {srv.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4. MOBILE NAVIGATION DRAWER (Clean White Theme) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-xs h-full bg-white border-l border-slate-200 p-5 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image
                    src={BRAND.logo}
                    alt={BRAND.displayName}
                    width={130}
                    height={36}
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search in Drawer */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs text-left"
              >
                <Search className="w-4 h-4 text-[#ff6a00]" />
                <span>Search parts, Arduino, sensors...</span>
              </button>

              {/* Navigation Links */}
              <div className="space-y-1">
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                >
                  Shop Components
                </Link>

                <Link
                  href="/projects"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                >
                  Project Kits
                </Link>

                <Link
                  href="/build"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold bg-orange-50 text-[#ff6a00] border border-orange-200"
                >
                  <span>Build My Project</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#ff6a00] text-slate-900">
                    POPULAR
                  </span>
                </Link>

                <div className="pt-3 pb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Custom Fabrication
                </div>
                {services.map((srv) => (
                  <Link
                    key={srv.name}
                    href={srv.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  >
                    <span>{srv.name}</span>
                  </Link>
                ))}

                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 mt-2"
                >
                  About partsly
                </Link>
              </div>

              {/* Admin & Account Links */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-[#ff6a00] bg-orange-50 border border-orange-200 font-bold"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#ff6a00]" />
                    <span>Admin Operations Console</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100 text-left font-medium"
                >
                  <User className="w-4 h-4 text-[#ff6a00]" />
                  <span>{user ? user.name : "Login / Sign Up"}</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
              {BRAND.displayName} â€¢ Same-Day Campus Dispatch
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;