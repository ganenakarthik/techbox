"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { Heart, ShoppingBag, Star, Eye, Check, Plus, Minus, Zap } from "lucide-react";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateCartQuantity, removeFromCart, cart, toggleWishlist, isInWishlist } = useApp();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const defaultVariant = product.variants[0];
  const isWished = isInWishlist(product.id);

  const cartItem = cart.find(
    (item) => item.variantId === defaultVariant?.id || (item.productId === product.id && !item.isKit)
  );
  const cartQty = cartItem?.quantity || 0;

  return (
    <>
      <div
        className="group relative flex flex-col rounded-2xl bg-white border border-slate-200 hover:border-[#ff6a00] transition-all duration-300 hover:shadow-lg overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {defaultVariant?.discount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#ff6a00] text-slate-900 shadow-xs">
                {defaultVariant.discount}% OFF
              </span>
            )}
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-2xs">
              <Zap className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
              <span>10-30m</span>
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`pointer-events-auto p-1.5 rounded-xl transition-all shadow-xs cursor-pointer ${
              isWished
                ? "bg-orange-50 text-[#ff6a00] border border-orange-200"
                : "bg-white/90 text-slate-400 hover:text-slate-800 hover:bg-white border border-slate-200"
            }`}
            title={isWished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${isWished ? "fill-[#ff6a00]" : ""}`} />
          </button>
        </div>

        {/* Product Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block w-full aspect-square bg-slate-50/70 overflow-hidden border-b border-slate-100"
        >
          <Image
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
          />

          {/* Quick Action Overlay on Hover */}
          <div
            className={`absolute inset-x-3 bottom-3 flex items-center gap-2 transition-all duration-200 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md border border-slate-200 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Quick View</span>
            </button>
          </div>
        </Link>

        {/* Content Details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                {product.brand}
              </span>
              <div className="flex items-center gap-1 text-slate-600">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="font-bold text-slate-700">{product.rating}</span>
                <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
              </div>
            </div>

            <Link href={`/products/${product.slug}`}>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#ff6a00] transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1.5">
              <Check className="w-3 h-3" />
              <span>Campus Stock Ready</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">
                  â‚¹{defaultVariant?.price || 0}
                </span>
                {defaultVariant?.mrp > defaultVariant?.price && (
                  <span className="text-xs text-slate-400 line-through">
                    â‚¹{defaultVariant.mrp}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Standard unit</span>
            </div>

            {/* Blinkit / Zepto Style Dynamic Stepper */}
            {cartQty === 0 ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart({
                    product,
                    variant: defaultVariant,
                    quantity: 1,
                    openDrawer: false,
                  });
                }}
                className="px-4 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-500 hover:border-emerald-600 text-xs font-black transition-all flex items-center gap-1 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>ADD</span>
              </button>
            ) : (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex items-center rounded-lg bg-emerald-600 text-slate-900 font-black text-xs shadow-xs border border-emerald-700 overflow-hidden"
              >
                <button
                  onClick={() => {
                    if (cartQty <= 1) {
                      removeFromCart(cartItem!.id);
                    } else {
                      updateCartQuantity(cartItem!.id, cartQty - 1);
                    }
                  }}
                  className="px-2.5 py-1.5 hover:bg-emerald-700 transition-colors flex items-center justify-center cursor-pointer active:scale-90"
                  title="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <span className="px-2 font-black text-xs select-none min-w-[20px] text-center">
                  {cartQty}
                </span>
                <button
                  onClick={() => {
                    updateCartQuantity(cartItem!.id, cartQty + 1);
                  }}
                  className="px-2.5 py-1.5 hover:bg-emerald-700 transition-colors flex items-center justify-center cursor-pointer active:scale-90"
                  title="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isQuickViewOpen && (
        <QuickViewModal
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}

export default ProductCard;