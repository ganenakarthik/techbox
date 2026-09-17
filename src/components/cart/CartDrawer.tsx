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
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="absolute inset-y-0 right-0 max-w-md w-full bg-white border-l border-slate-200 shadow-2xl flex flex-col z-10 text-slate-900"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#ff6a00]" />
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Your Project Cart ({cart.reduce((t, i) => t + i.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Delivery Threshold Tracker */}
            <div className="p-4 bg-orange-50/40 border-b border-slate-200">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Truck className="w-4 h-4 text-[#ff6a00]" />
                  <span>Campus & Hostel Delivery</span>
                </div>
                {cart.length === 0 ? (
                  <span className="text-slate-500 text-[11px]">
                    Free Delivery over <span className="text-slate-900 font-bold">₹499</span>
                  </span>
                ) : remainingForFree > 0 ? (
                  <span className="text-slate-600 font-medium text-xs">
                    Add <span className="text-[#ff6a00] font-bold">₹{remainingForFree}</span> for FREE
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> FREE Delivery Unlocked
                  </span>
                )}
              </div>

              {/* Progress Track */}
              <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                {subtotal > 0 && (
                  <div
                    className="h-full bg-gradient-to-r from-[#ff6a00] to-[#ea580c] rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${Math.min(Math.max(freeDeliveryProgress, 5), 100)}%` }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
                <span>{subtotal > 0 ? `₹${subtotal} in cart` : "Cart empty (₹0)"}</span>
                <span className={remainingForFree === 0 ? "text-emerald-600 font-bold" : "text-slate-500"}>
                  {remainingForFree === 0 ? "Unlocked!" : "₹499 Goal"}
                </span>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00] mb-4 shadow-xs">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mb-6">
                    Add individual sensors and MCUs, or upload a project document to auto-generate requirements.
                  </p>
                  <div className="flex flex-col gap-2.5 w-full max-w-xs">
                    <Link
                      href="/shop"
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="w-full py-2.5 px-4 bg-[#ff6a00] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl text-center transition-all shadow-xs"
                    >
                      Shop Components
                    </Link>
                    <button
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        window.scrollTo({ top: 400, behavior: "smooth" });
                      }}
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl text-center transition-all"
                    >
                      Upload Project File
                    </button>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 relative group"
                  >
                    <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 relative shadow-2xs">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                          {item.sku}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-slate-900">
                            ₹{item.price * item.quantity}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-[11px] text-slate-400 line-through">
                              ₹{item.originalPrice * item.quantity}
                            </span>
                          )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center bg-white border border-slate-300 rounded-lg shadow-2xs">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-slate-900 text-slate-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-slate-900 text-slate-500"
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
              <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                {/* Coupon Box */}
                {!couponCode ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        placeholder="Coupon (e.g. PARTSLY10)"
                        className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00]"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (inputCoupon) applyCoupon(inputCoupon);
                      }}
                      className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 border border-slate-300 text-xs font-bold text-slate-800 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#ff6a00]" />
                      <span className="font-bold text-[#ff6a00]">{couponCode} applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-slate-500 hover:text-slate-800 text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="text-slate-900 font-bold">₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Campus Delivery</span>
                    <span>{remainingForFree === 0 ? "FREE" : "₹40"}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Estimated Total</span>
                    <span className="text-[#ff6a00]">₹{finalTotal + (remainingForFree === 0 ? 0 : 40)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="py-2.5 px-4 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl text-center transition-colors shadow-2xs"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="py-2.5 px-4 bg-[#ff6a00] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#ff6a00]/20"
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

export default CartDrawer;
