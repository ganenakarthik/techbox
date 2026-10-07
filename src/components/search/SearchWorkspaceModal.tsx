"use client";

import React, { useEffect, useRef } from "react";
import { ComponentItem, filterProducts } from "@/data/componentsCatalog";

interface SearchWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: ComponentItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectProduct: (product: ComponentItem) => void;
}

export function SearchWorkspaceModal({
  isOpen,
  onClose,
  catalog,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
}: SearchWorkspaceModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const results = filterProducts(
    catalog,
    searchQuery,
    "All Categories",
    0,
    100000,
    false,
    0,
    "relevance"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="liquid-modal w-full max-w-3xl overflow-hidden flex flex-col max-h-[80vh] shadow-2xl">
        {/* Search Input Header */}
        <div className="p-4 border-b border-slate-200/80 flex items-center gap-3 bg-white/90">
          <svg className="w-5 h-5 text-[#ff6a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ESP32, Arduino, MPU6050, ICs, motors, laptop parts..."
            className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Popular Tags */}
        <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-200/60 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-slate-400 text-[10px] uppercase">Popular:</span>
          {["ESP32", "Arduino", "MPU6050", "Raspberry Pi", "LM2596", "NEMA 17", "PETG"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 text-[11px] font-semibold hover:border-[#ff6a00] hover:text-[#ff6a00] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            {results.length} Search Results Found
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <p className="font-semibold text-slate-600">No components match "{searchQuery}"</p>
              <p>Try searching for part numbers like "ESP32", "MPU6050", or "ATmega328P".</p>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="p-3 rounded-xl bg-white/80 hover:bg-white border border-slate-200/60 hover:border-[#ff6a00] flex items-center justify-between cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 p-1 flex items-center justify-center border border-slate-200/50">
                    <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      {product.manufacturer} • SKU: {product.sku}
                    </div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#ff6a00] transition-colors">
                      {product.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {product.specs}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">₹{product.price}</div>
                  <span className="text-[10px] font-bold text-emerald-600">● {product.stock}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
