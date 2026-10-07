"use client";

import React, { useState, useMemo } from "react";
import { ComponentItem, filterProducts } from "@/data/componentsCatalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Search, X, SlidersHorizontal, ArrowRight, Tag } from "lucide-react";

interface SearchWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: ComponentItem[];
  cartItems: { [key: string]: number };
  wishlistIds: string[];
  onAddToCart: (id: string, name: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onToggleWishlist: (id: string) => void;
  onQuickView: (product: ComponentItem) => void;
  initialQuery?: string;
}

const POPULAR_SEARCHES = [
  "ESP32",
  "Arduino",
  "Raspberry Pi",
  "Sensors",
  "Motors",
  "Connectors",
  "Laptop parts",
];

export function SearchWorkspaceModal({
  isOpen,
  onClose,
  catalog,
  cartItems,
  wishlistIds,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onQuickView,
  initialQuery = "",
}: SearchWorkspaceModalProps) {
  if (!isOpen) return null;

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("relevance");

  const results = useMemo(() => {
    return filterProducts(
      catalog,
      query,
      selectedCategory,
      0,
      5000,
      false,
      0,
      sortBy
    );
  }, [catalog, query, selectedCategory, sortBy]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xl flex flex-col justify-start p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Search Header Bar */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-[#ff6a00]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ESP32, Arduino, sensor, IC, connector..."
              autoFocus
              className="w-full bg-transparent text-sm sm:text-base font-bold text-zinc-900 focus:outline-none placeholder:text-zinc-400 font-sans"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Esc / Close
          </button>
        </div>

        {/* Popular Tags */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-mono">
          <span className="text-zinc-400 flex items-center gap-1 font-bold">
            <Tag className="w-3.5 h-3.5 text-[#ff6a00]" /> Popular:
          </span>
          {POPULAR_SEARCHES.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-full bg-white/80 hover:bg-white text-zinc-800 border border-zinc-200/80 font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Metadata & Sort */}
        <div className="flex items-center justify-between text-xs font-mono text-white/90 px-2">
          <span>
            {results.length} results found {query && `for "${query}"`}
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/20 border border-white/30 text-white rounded-lg p-1.5 text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="relevance" className="text-zinc-900">Relevance</option>
            <option value="price-asc" className="text-zinc-900">Price: Low → High</option>
            <option value="price-desc" className="text-zinc-900">Price: High → Low</option>
            <option value="rating" className="text-zinc-900">Rating</option>
          </select>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartQuantity={cartItems[product.id] || 0}
              isWishlisted={wishlistIds.includes(product.id)}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
