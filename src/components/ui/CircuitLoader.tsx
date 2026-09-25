"use client";

import React from "react";
import { Cpu, Sparkles, Truck } from "lucide-react";

interface CircuitLoaderProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "circuit" | "runner" | "pulse";
}

export function CircuitLoader({
  label = "Loading hardware data...",
  size = "md",
  variant = "circuit",
}: CircuitLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  if (variant === "runner") {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff6a00] to-[#ea580c] flex items-center justify-center text-white shadow-lg shadow-[#ff6a00]/30 animate-bounce">
            <Truck className="w-7 h-7" />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-300 rounded-full blur-xs animate-pulse" />
        </div>
        <p className="text-xs font-extrabold text-slate-800 tracking-tight">{label}</p>
        <p className="text-[10px] text-slate-400 font-mono mt-0.5">PARTSLY 10-MIN EXPRESS HUB</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center mb-3">
        {/* Outer Pulsing Glow Ring */}
        <div
          className={`${sizeClasses[size]} rounded-2xl bg-[#ff6a00]/15 border-2 border-[#ff6a00]/30 animate-ping absolute`}
        />

        {/* Inner Spinning Ring */}
        <div
          className={`${sizeClasses[size]} rounded-2xl border-2 border-t-[#ff6a00] border-r-transparent border-b-[#ea580c] border-l-transparent animate-spin`}
        />

        {/* Center Hardware Icon */}
        <div className="absolute w-7 h-7 rounded-xl bg-slate-900 text-[#ff6a00] flex items-center justify-center shadow-md">
          <Cpu className="w-4 h-4 animate-pulse" />
        </div>
      </div>

      {label && (
        <div className="space-y-0.5">
          <p className="text-xs font-black text-slate-900 tracking-tight">{label}</p>
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] animate-ping" />
            <span>Synchronizing PostgreSQL SKU Ledger...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ComponentSkeleton() {
  return (
    <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs animate-pulse space-y-3">
      <div className="w-full h-36 bg-slate-100 rounded-2xl" />
      <div className="w-2/3 h-4 bg-slate-200 rounded-md" />
      <div className="w-1/3 h-3 bg-slate-100 rounded-md" />
      <div className="flex items-center justify-between pt-2">
        <div className="w-16 h-5 bg-slate-200 rounded-md" />
        <div className="w-20 h-8 bg-slate-900/10 rounded-xl" />
      </div>
    </div>
  );
}
