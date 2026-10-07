"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { COMPONENTS_CATALOG, filterProducts, ComponentItem } from "@/data/componentsCatalog";
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
  const [productsList, setProductsList] = useState<ComponentItem[]>(COMPONENTS_CATALOG);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  useEffect(() => {
    // Fetch products via Neon serverless API route
    fetch(`/api/products${selectedCategory !== "All Categories" ? `?category=${selectedCategory}` : ""}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProductsList(data.products);
        }
      })
      .catch(() => setProductsList(COMPONENTS_CATALOG));
  }, [selectedCategory]);

  const filteredProducts = filterProducts(
    productsList,
    searchQuery,
    selectedCategory,
    0,
    maxPrice,
    inStockOnly,
    0,
    sortBy
  );

  return (
    <div className="wrap py-8 space-y-8">
      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div>
          <p className="eyebrow text-xs uppercase font-bold text-[var(--muted)]">Authorized Supply Chain</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">Hardware Components Store</h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Explore 100% genuine ICs, Microcontrollers, Motion Modules, Power Regulators & Sensors.
          </p>
        </div>
        <div className="text-xs font-bold text-[var(--muted)]">
          Showing <span className="text-[var(--accent)]">{filteredProducts.length}</span> of {COMPONENTS_CATALOG.length} Items
        </div>
      </div>

      {/* Search Input & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
        <div className="flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="Search component name, MPN, SKU, or brand (e.g. ESP32, STM32, NEMA 17)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <button
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-4 py-2.5 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)]"
        >
          ⚡ Sliders & Filters {showFilterDrawer ? "▲" : "▼"}
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
        <div className="product-grid">
          {filteredProducts.map((product, index) => (
            <article key={product.id} className="product-card group">
              <div className="product-image">
                <Link href={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} loading="lazy" />
                </Link>
                {product.badge && <span className="product-discount">{product.badge}</span>}
              </div>
              <div className="product-info">
                <p>{product.manufacturer} • {product.category}</p>
                <h3>
                  <Link href={`/product/${product.id}`} className="hover:text-[var(--accent)]">
                    {product.name}
                  </Link>
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <strong>₹{product.price}</strong>
                    {product.originalPrice && <del className="ml-2">₹{product.originalPrice}</del>}
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
                    className="rounded-full bg-[var(--accent)] px-3.5 py-1.5 text-xs font-bold text-white transition-transform hover:scale-105"
                  >
                    + Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
