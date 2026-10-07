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
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full liquid-header px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div onClick={() => setActiveTab("home")}>
          <Logo size="md" />
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => {
              setActiveTab("home");
              const el = document.getElementById("categories-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="hover:text-[#ff6a00] transition-colors"
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("home")}
            className={`transition-colors ${
              activeTab === "home" ? "text-[#ff6a00] font-bold" : "hover:text-[#ff6a00]"
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`transition-colors ${
              activeTab === "services" ? "text-[#ff6a00] font-bold" : "hover:text-[#ff6a00]"
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab("sourcing")}
            className={`transition-colors ${
              activeTab === "sourcing" ? "text-[#ff6a00] font-bold" : "hover:text-[#ff6a00]"
            }`}
          >
            Sourcing
          </button>
        </nav>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            title="Search Products"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Orders Link */}
          <button
            onClick={openAccount}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#ff6a00] transition-colors"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Orders</span>
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={openSearch}
            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors relative"
            title="Wishlist"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors relative"
            title="Shopping Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#ff6a00] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account Avatar */}
          <button
            onClick={openAccount}
            className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 hover:border-[#ff6a00] transition-colors"
          >
            👤
          </button>
        </div>
      </div>
    </header>
  );
}
