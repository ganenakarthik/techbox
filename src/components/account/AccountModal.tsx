"use client";

import React, { useState } from "react";
import { ComponentItem } from "@/data/componentsCatalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { User, Package, Heart, X, CheckCircle2, Clock } from "lucide-react";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "account" | "wishlist";
  wishlistIds: string[];
  catalog: ComponentItem[];
  cartItems: { [key: string]: number };
  onAddToCart: (id: string, name: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onToggleWishlist: (id: string) => void;
  onQuickView: (product: ComponentItem) => void;
}

export function AccountModal({
  isOpen,
  onClose,
  initialTab = "account",
  wishlistIds,
  catalog,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onQuickView,
}: AccountModalProps) {
  if (!isOpen) return null;

  const [tab, setTab] = useState<"account" | "wishlist">(initialTab);

  const wishlistedProducts = catalog.filter((item) => wishlistIds.includes(item.id));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative border border-zinc-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-3 text-xs font-mono font-bold">
          <button
            onClick={() => setTab("account")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              tab === "account"
                ? "bg-[#ff6a00] text-white shadow-md"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            My Account & Gate Orders
          </button>
          <button
            onClick={() => setTab("wishlist")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === "wishlist"
                ? "bg-[#ff6a00] text-white shadow-md"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Wishlist ({wishlistedProducts.length})</span>
          </button>
        </div>

        {tab === "account" ? (
          <div className="space-y-6 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#ff6a00] text-white font-black text-lg flex items-center justify-center">
                KG
              </div>
              <div>
                <div className="font-bold text-zinc-900 text-sm font-sans">Karthik Ganena</div>
                <div className="text-zinc-500 text-[11px]">Campus Gate Lab Account • Verified Engineer</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">Recent Campus Gate Orders</h4>
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-2">
                <div className="flex items-center justify-between text-zinc-900 font-bold">
                  <span>Order #PTS-2026-9812</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Gate Dispatch Active</span>
                </div>
                <div className="text-zinc-600 text-[11px]">Items: ESP32 DevKit V1 (x2), MPU6050 Gyro (x1)</div>
                <div className="flex justify-between text-[#ff6a00] font-black pt-1">
                  <span>Total: ₹927</span>
                  <span>Estimated Handoff: 12 Mins</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-mono font-bold text-xs text-zinc-500 uppercase">
              Your Wishlisted Engineering Components ({wishlistedProducts.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQuantity={cartItems[product.id] || 0}
                  isWishlisted={true}
                  onAddToCart={onAddToCart}
                  onUpdateQuantity={onUpdateQuantity}
                  onToggleWishlist={onToggleWishlist}
                  onQuickView={onQuickView}
                />
              ))}
            </div>

            {wishlistedProducts.length === 0 && (
              <div className="text-center py-12 text-zinc-500 font-mono space-y-2">
                <Heart className="w-8 h-8 mx-auto text-zinc-300" />
                <p className="text-xs font-bold">No components in your wishlist.</p>
                <p className="text-[11px] text-zinc-400">Click the heart icon on any card to save parts.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
