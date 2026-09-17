"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export function FloatingCartBar() {
  const { cart, cartCount, subtotal, setIsCartDrawerOpen, freeDeliveryThreshold, freeDeliveryProgress } = useApp();

  if (!cart || cart.length === 0) {
    return null;
  }

  const isFreeDelivery = subtotal >= freeDeliveryThreshold;

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none flex justify-center">
      <div className="pointer-events-auto w-full max-w-3xl bg-slate-950/95 backdrop-blur-md text-slate-900 rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-800 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
        {/* Left Side: Summary & Savings */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          </div>

          <div className="truncate">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-black text-slate-900">
                â‚¹{subtotal.toFixed(0)}
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                ({cartCount} {cartCount === 1 ? "item" : "items"})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold truncate">
              {isFreeDelivery ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Free Campus Runner Dispatch Unlocked!</span>
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400" />
                  <span className="text-slate-300">
                    Add â‚¹{(freeDeliveryThreshold - subtotal).toFixed(0)} more for Free Campus Delivery
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-97 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
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