import React from "react";

export function PartslyLogo({ className = "", isLight = true }: { className?: string; isLight?: boolean }) {
  const textColor = isLight ? "text-zinc-950" : "text-white";
  const pColor = isLight ? "#09090b" : "#ffffff";
  const badgeBg = isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-950 border-zinc-800";

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official PA Monogram Emblem */}
      <div className={`w-10 h-10 rounded-xl ${badgeBg} border flex items-center justify-center p-1.5 shadow-md`}>
        <svg viewBox="0 0 120 100" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
          {/* P in Black/White */}
          <path
            d="M10 15 H42 C60 15 60 50 42 50 H26 V85 H10 V15 Z M26 30 V35 H40 C44 35 44 30 40 30 H26 Z"
            fill={pColor}
          />
          {/* A in Orange */}
          <path
            d="M52 85 L72 15 H88 L108 85 H92 L86 64 H64 L60 85 H52 Z M68 50 H82 L75 27 L68 50 Z"
            fill="#FF6A00"
          />
        </svg>
      </div>

      {/* partsly wordmark */}
      <div className="flex items-baseline">
        <span className={`text-2xl sm:text-3xl font-black tracking-tighter ${textColor}`}>partsly</span>
        <span className="text-[#ff6a00] font-black text-2xl sm:text-3xl">.in</span>
      </div>
    </div>
  );
}
