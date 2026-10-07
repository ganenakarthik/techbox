"use client";

import React from "react";

interface FilterDrawerProps {
  category: string;
  setCategory: (cat: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  categories: string[];
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy,
  categories,
}) => {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text)]">⚡ Filter Catalog</h3>
        <button
          onClick={() => {
            setCategory("All Categories");
            setMaxPrice(3000);
            setInStockOnly(false);
            setSortBy("popular");
          }}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Category Pills */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">Category</label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                category === cat
                  ? "bg-[var(--accent)] text-white font-bold"
                  : "bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--line)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex justify-between text-xs font-bold text-[var(--muted)] mb-2">
          <span>Max Price: ₹{maxPrice}</span>
          <span>₹3,000</span>
        </div>
        <input
          type="range"
          min={50}
          max={3000}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          className="w-full accent-[var(--accent)] cursor-pointer"
        />
      </div>

      {/* Stock toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[var(--text)]">In Stock Only</span>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 accent-[var(--accent)] rounded cursor-pointer"
        />
      </div>

      {/* Sort order */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="popular">Popularity & Rating</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Stock Quantity</option>
        </select>
      </div>
    </div>
  );
};
