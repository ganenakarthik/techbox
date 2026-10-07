"use client";

import React from "react";
import { ComponentItem } from "@/data/componentsCatalog";

export interface CartItem {
  product: ComponentItem;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const delivery = subtotal >= 999 ? 0 : 79;
  const total = subtotal + delivery;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      {/* Translucent Drawer Box */}
      <div className="liquid-modal w-full max-w-md h-full rounded-none rounded-l-2xl p-6 flex flex-col justify-between shadow-2xl relative">
        {/* Top Drawer Bar */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#ff6a00]/10 flex items-center justify-center text-[#ff6a00] font-bold">
                🛒
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Hardware Cart
                </h2>
                <span className="text-[11px] font-semibold text-slate-400">
                  {cartItems.length} unique items
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            {subtotal >= 999 ? (
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <span>✓</span> Qualified for Free Express Shipping across India!
              </span>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span>Add ₹{999 - subtotal} more for Free Shipping</span>
                  <span>₹{subtotal} / ₹999</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-[#ff6a00] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs space-y-3">
                <div className="text-3xl">📦</div>
                <p className="font-bold text-slate-600">Your shopping cart is currently empty</p>
                <p className="text-[11px]">Explore our hardware catalog and add components to get started.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-contain p-1 rounded-lg bg-slate-50 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                    <div className="text-[10px] font-mono text-slate-400">SKU: {item.product.sku}</div>
                    <div className="text-xs font-black text-slate-900 mt-0.5">
                      ₹{item.product.price} × {item.quantity} = ₹{item.product.price * item.quantity}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      Remove
                    </button>

                    <div className="flex items-center rounded bg-slate-100 border border-slate-200/80 px-1">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 text-center text-xs font-bold text-slate-600 hover:text-slate-900"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 text-center text-xs font-bold text-slate-600 hover:text-slate-900"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Summary & Action */}
        <div className="pt-4 border-t border-slate-200/80 space-y-3 bg-white/60">
          <div className="space-y-1.5 text-xs font-semibold text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="text-slate-900 font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery Fee</span>
              <span className="text-slate-900 font-bold">
                {delivery === 0 ? <span className="text-emerald-600">FREE</span> : `₹${delivery}`}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-sm font-extrabold text-slate-900">
              <span>Total Payable</span>
              <span className="text-[#ff6a00] text-base">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            disabled={cartItems.length === 0}
            onClick={() => {
              onProceedToCheckout();
              onClose();
            }}
            className="w-full liquid-button-primary py-3 text-xs font-extrabold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <span>Proceed to 3-Step UTR Checkout</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
