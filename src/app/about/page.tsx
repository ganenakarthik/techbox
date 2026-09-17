"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Target,
  Award,
  Zap,
  Compass,
  Layers,
  Cpu,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { ThreeDTeamCarousel } from "@/components/about/ThreeDTeamCarousel";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#ff6a00] selection:text-black relative overflow-x-hidden">
      {/* Subtle Ambient High-Tech Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] md:w-[1100px] h-[450px] bg-[#ff6a00]/[0.07] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* 1. Sleek Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          {/* Partsly Emblem */}
          <div className="relative w-20 h-20 mx-auto mb-5 rounded-2xl bg-[#121212] border border-[#ff6a00]/40 p-2 shadow-2xl shadow-[#ff6a00]/20 flex items-center justify-center">
            <Image
              src="/logo-icon-dark.png"
              alt="Partsly Official Emblem"
              width={64}
              height={64}
              priority
              className="object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-mono font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Team & Architecture Showcase</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Built by Engineers, for the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] via-[#ff8533] to-[#ffb380]">
              Next Generation of Builders.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Partsly was founded on one simple premise: turning your engineering project idea into real, working hardware shouldn&apos;t be an agonizing journey. Explore the minds driving student project infrastructure.
          </p>
        </div>

        {/* 2. Flagship 3D Glassmorphic Team Carousel (8 Interactive Cards) */}
        <section className="relative z-20 my-4 md:my-8">
          <ThreeDTeamCarousel />
        </section>

        {/* 3. The Origin of Partsly (Preserved & Reimagined with Glass Aesthetics) */}
        <section className="mt-16 md:mt-24 p-8 md:p-12 rounded-3xl bg-[#111111]/80 backdrop-blur-xl border border-white/10 shadow-2xl mb-16 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6a00]/[0.04] blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ff6a00] uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#ff6a00]" />
            <span>The Origin of Partsly</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-snug tracking-tight">
            Why College Projects Were Broken — And How Partsly Fixes Them
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-neutral-300 leading-relaxed">
            <p className="p-5 rounded-2xl bg-[#151515]/60 border border-white/5">
              Every semester across engineering colleges, the exact same crisis unfolds: students hunt across crowded city electronics markets for elusive ICs, only to receive counterfeit chips that overheat on breadboards. PCB manufacturing takes 3 weeks with high import duties, custom enclosures have to be carved out of cardboard, and 48 hours before external review, erratic solder joints fail during bench tests.
            </p>
            <p className="p-5 rounded-2xl bg-[#151515]/60 border border-white/5">
              We created Partsly to be the <strong className="text-white">student project infrastructure platform</strong>. Whether you need genuine bench-tested sensors, a turnkey project kit with pre-tested firmware, custom 2-layer PCB fabrication, precision 3D-printed enclosures, or presentation-ready IEEE documentation, Partsly delivers everything directly to your campus lab or hostel.
            </p>
          </div>

          {/* 3 Core Engineering Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="p-5 rounded-2xl bg-[#141414]/90 border border-white/10 space-y-2.5 hover:border-[#ff6a00]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#ff6a00]/15 border border-[#ff6a00]/30 flex items-center justify-center text-[#ff6a00]">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Authentic Hardware Only</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Every microcontroller and sensor batch is pin-tested on digital oscilloscopes before leaving our warehouse. Zero counterfeit silicon.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141414]/90 border border-white/10 space-y-2.5 hover:border-[#ff6a00]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#ff6a00]/15 border border-[#ff6a00]/30 flex items-center justify-center text-[#ff6a00]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Turnkey Rapid Turnaround</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We operate rapid PCB fabrication and 3D printing farms to deliver enclosures and prototypes in days, not weeks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141414]/90 border border-white/10 space-y-2.5 hover:border-[#ff6a00]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#ff6a00]/15 border border-[#ff6a00]/30 flex items-center justify-center text-[#ff6a00]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Viva Defense Guarantee</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Clean annotated firmware, vector schematics, and viva question banks ensure students understand and defend their project with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Full Brand Banner Display */}
        <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#111111] via-[#161311] to-[#111111] border border-[#ff6a00]/30 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <div className="relative w-48 h-14 mx-auto">
              <Image
                src="/logo-dark.png"
                alt="Partsly Full Brand"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-2xl font-black text-white">
              Have an idea for your capstone or mini project?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              Upload your synopsis or component list today and let Partsly turn your vision into working hardware.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/build"
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all"
              >
                <span>Build My Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop"
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#2e2e2e] text-white font-semibold text-xs transition-colors"
              >
                Shop Electronic Parts
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
