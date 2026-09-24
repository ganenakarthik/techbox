import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/config/brand";

interface PartslyLogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  variant?: "full" | "icon";
}

export const PartslyLogo: React.FC<PartslyLogoProps> = ({
  size = "md",
  href = "/",
  className = "",
  variant = "full",
}) => {
  const heights = {
    sm: 28,
    md: 36,
    lg: 44,
  };

  const imageSize = heights[size];

  const content = (
    <div className={`inline-flex items-center group cursor-pointer ${className}`}>
      {variant === "icon" ? (
        <Image
          src={BRAND.logoIcon}
          alt={BRAND.displayName}
          width={imageSize}
          height={imageSize}
          priority
          className="h-auto w-auto object-contain"
        />
      ) : (
        <Image
          src={BRAND.logo}
          alt={BRAND.displayName}
          width={imageSize * 3.8}
          height={imageSize}
          priority
          style={{ height: `${imageSize}px`, width: "auto" }}
          className="object-contain hover:opacity-95 transition-opacity"
        />
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

