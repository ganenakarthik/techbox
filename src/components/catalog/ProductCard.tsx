"use client";

import React from "react";
import { ComponentItem } from "@/data/componentsCatalog";
import { Star, Heart, Plus, Minus } from "lucide-react";

interface ProductCardProps {
  product: ComponentItem;
  cartQuantity: number;
  isWishlisted: boolean;
  onAddToCart: (id: string, name: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onToggleWishlist: (id: string) => void;
  onSelectProduct?: (product: ComponentItem) => void;
  onQuickView?: (product: ComponentItem) => void;
}

export function ProductCard({
  product,
  cartQuantity,
  isWishlisted,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onSelectProduct,
  onQuickView,
}: ProductCardProps) {
  const handleSelect = () => {
    if (onSelectProduct) onSelectProduct(product);
    if (onQuickView) onQuickView(product);
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#ff6a00]/70 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col justify-between p-4 group relative">
      {/* Top Image Box & Wishlist Heart */}
      <div className="space-y-3">
        <div
          onClick={handleSelect}
          className="relative h-44 w-full bg-slate-50/80 rounded-xl overflow-hidden flex items-center justify-center p-3 border border-slate-100/90 cursor-pointer group/img"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain rounded group-hover/img:scale-105 transition-transform duration-300"
          />

          {/* Wishlist Heart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors backdrop-blur-md cursor-pointer ${
              isWishlisted
                ? "bg-red-50 text-red-500 border border-red-200"
                : "bg-white/80 text-slate-400 hover:text-red-500 border border-slate-200/80"
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Product Details Header */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            {product.manufacturer}
          </div>

          <h3
            onClick={handleSelect}
            className="font-bold text-slate-900 text-sm leading-snug group-hover:text-[#ff6a00] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-extrabold text-slate-950">₹{product.price}</span>

            {/* Stock indicator */}
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Stock ({product.inStockCount})</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-0.5">
            <span className="font-bold text-slate-800">{product.rating}</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>({product.reviewCount})</span>
          </div>

          {/* Short Specs */}
          <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed pt-1">
            {product.specs}
          </p>
        </div>
      </div>

      {/* Pricing & Add to Cart Controls */}
      <div className="pt-3 border-t border-slate-100 mt-3">
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
