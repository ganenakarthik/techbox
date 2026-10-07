"use client";

import React from "react";
import { CATEGORIES } from "@/data/componentsCatalog";
import { Cpu, Zap, Layers, Box, Shield, Link, Battery, Settings, Wrench, Laptop, Bike, Factory, Printer } from "lucide-react";

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryNav({ selectedCategory, onSelectCategory }: CategoryNavProps) {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "Electronics":
      case "Microcontrollers":
        return <Cpu className="w-5 h-5" />;
      case "Development Boards":
        return <Layers className="w-5 h-5" />;
      case "Sensors":
        return <Zap className="w-5 h-5" />;
      case "Modules":
        return <Box className="w-5 h-5" />;
      case "ICs":
        return <Shield className="w-5 h-5" />;
      case "Connectors":
        return <Link className="w-5 h-5" />;
      case "Power":
        return <Battery className="w-5 h-5" />;
      case "Motors":
        return <Settings className="w-5 h-5" />;
      case "Tools":
        return <Wrench className="w-5 h-5" />;
      case "Laptop Parts":
        return <Laptop className="w-5 h-5" />;
      case "Bike Parts":
        return <Bike className="w-5 h-5" />;
      case "Industrial Parts":
        return <Factory className="w-5 h-5" />;
      case "3D Printing":
        return <Printer className="w-5 h-5" />;
      default:
        return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6a00] uppercase">
            EXPLORE HARDWARE CATEGORIES
          </h2>
          <h3 className="text-xl font-black text-zinc-950">Engineered Components & Materials</h3>
        </div>
        
        <button
          onClick={() => onSelectCategory("All Categories")}
          className="text-xs font-bold text-[#ff6a00] hover:underline cursor-pointer"
        >
          View All ({CATEGORIES.length} Categories) →
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden ${
                isSelected
                  ? "bg-orange-50/90 border-[#ff6a00] shadow-md shadow-orange-500/10"
                  : "bg-white/80 hover:bg-white border-zinc-200/80 hover:border-zinc-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isSelected
                      ? "bg-[#ff6a00] text-white"
                      : "bg-zinc-100 text-zinc-700 group-hover:bg-orange-100 group-hover:text-[#ff6a00]"
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100/90 text-zinc-500 font-bold group-hover:bg-orange-100 group-hover:text-[#ff6a00] transition-colors">
                  {cat.count}
                </span>
              </div>

              <div>
                <div className={`font-bold text-xs leading-tight ${isSelected ? "text-[#ff6a00]" : "text-zinc-900 group-hover:text-[#ff6a00]"}`}>
                  {cat.name}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono pt-0.5">
                  Verified Stock
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
