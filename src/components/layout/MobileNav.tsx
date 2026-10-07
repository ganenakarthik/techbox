"use client";

import React from "react";
import { Home, Grid, Search, ShoppingCart, User, Wrench } from "lucide-react";

interface MobileNavProps {
  cartCount: number;
  cartTotal: number;
  onSelectCategory: (category: string) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenAccount: () => void;
  onOpenSourcing: () => void;
}

export function MobileNav({
  cartCount,
  cartTotal,
  onSelectCategory,
  onOpenSearch,
  onOpenCart,
  onOpenAccount,
  onOpenSourcing,
}: MobileNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-zinc-200/90 py-2 px-3 flex items-center justify-around text-[10px] font-mono shadow-2xl">
      {/* Home */}
      <button
        onClick={() => onSelectCategory("All Categories")}
        className="flex flex-col items-center gap-1 text-zinc-600 hover:text-[#ff6a00] cursor-pointer"
      >
        <Home className="w-5 h-5 text-[#ff6a00]" />
        <span>Home</span>
      </button>

      {/* Shop Categories */}
      <button
        onClick={() => onSelectCategory("Microcontrollers")}
        className="flex flex-col items-center gap-1 text-zinc-600 hover:text-[#ff6a00] cursor-pointer"
      >
        <Grid className="w-5 h-5 text-zinc-600" />
        <span>Shop</span>
      </button>

      {/* Search Floating Workspace Trigger */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center gap-1 text-zinc-600 hover:text-[#ff6a00] cursor-pointer"
      >
        <div className="p-2 -mt-4 bg-[#ff6a00] text-white rounded-full shadow-lg border-2 border-white">
          <Search className="w-5 h-5" />
        </div>
        <span>Search</span>
      </button>

      {/* Sourcing */}
      <button
        onClick={onOpenSourcing}
        className="flex flex-col items-center gap-1 text-zinc-600 hover:text-[#ff6a00] cursor-pointer"
      >
        <Wrench className="w-5 h-5 text-amber-500" />
        <span>Sourcing</span>
      </button>

      {/* Cart */}
      <button
        onClick={onOpenCart}
        className="flex flex-col items-center gap-1 text-zinc-600 hover:text-[#ff6a00] relative cursor-pointer"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 text-[#ff6a00]" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#ff6a00] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
              {cartCount}
            </span>
          )}
        </div>
        <span>Cart (₹{cartTotal})</span>
      </button>
    </div>
  );
}
