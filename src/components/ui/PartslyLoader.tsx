"use client";

import React from "react";
import Image from "next/image";
import { Cpu, Zap } from "lucide-react";
import { BRAND } from "@/config/brand";

interface PartslyLoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

export function PartslyLoader({
  text = "Verifying Partsly Hardware Dispatch...",
  size = "md",
  fullScreen = false,
  className = "",
}: PartslyLoaderProps) {
  const sizeMap = {
    sm: { container: "w-8 h-8", logo: 80, spinner: "w-10 h-10", text: "text-xs" },
    md: { container: "w-12 h-12", logo: 120, spinner: "w-16 h-16", text: "text-sm" },
    lg: { container: "w-16 h-16", logo: 150, spinner: "w-20 h-20", text: "text-base" },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`flex flex-col items-center justify-center text-center p-6 space-y-4 select-none ${className}`}>
      {/* Animated Glowing Chip Loader */}
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Orange Ring */}
        <div className={`${currentSize.spinner} rounded-2xl border-2 border-[#ff6a00]/30 border-t-[#ff6a00] border-r-[#ff6a00] animate-spin shadow-lg shadow-[#ff6a00]/20`} />
        
        {/* Inner Glowing Hardware Icon Box */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#ff6a00] to-[#ea580c] flex items-center justify-center text-white shadow-md shadow-[#ff6a00]/40 animate-pulse">
            <Cpu className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Ambient Glow background */}
        <div className="absolute -inset-2 bg-[#ff6a00]/10 rounded-3xl blur-md pointer-events-none animate-pulse" />
      </div>

      {/* Brand Logo & Progress Text */}
      <div className="space-y-1.5 max-w-xs">
        <div className="flex items-center justify-center gap-1.5">
          <Image
            src={BRAND.logo}
            alt={BRAND.displayName}
            width={currentSize.logo}
            height={32}
            priority
            className="h-7 w-auto object-contain"
          />
        </div>
        
        {text && (
          <p className={`${currentSize.text} font-bold text-slate-700 tracking-tight flex items-center justify-center gap-1.5`}>
            <Zap className="w-3.5 h-3.5 text-[#ff6a00] animate-bounce shrink-0" />
            <span>{text}</span>
          </p>
        )}
        
        <div className="flex items-center justify-center gap-1 pt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] animate-ping" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Hardware Engine Active
          </span>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md transition-all">
        {content}
      </div>
    );
  }

  return content;
}
