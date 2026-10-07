"use client";

import React from "react";
import { SlidersHorizontal, Check, X, RotateCcw } from "lucide-react";
import { CATEGORIES } from "@/data/componentsCatalog";

interface FilterSidebarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  priceRange: number;
  onSetPriceRange: (val: number) => void;
  inStockOnly: boolean;
  onSetInStockOnly: (val: boolean) => void;
  minRating: number;
  onSetMinRating: (val: number) => void;
  sortBy: string;
  onSetSortBy: (val: string) => void;
  onResetFilters: () => void;
  isMobileDrawerOpen: boolean;
  onCloseMobileDrawer: () => void;
}

export function FilterSidebar({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onSetPriceRange,
  inStockOnly,
  onSetInStockOnly,
  minRating,
  onSetMinRating,
  sortBy,
  onSetSortBy,
  onResetFilters,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
}: FilterSidebarProps) {
  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
        <div className="flex items-center gap-2 text-zinc-900 font-black text-sm">
          <SlidersHorizontal className="w-4 h-4 text-[#ff6a00]" />
          <span>Catalog Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-[#ff6a00] font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
          Category
        </label>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => onSelectCategory("All Categories")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
              selectedCategory === "All Categories"
                ? "bg-orange-50 text-[#ff6a00] font-bold border border-orange-200/80"
                : "hover:bg-zinc-100 text-zinc-700"
            }`}
          >
            <span>All Categories</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-orange-50 text-[#ff6a00] font-bold border border-orange-200/80"
                  : "hover:bg-zinc-100 text-zinc-700"
              }`}
            >
              <span className="truncate">{cat.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 font-bold">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort By Selection */}
      <div className="space-y-2 border-t border-zinc-100 pt-4">
        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
          Sort Catalog
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSetSortBy(e.target.value)}
          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs font-bold text-zinc-800 focus:outline-none focus:border-[#ff6a00] cursor-pointer"
        >
          <option value="relevance">Relevance / Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Highest Stock Count</option>
        </select>
      </div>

      {/* Price Slider */}
      <div className="space-y-2 border-t border-zinc-100 pt-4">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Max Price</span>
          <span className="text-[#ff6a00] font-mono font-black">₹{priceRange}</span>
        </div>
        <input
          type="range"
          min={50}
          max={5000}
          step={50}
          value={priceRange}
          onChange={(e) => onSetPriceRange(Number(e.target.value))}
          className="w-full accent-[#ff6a00] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-400">
          <span>₹50</span>
          <span>₹5,000+</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2 border-t border-zinc-100 pt-4">
        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
          Minimum Rating
        </label>
        <div className="space-y-1">
          {[0, 4.5, 4.8].map((ratingVal) => (
            <button
              key={ratingVal}
              onClick={() => onSetMinRating(ratingVal)}
              className={`w-full text-xs p-2.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                minRating === ratingVal
                  ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                  : "hover:bg-zinc-100 text-zinc-700"
              }`}
            >
              <span>{ratingVal === 0 ? "All Ratings" : `${ratingVal}★ & above`}</span>
              {minRating === ratingVal && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Filter Checkbox */}
      <div className="border-t border-zinc-100 pt-4">
        <label className="flex items-center gap-2 text-xs font-bold text-zinc-800 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onSetInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-[#ff6a00] focus:ring-[#ff6a00] accent-[#ff6a00]"
          />
          <span>In-Stock Items Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-zinc-200/90 shadow-sm sticky top-24">
        {content}
      </aside>

      {/* Mobile Glass Bottom Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end lg:hidden">
          <div className="w-full bg-white rounded-t-3xl p-6 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <span className="font-black text-base text-zinc-950">Filter Catalog</span>
              <button
                onClick={onCloseMobileDrawer}
                className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
            <button
              onClick={onCloseMobileDrawer}
              className="w-full py-3 bg-[#ff6a00] text-white font-bold text-xs rounded-xl shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}
