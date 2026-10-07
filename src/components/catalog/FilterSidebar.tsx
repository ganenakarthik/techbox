"use client";

import React from "react";
import { CATEGORIES } from "@/data/componentsCatalog";

interface FilterSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onReset: () => void;
  resultCount: number;
}

export function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  inStockOnly,
  setInStockOnly,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  onReset,
  resultCount,
}: FilterSidebarProps) {
  const manufacturers = ["Espressif", "Arduino", "InvenSense", "Raspberry Pi", "Texas Instruments", "TowerPro", "Aosong", "Usongshine", "Ai-Thinker", "Partsly Fab"];

  return (
    <aside className="w-full lg:w-64 liquid-card p-5 space-y-6 h-fit shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div>
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Catalog Filters</h3>
          <span className="text-[11px] font-semibold text-[#ff6a00]">{resultCount} items matching</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-[#ff6a00] transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          Sort Results
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full liquid-input px-3 py-2 text-xs font-semibold text-slate-800"
        >
          <option value="relevance">Relevance & Best Match</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
          <option value="newest">In Stock Priority</option>
        </select>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          Category
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory("All Categories")}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
              selectedCategory === "All Categories"
                ? "bg-[#ff6a00]/10 text-[#ff6a00] font-bold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] text-slate-400">750+</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                selectedCategory === cat.name
                  ? "bg-[#ff6a00]/10 text-[#ff6a00] font-bold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-slate-400">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
          <span>Max Price: ₹{priceRange[1]}</span>
        </div>
        <input
          type="range"
          min={50}
          max={5000}
          step={50}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full accent-[#ff6a00] cursor-pointer"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>₹50</span>
          <span>₹5,000+</span>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="pt-2 border-t border-slate-200/80">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-[#ff6a00] focus:ring-[#ff6a00]"
          />
          <span className="text-xs font-semibold text-slate-800">In-Stock Ready for Dispatch</span>
        </label>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2 pt-2 border-t border-slate-200/80">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          Minimum Rating
        </label>
        <div className="flex items-center gap-1">
          {[0, 4.0, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={`flex-1 py-1 rounded text-xs font-semibold border transition-all ${
                minRating === rating
                  ? "bg-[#ff6a00] text-white border-[#ff6a00]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {rating === 0 ? "All" : `${rating}+ ★`}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
