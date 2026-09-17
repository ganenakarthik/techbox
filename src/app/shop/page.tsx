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

    fetchProducts();
    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, selectedBrand, searchQuery, inStockOnly, sortBy]);

  const filteredProducts = products.filter((p) => {
    const price = p.variants?.[0]?.price || p.price || 0;
    return price <= maxPrice;
  });

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setInStockOnly(false);
    setSearchQuery("");
    setMaxPrice(5000);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 mb-1">
              <span>Home</span> / <span className="text-slate-900 font-semibold">Shop Components</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Electronic Components & Hardware
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Genuine sensors, microcontrollers, modules, and breakout boards powered by live PostgreSQL catalog.
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#ff6a00] shadow-2xs"
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
                ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
                : "hidden"
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <Filter className="w-4 h-4 text-[#ff6a00]" />
                  <span>Filters</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="text-xs text-slate-500 hover:text-[#ff6a00] flex items-center gap-1 font-medium"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  {isMobileFilterOpen && (
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="p-1 text-slate-500 hover:text-slate-900"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Search in Catalog
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. ESP32, Sonar, Relay..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === "all"
                        ? "bg-orange-50 text-[#ff6a00] font-bold border border-orange-200"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[10px] text-slate-400">{products.length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? "bg-orange-50 text-[#ff6a00] font-bold border border-orange-200"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Brand / Manufacturer
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
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
                  <span className="font-bold text-slate-700">Max Price</span>
                  <span className="text-[#ff6a00] font-black">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#ff6a00] bg-slate-200"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>₹50</span>
                  <span>₹5,000+</span>
                </div>
              </div>

              {/* In Stock Only */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-[#ff6a00]"
                  />
                  <span>In Stock Only (Campus Dispatch)</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
              <span>
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> components
              </span>
              {(selectedCategory !== "all" || searchQuery || selectedBrand !== "all") && (
                <button
                  onClick={resetFilters}
                  className="text-[#ff6a00] font-bold hover:underline"
                >
                  Clear all active filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-24 rounded-3xl bg-slate-50 border border-slate-200">
                <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500">Loading catalog from database...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 rounded-3xl bg-slate-50 border border-slate-200">
                <Tag className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No components match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Try widening your price range, clearing brand filters, or searching for other keywords like ESP32 or Sensor.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#ff6a00] text-white font-bold text-xs rounded-xl shadow-xs"
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
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
