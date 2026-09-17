"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { Search, X, ArrowRight, Box, Cpu, Sparkles, Tag } from "lucide-react";
import { PRODUCTS, PROJECT_KITS, CATEGORIES } from "@/data/mockData";
import Link from "next/link";
import Image from "next/image";

export function SearchOverlay() {
  const { isSearchOpen, setIsSearchOpen } = useApp();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setDbProducts([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query.trim())}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          if (data.products) setDbProducts(data.products);
        }
      } catch {
        // fallback
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  const filteredProducts = dbProducts.length > 0 ? dbProducts : (query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : []);

  const filteredKits = query.trim()
    ? PROJECT_KITS.filter(
        (k) =>
          k.title.toLowerCase().includes(query.toLowerCase()) ||
          k.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const popularSearches = ["ESP32", "Arduino Uno", "Ultrasonic Sensor", "0.96 OLED", "SG90 Servo", "Relay Module", "Project Kits"];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-[#ff6a00] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components, project kits, MCUs, sensors... (e.g. ESP32)"
            className="w-full bg-transparent text-slate-900 text-base placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-700 mr-2 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-md font-mono shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results / Default State */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5 bg-white">
          {query.trim() === "" ? (
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 px-2">
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-xs font-medium text-slate-700 hover:text-[#ff6a00] transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[#ff6a00]" />
                    {term}
                  </button>
                ))}
              </div>

              <div className="mt-5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 px-2">
                Browse Popular Categories
              </div>
              <div className="grid grid-cols-2 gap-2 px-2">
                {CATEGORIES.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-200 text-sm font-semibold text-slate-800 hover:text-[#ff6a00] group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Tag className="w-4 h-4 text-[#ff6a00]" />
                      <span>{cat.name}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Product Matches */}
              {filteredProducts.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#ff6a00]" />
                    Components & Hardware ({filteredProducts.length})
                  </div>
                  <div className="space-y-1">
                    {filteredProducts.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 relative shadow-2xs">
                          <Image
                            src={prod.images[0]}
                            alt={prod.name}
                            fill
                            className="object-contain p-1 group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate group-hover:text-[#ff6a00] transition-colors">
                            {prod.name}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{prod.brand}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-800">₹{prod.variants[0].price}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#ff6a00] group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Kit Matches */}
              {filteredKits.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-[#ff6a00]" />
                    Project Kits ({filteredKits.length})
                  </div>
                  <div className="space-y-1">
                    {filteredKits.map((kit) => (
                      <Link
                        key={kit.id}
                        href={`/projects/${kit.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 relative shadow-2xs">
                          <Image
                            src={kit.images[0]}
                            alt={kit.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate group-hover:text-[#ff6a00] transition-colors">
                            {kit.title}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span className="text-[#ff6a00] font-medium">{kit.difficulty}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-800">₹{kit.price}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#ff6a00] group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 && filteredKits.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-sm font-medium">No components or project kits matching &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try searching for &ldquo;ESP32&rdquo;, &ldquo;Arduino&rdquo;, or &ldquo;Ultrasonic&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Search 2,000+ components & campus project kits</span>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="hover:text-slate-900 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
