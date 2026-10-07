import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2.5 select-none cursor-pointer group ${className}`}>
      {/* Orange Circle Emblem with White P */}
      <div
        className={`${iconSizes[size]} rounded-full bg-[#ff6a00] flex items-center justify-center font-black text-white shadow-sm group-hover:scale-105 transition-transform duration-200`}
      >
        <span>P</span>
      </div>

      {/* Brand Text: Partsly */}
      <span className={`font-black tracking-tight text-slate-900 ${textSizes[size]}`}>
        Partsly
      </span>
    </div>
  );
}
