"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function TechBoxBootSequence() {
  const [phase, setPhase] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Respect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Check sessionStorage (allow ?intro=true or ?boot=true override for testing anytime)
    try {
      const forceIntro =
        typeof window !== "undefined" &&
        (window.location.search.includes("intro") ||
          window.location.search.includes("boot"));
      const alreadySeen = sessionStorage.getItem("techbox_boot_seen");
      if ((alreadySeen && !forceIntro) || prefersReducedMotion) {
        setShouldShow(false);
        return;
      }
      // First visit in current session
      sessionStorage.setItem("techbox_boot_seen", "true");
      setShouldShow(true);
    } catch {
      setShouldShow(false);
      return;
    }

    // Timeline Progression (Total ~2.85s)
    // Phase 0 (0.0s): Initializing orange origin point
    // Phase 1 (0.4s): PCB circuit trace construction begins
    // Phase 2 (1.0s): Official TechBox logo mark assembly & specular bloom
    // Phase 3 (1.6s): Typographic wordmark & BUILD. CONNECT. DELIVER. reveal
    // Phase 4 (2.2s): Luminous glass convergence & energy pulse
    // Phase 5 (2.7s): Outward spatial expansion into homepage
    // Done (3.1s): Complete removal from DOM

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
          key="techbox-boot-sequence"
          initial={{ opacity: 1 }}
          animate={
            isExiting
              ? {
                  opacity: 0,
                  scale: 1.15,
                  filter: "blur(18px)",
                }
              : {
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }
          }
          exit={{
            opacity: 0,
            scale: 1.2,
            filter: "blur(24px)",
          }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080808] overflow-hidden select-none cursor-default"
          style={{
            willChange: "transform, opacity, filter",
          }}
        >
          {/* Subtle Ambient High-Voltage Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: phase >= 2 ? (phase >= 4 ? 0.35 : 0.22) : 0.08,
              scale: phase >= 4 ? 1.4 : 1,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[650px] h-[420px] sm:h-[650px] bg-[#ff6a00] rounded-full blur-[140px] sm:blur-[180px] pointer-events-none"
          />

          {/* High-Tech Grid Matrix Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,106,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,106,0,0.08) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 65% 65% at 50% 50%, black 40%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 65% 65% at 50% 50%, black 40%, transparent 100%)",
            }}
          />

          {/* Central Engineering Stage */}
          <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
            {/* SVG Circuit Traces & PCB Pathways (Phase 1+) */}
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6a00" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#ff8c33" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ff6a00" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* PCB Circuit Traces Radiating from Center */}
              {phase >= 1 && (
                <g filter="url(#glow)">
                  {/* North Track */}
                  <motion.path
                    d="M 200 150 L 200 90 L 160 50 L 80 50"
                    fill="none"
                    stroke="url(#traceGrad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 0.65, ease: "easeInOut" }}
                  />
                  {/* North-East Track */}
                  <motion.path
                    d="M 235 165 L 290 120 L 340 120"
                    fill="none"
                    stroke="url(#traceGrad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 0.65, delay: 0.05, ease: "easeInOut" }}
                  />
                  {/* East Track */}
                  <motion.path
                    d="M 250 200 L 310 200 L 350 240 L 380 240"
                    fill="none"
                    stroke="url(#traceGrad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 0.65, delay: 0.1, ease: "easeInOut" }}
                  />
                  {/* South Track */}
                  <motion.path
                    d="M 200 250 L 200 310 L 240 350 L 320 350"
                    fill="none"
                    stroke="url(#traceGrad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 0.65, delay: 0.08, ease: "easeInOut" }}
                  />
                  {/* South-West Track */}
                  <motion.path
                    d="M 165 235 L 110 280 L 60 280"
                    fill="none"
                    stroke="url(#traceGrad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 0.65, delay: 0.12, ease: "easeInOut" }}
                  />
                  {/* West Track */}
                  <motion.path
                    d="M 150 200 L 90 200 L 50 160 L 20 160"
                    fill="none"
                    stroke="url(#traceGrad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 0.65, delay: 0.15, ease: "easeInOut" }}
                  />

                  {/* Via / Pin Pads at Ends */}
                  <motion.circle
                    cx="80"
                    cy="50"
                    r="3"
                    fill="#ff6a00"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.55 }}
                  />
                  <motion.circle
                    cx="340"
                    cy="120"
                    r="3"
                    fill="#ff6a00"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 }}
                  />
                  <motion.circle
                    cx="380"
                    cy="240"
                    r="3"
                    fill="#ff6a00"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.65 }}
                  />
                  <motion.circle
                    cx="320"
                    cy="350"
                    r="3"
                    fill="#ff6a00"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.68 }}
                  />
                  <motion.circle
                    cx="60"
                    cy="280"
                    r="3"
                    fill="#ff6a00"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.72 }}
                  />
                  <motion.circle
                    cx="20"
                    cy="160"
                    r="3"
                    fill="#ff6a00"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.75 }}
                  />
                </g>
              )}

              {/* Engineering Coordinate Reticle (Target Ring) */}
              {phase >= 1 && (
                <motion.circle
                  cx="200"
                  cy="200"
                  r="70"
                  fill="none"
                  stroke="#ff6a00"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                  initial={{ rotate: 0, opacity: 0 }}
                  animate={{
                    rotate: 180,
                    opacity: phase >= 4 ? 0.8 : 0.35,
                    scale: phase >= 4 ? 1.1 : 1,
                  }}
                  transition={{ duration: 1.8, ease: "linear" }}
                  style={{ transformOrigin: "200px 200px" }}
                />
              )}

              {/* Precision Optical Alignment Crosshairs */}
              {phase >= 1 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 4 ? 0.8 : 0.4 }}
                  transition={{ duration: 0.4 }}
                >
                  <line x1="200" y1="110" x2="200" y2="125" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
                  <line x1="200" y1="275" x2="200" y2="290" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
                  <line x1="110" y1="200" x2="125" y2="200" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
                  <line x1="275" y1="200" x2="290" y2="200" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
                </motion.g>
              )}
            </svg>

            {/* 0.0s – 0.4s: The Pure TechBox Orange Center Origin Point */}
            {phase < 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: phase === 0 ? [0, 1.2, 1] : [1, 2.2, 0],
                  opacity: phase === 0 ? 1 : 0,
                }}
                transition={{
                  duration: phase === 0 ? 0.4 : 0.5,
                  ease: "easeInOut",
                }}
                className="absolute z-20 w-3 h-3 rounded-full bg-[#ff6a00] shadow-[0_0_24px_#ff6a00,0_0_48px_#ff6a00]"
              />
            )}

            {/* 1.0s – 1.6s: Official TechBox Logo Core Assembly */}
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.4, rotate: -15 }}
                animate={{
                  opacity: 1,
                  scale: phase >= 4 ? 1.06 : 1,
                  rotate: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                  mass: 0.8,
                }}
                className={`relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl p-3 flex items-center justify-center transition-all duration-500 ${
                  phase >= 4
                    ? "bg-[#161616]/95 border-2 border-[#ff6a00] shadow-[0_0_60px_rgba(255,106,0,0.5),0_15px_40px_rgba(0,0,0,0.9)] ring-2 ring-[#ff6a00]/40"
                    : "bg-[#121212]/90 border border-[#ff6a00]/50 shadow-[0_0_35px_rgba(255,106,0,0.25),0_10px_30px_rgba(0,0,0,0.8)]"
                }`}
                style={{
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                {/* Specular Edge High-Light */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff6a00] to-transparent pointer-events-none" />

                {/* The Real TechBox Logo Mark */}
                <div className="relative w-full h-full">
                  <Image
                    src="/logo-icon.png"
                    alt="TechBox"
                    fill
                    priority
                    sizes="112px"
                    className="object-contain drop-shadow-[0_0_12px_rgba(255,106,0,0.4)]"
                  />
                </div>

                {/* Expanding Shockwave Ring (Phase 4) */}
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

          {/* 1.6s – 2.2s: Typographic Brand Reveal */}
          <div className="relative z-20 text-center -mt-8 sm:-mt-10 space-y-3">
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="space-y-2"
              >
                <div className="font-black text-2xl sm:text-3xl tracking-[0.2em] text-white flex items-center justify-center gap-1">
                  <span>TECH</span>
                  <span className="text-[#ff6a00] drop-shadow-[0_0_14px_rgba(255,106,0,0.6)]">BOX</span>
                </div>

                {/* Subtitle / Brand Doctrine */}
                <div className="flex items-center justify-center gap-2">
                  <span className="h-[1px] w-5 sm:w-8 bg-gradient-to-r from-transparent to-[#ff6a00]/60" />
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase text-neutral-400">
                    BUILD <span className="text-[#ff6a00]">•</span> CONNECT <span className="text-[#ff6a00]">•</span> DELIVER
                  </span>
                  <span className="h-[1px] w-5 sm:w-8 bg-gradient-to-l from-transparent to-[#ff6a00]/60" />
                </div>
              </motion.div>
            )}

            {/* Micro Industrial System Readiness Pill */}
            {phase >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[9px] font-mono text-[#ff6a00] uppercase tracking-widest mt-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] animate-ping" />
                <span>PLATFORM ONLINE</span>
              </motion.div>
            )}
          </div>

          {/* Discreet Skip Pill for Power Users */}
          <button
            type="button"
            onClick={() => setShouldShow(false)}
            className="absolute bottom-6 right-6 z-30 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[10px] font-mono text-neutral-500 hover:text-neutral-300 transition-all cursor-pointer opacity-50 hover:opacity-100"
            title="Press Esc to skip"
          >
            Skip Intro [Esc]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
