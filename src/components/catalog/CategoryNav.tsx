"use client";

import React from "react";
import { CATEGORIES } from "@/data/componentsCatalog";

interface CategoryNavProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export function CategoryNav({ activeCategory, setActiveCategory }: CategoryNavProps) {
  return (
    <div id="categories-section" className="w-full py-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 min-w-max pb-2">
        {/* All Categories Option */}
        <button
          onClick={() => setActiveCategory("All Categories")}
          className={`liquid-pill px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 ${
            activeCategory === "All Categories" ? "liquid-pill-active" : "text-slate-700 hover:text-slate-900"
          }`}
        >
          <span>All Hardware</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeCategory === "All Categories" ? "bg-[#ff6a00] text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            750+
          </span>
        </button>

        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`liquid-pill px-4 py-2 text-xs font-semibold transition-all flex items-center gap-2 ${
                isActive ? "liquid-pill-active" : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? "bg-[#ff6a00] text-white" : "bg-slate-200/60 text-slate-500"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
