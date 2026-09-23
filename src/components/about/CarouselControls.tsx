"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { TeamMember } from "@/data/teamData";

interface CarouselControlsProps {
  members: TeamMember[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

export function CarouselControls({
  members,
  activeIndex,
  onPrev,
  onNext,
  onSelect,
}: CarouselControlsProps) {
  const current = members[activeIndex];

  return (
    <div className="flex flex-col items-center gap-4 mt-6 select-none">
      {/* Active Member Tracker Pill */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50/80 backdrop-blur-xl border border-white/10 shadow-lg text-xs font-mono">
        <span className="text-[#ff6a00] font-bold">
          0{activeIndex + 1} / 0{members.length}
        </span>
        <span className="text-neutral-600">•</span>
        <span className="text-slate-900 font-semibold uppercase tracking-wider">
          {current.name}
        </span>
        <span className="text-neutral-600">•</span>
        <span className="text-slate-500 text-[11px] font-sans">
          {current.tag}
        </span>
      </div>

      {/* Navigation Buttons + Dots Bar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          aria-label="Previous Team Card"
          className="w-10 h-10 rounded-2xl bg-slate-50/80 hover:bg-[#1f1f1f] backdrop-blur-md border border-white/10 hover:border-[#ff6a00]/50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all active:scale-95 shadow-lg group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* 8 Interactive Indicator Dots */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-white/10">
          {members.map((m, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={m.id}
                onClick={() => onSelect(idx)}
                title={`${m.name} (${m.tag})`}
                aria-label={`Go to ${m.name}`}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-7 h-2.5 bg-[#ff6a00] shadow-[0_0_12px_rgba(255,106,0,0.6)]"
                    : "w-2.5 h-2.5 bg-white/20 hover:bg-white/50"
                }`}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          aria-label="Next Team Card"
          className="w-10 h-10 rounded-2xl bg-slate-50/80 hover:bg-[#1f1f1f] backdrop-blur-md border border-white/10 hover:border-[#ff6a00]/50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all active:scale-95 shadow-lg group"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Subtle Interaction Guide */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
        <Compass className="w-3 h-3 text-[#ff6a00]" />
        <span>Drag to rotate • Keyboard ← / → • Click to expand profile</span>
      </div>
    </div>
  );
}