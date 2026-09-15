"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { TeamMember } from "@/data/teamData";

interface GlassProfileCardProps {
  member: TeamMember;
  isActive: boolean;
  distance: number; // 0 for front/active, 1, 2, 3, 4 for distance
  onClick: () => void;
  onExpand: () => void;
  reducedMotion?: boolean;
}

export function GlassProfileCard({
  member,
  isActive,
  distance,
  onClick,
  onExpand,
  reducedMotion = false,
}: GlassProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isActive || reducedMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Smooth tilt via direct style transform (zero React component re-renders)
    const tiltX = (y - 0.5) * -10;
    const tiltY = (x - 0.5) * 12;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255, 106, 0, 0.18) 0%, rgba(255, 255, 255, 0.06) 30%, transparent 65%)`;
      glareRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = isActive ? "0.4" : "0.2";
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand();
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className={`relative w-[280px] sm:w-[320px] md:w-[340px] h-[450px] sm:h-[490px] rounded-3xl p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-300 overflow-hidden group ${
        isActive
          ? "bg-[#141414]/85 border-2 border-[#ff6a00]/60 shadow-[0_0_40px_rgba(255,106,0,0.22),0_20px_50px_rgba(0,0,0,0.85)] ring-1 ring-[#ff6a00]/30"
          : "bg-[#101010]/60 border border-white/10 hover:border-[#ff6a00]/30 shadow-[0_15px_35px_rgba(0,0,0,0.7)]"
      }`}
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transformStyle: "preserve-3d",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.15s ease-out",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* Specular Glare Follower (Interactive Glass Highlight) */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)",
          opacity: isActive ? 0.4 : 0.2,
        }}
      />

      {/* Subtle internal orange rim light on top & corners */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff6a00]/60 to-transparent pointer-events-none" />

      {/* Corner Industrial Marks */}
      <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-white/20 rounded-tl pointer-events-none" />
      <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-white/20 rounded-tr pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-white/20 rounded-bl pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-white/20 rounded-br pointer-events-none" />

      {/* Top Card Header */}
      <div className="relative z-10 pointer-events-none">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition-colors ${
              isActive
                ? "bg-[#ff6a00]/20 text-[#ff6a00] border border-[#ff6a00]/40 shadow-sm shadow-[#ff6a00]/20"
                : "bg-white/5 text-neutral-400 border border-white/10"
            }`}
          >
            {member.tag}
          </span>
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
            {member.domain}
          </span>
        </div>

        {/* Member Portrait */}
        <div className="relative w-full aspect-square max-w-[210px] mx-auto rounded-2xl overflow-hidden bg-[#161616] border border-white/10 group-hover:border-[#ff6a00]/40 transition-colors shadow-inner select-none pointer-events-none">
          <Image
            src={member.image}
            alt={member.name}
            fill
            draggable={false}
            sizes="(max-width: 640px) 210px, 240px"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
            priority={isActive}
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

          {/* Mini Stat Badge over image */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[10px] pointer-events-none select-none">
            <span className="text-white font-mono font-bold">{member.stat}</span>
            <span className="text-neutral-400 text-[9px] truncate ml-1">{member.statLabel}</span>
          </div>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="relative z-10 pt-3 border-t border-white/5 space-y-2">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center justify-between group-hover:text-[#ff6a00] transition-colors">
            <span>{member.name}</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-[#ff6a00] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </h3>
          <p className="text-xs font-semibold text-neutral-300 mt-0.5 line-clamp-1">
            {member.role}
          </p>
        </div>

        <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
          {member.bio}
        </p>

        {/* Interactive Expand Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className={`w-full py-2.5 px-3.5 rounded-xl flex items-center justify-between text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-[#ff6a00] hover:bg-[#ff7a1a] text-black shadow-lg shadow-[#ff6a00]/30 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-white/10 hover:bg-[#ff6a00]/20 text-neutral-300 hover:text-[#ff6a00] border border-white/15 hover:border-[#ff6a00]/40"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${isActive ? "text-black" : "text-[#ff6a00]"}`} />
              <span>CLICK TO EXPAND</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] opacity-80">
              <span>View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
