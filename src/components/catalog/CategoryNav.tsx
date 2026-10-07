"use client";

import React from "react";
import { Cpu, Zap, Layers, Box, Shield, Link, Battery, Wrench } from "lucide-react";

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_ITEMS = [
  { id: "Electronics", name: "Electronics", count: "120+ products", icon: Cpu },
  { id: "Microcontrollers", name: "Microcontrollers", count: "2.8k+ products", icon: Cpu },
  { id: "Sensors", name: "Sensors", count: "3.8k+ products", icon: Zap },
  { id: "Modules", name: "Modules", count: "4.2k+ products", icon: Box },
  { id: "Connectors", name: "Connectors", count: "1.8k+ products", icon: Link },
  { id: "ICs", name: "ICs", count: "5.3k+ products", icon: Shield },
  { id: "Power", name: "Power", count: "2.3k+ products", icon: Battery },
  { id: "Tools", name: "Tools", count: "3.3k+ products", icon: Wrench },
];

export function CategoryNav({ selectedCategory, onSelectCategory }: CategoryNavProps) {
  return (
    <section className="space-y-3">
      {/* Category Pills Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORY_ITEMS.map((cat) => {
          const IconComp = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between gap-2.5 group ${
                isSelected
                  ? "bg-orange-50/90 border-[#ff6a00] shadow-md shadow-orange-500/10"
                  : "liquid-glass-pill hover:border-orange-300"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isSelected
                    ? "bg-[#ff6a00] text-white"
                    : "bg-slate-100 text-slate-700 group-hover:bg-orange-100 group-hover:text-[#ff6a00]"
                }`}
              >
                <IconComp className="w-5 h-5" />
              </div>

              <div>
                <div className={`font-bold text-xs ${isSelected ? "text-[#ff6a00]" : "text-slate-900 group-hover:text-[#ff6a00]"}`}>
                  {cat.name}
                </div>
                <div className="text-[10px] text-slate-400 font-medium pt-0.5 whitespace-nowrap">
                  {cat.count}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
