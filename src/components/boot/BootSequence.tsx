"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/config/brand";

export function BootSequence() {
  const [phase, setPhase] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      const forceIntro =
        typeof window !== "undefined" &&
        (window.location.search.includes("intro") ||
          window.location.search.includes("boot"));
      const alreadySeen =
        sessionStorage.getItem(BRAND.bootSeenKey) ||
        sessionStorage.getItem(BRAND.legacyBootSeenKey);
      if ((alreadySeen && !forceIntro) || prefersReducedMotion) {
        setShouldShow(false);
        return;
      }
      sessionStorage.setItem(BRAND.bootSeenKey, "true");
      setShouldShow(true);
    } catch {
      setShouldShow(false);
      return;
    }

    // Timeline Progression (~3.0s total)
    const timer1 = setTimeout(() => setPhase(1), 400);
    const timer2 = setTimeout(() => setPhase(2), 1000);
    const timer3 = setTimeout(() => setPhase(3), 1600);
    const timer4 = setTimeout(() => setPhase(4), 2200);
    const timer5 = setTimeout(() => {
      setPhase(5);
      setIsExiting(true);
    }, 2700);
    const timer6 = setTimeout(() => {
      setShouldShow(false);
    }, 3100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShouldShow(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isMounted || !shouldShow) return null;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="partsly-boot-sequence"
          initial={{ opacity: 1 }}
          animate={
            isExiting
              ? {
                  opacity: 0,
                  scale: 1.04,
                  filter: "blur(8px)",
                }
              : { opacity: 1, scale: 1, filter: "blur(0px)" }
          }
          exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#070707] overflow-hidden select-none"
        >
          {/* Ambient Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

          {/* Central Radial Light Field */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{
              scale: phase >= 2 ? [1, 1.25, 1.15] : 0.9,
              opacity: phase >= 2 ? 0.35 : 0.15,
            }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#ff6a00]/30 via-[#f97316]/15 to-transparent blur-[90px] pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Engineering Circuit Construction SVG */}
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              >
                <defs>
                  <linearGradient id="partslyTraceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff6a00" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#f97316" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ff8533" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Outer Reticle Ring */}
                {phase >= 1 && (
                  <motion.circle
                    cx="200"
                    cy="200"
                    r="135"
                    fill="none"
                    stroke="#222222"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 0.8, rotate: 180 }}
                    transition={{ duration: 2.2, ease: "linear" }}
                  />
                )}

                {/* Circuit Traces */}
                {phase >= 1 && (
                  <motion.g
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <path
                      d="M 60 200 L 140 200 L 170 170 L 190 170"
                      fill="none"
                      stroke="url(#partslyTraceGrad)"
                      strokeWidth="2"
                    />
                    <path
                      d="M 340 200 L 260 200 L 230 230 L 210 230"
                      fill="none"
                      stroke="url(#partslyTraceGrad)"
                      strokeWidth="2"
                    />
                    <path
                      d="M 200 60 L 200 140 L 170 170"
                      fill="none"
                      stroke="url(#partslyTraceGrad)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 200 340 L 200 260 L 230 230"
                      fill="none"
                      stroke="url(#partslyTraceGrad)"
                      strokeWidth="1.5"
                    />

                    {/* Circuit Connection Node Dots */}
                    <circle cx="60" cy="200" r="3" fill="#ff6a00" />
                    <circle cx="340" cy="200" r="3" fill="#ff6a00" />
                    <circle cx="200" cy="60" r="3" fill="#ff6a00" />
                    <circle cx="200" cy="340" r="3" fill="#ff6a00" />
                  </motion.g>
                )}
              </svg>

              {/* 0.0s – 0.4s: Initial Origin Point */}
              {phase < 2 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: phase === 0 ? [0, 1.3, 1] : [1, 2.4, 0],
                    opacity: phase === 0 ? 1 : 0,
                  }}
                  transition={{
                    duration: phase === 0 ? 0.4 : 0.5,
                    ease: "easeInOut",
                  }}
                  className="absolute z-20 w-3.5 h-3.5 rounded-full bg-[#ff6a00] shadow-[0_0_30px_#ff6a00,0_0_60px_#ff6a00]"
                />
              )}

              {/* 1.0s – 1.6s: Official Partsly Emblem Assembly */}
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.35, rotate: -12 }}
                  animate={{
                    opacity: 1,
                    scale: phase >= 4 ? 1.05 : 1,
                    rotate: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 22,
                    mass: 0.8,
                  }}
                  className={`relative z-20 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-4 flex items-center justify-center transition-all duration-500 ${
                    phase >= 4
                      ? "bg-white/95 border-2 border-[#ff6a00] shadow-[0_0_60px_rgba(255,106,0,0.5),0_15px_40px_rgba(0,0,0,0.9)] ring-2 ring-[#ff6a00]/40"
                      : "bg-[#0d0d0d]/90 border border-[#ff6a00]/50 shadow-[0_0_35px_rgba(255,106,0,0.25),0_10px_30px_rgba(0,0,0,0.8)]"
                  }`}
                  style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  {/* Top Specular Edge Glow */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff6a00] to-transparent pointer-events-none" />

                  {/* Official Partsly Geometric Logo Emblem */}
                  <div className="relative w-full h-full">
                    <Image
                      src={BRAND.logoIconDark}
                      alt={BRAND.displayName}
                      fill
                      priority
                      sizes="128px"
                      className="object-contain drop-shadow-[0_0_14px_rgba(255,106,0,0.5)]"
                    />
                  </div>

                  {/* Luminous Shockwave Ring (Phase 4) */}
                  {phase >= 4 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.9 }}
                      animate={{ scale: 2.8, opacity: 0 }}
                      transition={{ duration: 0.65, ease: "easeOut" }}
                      className="absolute inset-0 rounded-3xl border border-[#ff6a00] pointer-events-none"
                    />
                  )}
                </motion.div>
              )}
            </div>

            {/* 1.6s – 2.2s: Typographic Wordmark & Doctrine */}
            <div className="relative z-20 text-center -mt-6 sm:-mt-8 space-y-3">
              {phase >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="space-y-2"
                >
                  {/* Wordmark */}
                  <div className="font-black text-3xl sm:text-4xl tracking-tight text-slate-900 flex items-center justify-center gap-1">
                    <span className="tracking-tight lowercase">{BRAND.name}</span>
                  </div>

                  {/* Doctrine Subtitle */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#ff6a00]/60" />
                    <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase text-slate-500">
                      BUILD <span className="text-[#ff6a00]">•</span> CONNECT <span className="text-[#ff6a00]">•</span> DELIVER
                    </span>
                    <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#ff6a00]/60" />
                  </div>
                </motion.div>
              )}

              {/* Ready Status Badge */}
              {phase >= 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 shadow-inner"
                >
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                  <span>CAMPUS INFRASTRUCTURE ONLINE</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Micro Skip Prompt (Bottom Right) */}
          <div className="absolute bottom-6 right-6 text-[10px] font-mono text-neutral-600 hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-50 border border-[#2e2e2e] text-slate-500">ESC</kbd> to skip
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}