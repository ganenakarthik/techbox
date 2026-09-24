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
  CheckCircle2,
  Building2,
  Wrench,
  FileText,
  Clock,
} from "lucide-react";
import { BRAND } from "@/config/brand";

const capabilities = [
  {
    icon: Cpu,
    title: "Embedded Silicon & Microcontrollers",
    desc: "Direct procurement of genuine, lab-grade microcontrollers (Arduino, ESP32, STM32, Raspberry Pi Pico), digital ICs, and high-sensitivity sensor modules with 100% oscilloscope power-on verification.",
  },
  {
    icon: Layers,
    title: "Turnkey Rapid PCB Fabrication",
    desc: "Automated Gerber file panelization, 1 to 4 layer FR-4 custom PCB manufacturing, solder mask finishes, and rapid surface-mount component assembly (SMT).",
  },
  {
    icon: Wrench,
    title: "3D Sensor & Mechanical Enclosures",
    desc: "Rapid additive manufacturing using tough PLA, ABS, and PETG polymers for custom sensor housing, robotic chassis frames, and IP-rated project enclosures.",
  },
  {
    icon: FileText,
    title: "IEEE Documentation & Viva Defense",
    desc: "Presentation-ready technical reports, vector circuit schematics, block diagrams, annotated firmware source code, and comprehensive viva defense question banks.",
  },
  {
    icon: Truck,
    title: "Campus Dropzone Dispatch Logistics",
    desc: "Direct-to-hostel and main-gate campus runner network engineered for 10 to 30 minute fast-track delivery across engineering and polytechnic campuses.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance & Oscilloscope Validation",
    desc: "Every component batch undergoes rigorous multi-meter and oscilloscope pinout testing to eliminate counterfeit or defective silicon before gate dispatch.",
  },
];

const stats = [
  { label: "Lab Components Stocked", value: "2,000+" },
  { label: "Projects & Kits Dispatched", value: "5,000+" },
  { label: "Campus Dropzones Active", value: "35+" },
  { label: "Lab Verification Accuracy", value: "99.9%" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#ff6a00] selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="bg-slate-50 border-b border-slate-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6a00] text-xs font-bold mb-5 shadow-2xs">
            <Building2 className="w-3.5 h-3.5" />
            <span>About {BRAND.displayName}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            India's Premier <span className="text-[#ff6a00]">Student Hardware & Campus Infrastructure</span> Platform
          </h1>

          <p className="mt-6 text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {BRAND.displayName} is the centralized project infrastructure platform powering engineering, polytechnic, and STEM institutions across India — providing lab-tested microcontrollers, genuine sensors, custom PCB manufacturing, 3D enclosures, and rapid campus dropzone delivery.
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#ff6a00]">{s.value}</div>
                <div className="text-[11px] text-slate-500 mt-1 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CORPORATE OVERVIEW & MISSION STATEMENT */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff6a00] uppercase tracking-wider mb-3">
            <Compass className="w-4 h-4" />
            <span>Institutional Mission</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-8 max-w-3xl">
            Streamlining Engineering Innovation & Project Execution
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-600 leading-relaxed mb-12">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Eliminating Component Counterfeiting & Sourcing Friction
              </h3>
              <p>
                Engineering students and research labs often face severe procurement bottlenecks — ranging from defective ICs purchased from unverified vendors to weeks-long delays in custom PCB panelization and international shipping fees.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Turnkey Campus Dropzone Infrastructure
              </h3>
              <p>
                {BRAND.displayName} bridges the gap between hardware engineering and rapid delivery. By operating dedicated campus dropzones and automated stock points near major engineering hubs, we deliver verified hardware components, custom enclosures, and complete project kits directly to student hostels, laboratories, and college gates.
              </p>
            </div>
          </div>

          {/* Core Capabilities Grid */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
              Core Technical Infrastructure & Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div key={cap.title} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#ff6a00] hover:shadow-md transition-all group">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00] mb-4 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">{cap.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{cap.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. QUALITY ASSURANCE STANDARDS */}
      <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Lab Verification Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              100% Bench-Tested Hardware Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every microcontroller board, wireless module, and sensor array dispatched by {BRAND.displayName} passes digital multi-meter continuity testing, pinout logic validation, and firmware bootloader checks to guarantee immediate out-of-the-box performance during academic evaluations.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Empowering Your Next Capstone Project
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Explore our comprehensive catalog of microcontrollers, sensors, robotics motors, and custom fabrication services — with fast-track campus delivery to your college dropzone.
              </p>
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#ff6a00]/30 transition-all cursor-pointer"
                >
                  <span>Explore Component Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/build"
                  className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-colors"
                >
                  <span>Build Custom Project</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
