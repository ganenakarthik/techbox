"use client";

import React from "react";
import { Search, ShoppingCart, Heart, Package, User } from "lucide-react";
import { PartslyLogo } from "@/components/ui/Logo";

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
}

export function Header({
  currentView,
  onNavigate,
  cartCount,
  wishlistCount,
  searchQuery,
  setSearchQuery,
  onOpenSearch,
  onOpenCart,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 liquid-glass-header transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div onClick={() => onNavigate("home")}>
          <PartslyLogo />
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-700">
          <button
            onClick={() => onNavigate("home")}
            className={`transition-colors cursor-pointer ${
              currentView === "home" ? "text-[#ff6a00] font-bold" : "hover:text-[#ff6a00]"
            }`}
          >
            Categories
          </button>

          <button
            onClick={() => onNavigate("search")}
            className={`transition-colors cursor-pointer ${
              currentView === "search" ? "text-[#ff6a00] font-bold" : "hover:text-[#ff6a00]"
            }`}
          >
            Shop
          </button>

          <button
            onClick={() => onNavigate("services")}
            className={`transition-colors cursor-pointer ${
              currentView === "services" ? "text-[#ff6a00] font-bold" : "hover:text-[#ff6a00]"
            }`}
          >
            Services
          </button>

          <button
            onClick={() => onNavigate("sourcing")}
            className={`transition-colors cursor-pointer ${
              currentView === "sourcing" ? "text-[#ff6a00] font-bold" : "hover:text-[#ff6a00]"
            }`}
          >
            Sourcing
          </button>
        </nav>

        {/* Large Central Search Input Pill */}
        <div className="flex-1 max-w-md mx-2 relative hidden lg:block">
          <div
            onClick={onOpenSearch}
            className="w-full liquid-glass-search rounded-full py-2 px-4 flex items-center justify-between gap-2 text-xs text-slate-600 cursor-pointer transition-all hover:border-[#ff6a00]/50 shadow-xs"
          >
            <div className="flex items-center gap-2 text-slate-400 flex-1 truncate">
              <Search className="w-4 h-4 text-slate-400" />
              <span className="truncate">Search components, modules, ICs, tools...</span>
            </div>
          </div>
        </div>

        {/* Right Icon Actions */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 shrink-0">
          <button
            onClick={() => onNavigate("account")}
            className="hidden sm:flex items-center gap-1.5 hover:text-[#ff6a00] transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4 text-slate-600" />
            <span>Orders</span>
          </button>

          <button
            onClick={() => onNavigate("account")}
            className="p-1.5 text-slate-600 hover:text-red-500 transition-colors relative cursor-pointer"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Icon with Badge */}
          <button
            onClick={onOpenCart}
            className="p-1.5 text-slate-700 hover:text-[#ff6a00] transition-colors relative cursor-pointer"
            title="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-[#ff6a00] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => onNavigate("account")}
            className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#ff6a00]/50 transition-all"
            title="Account"
          >
            <User className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
