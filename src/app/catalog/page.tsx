"use client";

import React, { useState } from "react";
import Link from "next/link";
import { COMPONENTS_CATALOG, filterProducts } from "@/data/componentsCatalog";
import { useCart } from "@/context/CartContext";
import { FilterDrawer } from "@/components/FilterDrawer";

const categoriesList = [
  "All Categories",
  "Microcontrollers",
  "Development Boards",
  "Sensors",
  "Motors",
  "3D Printing",
  "Laptop Parts",
  "Power Supplies",
];

export default function CatalogPage() {
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const filteredProducts = filterProducts(
    COMPONENTS_CATALOG,
    searchQuery,
    selectedCategory,
    0,
    maxPrice,
    inStockOnly,
    0,
    sortBy
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Hardware Components Store</h1>
          <p className="text-xs text-[var(--muted)]">
            Explore 100% genuine ICs, Microcontrollers, Motion Modules, Power Regulators & Sensors.
          </p>
        </div>
        <div className="text-xs text-[var(--muted)]">
          Showing <span className="font-bold text-[var(--accent)]">{filteredProducts.length}</span> of {COMPONENTS_CATALOG.length} Items
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
        <div className="flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="Filter by title, SKU, MPN, or brand (e.g. ESP32, STM32, NEMA 17)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <button
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-4 py-2.5 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)]"
        >
          ⚡ Dynamic Filters & Price Sliders {showFilterDrawer ? "▲" : "▼"}
        </button>
      </div>

      {/* Category Pills Strip */}
      <div className="flex flex-wrap gap-2">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-[var(--accent)] text-white font-bold shadow-md"
                : "border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--line)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Collapsible Filter Drawer */}
      {showFilterDrawer && (
        <FilterDrawer
          category={selectedCategory}
          setCategory={setSelectedCategory}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          inStockOnly={inStockOnly}
          setInStockOnly={setInStockOnly}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categoriesList}
        />
      )}

      {/* Product Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8">
          <div className="text-4xl mb-2">🔍</div>
          <h3 className="text-base font-bold text-[var(--text)]">No hardware items match your filters</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">Try adjusting your category selection, max price slider, or search query.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Categories");
              setMaxPrice(3000);
              setInStockOnly(false);
            }}
            className="mt-4 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-white"
          >
            Reset Catalog Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-md"
            >
              {product.badge && (
                <span className="absolute left-4 top-4 z-10 rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {product.badge}
                </span>
              )}

              <Link href={`/product/${product.id}`} className="space-y-3 block">
                <div className="aspect-square overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-2)]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                    {product.manufacturer} • {product.category}
                  </div>
                  <h3 className="line-clamp-2 text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)]">
                    {product.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{product.specs}</p>
                </div>
              </Link>

              <div className="mt-4 border-t border-[var(--line)] pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-extrabold text-[var(--accent)]">₹{product.price}</div>
                    {product.originalPrice && (
                      <div className="text-xs text-[var(--muted)] line-through">₹{product.originalPrice}</div>
                    )}
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
                    className="rounded-xl bg-[var(--surface-2)] border border-[var(--line)] px-3 py-2 text-xs font-bold text-[var(--text)] transition-all hover:bg-[var(--accent)] hover:text-white"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
