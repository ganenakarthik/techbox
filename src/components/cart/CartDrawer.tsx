"use client";

import React, { useState } from "react";
import { ComponentItem } from "@/data/componentsCatalog";
import { X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";

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

  const [promoCode, setPromoCode] = useState("");
  const cartEntries = Object.entries(cartItems).filter(([_, qty]) => qty > 0);
  const totalCount = cartEntries.reduce((sum, [_, qty]) => sum + qty, 0);

  const subtotal = cartEntries.reduce((sum, [id, qty]) => {
    const p = catalog.find((c) => c.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const deliveryFee = subtotal > 0 ? 60 : 0;
  const totalAmount = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex justify-end animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-xl liquid-glass-modal h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto border-l border-white/80">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-xl font-black text-slate-950">Your Cart ({totalCount})</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="space-y-4">
            {cartEntries.map(([id, qty]) => {
              const item = catalog.find((c) => c.id === id);
              if (!item) return null;

              return (
                <div
                  key={id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-xl border border-slate-200 bg-white p-1 shrink-0"
                  />

                  <div className="space-y-1 flex-1">
                    <div className="font-bold text-xs text-slate-950 line-clamp-1">{item.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {item.manufacturer} • SKU: {item.sku}
                    </div>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-sm font-extrabold text-slate-950">₹{item.price * qty}</span>
                      <span className="text-[10px] font-semibold text-emerald-700">● In Stock</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(id, -1)}
                      className="text-slate-600 hover:text-[#ff6a00] cursor-pointer"
                    >
                      {qty === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="font-mono px-1">{qty}</span>
                    <button
                      onClick={() => onUpdateQuantity(id, 1)}
                      className="text-slate-600 hover:text-[#ff6a00] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {totalCount === 0 && (
              <div className="text-center py-20 text-slate-500 space-y-2">
                <p className="text-sm font-bold text-slate-700">Your cart is empty.</p>
                <p className="text-xs text-slate-400">Search components and add parts to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Order Summary */}
        {totalCount > 0 && (
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold text-slate-900">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Discount</span>
                <span>-₹0</span>
              </div>
              <div className="flex justify-between text-lg text-slate-950 font-black pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-[#ff6a00]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Promo Code Input Box */}
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#ff6a00]"
              />
              <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer">
                Apply
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-4 rounded-2xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
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
