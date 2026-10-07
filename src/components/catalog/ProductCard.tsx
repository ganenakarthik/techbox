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

  // Extract top 3 specs
  const specPills = [];
  if (product.techSpecs.operatingVoltage) specPills.push(product.techSpecs.operatingVoltage);
  if (product.techSpecs.cpu) specPills.push(product.techSpecs.cpu.split(",")[0]);
  if (product.techSpecs.wifi) specPills.push("Wi-Fi + BLE");
  if (product.techSpecs.interface) specPills.push(product.techSpecs.interface);

  return (
    <div className="liquid-card p-4 flex flex-col justify-between group">
      <div>
        {/* Header: Manufacturer & Wishlist */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">
            {product.manufacturer} • MPN: {product.sku}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="p-1 rounded-full text-slate-300 hover:text-rose-500 transition-colors"
            title="Wishlist"
          >
            <svg
              className={`w-4 h-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : "fill-none stroke-currentColor"}`}
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Image Box on Frosted Glass Surface */}
        <div
          onClick={() => onSelect(product)}
          className="w-full h-36 mb-3 rounded-xl bg-white/70 border border-white/90 flex items-center justify-center p-3 cursor-pointer overflow-hidden group-hover:scale-[1.02] transition-transform duration-200 shadow-2xs"
        >
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Title */}
        <div onClick={() => onSelect(product)} className="cursor-pointer space-y-0.5">
          <h3 className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#ff6a00] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* iOS Frosted Glass Spec Badges */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {specPills.slice(0, 3).map((pill, idx) => (
            <span
              key={idx}
              className="glass-badge px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-700"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Price, Stock, Quantity & Add Button */}
      <div className="pt-2.5 border-t border-slate-200/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-black text-slate-900 tracking-tight">
              ₹{product.price.toLocaleString("en-IN")}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[10px] text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{product.stock}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center rounded-lg bg-white/70 border border-slate-200 p-0.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-5 h-5 rounded text-slate-600 hover:bg-white text-xs font-bold"
            >
              -
            </button>
            <span className="w-5 text-center text-xs font-bold text-slate-800">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-5 h-5 rounded text-slate-600 hover:bg-white text-xs font-bold"
            >
              +
            </button>
          </div>

          <button
            onClick={() => onAddToCart(product, quantity)}
            className="flex-1 liquid-button-primary py-2 text-xs font-extrabold flex items-center justify-center gap-1 shadow-xs"
          >
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
