"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECT_KITS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import {
  Boxes,
  Clock,
  Code,
  ShieldCheck,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function ProjectsPage() {
  const { addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const categories = ["all", "IoT & Embedded", "Robotics & Automation", "Biomedical & IoT", "AI/ML & Embedded"];

  const filteredKits = PROJECT_KITS.filter((kit) => {
    if (selectedCategory !== "all" && kit.category !== selectedCategory) return false;
    if (selectedDifficulty !== "all" && kit.difficulty !== selectedDifficulty) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 mb-1">
              <span>Home</span> / <span className="text-slate-900 font-semibold">Project Kits</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Engineering & College Project Kits
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Curated end-to-end hardware kits with source code, circuit diagrams, documentation and optional PCB/3D enclosures.
            </p>
          </div>

          <Link
            href="/build"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-slate-900 text-xs font-bold transition-all shadow-md shadow-[#ff6a00]/20 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Have a custom topic? Build My Project</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#ff6a00] text-slate-900 shadow-2xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
              >
                {cat === "all" ? "All Domains" : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#ff6a00] shadow-2xs"
            >
              <option value="all">Any Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Kits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredKits.map((kit) => (
            <div
              key={kit.id}
              className="rounded-3xl bg-white border border-slate-200 hover:border-[#ff6a00] transition-all flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-lg group"
            >
              <div>
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                  <Image
                    src={kit.images[0]}
                    alt={kit.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#ff6a00] border border-orange-200 shadow-2xs">
                    {kit.difficulty}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-slate-700 border border-slate-200 shadow-2xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#ff6a00]" />
                    <span>{kit.buildTime}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-[11px] font-bold text-[#ff6a00] uppercase tracking-wider mb-1">
                    {kit.category}
                  </div>
                  <Link href={`/projects/${kit.slug}`}>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#ff6a00] transition-colors leading-snug">
                      {kit.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {kit.description}
                  </p>

                  {/* Included Highlights */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                    <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                      Package Includes:
                    </div>
                    <ul className="space-y-1 text-slate-600 text-xs">
                      {kit.includes.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                    {kit.includes.length > 3 && (
                      <div className="text-[11px] text-slate-400 font-medium">
                        + {kit.includes.length - 3} more hardware modules & source code
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="flex items-baseline justify-between mb-4 pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">₹{kit.price}</span>
                    <span className="text-xs text-slate-400 line-through">₹{kit.mrp}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    SAVE ₹{kit.mrp - kit.price}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href={`/projects/${kit.slug}`}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold text-center transition-colors"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => addToCart({ kit })}
                    className="py-2.5 px-3 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#ff6a00]/20 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add Kit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
