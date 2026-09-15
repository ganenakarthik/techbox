"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
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

  const isServicesActive = pathname.startsWith("/services");
  const isAdminRoute = pathname.startsWith("/admin");

  // Dedicated Staff Operations Console Header
  if (isAdminRoute) {
    return (
      <header className="sticky top-0 z-40 bg-[#0d0d0d] border-b border-[#262626] py-3 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Brand + Console Identifier */}
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/admin" className="flex items-center gap-2.5 group">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[#141414] border border-[#ff6a00]/40 p-0.5 shadow-md shadow-[#ff6a00]/15">
                  <Image src="/logo-icon.png" alt="TechBox" fill className="object-contain" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-wider text-white">
                    TECH<span className="text-[#ff6a00]">BOX</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#ff6a00]/15 text-[#ff6a00] border border-[#ff6a00]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                    Staff Console
                  </span>
                </div>
              </Link>

              {/* Console Navigation Links */}
              <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-[#222222]">
                <Link
                  href="/admin"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/admin"
                      ? "text-[#ff6a00] bg-[#ff6a00]/10 border border-[#ff6a00]/25"
                      : "text-neutral-400 hover:text-white hover:bg-[#161616]"
                  }`}
                >
                  Overview
                </Link>
                <Link
                  href="/admin/orders"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/admin/orders"
                      ? "text-[#ff6a00] bg-[#ff6a00]/10 border border-[#ff6a00]/25"
                      : "text-neutral-400 hover:text-white hover:bg-[#161616]"
                  }`}
                >
                  Orders & Dispatch
                </Link>
                <Link
                  href="/admin/projects"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/admin/projects"
                      ? "text-[#ff6a00] bg-[#ff6a00]/10 border border-[#ff6a00]/25"
                      : "text-neutral-400 hover:text-white hover:bg-[#161616]"
                  }`}
                >
                  Quote Studio
                </Link>
                <Link
                  href="/admin/products"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/admin/products"
                      ? "text-[#ff6a00] bg-[#ff6a00]/10 border border-[#ff6a00]/25"
                      : "text-neutral-400 hover:text-white hover:bg-[#161616]"
                  }`}
                >
                  Catalog
                </Link>
                <Link
                  href="/admin/inventory"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/admin/inventory"
                      ? "text-[#ff6a00] bg-[#ff6a00]/10 border border-[#ff6a00]/25"
                      : "text-neutral-400 hover:text-white hover:bg-[#161616]"
                  }`}
                >
                  Inventory Ledger
                </Link>
              </nav>
            </div>

            {/* Right: Quick Actions & Exit to Storefront */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#161616] border border-[#262626] text-[11px] text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                <span>Production Dispatch Live</span>
              </div>

              {/* Staff Switcher / Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141414] border border-[#262626] text-xs">
                <div className="w-5 h-5 rounded-full bg-[#ff6a00]/20 border border-[#ff6a00]/40 flex items-center justify-center text-[10px] font-bold text-[#ff6a00]">
                  SU
                </div>
                <span className="hidden sm:inline text-neutral-300 font-medium text-[11px]">
                  Operations Lead
                </span>
              </div>

              {/* Return to Customer Storefront Link */}
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#333333] hover:border-neutral-500 text-xs font-semibold text-white transition-all shadow-sm"
              >
                <span>← Exit to Store</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0a0a0a]/92 backdrop-blur-xl border-b border-[#262626] shadow-xl py-3"
            : "bg-[#080808]/80 backdrop-blur-md border-b border-[#1c1c1c] py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Logo: Clean and prominent brandmark */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-[#141414] border border-[#ff6a00]/40 group-hover:border-[#ff6a00] transition-colors shrink-0 shadow-lg shadow-[#ff6a00]/15">
                <Image
                  src="/logo-icon.png"
                  alt="TechBox Logo"
                  fill
                  className="object-contain p-0.5 group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-wider text-white flex items-center gap-0.5 leading-none">
                  TECH<span className="text-[#ff6a00]">BOX</span>
                </span>
                <span className="text-[9px] font-medium text-neutral-400 tracking-widest uppercase mt-1 hidden sm:block">
                  Project Infrastructure
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Clean 5 items) */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
              <Link
                href="/shop"
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  pathname === "/shop"
                    ? "text-white bg-[#1a1a1a]"
                    : "text-neutral-400 hover:text-white hover:bg-[#141414]"
                }`}
              >
                Shop
              </Link>

              <Link
                href="/projects"
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  pathname.startsWith("/projects")
                    ? "text-white bg-[#1a1a1a]"
                    : "text-neutral-400 hover:text-white hover:bg-[#141414]"
                }`}
              >
                Project Kits
              </Link>

              <Link
                href="/build"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  pathname === "/build"
                    ? "bg-[#ff6a00] text-black shadow-md shadow-[#ff6a00]/25"
                    : "bg-[#ff6a00]/15 text-[#ff6a00] hover:bg-[#ff6a00] hover:text-black border border-[#ff6a00]/30"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Build My Project</span>
              </Link>

              {/* Grouped Services Dropdown with high-contrast text */}
              <div className="relative" ref={servicesDropdownRef}>
                <button
                  onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isServicesActive || isServicesDropdownOpen
                      ? "text-white bg-[#1a1a1a]"
                      : "text-neutral-400 hover:text-white hover:bg-[#141414]"
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${
                      isServicesDropdownOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>

                {isServicesDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-[#121212] border border-[#262626] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1.5">
                      Engineering & Fabrication Hubs
                    </div>
                    <div className="space-y-1">
                      {services.map((srv) => {
                        const Icon = srv.icon;
                        return (
                          <Link
                            key={srv.name}
                            href={srv.href}
                            onClick={() => setIsServicesDropdownOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#1c1c1c] text-neutral-300 hover:text-white transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-center text-[#ff6a00] shrink-0 group-hover:border-[#ff6a00]/40">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold group-hover:text-[#ff6a00] transition-colors">
                                {srv.name}
                              </div>
                              <div className="text-[11px] text-neutral-300 leading-snug mt-0.5">
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

              <Link
                href="/about"
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  pathname === "/about"
                    ? "text-white bg-[#1a1a1a]"
                    : "text-neutral-400 hover:text-white hover:bg-[#141414]"
                }`}
              >
                About Us
              </Link>
            </nav>

            {/* Utility Icons & Actions (Polished search, user profile icon, single admin button) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Trigger: Height increased to 46px (h-11.5), py-0, line-height normal, zero baseline clipping */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-3 h-11.5 px-4 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-[#282828] hover:border-neutral-600 text-neutral-400 hover:text-neutral-200 transition-all text-xs shadow-inner"
              >
                <Search className="w-4 h-4 text-[#ff6a00] shrink-0" />
                <span className="hidden md:inline-block text-xs font-normal text-neutral-400 leading-normal tracking-wide py-0.5">
                  Search parts, kits...
                </span>
                <kbd className="hidden md:inline-flex items-center px-2 py-0.5 text-[10px] text-neutral-400 bg-[#1e1e1e] border border-[#2d2d2d] rounded-md font-mono font-semibold">
                  ⌘K
                </kbd>
              </button>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="relative w-10.5 h-10.5 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] hover:border-neutral-600 transition-colors"
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff6a00] text-black text-[10px] font-bold flex items-center justify-center shadow">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Standard User Profile / Account Icon */}
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-10.5 h-10.5 rounded-xl flex items-center justify-center text-neutral-300 hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] hover:border-neutral-600 transition-colors"
                title="Student / Account Profile"
              >
                <User className="w-4 h-4" />
              </button>

              {/* Single Prominent Admin Operations Console Button */}
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 h-11.5 px-3.5 rounded-xl bg-[#161616] hover:bg-[#1e1e1e] border border-[#ff6a00]/40 hover:border-[#ff6a00] text-xs font-bold text-[#ff6a00] shadow-sm shadow-[#ff6a00]/10 transition-all"
                title="Admin Operations Console"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#ff6a00]" />
                <span>Admin</span>
              </Link>

              {/* Cart Drawer Button */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-2 h-10 px-3.5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs transition-all shadow-md shadow-[#ff6a00]/20 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-black text-[#ff6a00] text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#141414]"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-xs h-full bg-[#0d0d0d] border-l border-[#262626] p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-[#141414] border border-[#ff6a00]/40">
                    <Image src="/logo-icon.png" alt="TechBox" fill className="object-contain" />
                  </div>
                  <span className="font-bold text-base text-white">
                    TECH<span className="text-[#ff6a00]">BOX</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#171717]"
                >
                  Shop Components
                </Link>

                <Link
                  href="/projects"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#171717]"
                >
                  Project Kits
                </Link>

                <Link
                  href="/build"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold bg-[#ff6a00]/15 text-[#ff6a00]"
                >
                  <span>Build My Project</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#ff6a00] text-black">
                    NEW
                  </span>
                </Link>

                <div className="pt-2 pb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Custom Fabrication
                </div>
                {services.map((srv) => (
                  <Link
                    key={srv.name}
                    href={srv.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-[#171717]"
                  >
                    <span>{srv.name}</span>
                  </Link>
                ))}

                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#171717] mt-2"
                >
                  About Founders
                </Link>
              </div>

              {/* Admin & Account Links */}
              <div className="pt-4 border-t border-[#262626] space-y-2">
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-[#ff6a00] bg-[#ff6a00]/10 border border-[#ff6a00]/20 font-bold"
                >
                  <ShieldAlert className="w-4 h-4 text-[#ff6a00]" />
                  <span>Admin Operations Console</span>
                </Link>

                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-neutral-300 hover:bg-[#171717]"
                >
                  <User className="w-4 h-4 text-[#ff6a00]" />
                  <span>Student Account</span>
                </Link>
              </div>
            </div>

            <div className="pt-6 text-center text-xs text-neutral-500">
              TechBox • Everything for your project.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
