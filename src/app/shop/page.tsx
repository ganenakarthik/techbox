"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, Filter, SlidersHorizontal, X, Tag, RotateCcw, Loader2 } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch live categories & brands from PostgreSQL on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});

    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data.brands || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let isCancelled = false;
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "all") params.set("category", selectedCategory);
        if (selectedBrand !== "all") params.set("brand", selectedBrand);
        if (searchQuery.trim()) params.set("q", searchQuery.trim());
        if (inStockOnly) params.set("inStock", "true");
        if (sortBy) params.set("sort", sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setProducts(data.products || []);
          }
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    const timer = setTimeout(fetchProducts, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [selectedCategory, selectedBrand, searchQuery, inStockOnly, sortBy]);

  // Client-side price slider filter
  const filteredProducts = products.filter((p) => {
    if (!p.variants || p.variants.length === 0) return true;
    const minPrice = Math.min(...p.variants.map((v: any) => Number(v.price) || 0));
    return minPrice <= maxPrice;
  });

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setInStockOnly(false);
    setSearchQuery("");
    setMaxPrice(1000);
    setSortBy("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f]">
        <div>
          <div className="text-xs text-neutral-400 mb-1">
            <span>Home</span> / <span className="text-white">Shop Components</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Electronic Components & Hardware
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Genuine sensors, microcontrollers, modules, and breakout boards powered by live PostgreSQL catalog.
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden px-3 py-2 rounded-xl bg-[#171717] border border-[#262626] text-xs font-semibold text-white flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff6a00]" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#141414] border border-[#262626] text-white text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-[#ff6a00]"
            >
              <option value="featured">Featured</option>
              <option value="rating">Best Rated</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Sidebar Filters */}
        <aside
          className={`lg:block ${
            isMobileFilterOpen
              ? "fixed inset-0 z-50 bg-black/90 p-6 overflow-y-auto"
              : "hidden"
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Filter className="w-4 h-4 text-[#ff6a00]" />
                <span>Filters</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetFilters}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                {isMobileFilterOpen && (
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Search in Catalog
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. ESP32, Sonar, Relay..."
                  className="w-full bg-[#141414] border border-[#262626] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6a00]"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Category
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === "all"
                      ? "bg-[#ff6a00]/15 text-[#ff6a00] font-semibold"
                      : "text-neutral-400 hover:bg-[#141414] hover:text-white"
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] text-neutral-500">{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? "bg-[#ff6a00]/15 text-[#ff6a00] font-semibold"
                        : "text-neutral-400 hover:bg-[#141414] hover:text-white"
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Brand / Manufacturer
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-neutral-300">Max Price</span>
                <span className="text-[#ff6a00] font-bold">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#ff6a00] bg-[#1e1e1e]"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                <span>₹50</span>
                <span>₹1500+</span>
              </div>
            </div>

            {/* In Stock Only */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-[#262626] bg-[#141414] accent-[#ff6a00]"
                />
                <span>In Stock Only (Campus Dispatch)</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-6">
            <span>
              Showing <strong className="text-white">{filteredProducts.length}</strong> components
            </span>
            {(selectedCategory !== "all" || searchQuery || selectedBrand !== "all") && (
              <button
                onClick={resetFilters}
                className="text-[#ff6a00] hover:underline"
              >
                Clear all active filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-24 rounded-3xl bg-[#111111] border border-[#222222]">
              <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
              <p className="text-xs text-neutral-400">Loading catalog from database...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-[#111111] border border-[#222222]">
              <Tag className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No components match your filters</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                Try widening your price range, clearing brand filters, or searching for other keywords like ESP32 or Sensor.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-[#ff6a00] text-black font-bold text-xs rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-neutral-400">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
