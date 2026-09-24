"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export function FloatingCartBar() {
  const { cart, cartCount, subtotal, setIsCartDrawerOpen, freeDeliveryThreshold } = useApp();

  if (!cart || cart.length === 0) {
    return null;
  }

  const isFreeDelivery = subtotal >= freeDeliveryThreshold;

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none flex justify-center">
      <div className="pointer-events-auto w-full max-w-2xl bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-800 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
        {/* Left Side: Summary & Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff6a00] to-[#ea580c] text-white shrink-0 shadow-md shadow-[#ff6a00]/25">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-[#ff6a00] font-black text-[11px] flex items-center justify-center shadow-md">
              {cartCount}
            </span>
          </div>

          <div className="truncate">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-white">
                ₹{subtotal.toFixed(0)}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                ({cartCount} {cartCount === 1 ? "item" : "items"})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold truncate">
              {isFreeDelivery ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  Free Campus Runner Dispatch Unlocked!
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1 truncate">
                  <Zap className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                  Add ₹{(freeDeliveryThreshold - subtotal).toFixed(0)} for Free Delivery
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Partsly Orange CTA Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] active:scale-95 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#ff6a00]/30 transition-all cursor-pointer"
          >
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FloatingCartBar;