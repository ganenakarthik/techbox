"use client";

import React, { useState } from "react";
import { ComponentItem } from "@/data/componentsCatalog";

interface ProductDetailModalProps {
  product: ComponentItem | null;
  onClose: () => void;
  onAddToCart: (product: ComponentItem, quantity: number) => void;
  onBuyNow: (product: ComponentItem, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: ComponentItem) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "pinout" | "compatibility" | "included">("specs");

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      {/* Liquid Glass Modal Box */}
      <div className="liquid-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative flex flex-col gap-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Top Grid: Image Gallery & Purchase Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Product Image */}
          <div className="relative rounded-2xl bg-white p-6 border border-slate-200/80 flex items-center justify-center min-h-[280px] shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[240px] max-w-full object-contain"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ff6a00] text-white shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right: Product Info & Actions */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono font-bold text-[#ff6a00] uppercase tracking-wider">
                {product.manufacturer} • SKU: {product.sku}
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight mt-1">
                {product.name}
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{product.description}</p>
            </div>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                ★ {product.rating} <span className="text-slate-400 font-normal">({product.reviewCount} verified reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{product.stock} ({product.inStockCount} units available)</span>
              </div>
            </div>

            {/* Price Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold block">Unit Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">₹{product.price.toLocaleString("en-IN")}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through font-medium">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center rounded-lg bg-white border border-slate-300 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded text-slate-700 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-extrabold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded text-slate-700 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 liquid-button-secondary py-3 text-xs font-extrabold flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-[#ff6a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => {
                  onBuyNow(product, quantity);
                  onClose();
                }}
                className="flex-1 liquid-button-primary py-3 text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
              >
                <span>Buy Now (Express)</span>
              </button>
            </div>

            {/* Datasheet Link */}
            {product.datasheetUrl && (
              <a
                href={product.datasheetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#ff6a00] hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Official Technical Datasheet (PDF)</span>
              </a>
            )}
          </div>
        </div>

        {/* Tabbed Technical Information */}
        <div className="border-t border-slate-200/80 pt-4">
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
            <button
              onClick={() => setActiveTab("specs")}
              className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-colors ${
                activeTab === "specs"
                  ? "bg-[#ff6a00] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab("pinout")}
              className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-colors ${
                activeTab === "pinout"
                  ? "bg-[#ff6a00] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Pinout & Interfaces
            </button>
            <button
              onClick={() => setActiveTab("compatibility")}
              className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-colors ${
                activeTab === "compatibility"
                  ? "bg-[#ff6a00] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Compatibility & Toolchains
            </button>
            <button
              onClick={() => setActiveTab("included")}
              className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-colors ${
                activeTab === "included"
                  ? "bg-[#ff6a00] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Package Contents
            </button>
          </div>

          <div className="py-4">
            {activeTab === "specs" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(product.techSpecs).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/80">
                    <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">{key}</span>
                    <span className="font-mono font-semibold text-slate-900">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "pinout" && (
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2">
                <div className="text-[#ff6a00] font-bold">Standard 2.54mm Header Pinout Layout</div>
                <p className="text-slate-300">
                  GPIO Pins: 3.3V Logic Level. VIN accepts 5V to 9V DC input with integrated LDO regulator.
                  Supports Hardware UART, SPI, I2C, and PWM Channels.
                </p>
              </div>
            )}

            {activeTab === "compatibility" && (
              <div className="flex flex-wrap gap-2">
                {product.compatibleWith.map((item, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    ✓ {item}
                  </span>
                ))}
              </div>
            )}

            {activeTab === "included" && (
              <ul className="space-y-2 text-xs font-semibold text-slate-700">
                {product.whatsIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#ff6a00] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
