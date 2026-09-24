import React from "react";
import Link from "next/link";
import { Cpu } from "lucide-react";

interface PartslyLogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

export const PartslyLogo: React.FC<PartslyLogoProps> = ({
  size = "md",
  href = "/",
  className = "",
}) => {
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  const containerSizes = {
    sm: "w-8 h-8 rounded-xl",
    md: "w-10 h-10 rounded-2xl",
    lg: "w-12 h-12 rounded-2xl",
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <div
        className={`${containerSizes[size]} bg-gradient-to-br from-[#ff6a00] to-[#ff8c00] flex items-center justify-center text-black font-black shadow-md shadow-[#ff6a00]/25 group-hover:scale-105 transition-all shrink-0`}
      >
        <Cpu className={`${iconSizes[size]} text-black`} />
      </div>
      <div className="flex flex-col">
        <span className={`${textSizes[size]} font-black tracking-tight text-slate-900 group-hover:text-[#ff6a00] transition-colors leading-none`}>
          parts<span className="text-[#ff6a00]">ly</span>
        </span>
        {size !== "sm" && (
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 font-mono mt-0.5">
            Campus Hardware Hub
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
