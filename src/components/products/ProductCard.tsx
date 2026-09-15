"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { Heart, ShoppingBag, Star, Eye, Zap } from "lucide-react";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const defaultVariant = product.variants[0];
  const isWished = isInWishlist(product.id);

  return (
    <>
      <div
        className="group relative flex flex-col rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#ff6a00]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#ff6a00]/5 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {defaultVariant.discount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#ff6a00] text-black shadow-md">
                {defaultVariant.discount}% OFF
              </span>
            )}
            {product.isFeatured && (
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-[#1f1f1f] text-neutral-300 border border-[#2e2e2e]">
                Popular
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className={`pointer-events-auto p-2 rounded-xl transition-all backdrop-blur-md ${
              isWished
                ? "bg-[#ff6a00]/20 text-[#ff6a00] border border-[#ff6a00]/40"
                : "bg-black/50 text-neutral-400 hover:text-white hover:bg-black/80"
            }`}
            title={isWished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${isWished ? "fill-[#ff6a00]" : ""}`} />
          </button>
        </div>

        {/* Product Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block w-full aspect-square bg-[#161616] overflow-hidden"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
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
                setIsQuickViewOpen(true);
              }}
              className="flex-1 py-2 px-3 bg-black/85 hover:bg-black text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 backdrop-blur-md border border-[#333333] transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              <span>Quick Specs</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart({ product, variant: defaultVariant });
              }}
              className="p-2 bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold rounded-xl shadow-lg transition-all"
              title="Quick Add"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </Link>

        {/* Content Details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
              <span>{product.brand}</span>
              <div className="flex items-center gap-1 text-neutral-300">
                <Star className="w-3 h-3 text-[#ff6a00] fill-[#ff6a00]" />
                <span className="font-semibold text-white">{product.rating}</span>
                <span className="text-neutral-500">({product.reviewCount})</span>
              </div>
            </div>

            <Link href={`/products/${product.slug}`}>
              <h3 className="text-xs font-semibold text-neutral-100 group-hover:text-[#ff6a00] transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="mt-3 pt-3 border-t border-[#1c1c1c] flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-white">
                ₹{defaultVariant.price}
              </span>
              {defaultVariant.mrp > defaultVariant.price && (
                <span className="text-xs text-neutral-500 line-through">
                  ₹{defaultVariant.mrp}
                </span>
              )}
            </div>

            <button
              onClick={() => addToCart({ product, variant: defaultVariant })}
              className="px-2.5 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#ff6a00] text-neutral-300 hover:text-black text-xs font-semibold border border-[#2a2a2a] hover:border-[#ff6a00] transition-all flex items-center gap-1"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Add</span>
            </button>
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
