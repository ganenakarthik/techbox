"use client";

import React from "react";

export function PartslyLogo({
  className = "",
  isLight = true,
}: {
  className?: string;
  isLight?: boolean;
}) {
  const textColor = isLight ? "text-zinc-950" : "text-white";

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Upscaled Official PA Monogram Emblem */}
      <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/90 shadow-md flex items-center justify-center p-1 overflow-hidden transition-transform hover:scale-105">
        <img
          src="/pa-logo.png"
          alt="Partsly PA Emblem"
          className="w-full h-full object-contain"
        />
      </div>

      {/* partsly.in Brand Wordmark */}
      <div className="flex items-baseline">
        <span className={`text-2xl sm:text-3xl font-black tracking-tighter ${textColor}`}>
          partsly
        </span>
        <span className="text-[#ff6a00] font-black text-2xl sm:text-3xl">.in</span>
      </div>
    </div>
  );
}
