import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-lg",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2.5 select-none cursor-pointer group ${className}`}>
      {/* Icon Badge: PA Emblem inside Liquid Glass Container */}
      <div
        className={`${iconSizes[size]} rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center font-black text-white shadow-md shadow-slate-900/20 group-hover:border-[#ff6a00] group-hover:scale-105 transition-all duration-200 relative overflow-hidden`}
      >
        <div className="flex items-center justify-center font-black tracking-tighter">
          <span className="text-white">P</span>
          <span className="text-[#ff6a00] -ml-0.5">A</span>
        </div>
        {/* Liquid Refractive Top Edge Gloss */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      </div>

      {/* Brand Wordmark: partsly.in */}
      <div className="flex flex-col leading-none">
        <div className={`font-black tracking-tight text-slate-900 ${textSizes[size]}`}>
          partsly<span className="text-[#ff6a00]">.in</span>
        </div>
        <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
          HARDWARE MARKETPLACE
        </span>
      </div>
    </div>
  );
}
