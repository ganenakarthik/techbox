"use client";

import React from "react";

export function PartslyLogo({
  className = "",
  isLight = true,
}: {
  className?: string;
  isLight?: boolean;
}) {
  const textColor = isLight ? "text-slate-900" : "text-white";

  return (
    <div className={`inline-flex items-center gap-2 select-none cursor-pointer ${className}`}>
      {/* Orange Circle Emblem with P */}
      <div className="w-8 h-8 rounded-full bg-[#ff6a00] text-white font-black text-sm flex items-center justify-center shadow-sm shadow-orange-500/30">
        P
      </div>

      {/* Partsly Brand Wordmark */}
      <span className={`text-xl font-extrabold tracking-tight ${textColor}`}>
        Partsly
      </span>
    </div>
  );
}
