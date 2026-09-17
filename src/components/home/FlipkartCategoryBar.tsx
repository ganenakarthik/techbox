"use client";

import React from "react";
import Link from "next/link";
import { Cpu, Wifi, Activity, Monitor, Cog, Bot, Box, Layers, Zap } from "lucide-react";

const CATEGORIES = [
  { name: "Dev Boards", slug: "development-boards", icon: Cpu, color: "text-blue-600 bg-blue-50" },
  { name: "ESP32 & IoT", slug: "esp32-iot", icon: Wifi, color: "text-indigo-600 bg-indigo-50" },
  { name: "Sensors", slug: "sensors-modules", icon: Activity, color: "text-emerald-600 bg-emerald-50" },
  { name: "Displays", slug: "displays", icon: Monitor, color: "text-purple-600 bg-purple-50" },
  { name: "Motors & Drivers", slug: "motors-drivers", icon: Cog, color: "text-amber-600 bg-amber-50" },
  { name: "Robotics Parts", slug: "robotics", icon: Bot, color: "text-red-600 bg-red-50" },
  { name: "Project Kits", slug: "projects", isProjects: true, icon: Box, color: "text-orange-600 bg-orange-50" },
  { name: "Prototyping", slug: "prototyping-wires", icon: Zap, color: "text-cyan-600 bg-cyan-50" },
  { name: "PCB Fabrication", slug: "services/pcb", isService: true, icon: Layers, color: "text-teal-600 bg-teal-50" },
];

export function FlipkartCategoryBar() {
  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const targetUrl = cat.isProjects ? "/projects" : cat.isService ? `/${cat.slug}` : `/shop?category=${cat.slug}`;

            return (
              <Link
                key={cat.name}
                href={targetUrl}
                className="flex flex-col items-center gap-1.5 shrink-0 group px-2 py-1 rounded-xl hover:bg-slate-50 transition-all text-center min-w-[72px] sm:min-w-[84px]"
              >
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center ${cat.color} group-hover:scale-110 group-hover:shadow-xs transition-all border border-slate-100`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 group-hover:text-[#ff6a00] transition-colors whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FlipkartCategoryBar;
