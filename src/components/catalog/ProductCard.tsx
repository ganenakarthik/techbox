"use client";

import React from "react";
import { ComponentItem } from "@/data/componentsCatalog";
import { Star, Heart, Eye, Plus, Minus, ShoppingCart, Check } from "lucide-react";

interface ProductCardProps {
  product: ComponentItem;
  cartQuantity: number;
  isWishlisted: boolean;
  onAddToCart: (id: string, name: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onToggleWishlist: (id: string) => void;
  onQuickView: (product: ComponentItem) => void;
}

export function ProductCard({
  product,
  cartQuantity,
  isWishlisted,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onQuickView,
}: ProductCardProps) {
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 hover:border-[#ff6a00]/70 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col justify-between p-4 group relative">
      {/* Top Badges & Wishlist Trigger */}
      <div className="space-y-3">
        <div className="relative h-44 w-full bg-zinc-50/80 rounded-xl overflow-hidden flex items-center justify-center p-3 border border-zinc-100/90 group/img">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain rounded group-hover/img:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => onQuickView(product)}
          />

          {/* Quick View Spec Sheet Button */}
          <button
            onClick={() => onQuickView(product)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] text-white text-xs font-bold opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer rounded-xl"
          >
            <Eye className="w-4 h-4 text-[#ff6a00]" />
            <span>Quick Specs Sheet</span>
          </button>

          {/* Badges */}
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#ff6a00] text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          )}

          {product.badge && (
            <span className="absolute top-2 left-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-900 text-white shadow-xs" style={{ left: discountPercent > 0 ? "4.5rem" : "0.5rem" }}>
              {product.badge}
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors backdrop-blur-md cursor-pointer ${
              isWishlisted
                ? "bg-red-50 text-red-500 border border-red-200"
                : "bg-white/80 text-zinc-400 hover:text-red-500 border border-zinc-200/80"
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Product Details Header */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="font-bold text-zinc-600 uppercase tracking-wide">{product.manufacturer}</span>
            <span className="truncate max-w-[120px]">SKU: {product.sku}</span>
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-zinc-900 text-sm leading-tight group-hover:text-[#ff6a00] transition-colors line-clamp-2 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Stock Indicator & Rating */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 font-bold">In Stock</span>
              <span className="text-zinc-400 font-normal">({product.inStockCount} units)</span>
            </div>

            <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-800 text-[11px] font-bold border border-emerald-200/60">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
            </div>
          </div>

          {/* Key Specs Pills */}
          <p className="text-[11px] text-zinc-500 font-mono line-clamp-2 leading-relaxed pt-1">
            {product.specs}
          </p>
        </div>
      </div>

      {/* Pricing & Add to Cart Controls */}
      <div className="space-y-3 pt-3 border-t border-zinc-100 mt-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-zinc-950">₹{product.price}</span>
            <span className="text-xs text-zinc-400 line-through">₹{product.originalPrice}</span>
          </div>
          <button
            onClick={() => onQuickView(product)}
            className="text-[11px] text-emerald-600 font-bold hover:underline flex items-center gap-1 font-mono"
          >
            Specs →
          </button>
        </div>

        {cartQuantity === 0 ? (
          <button
            onClick={() => onAddToCart(product.id, product.name)}
            className="w-full py-2.5 rounded-xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-orange-500/20 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        ) : (
          <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#ff6a00]">
            <button
              onClick={() => onUpdateQuantity(product.id, -1)}
              className="p-1 hover:bg-orange-100 rounded-lg text-[#ff6a00] cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono">{cartQuantity} in Cart</span>
            <button
              onClick={() => onUpdateQuantity(product.id, 1)}
              className="p-1 hover:bg-orange-100 rounded-lg text-[#ff6a00] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
