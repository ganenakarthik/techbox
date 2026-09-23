"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, Filter, SlidersHorizontal, X, Tag, RotateCcw, Loader2 } from "lucide-react";
import { getProducts, getCategories, getBrands, Product, Category, Brand } from "@/lib/data";

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

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch categories & brands from Data Provider
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getBrands().then(setBrands).catch(() => {});
  }, []);

  useEffect(() => {
    let isCancelled = false;
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await getProducts({
          category: selectedCategory,
          brand: selectedBrand,
          query: searchQuery,
          inStock: inStockOnly,
          sort: sortBy,
        });
        if (!isCancelled) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, selectedBrand, searchQuery, inStockOnly, sortBy]);

  const filteredProducts = products.filter((p) => {
    const price = p.variants?.[0]?.price || 0;
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
              Electronic Components & Hardware Catalog
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Genuine microcontrollers, sensors, ICs, modules, and passive components backed by verified campus lab inventory.
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#ff6a00] shadow-2xs cursor-pointer"
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
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
                    className="text-xs text-slate-500 hover:text-[#ff6a00] flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  {isMobileFilterOpen && (
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Search Catalog
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. ESP32, Sonar, Relay, STM32..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Clean Vertical Component Categories List */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider text-[10px]">
                  Categories
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-[#ff6a00] text-black font-extrabold shadow-2xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>All Components</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        selectedCategory === "all"
                          ? "bg-black/10 text-black"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {products.length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#ff6a00] text-black font-extrabold shadow-2xs"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {cat.count !== undefined && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                              isSelected
                                ? "bg-black/10 text-black font-bold"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {cat.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brands Filter */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider text-[10px]">
                  Brand / Manufacturer
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00] cursor-pointer"
                >
                  <option value="all">All Manufacturers</option>
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
                  className="w-full accent-[#ff6a00] bg-slate-200 cursor-pointer"
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
                    className="w-4 h-4 rounded border-slate-300 accent-[#ff6a00] cursor-pointer"
                  />
                  <span>In Stock Only (Campus Lab Ready)</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Active Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500 font-medium">Active Filters:</span>

                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100 border border-orange-200 text-[#ff6a00] font-bold text-[11px]">
                    <span>Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}</span>
                    <button onClick={() => setSelectedCategory("all")} className="hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100 border border-orange-200 text-[#ff6a00] font-bold text-[11px]">
                    <span>Query: &quot;{searchQuery}&quot;</span>
                    <button onClick={() => setSearchQuery("")} className="hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedBrand !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100 border border-orange-200 text-[#ff6a00] font-bold text-[11px]">
                    <span>Brand: {selectedBrand}</span>
                    <button onClick={() => setSelectedBrand("all")} className="hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[11px]">
                    <span>In Stock Only</span>
                    <button onClick={() => setInStockOnly(false)} className="hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCategory === "all" && !searchQuery && selectedBrand === "all" && !inStockOnly && (
                  <span className="text-slate-400 italic">None (showing full catalog)</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-500">
                  Showing <strong className="text-slate-900">{filteredProducts.length}</strong> components
                </span>
                {(selectedCategory !== "all" || searchQuery || selectedBrand !== "all" || inStockOnly) && (
                  <button
                    onClick={resetFilters}
                    className="text-[#ff6a00] font-bold hover:underline cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-24 rounded-3xl bg-slate-50 border border-slate-200">
                <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500">Loading catalog from database...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <Tag className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No components match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Can&apos;t find the exact IC or module you need? Submit a custom sourcing request and Partsly will procure it for you.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  <a
                    href="/services/component-sourcing"
                    className="px-4 py-2 bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Request Custom Sourcing
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Custom Sourcing Callout Banner */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#ff6a00] text-black uppercase tracking-wider">
                  Can&apos;t find your part?
                </span>
                <h3 className="text-base font-bold mt-1">Custom Component Sourcing & IC Procurement</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Submit rare microcontrollers, sensor ICs, or specific package footprints for procurement.
                </p>
              </div>
              <a
                href="/services/component-sourcing"
                className="py-3 px-5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs shrink-0 transition-all shadow-md"
              >
                Submit Sourcing Request
              </a>
            </div>
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
