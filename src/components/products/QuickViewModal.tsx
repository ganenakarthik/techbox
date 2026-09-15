"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductVariant } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { X, Star, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart, selectedCollege } = useApp();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-3xl bg-[#111111] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Gallery */}
        <div className="md:w-1/2 p-6 bg-[#0e0e0e] border-b md:border-b-0 md:border-r border-[#262626] flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-xl bg-[#161616] border border-[#262626] overflow-hidden mb-4">
            <Image
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden border ${
                    activeImageIndex === idx ? "border-[#ff6a00]" : "border-[#262626] opacity-60"
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Specs */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-[#ff6a00] uppercase tracking-wider">
                  {product.category}
                </span>
                <h2 className="text-base font-bold text-white mt-1 leading-snug">
                  {product.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-[#1a1a1a]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center gap-1 text-[#ff6a00]">
                <Star className="w-3.5 h-3.5 fill-[#ff6a00]" />
                <span className="font-bold text-white">{product.rating}</span>
              </div>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400">{product.reviewCount} college lab reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-2xl font-black text-white">
                ₹{selectedVariant.price}
              </span>
              {selectedVariant.mrp > selectedVariant.price && (
                <span className="text-sm text-neutral-500 line-through">
                  ₹{selectedVariant.mrp}
                </span>
              )}
              {selectedVariant.discount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-[#ff6a00]/15 text-[#ff6a00] border border-[#ff6a00]/30">
                  {selectedVariant.discount}% OFF
                </span>
              )}
            </div>

            {/* Variants Selector */}
            {product.variants.length > 1 && (
              <div className="mt-4">
                <label className="text-xs font-semibold text-neutral-300 block mb-2">
                  Select Package / Variant:
                </label>
                <div className="space-y-1.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                        selectedVariant.id === v.id
                          ? "bg-[#ff6a00]/10 border-[#ff6a00] text-white font-medium"
                          : "bg-[#141414] border-[#262626] text-neutral-300 hover:border-[#333333]"
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="font-bold">₹{v.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Specs Highlight */}
            <div className="mt-4 p-3 rounded-xl bg-[#141414] border border-[#222222]">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Key Technical Parameters
              </div>
              <div className="space-y-1 text-xs">
                {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-neutral-400">{key}:</span>
                    <span className="text-neutral-200 font-medium text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-[#22c55e]">
              <ShieldCheck className="w-4 h-4" />
              <span>In stock • Dispatched to {selectedCollege.code} in 24h</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-[#262626] mt-4 flex items-center gap-3">
            <button
              onClick={() => {
                addToCart({ product, variant: selectedVariant });
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#ff6a00]/20 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Project Cart</span>
            </button>
            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="py-3 px-4 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2e2e2e] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <span>Full Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
