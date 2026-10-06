import React from "react";
import Image from "next/image";

export function PartslyLogo({
  className = "",
  isLight = true,
}: {
  className?: string;
  isLight?: boolean;
}) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Partsly PA Emblem & Wordmark from uploaded brand logo */}
      <div className="relative flex items-center gap-2.5">
        <div className="relative h-9 w-auto flex items-center">
          <img
            src="/logo.png"
            alt="Partsly Logo"
            className="h-9 w-auto object-contain rounded-md"
            style={{
              mixBlendMode: isLight ? "multiply" : "screen",
              filter: isLight ? "contrast(1.1)" : "brightness(1.2) contrast(1.1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
