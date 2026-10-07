"use client";

import React from "react";
import { ComponentItem } from "@/data/componentsCatalog";
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { [key: string]: number };
  catalog: ComponentItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  catalog,
  onUpdateQuantity,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const cartEntries = Object.entries(cartItems).filter(([_, qty]) => qty > 0);
  const totalCount = cartEntries.reduce((sum, [_, qty]) => sum + qty, 0);

  const subtotal = cartEntries.reduce((sum, [id, qty]) => {
    const p = catalog.find((c) => c.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const originalTotal = cartEntries.reduce((sum, [id, qty]) => {
    const p = catalog.find((c) => c.id === id);
    return sum + (p ? p.originalPrice * qty : 0);
  }, 0);

  const totalSavings = originalTotal - subtotal;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto border-l border-white/60">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-100 text-[#ff6a00]">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-zinc-950">Engineering Cart</h2>
                <div className="text-xs text-zinc-500 font-mono">{totalCount} Item(s) Selected</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="space-y-3">
            {cartEntries.map(([id, qty]) => {
              const item = catalog.find((c) => c.id === id);
              if (!item) return null;

              return (
                <div
                  key={id}
                  className="p-3.5 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 flex items-center justify-between gap-3 shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-contain rounded-lg border border-zinc-200/60 bg-white p-1"
                  />

                  <div className="space-y-0.5 flex-1">
                    <div className="font-bold text-xs text-zinc-950 line-clamp-1">{item.name}</div>
                    <div className="text-[10px] font-mono text-zinc-400">SKU: {item.sku}</div>
                    <div className="text-xs text-[#ff6a00] font-black font-mono">₹{item.price * qty}</div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-white border border-zinc-300/80 rounded-xl px-2 py-1 text-xs font-bold shadow-xs">
                    <button
                      onClick={() => onUpdateQuantity(id, -1)}
                      className="text-zinc-600 hover:text-[#ff6a00] cursor-pointer"
                    >
                      {qty === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="font-mono">{qty}</span>
                    <button
                      onClick={() => onUpdateQuantity(id, 1)}
                      className="text-zinc-600 hover:text-[#ff6a00] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {totalCount === 0 && (
              <div className="text-center py-16 text-zinc-500 space-y-2">
                <ShoppingCart className="w-10 h-10 mx-auto text-zinc-300" />
                <p className="text-xs font-bold text-zinc-700">Your engineering cart is empty.</p>
                <p className="text-[11px] text-zinc-400">Search components and add parts to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Summary */}
        {totalCount > 0 && (
          <div className="pt-6 border-t border-zinc-200/80 space-y-4 font-mono">
            {totalSavings > 0 && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>You save ₹{totalSavings} on this order!</span>
              </div>
            )}

            <div className="space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalCount} items):</span>
                <span className="font-bold text-zinc-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>10-30 Min Gate Delivery:</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-base text-zinc-950 font-black pt-2 border-t border-zinc-200 font-sans">
                <span>Total Amount:</span>
                <span className="text-[#ff6a00]">₹{subtotal}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-4 rounded-2xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
