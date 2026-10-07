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
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* PA Monogram Emblem */}
      <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200/90 shadow-sm flex items-center justify-center p-1 overflow-hidden transition-transform hover:scale-105">
        <img
          src="/pa-logo.png"
          alt="Partsly PA Emblem"
          className="w-full h-full object-contain"
        />
      </div>

      {/* partsly Brand Wordmark */}
      <div className="flex items-baseline">
        <span className={`text-xl sm:text-2xl font-black tracking-tighter ${textColor}`}>
          partsly
        </span>
      </div>
    </div>
  );
}
