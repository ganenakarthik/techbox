"use client";

import React, { useState } from "react";
import { ComponentItem } from "@/data/componentsCatalog";
import { Star, X, Plus, Minus, Check, MessageSquare, Download } from "lucide-react";

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

  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "pinout" | "docs" | "compatibility" | "reviews">("overview");
  const [selectedImage, setSelectedImage] = useState(product.image);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl liquid-glass-modal rounded-3xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative border border-white/80 font-sans animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Top Product Header & Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gallery Column (Thumbnails + Main Image) */}
          <div className="lg:col-span-6 flex gap-4">
            {/* Vertical Thumbnails */}
            <div className="flex flex-col gap-2 shrink-0">
              {[product.image, product.image, product.image, product.image].map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded-xl border p-1 bg-slate-50 cursor-pointer transition-all ${
                    selectedImage === img ? "border-[#ff6a00] ring-2 ring-[#ff6a00]/30" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-contain rounded" />
                </div>
              ))}
            </div>

            {/* Main Preview Box */}
            <div className="flex-1 h-72 sm:h-80 bg-slate-50 rounded-2xl border border-slate-200/90 p-4 flex items-center justify-center relative overflow-hidden">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain rounded"
              />
            </div>
          </div>

          {/* Right Info Column */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              {/* Category Breadcrumbs */}
              <div className="text-xs font-semibold text-slate-400 space-x-2 pb-1">
                <span className="text-slate-600 font-bold">{product.manufacturer}</span>
                <span>•</span>
                <span>ESP-WROOM-32</span>
                <span>•</span>
                <span>30 Pin</span>
              </div>

              <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center gap-3 pt-2 text-xs">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold border border-amber-200">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-slate-500 font-medium">({product.reviewCount} reviews)</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400 font-mono">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-950">₹{product.price}</span>
                <span className="text-sm text-slate-400 line-through">₹{product.originalPrice}</span>
              </div>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 pt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>In Stock — {product.inStockCount} units available</span>
              </div>
            </div>

            {/* Quantity Selector & CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50">
                  <button
                    onClick={() => onUpdateQuantity(product.id, -1)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-mono text-sm">{cartQuantity || 1}</span>
                  <button
                    onClick={() => onUpdateQuantity(product.id, 1)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onAddToCart(product.id, product.name)}
                  className="flex-1 py-3.5 rounded-xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-98"
                >
                  Add to Cart
                </button>

                <a
                  href={`https://wa.me/917032635858?text=${encodeURIComponent(`Hi Partsly! I want to buy ${product.name} (₹${product.price}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-bold text-xs shadow-xs transition-all"
                >
                  Buy Now
                </a>
              </div>

              {/* Feature Pills */}
              <div className="flex items-center gap-2 pt-1 flex-wrap text-xs font-medium text-slate-700">
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                  Wi-Fi 802.11 b/g/n
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                  Bluetooth 4.2
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                  3.3V Operating Voltage
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Tabbed Sections */}
        <div className="border-t border-slate-200 pt-6 space-y-6">
          <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-bold scrollbar-none overflow-x-auto">
            {["overview", "specs", "pinout", "docs", "compatibility", "reviews"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={`pb-3 transition-colors border-b-2 capitalize cursor-pointer whitespace-nowrap ${
                  activeTab === t
                    ? "border-[#ff6a00] text-[#ff6a00] font-black"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {t === "specs" ? "Specifications" : t === "docs" ? "Documentation" : t}
              </button>
            ))}
          </div>

          {/* Tab View Contents */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs leading-relaxed text-slate-700">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Overview</h4>
                  <p>{product.description}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">What's included</h4>
                  <ul className="space-y-1.5 text-slate-700">
                    {product.whatsIncluded.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Compatible with</h4>
                  <div className="flex gap-2">
                    {product.compatibleWith.map((c, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 font-semibold text-slate-800">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="lg:col-span-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Technical Specifications</h4>
                <div className="space-y-2 text-xs">
                  {Object.entries(product.techSpecs).map(([key, val]) => {
                    if (!val) return null;
                    return (
                      <div key={key} className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className="font-bold text-slate-900 text-right">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Full Technical Specifications</h4>
              {Object.entries(product.techSpecs).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600 font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="font-bold text-slate-900">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "pinout" && (
            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3 text-xs font-mono">
              <h4 className="font-bold text-[#ff6a00] text-sm font-sans">GPIO Pinout Reference</h4>
              <p className="text-slate-300">ESP32 30-Pin DevKit Pinout configuration: Pin 1 (3V3), Pin 2 (GND), Pin 3 (EN), Pin 4 (VP), Pin 5 (VN), Pin 26 (GPIO22 I2C SCL), Pin 27 (GPIO21 I2C SDA).</p>
            </div>
          )}

          {activeTab === "docs" && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Documentation & Datasheets</h4>
              <a href={product.datasheetUrl || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#ff6a00] font-bold hover:underline">
                <Download className="w-4 h-4" /> Download Official Datasheet (PDF)
              </a>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Customer Reviews ({product.reviewCount})</h4>
              <p className="text-slate-600">Rated {product.rating} out of 5 stars by verified engineering labs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
