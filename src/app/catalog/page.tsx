"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { COMPONENTS_CATALOG, filterProducts, ComponentItem } from "@/data/componentsCatalog";
import { useCart } from "@/context/CartContext";

const categoriesList = [
  "All Categories",
  "Microcontrollers",
  "Development Boards",
  "Sensors",
  "Motors",
  "3D Printing",
  "Laptop Parts",
];

const manufacturerList = [
  "Espressif Systems",
  "Raspberry Pi Foundation",
  "STMicroelectronics",
  "InvenSense",
  "TowerPro",
  "Aosong",
  "Partsly Fab",
];

export default function CatalogPage() {
  const { addToCart, wishlist, toggleWishlist, pincode } = useCart();
  const [productsList, setProductsList] = useState<ComponentItem[]>(COMPONENTS_CATALOG);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedMfrs, setSelectedMfrs] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetch(`/api/products${selectedCategory !== "All Categories" ? `?category=${selectedCategory}` : ""}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProductsList(data.products);
        }
      })
      .catch(() => setProductsList(COMPONENTS_CATALOG));
  }, [selectedCategory]);

  const toggleMfr = (mfr: string) => {
    setSelectedMfrs((prev) =>
      prev.includes(mfr) ? prev.filter((m) => m !== mfr) : [...prev, mfr]
    );
  };

  let filtered = filterProducts(
    productsList,
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    inStockOnly,
    minRating,
    sortBy
  );

  if (selectedMfrs.length > 0) {
    filtered = filtered.filter((p) => selectedMfrs.includes(p.manufacturer));
  }

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedMfrs([]);
    setMinPrice(0);
    setMaxPrice(3000);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy("popular");
  };

  return (
    <div className="wrap py-8 space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/30 uppercase">
              📍 Delivering to {pincode} India
            </span>
            <span className="text-xs text-[var(--muted)]">• Express Courier Delivery Available</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)] mt-1">
            Hardware Components Store
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Explore 100% genuine ICs, Microcontrollers, Sensors, Motors & Prototyping Hardware.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid/List View Toggle */}
          <div className="flex rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-1 text-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded-lg font-bold ${
                viewMode === "grid" ? "bg-[var(--accent)] text-white shadow" : "text-[var(--muted)]"
              }`}
            >
              田 Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-lg font-bold ${
                viewMode === "list" ? "bg-[var(--accent)] text-white shadow" : "text-[var(--muted)]"
              }`}
            >
              ≡ List
            </button>
          </div>

          <div className="text-xs font-bold text-[var(--muted)]">
            Showing <span className="text-[var(--accent)] font-mono text-sm">{filtered.length}</span> of {COMPONENTS_CATALOG.length} Items
          </div>
        </div>
      </div>

      {/* Main Catalog Layout (Sidebar Filters + Catalog Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filter Panel */}
        <aside className="space-y-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 h-fit shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text)]">⚡ Sliders & Filters</h3>
            <button onClick={resetFilters} className="text-[11px] font-bold text-[var(--accent)] hover:underline">
              Reset All
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--muted)] uppercase">Search Catalog</label>
            <input
              type="text"
              placeholder="Name, MPN, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[var(--muted)] uppercase">Component Category</label>
            <div className="space-y-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex justify-between items-center ${
                    selectedCategory === cat
                      ? "bg-[var(--accent)] text-white font-bold"
                      : "text-[var(--text)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 border-t border-[var(--line)] pt-4">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-[var(--muted)] uppercase">Price Range</span>
              <span className="text-[var(--accent)] font-mono">₹{minPrice} - ₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={0}
              max={3000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </div>

          {/* Stock Filter Toggle */}
          <div className="border-t border-[var(--line)] pt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text)]">In-Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)] cursor-pointer"
            />
          </div>

          {/* Manufacturer Filter Checkboxes */}
          <div className="space-y-2 border-t border-[var(--line)] pt-4">
            <label className="text-[11px] font-bold text-[var(--muted)] uppercase">Manufacturer Brand</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {manufacturerList.map((mfr) => {
                const isSelected = selectedMfrs.includes(mfr);
                return (
                  <label key={mfr} className="flex items-center gap-2 text-xs text-[var(--text)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMfr(mfr)}
                      className="accent-[var(--accent)]"
                    />
                    <span>{mfr}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Sort Controls & Active Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-[var(--muted)]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-bold text-[var(--text)] cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="newest">Newest Stock</option>
              </select>
            </div>
          </div>

          {/* Product Items Display */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-3">
              <div className="text-4xl">🔍</div>
              <h3 className="text-base font-bold text-[var(--text)]">No hardware components match your filters</h3>
              <p className="text-xs text-[var(--muted)]">Try adjusting your price slider or resetting category selections.</p>
              <button
                onClick={resetFilters}
                className="mt-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-xs font-bold text-white shadow"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => {
                const isFav = wishlist.includes(product.id);
                return (
                  <article key={product.id} className="product-card rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 space-y-3 shadow-sm hover:shadow-xl transition-all relative flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="aspect-square overflow-hidden rounded-xl bg-[var(--surface-2)] relative">
                        <Link href={`/product/${product.id}`}>
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform hover:scale-105" />
                        </Link>
                        {product.badge && (
                          <span className="absolute top-2 left-2 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow">
                            {product.badge}
                          </span>
                        )}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`absolute top-2 right-2 h-8 w-8 rounded-full border border-[var(--line)] bg-[var(--surface)] text-xs flex items-center justify-center transition-all ${
                            isFav ? "text-red-500 font-bold bg-red-500/10 border-red-500/30" : "text-[var(--muted)] hover:text-red-500"
                          }`}
                        >
                          {isFav ? "♥" : "♡"}
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-[var(--muted)]">
                          <span>{product.manufacturer}</span>
                          <span>⭐ {product.rating}</span>
                        </div>
                        <h3 className="text-xs font-bold text-[var(--text)] line-clamp-2 hover:text-[var(--accent)]">
                          <Link href={`/product/${product.id}`}>{product.name}</Link>
                        </h3>
                        <p className="text-[11px] text-[var(--muted)] line-clamp-1">{product.specs}</p>
                      </div>
                    </div>

                    <div className="border-t border-[var(--line)] pt-3 flex items-center justify-between mt-2">
                      <div>
                        <span className="text-base font-extrabold text-[var(--accent)]">₹{product.price}</span>
                        {product.originalPrice && <del className="ml-2 text-xs text-[var(--muted)]">₹{product.originalPrice}</del>}
                      </div>
                      <button
                        onClick={() =>
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            specs: product.specs,
                            image: product.image,
                          })
                        }
                        className="rounded-xl bg-[var(--accent)] px-3.5 py-2 text-xs font-bold text-white hover:opacity-90 transition-transform active:scale-95 shadow"
                      >
                        + Add
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm hover:border-[var(--accent)] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-cover border border-[var(--line)] bg-[var(--surface-2)]" />
                    <div>
                      <span className="text-[10px] font-bold text-[var(--muted)] uppercase">{product.manufacturer} • SKU: {product.sku}</span>
                      <h4 className="text-sm font-bold text-[var(--text)] hover:text-[var(--accent)]">
                        <Link href={`/product/${product.id}`}>{product.name}</Link>
                      </h4>
                      <p className="text-xs text-[var(--muted)]">{product.specs}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <div className="text-lg font-extrabold text-[var(--accent)]">₹{product.price}</div>
                      <div className="text-[10px] text-emerald-500 font-bold">In Stock ({product.inStockCount} Pcs)</div>
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          specs: product.specs,
                          image: product.image,
                        })
                      }
                      className="rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-white hover:opacity-90 shadow"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
