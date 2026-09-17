"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  Boxes,
  Cpu,
} from "lucide-react";

export default function CartPage() {
  const {
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
  const deliveryFee = remainingForFree === 0 ? 0 : 40;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#141414] border border-[#262626] flex items-center justify-center mx-auto mb-6 text-neutral-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Your Project Cart is Empty</h1>
        <p className="text-sm text-neutral-400 max-w-md mx-auto mb-8">
          Browse verified microcontrollers and sensors or upload a project document to auto-detect hardware requirements.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/shop"
            className="py-3 px-6 bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#ff6a00]/20 transition-all"
          >
            Shop Components
          </Link>
          <Link
            href="/build"
            className="py-3 px-6 bg-[#161616] hover:bg-[#222222] border border-[#2a2a2a] text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Upload Project Document
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-black text-white mb-8">
        Your Project Cart ({cart.reduce((t, i) => t + i.quantity, 0)} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Banner */}
          <div className="p-4 rounded-2xl bg-[#111111] border border-[#262626] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <Truck className="w-4 h-4 text-[#ff6a00]" />
                <span>Campus Delivery: <strong className="text-white">{selectedCollege.name}</strong></span>
              </div>
              {cart.length === 0 ? (
                <span className="text-neutral-500 font-medium">
                  Free delivery threshold: <strong className="text-white">₹499</strong>
                </span>
              ) : remainingForFree > 0 ? (
                <span className="text-neutral-400 font-medium">
                  Add <strong className="text-[#ff6a00]">₹{remainingForFree}</strong> more for FREE campus dispatch
                </span>
              ) : (
                <span className="text-[#22c55e] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> FREE Delivery Active
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-full overflow-hidden">
              {subtotal > 0 && (
                <div
                  className="h-full bg-gradient-to-r from-[#ff6a00] via-[#ff8533] to-[#ffaa66] rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(255,106,0,0.4)]"
                  style={{ width: `${Math.min(Math.max(freeDeliveryProgress, 5), 100)}%` }}
                />
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
              <span>{subtotal > 0 ? `₹${subtotal} in cart` : "Cart empty (0%)"}</span>
              <span className={remainingForFree === 0 ? "text-[#22c55e] font-bold" : "text-neutral-400"}>
                {remainingForFree === 0 ? "100% Unlocked" : "₹499 Goal"}
              </span>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#111111] border border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-16 h-16 rounded-xl bg-[#181818] border border-[#262626] overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-mono text-[#ff6a00]">
                      {item.isKit ? "PROJECT KIT" : item.sku}
                    </div>
                    <h3 className="text-sm font-bold text-white truncate max-w-md mt-0.5">
                      {item.name}
                    </h3>
                    <div className="text-xs font-bold text-white mt-1">
                      ₹{item.price} each
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 shrink-0">
                  {/* Quantity Control */}
                  <div className="flex items-center bg-[#181818] border border-[#262626] rounded-xl">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-neutral-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-neutral-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-white">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-neutral-500 hover:text-[#ef4444] rounded-lg hover:bg-[#1a1a1a] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626] shadow-2xl space-y-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Order Summary
            </h2>

            {/* Coupon field */}
            {!couponCode ? (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon code (e.g. PARTSLY10)"
                    className="w-full bg-[#161616] border border-[#262626] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
                <button
                  onClick={() => {
                    if (inputCoupon) applyCoupon(inputCoupon);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] text-white text-xs font-semibold"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-xs">
                <span className="font-semibold text-white">Coupon {couponCode} applied</span>
                <button onClick={removeCoupon} className="text-neutral-400 hover:text-white underline">
                  Remove
                </button>
              </div>
            )}

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs text-neutral-400">
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
                <span>Campus Dispatch Fee</span>
                <span className={deliveryFee === 0 ? "text-[#22c55e] font-semibold" : "text-white"}>
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-[#262626]">
                <span>Total Amount</span>
                <span className="text-[#ff6a00] text-xl">₹{total}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all"
            >
              <span>Proceed to Campus Delivery Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-2 border-t border-[#1c1c1c]">
              <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0" />
              <span>Campus payment guarantee • Test Mode & COD supported</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
