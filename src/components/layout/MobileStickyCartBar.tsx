"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, ArrowRight } from "lucide-react";

export function MobileStickyCartBar() {
  const pathname = usePathname();
  const { cart, cartCount, subtotal, setIsCartDrawerOpen } = useApp();

  // Hide on checkout, cart, or admin pages, or if cart is empty
  const isHiddenPage =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/admin");

  if (cartCount === 0 || isHiddenPage) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-40 md:hidden">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#ff6a00] flex items-center justify-center text-white font-black shrink-0 shadow-md">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{cartCount} {cartCount === 1 ? "Item" : "Items"}</span>
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="text-[#ff6a00] font-black">₹{subtotal}</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Campus Fast-Track Dispatch Ready
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
