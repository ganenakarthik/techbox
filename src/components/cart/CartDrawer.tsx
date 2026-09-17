"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    subtotal,
    freeDeliveryThreshold,
    freeDeliveryProgress,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
    selectedCollege,
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState("");
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartDrawerOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="absolute inset-y-0 right-0 max-w-md w-full bg-[#0d0d0d] border-l border-[#262626] shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#111111]/80">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#ff6a00]" />
                <h2 className="text-base font-semibold text-white tracking-wide">
                  Your Project Cart ({cart.reduce((t, i) => t + i.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-[#1a1a1a] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Delivery Threshold Tracker */}
            <div className="p-4 bg-[#141414] border-b border-[#262626]">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                  <Truck className="w-4 h-4 text-[#ff6a00]" />
                  <span>Campus & Hostel Delivery</span>
                </div>
                {cart.length === 0 ? (
                  <span className="text-neutral-500 text-[11px] font-medium">
                    Threshold: <span className="text-white font-semibold">₹499</span>
                  </span>
                ) : remainingForFree > 0 ? (
                  <span className="text-neutral-400 font-medium text-xs">
                    Add <span className="text-[#ff6a00] font-bold">₹{remainingForFree}</span> for FREE
                  </span>
                ) : (
                  <span className="text-[#22c55e] font-bold text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> FREE Delivery Unlocked
                  </span>
                )}
              </div>

              {/* Progress Track with vibrant gradient */}
              <div className="relative w-full h-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-full overflow-hidden">
                {subtotal > 0 && (
                  <div
                    className="h-full bg-gradient-to-r from-[#ff6a00] via-[#ff8533] to-[#ffaa66] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(255,106,0,0.4)]"
                    style={{ width: `${Math.min(Math.max(freeDeliveryProgress, 5), 100)}%` }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-1.5 font-mono">
                <span>{subtotal > 0 ? `₹${subtotal} in cart` : "Cart empty (0%)"}</span>
                <span className={remainingForFree === 0 ? "text-[#22c55e] font-bold" : "text-neutral-400"}>
                  {remainingForFree === 0 ? "Unlocked!" : "₹499 Goal"}
                </span>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-[#171717] border border-[#262626] flex items-center justify-center text-neutral-500 mb-4">
                    <ShoppingBag className="w-8 h-8 text-neutral-600" />
                  </div>
                  <h3 className="text-base font-medium text-white mb-1">Your cart is empty</h3>
                  <p className="text-xs text-neutral-400 max-w-xs mb-6">
                    Add individual sensors and MCUs, or upload a project document to auto-generate requirements.
                  </p>
                  <div className="flex flex-col gap-2.5 w-full max-w-xs">
                    <Link
                      href="/shop"
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="w-full py-2.5 px-4 bg-[#ff6a00] hover:bg-[#ff7a1a] text-black text-sm font-semibold rounded-xl text-center transition-all"
                    >
                      Shop Components
                    </Link>
                    <Link
                      href="/build"
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="w-full py-2.5 px-4 bg-[#171717] hover:bg-[#222222] border border-[#262626] text-white text-sm font-medium rounded-xl text-center transition-all"
                    >
                      Upload Project File
                    </Link>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3 rounded-xl bg-[#141414] border border-[#262626] relative group"
                  >
                    <div className="w-16 h-16 rounded-lg bg-[#1a1a1a] border border-[#262626] overflow-hidden shrink-0 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-500 hover:text-[#ef4444] transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                          {item.sku}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white">
                            ₹{item.price * item.quantity}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-[11px] text-neutral-500 line-through">
                              ₹{item.originalPrice * item.quantity}
                            </span>
                          )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center bg-[#1e1e1e] border border-[#262626] rounded-lg">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-white text-neutral-400"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-white text-neutral-400"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-[#262626] bg-[#111111]/90 space-y-3.5">
                {/* Coupon Box */}
                {!couponCode ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        placeholder="Discount code (e.g. PARTSLY10)"
                        className="w-full bg-[#171717] border border-[#262626] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6a00]"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (inputCoupon) applyCoupon(inputCoupon);
                      }}
                      className="px-3.5 py-2 bg-[#222222] hover:bg-[#2c2c2c] border border-[#333333] text-xs font-semibold text-white rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#ff6a00]" />
                      <span className="font-semibold text-white">{couponCode} applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-neutral-400 hover:text-white text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-neutral-400">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="text-white font-medium">₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#22c55e]">
                      <span>Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Campus Delivery</span>
                    <span>{remainingForFree === 0 ? "FREE" : "₹40"}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#262626]">
                    <span>Estimated Total</span>
                    <span className="text-[#ff6a00]">₹{finalTotal + (remainingForFree === 0 ? 0 : 40)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="py-2.5 px-4 bg-[#1c1c1c] hover:bg-[#262626] border border-[#2e2e2e] text-white text-xs font-semibold rounded-xl text-center transition-colors"
                  >
                    View Cart Page
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="py-2.5 px-4 bg-[#ff6a00] hover:bg-[#ff7a1a] text-black text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#ff6a00]/20"
                  >
                    Checkout <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
