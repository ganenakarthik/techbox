"use client";

import React, { useState } from "react";
import { ComponentItem } from "@/data/componentsCatalog";

interface ProductCardProps {
  product: ComponentItem;
  onSelect: (product: ComponentItem) => void;
  onAddToCart: (product: ComponentItem, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: ComponentItem) => void;
}

export function ProductCard({
  product,
  onSelect,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Extract top 3 specs for pills
  const specPills = [];
  if (product.techSpecs.operatingVoltage) specPills.push(product.techSpecs.operatingVoltage);
  if (product.techSpecs.cpu) specPills.push(product.techSpecs.cpu.split(",")[0]);
  if (product.techSpecs.wifi) specPills.push("Wi-Fi");
  if (product.techSpecs.interface) specPills.push(product.techSpecs.interface);
  if (product.techSpecs.sensorType) specPills.push(product.techSpecs.sensorType.split(" ")[0]);

  return (
    <div className="liquid-card p-4 flex flex-col justify-between group">
      {/* Top Badge & Wishlist Button */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {product.badge ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20">
              {product.badge}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {product.manufacturer}
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 shadow-xs transition-colors"
            title="Add to Wishlist"
          >
            <svg
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? "fill-rose-500 text-rose-500" : "fill-none stroke-currentColor"
              }`}
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Product Image Container */}
        <div
          onClick={() => onSelect(product)}
          className="relative w-full h-40 mb-3 rounded-xl bg-slate-50/80 border border-slate-200/50 flex items-center justify-center p-3 cursor-pointer overflow-hidden group-hover:scale-[1.02] transition-transform duration-300"
        >
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-xs">
              Loading component image...
            </div>
          )}
        </div>

        {/* Product Title & SKU */}
        <div onClick={() => onSelect(product)} className="cursor-pointer space-y-1">
          <div className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-tight">
            SKU: {product.sku}
          </div>
          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#ff6a00] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Technical Specification Pills */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {specPills.slice(0, 3).map((pill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/80 text-slate-600 border border-slate-200/80 shadow-2xs"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Details: Stock, Price, Quantity & Add Button */}
      <div className="pt-2 border-t border-slate-200/60 space-y-3">
        {/* Stock Status Indicator */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                product.inStockCount > 20
                  ? "bg-emerald-500 animate-pulse"
                  : product.inStockCount > 0
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
            />
            <span className="text-[11px] font-semibold text-slate-600">
              {product.stock} ({product.inStockCount} available)
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
            ★ {product.rating} <span className="text-slate-400 font-normal">({product.reviewCount})</span>
          </span>
        </div>

        {/* Price Tag */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-slate-900 tracking-tight">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through font-medium">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Controls: Quantity Selector + Add to Cart */}
        <div className="flex items-center gap-2">
          {/* Quantity Controls */}
          <div className="flex items-center rounded-lg bg-slate-100 border border-slate-200/80 p-0.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-white text-xs font-bold transition-colors"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-bold text-slate-800">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-white text-xs font-bold transition-colors"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(product, quantity)}
            className="flex-1 liquid-button-primary py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
