import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const heights = {
    sm: "h-7",
    md: "h-9",
    lg: "h-12",
  };

  return (
    <div className={`flex items-center gap-3 select-none cursor-pointer group ${className}`}>
      {/* Real Uploaded Logo Image */}
      <img
        src="/logo-partsly.png"
        alt="Partsly Logo"
        className={`${heights[size]} w-auto object-contain rounded-lg shadow-2xs group-hover:scale-105 transition-transform duration-200`}
        onError={(e) => {
          // Fallback if image fails
          e.currentTarget.style.display = "none";
        }}
      />

      {/* Clean Brand Wordmark (No .in) */}
      <div className="flex flex-col leading-none">
        <div className="font-extrabold tracking-tight text-slate-900 text-xl flex items-center gap-0.5">
          <span>PARTS</span>
          <span className="text-[#ff6a00]">LY</span>
        </div>
        <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
          HARDWARE STORE
        </span>
      </div>
    </div>
  );
}
