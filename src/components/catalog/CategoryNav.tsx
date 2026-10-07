"use client";

import React from "react";
import { CATEGORIES } from "@/data/componentsCatalog";

interface CategoryNavProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export function CategoryNav({ activeCategory, setActiveCategory }: CategoryNavProps) {
  const categoryIcons: Record<string, string> = {
    Electronics: "⚡",
    Microcontrollers: "🎛",
    "Development Boards": "📟",
    Sensors: "📡",
    Modules: "📦",
    ICs: "⚙️",
    Connectors: "🔌",
    Power: "🔋",
    Motors: "⚙️",
    Tools: "🛠",
    "Laptop Parts": "💻",
    "Bike Parts": "🚲",
    "Industrial Parts": "🏭",
    "3D Printing": "🖨",
  };

  return (
    <section id="categories-section" className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
          Browse Categories
        </h2>
        <button
          onClick={() => setActiveCategory("All Categories")}
          className="text-xs font-bold text-[#ff6a00] hover:underline"
        >
          View All ({CATEGORIES.reduce((acc, c) => acc + c.count, 0)}+ products) →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.slice(0, 8).map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center gap-2 group ${
                isActive
                  ? "bg-white border-2 border-[#ff6a00] shadow-md scale-[1.02]"
                  : "bg-white/90 hover:bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs"
              }`}
            >
              {/* Soft Orange Icon Circle */}
              <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                {categoryIcons[cat.name] || "📦"}
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#ff6a00] transition-colors leading-tight">
                  {cat.name}
                </div>
                <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                  {cat.count}+ products
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
