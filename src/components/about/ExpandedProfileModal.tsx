"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Target, Award, ShieldCheck, ArrowLeft } from "lucide-react";
import { TeamMember } from "@/data/teamData";

interface ExpandedProfileModalProps {
  member: TeamMember | null;
  onClose: () => void;
  reducedMotion?: boolean;
}

export function ExpandedProfileModal({
  member,
  onClose,
  reducedMotion = false,
}: ExpandedProfileModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open & listen for Escape
  useEffect(() => {
    if (member) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [member, onClose]);

  if (!mounted || typeof document === "undefined" || !document.body || !member) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="expanded-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-2xl overflow-y-auto"
          onClick={onClose}
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff6a00]/10 blur-[140px] rounded-full pointer-events-none" />

          {/* 3D Expanding Panel Container */}
          <motion.div
            key={member.id}
            initial={
              reducedMotion
                ? { opacity: 0, scale: 0.95 }
                : {
                    opacity: 0,
                    scale: 0.75,
                    rotateY: -20,
                    rotateX: 10,
                    z: -200,
                  }
            }
            animate={{
              opacity: 1,
              scale: 1,
              rotateY: 0,
              rotateX: 0,
              z: 0,
            }}
            exit={
              reducedMotion
                ? { opacity: 0, scale: 0.95 }
                : {
                    opacity: 0,
                    scale: 0.75,
                    rotateY: 15,
                    rotateX: -10,
                    z: -200,
                  }
            }
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 26,
              mass: 0.9,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#121212]/90 border border-white/15 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_0_60px_rgba(255,106,0,0.18),0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden my-auto"
            style={{
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Top Glass Rim Glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff6a00] to-transparent pointer-events-none" />

            {/* Corner Industrial Marks */}
            <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#ff6a00]/60 rounded-tl pointer-events-none" />
            <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[#ff6a00]/60 rounded-tr pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[#ff6a00]/60 rounded-bl pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[#ff6a00]/60 rounded-br pointer-events-none" />

            {/* Close Button Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 text-[#ff6a00] group-hover:-translate-x-1 transition-transform" />
                <span>Return to 3D System</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-all active:scale-95"
                title="Close Profile (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Profile Grid with Staggered Elements */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* 1. Large Portrait (Appears First) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="md:col-span-5 flex flex-col items-center text-center"
              >
                <div className="relative w-full max-w-[280px] aspect-square rounded-3xl overflow-hidden bg-[#161616] border-2 border-[#ff6a00]/50 shadow-2xl shadow-[#ff6a00]/20 p-1">
                  <div className="relative w-full h-full rounded-[22px] overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 280px, 320px"
                      priority
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Key Stat Badge */}
                <div className="mt-4 w-full max-w-[280px] p-3.5 rounded-2xl bg-[#181818] border border-white/10 flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-xs font-mono font-bold text-[#ff6a00]">{member.stat}</div>
                    <div className="text-[10px] text-neutral-400">{member.statLabel}</div>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-[#ff6a00]/15 flex items-center justify-center text-[#ff6a00]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>

              {/* 2. Sequenced Information */}
              <div className="md:col-span-7 space-y-6">
                {/* Name & Tag */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                  className="space-y-1.5"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-[#ff6a00]/20 text-[#ff6a00] border border-[#ff6a00]/40 text-xs font-mono font-bold uppercase tracking-wider">
                      {member.tag}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-xs font-mono">
                      {member.domain}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                    {member.name}
                  </h2>
                  <div className="text-sm font-semibold text-neutral-300">
                    {member.role}
                  </div>
                </motion.div>

                {/* Biography */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="space-y-2"
                >
                  <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff6a00]" />
                    <span>Background & Mission</span>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {member.bio}
                  </p>
                </motion.div>

                {/* Key Focus at Partsly */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.32 }}
                  className="p-4 rounded-2xl bg-[#181818]/90 border border-white/10 space-y-1.5"
                >
                  <div className="text-xs font-mono font-bold text-[#ff6a00] uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#ff6a00]" />
                    <span>Primary Responsibility at Partsly</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                    {member.focus}
                  </p>
                </motion.div>

                {/* Core Competencies & Skills */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.38 }}
                  className="space-y-2"
                >
                  <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#ff6a00]" />
                    <span>Engineering Focus Areas</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-300 font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Footer Credential */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.45 }}
                  className="pt-4 border-t border-white/10 text-xs text-neutral-500 font-medium"
                >
                  {member.background}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  }
