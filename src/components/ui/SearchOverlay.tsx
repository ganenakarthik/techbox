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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#111111] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-[#262626]">
          <Search className="w-5 h-5 text-[#ff6a00] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components, project kits, MCUs, sensors... (e.g. ESP32)"
            className="w-full bg-transparent text-white text-base placeholder-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-neutral-400 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-neutral-400 bg-[#171717] border border-[#262626] rounded-md font-mono">
            ESC
          </kbd>
        </div>

        {/* Results / Default State */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {query.trim() === "" ? (
            <div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 px-2">
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171717] hover:bg-[#262626] border border-[#262626] text-xs font-medium text-neutral-300 hover:text-white transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[#ff6a00]" />
                    {term}
                  </button>
                ))}
              </div>

              <div className="mt-5 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 px-2">
                Browse Popular Categories
              </div>
              <div className="grid grid-cols-2 gap-2 px-2">
                {CATEGORIES.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#171717] hover:bg-[#1f1f1f] border border-[#262626] text-sm text-neutral-200 hover:text-white group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Tag className="w-4 h-4 text-[#ff6a00]" />
                      <span>{cat.name}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Product Matches */}
              {filteredProducts.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#ff6a00]" />
                    Components & Hardware ({filteredProducts.length})
                  </div>
                  <div className="space-y-1">
                    {filteredProducts.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#1a1a1a] transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#171717] border border-[#262626] overflow-hidden shrink-0 relative">
                          <Image
                            src={prod.images[0]}
                            alt={prod.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate group-hover:text-[#ff6a00] transition-colors">
                            {prod.name}
                          </div>
                          <div className="text-xs text-neutral-400 flex items-center gap-2">
                            <span>{prod.brand}</span>
                            <span>•</span>
                            <span>₹{prod.variants[0].price}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Kit Matches */}
              {filteredKits.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-[#ff6a00]" />
                    Project Kits ({filteredKits.length})
                  </div>
                  <div className="space-y-1">
                    {filteredKits.map((kit) => (
                      <Link
                        key={kit.id}
                        href={`/projects/${kit.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#1a1a1a] transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#171717] border border-[#262626] overflow-hidden shrink-0 relative">
                          <Image
                            src={kit.images[0]}
                            alt={kit.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate group-hover:text-[#ff6a00] transition-colors">
                            {kit.title}
                          </div>
                          <div className="text-xs text-neutral-400 flex items-center gap-2">
                            <span className="text-[#ff6a00]">{kit.difficulty}</span>
                            <span>•</span>
                            <span>₹{kit.price}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 && filteredKits.length === 0 && (
                <div className="text-center py-12 text-neutral-400">
                  <p className="text-sm">No components or project kits matching &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Try searching for &ldquo;ESP32&rdquo;, &ldquo;Arduino&rdquo;, or &ldquo;Sensor&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0d0d0d] border-t border-[#262626] flex items-center justify-between text-xs text-neutral-500">
          <span>Search 2,000+ components & campus project kits</span>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="hover:text-neutral-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
