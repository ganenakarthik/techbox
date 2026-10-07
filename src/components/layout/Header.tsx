"use client";

import React from "react";
import { Search, ShoppingCart, Heart, Package, User, Sparkles, ChevronDown } from "lucide-react";
import { PartslyLogo } from "@/components/ui/Logo";

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onOpenSourcing: () => void;
  onOpenServices: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Header({
  cartCount,
  cartTotal,
  wishlistCount,
  selectedCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onOpenSourcing,
  onOpenServices,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-zinc-200/80 shadow-sm transition-all">
      {/* Top Banner Notice */}
      <div className="bg-[#0f172a] text-white text-[11px] py-1.5 px-4 font-mono flex items-center justify-between border-b border-zinc-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3 text-zinc-300">
            <span className="inline-flex items-center gap-1.5 text-[#ff6a00] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#ff6a00] animate-ping" />
              Express Hardware Platform
            </span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline text-emerald-400 font-bold">
              10-30 Min Gate Delivery to Campus Labs
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
            <button onClick={onOpenSourcing} className="hover:text-white transition-colors cursor-pointer">
              Custom Part Sourcing
            </button>
            <span className="text-zinc-700">|</span>
            <button onClick={onOpenServices} className="hover:text-white transition-colors cursor-pointer">
              PCB & 3D Print Quote
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => onSelectCategory("All Categories")}
          className="cursor-pointer text-left shrink-0"
        >
          <PartslyLogo />
        </button>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-zinc-700">
          <button
            onClick={() => onSelectCategory("All Categories")}
            className={`transition-colors cursor-pointer ${
              selectedCategory === "All Categories" ? "text-[#ff6a00]" : "hover:text-[#ff6a00]"
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => onSelectCategory("Microcontrollers")}
            className="hover:text-[#ff6a00] transition-colors cursor-pointer"
          >
            Categories
          </button>
          <button
            onClick={onOpenServices}
            className="hover:text-[#ff6a00] transition-colors cursor-pointer flex items-center gap-1"
          >
            Services <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-100 text-[#ff6a00]">Fab</span>
          </button>
          <button
            onClick={onOpenSourcing}
            className="hover:text-[#ff6a00] transition-colors cursor-pointer flex items-center gap-1"
          >
            Sourcing <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">Request</span>
          </button>
        </nav>

        {/* Central Search Bar */}
        <div className="flex-1 max-w-xl mx-2 relative hidden md:block">
          <div
            onClick={onOpenSearch}
            className="w-full bg-zinc-100/80 hover:bg-zinc-100 border border-zinc-200/90 rounded-full py-2 px-4 flex items-center justify-between gap-3 text-xs text-zinc-500 cursor-pointer shadow-inner transition-all hover:shadow"
          >
            <div className="flex items-center gap-2 text-zinc-400 flex-1 truncate">
              <Search className="w-4 h-4 text-[#ff6a00]" />
              <span className="truncate">
                {searchQuery || "Search components, modules, ICs, tools, laptop parts..."}
              </span>
            </div>
            <kbd className="hidden xl:inline-flex items-center gap-1 font-mono text-[10px] bg-white border border-zinc-200 text-zinc-400 px-2 py-0.5 rounded-md shadow-xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Orders */}
          <button
            onClick={onOpenAccount}
            className="hidden sm:flex flex-col text-right text-xs cursor-pointer group"
          >
            <span className="text-[10px] text-zinc-400 font-mono">My Account</span>
            <span className="font-bold text-zinc-900 group-hover:text-[#ff6a00] transition-colors flex items-center gap-1">
              Orders & Specs <ChevronDown className="w-3 h-3 text-zinc-400" />
            </span>
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="p-2 text-zinc-600 hover:text-red-500 hover:bg-zinc-100 rounded-full transition-colors relative cursor-pointer"
            title="Saved Components"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-white text-[#ff6a00] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
            <span className="font-black border-l border-orange-400/80 pl-2">
              ₹{cartTotal}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
