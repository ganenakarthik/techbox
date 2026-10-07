"use client";

import React from "react";
import { Logo } from "@/components/ui/Logo";

interface HeaderProps {
  activeTab: "home" | "search" | "services" | "sourcing" | "account";
  setActiveTab: (tab: "home" | "search" | "services" | "sourcing" | "account") => void;
  cartCount: number;
  wishlistCount: number;
  openCart: () => void;
  openSearch: () => void;
  openAccount: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function Header({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  openCart,
  openSearch,
  openAccount,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full liquid-header px-4 sm:px-8 py-3 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo (No .in) */}
        <div onClick={() => setActiveTab("home")}>
          <Logo size="md" />
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "home"
                ? "bg-white text-[#ff6a00] shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => {
              setActiveTab("home");
              const el = document.getElementById("categories-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all"
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "services"
                ? "bg-white text-[#ff6a00] shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            Services (PCB / 3D)
          </button>
          <button
            onClick={() => setActiveTab("sourcing")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "sourcing"
                ? "bg-white text-[#ff6a00] shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            Sourcing
          </button>
        </nav>

        {/* Central Search Bar */}
        <div className="flex-1 max-w-md hidden lg:block">
          <div
            onClick={openSearch}
            className="liquid-input flex items-center gap-2.5 px-4 py-2 cursor-pointer group text-slate-400 hover:text-slate-600"
          >
            <svg
              className="w-4 h-4 text-slate-400 group-hover:text-[#ff6a00] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xs font-semibold text-slate-500 truncate flex-1">
              Search ESP32, Arduino, sensors, ICs, connectors, tools...
            </span>
            <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Actions: Account, Wishlist, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Icon */}
          <button
            onClick={openSearch}
            className="lg:hidden p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            title="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Account Button */}
          <button
            onClick={openAccount}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100/80 border border-slate-200/80 transition-all"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Account</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => {
              setActiveTab("home");
              openSearch();
            }}
            className="p-2.5 rounded-full text-slate-600 hover:bg-slate-100/80 transition-colors relative"
            title="Wishlist"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff6a00] to-[#e05d00] text-white text-xs font-extrabold shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            <span className="bg-white/25 px-1.5 py-0.5 rounded-full text-[11px] font-extrabold">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
