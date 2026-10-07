"use client";

import React, { useState } from "react";
import { ComponentItem } from "@/data/componentsCatalog";
import { Star, X, Plus, Minus, Check, MessageSquare, Download, ShieldCheck, Truck, ExternalLink, Cpu } from "lucide-react";

interface ProductDetailModalProps {
  product: ComponentItem | null;
  onClose: () => void;
  cartQuantity: number;
  onAddToCart: (id: string, name: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
}: ProductDetailModalProps) {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "pinout" | "compatibility">("overview");
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative border border-zinc-200/90 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 cursor-pointer transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Top Product Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Product Image Display */}
          <div className="space-y-3">
            <div className="h-72 w-full bg-zinc-50 rounded-2xl border border-zinc-200/80 p-4 flex items-center justify-center relative overflow-hidden group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#ff6a00] text-white shadow-md">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 px-1">
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                In Stock ({product.inStockCount} Units Available)
              </span>
              <span>SKU: {product.sku}</span>
            </div>
          </div>

          {/* Product Header & Actions */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="font-bold text-[#ff6a00] uppercase tracking-wider">{product.manufacturer}</span>
                <span className="text-zinc-400">•</span>
                <span className="text-zinc-500 uppercase">{product.category}</span>
              </div>
              <h2 className="text-2xl font-black text-zinc-950 leading-tight pt-1">
                {product.name}
              </h2>
              <div className="flex items-center gap-3 pt-2">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-xs font-bold flex items-center gap-1">
                  {product.rating} <Star className="w-3 h-3 fill-current" />
                </span>
                <span className="text-xs text-zinc-500 font-mono">({product.reviewCount} Verified Reviews)</span>
              </div>
            </div>

            {/* Price Banner */}
            <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60">
              <span className="text-3xl font-black text-zinc-950">₹{product.price}</span>
              <span className="text-base text-zinc-400 line-through">₹{product.originalPrice}</span>
              <span className="text-xs font-bold text-[#ff6a00] ml-auto font-mono">
                Free Gate Delivery
              </span>
            </div>

            {/* Quantity Selector & Add / Buy Buttons */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {cartQuantity === 0 ? (
                  <button
                    onClick={() => onAddToCart(product.id, product.name)}
                    className="flex-1 py-3.5 rounded-xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#ff6a00]">
                    <button
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      className="p-1 hover:bg-orange-100 rounded text-[#ff6a00] cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-sm">{cartQuantity} in Cart</span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      className="p-1 hover:bg-orange-100 rounded text-[#ff6a00] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <a
                  href={`https://wa.me/917032635858?text=${encodeURIComponent(`Hi Partsly! I want to order ${product.name} (SKU: ${product.sku}, ₹${product.price}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Buy Now</span>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Zero-DOA Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#ff6a00]" />
                  <span>10-30 Min Gate Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specs & Info Section */}
        <div className="border-t border-zinc-200/80 pt-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-200 text-xs font-bold scrollbar-none overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-4 transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === "overview"
                  ? "border-[#ff6a00] text-[#ff6a00] font-black"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Overview & Compatibility
            </button>

            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-3 px-4 transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === "specs"
                  ? "border-[#ff6a00] text-[#ff6a00] font-black"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Technical Specifications Table
            </button>

            <button
              onClick={() => setActiveTab("pinout")}
              className={`pb-3 px-4 transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === "pinout"
                  ? "border-[#ff6a00] text-[#ff6a00] font-black"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Pinout & Datasheet
            </button>

            <button
              onClick={() => setActiveTab("compatibility")}
              className={`pb-3 px-4 transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === "compatibility"
                  ? "border-[#ff6a00] text-[#ff6a00] font-black"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Customer Reviews ({product.reviewCount})
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-2">
            {activeTab === "overview" && (
              <div className="space-y-6 text-xs leading-relaxed text-zinc-700">
                <p className="text-sm text-zinc-800 font-medium">{product.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* What's Included */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                    <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider font-mono">
                      What's Included
                    </h4>
                    <ul className="space-y-1.5 font-mono text-zinc-600">
                      {product.whatsIncluded.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compatible Software / IDEs */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                    <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider font-mono">
                      Compatible Toolchains
                    </h4>
                    <div className="flex flex-wrap gap-2 pt-1 font-mono">
                      {product.compatibleWith.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-zinc-300 text-zinc-800 font-bold shadow-2xs"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Hardware Specifications Table
                </h4>
                <div className="rounded-2xl border border-zinc-200/90 overflow-hidden text-xs font-mono">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {Object.entries(product.techSpecs).map(([key, val], idx) => {
                        if (!val) return null;
                        return (
                          <tr
                            key={key}
                            className={idx % 2 === 0 ? "bg-zinc-50/70" : "bg-white"}
                          >
                            <td className="p-3 font-bold text-zinc-600 border-b border-zinc-200/60 uppercase text-[11px] w-1/3">
                              {key.replace(/([A-Z])/g, " $1")}
                            </td>
                            <td className="p-3 font-bold text-zinc-900 border-b border-zinc-200/60">
                              {val}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "pinout" && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-zinc-900 text-sm">Official Datasheet</div>
                    <div className="text-zinc-500 text-[11px]">PDF technical reference manual and pin configuration</div>
                  </div>
                  {product.datasheetUrl ? (
                    <a
                      href={product.datasheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </a>
                  ) : (
                    <span className="text-zinc-400 italic">Available on Request</span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-2">
                  <div className="font-bold text-[#ff6a00]">Pinout Diagram Summary:</div>
                  <div className="text-[11px] text-zinc-300 leading-relaxed font-mono">
                    30-Pin GPIO Layout: Pin 1 (3V3), Pin 2 (GND), Pin 3 (EN), Pin 4 (VP / SENSOR_VP), Pin 5 (VN / SENSOR_VN), Pin 25 (GPIO23 - VSPI MOSI), Pin 26 (GPIO22 - I2C SCL), Pin 27 (GPIO21 - I2C SDA).
                  </div>
                </div>
              </div>
            )}

            {activeTab === "compatibility" && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <span className="text-3xl font-black">{product.rating}</span>
                  <div>
                    <div className="font-bold">Excellent Lab Performance Rating</div>
                    <div className="text-emerald-700 text-[11px] font-mono">Based on {product.reviewCount} verified campus orders.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
