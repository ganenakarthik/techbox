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
  Heart,
  Users,
} from "lucide-react";

const team = [
  { name: "Karthik G.", role: "Founder & CEO", desc: "Embedded systems engineer. Former research intern at IIT Madras. Obsessed with making hardware accessible." },
  { name: "Priya R.", role: "Head of Fabrication", desc: "PCB design & DFM specialist. 5+ years manufacturing custom electronics for defense and consumer products." },
  { name: "Arun S.", role: "Lead Engineer", desc: "Full-stack embedded dev. Writes firmware in C and React components with equal passion." },
  { name: "Meera K.", role: "Campus Ops Lead", desc: "Manages same-day dispatch logistics across 8 college campuses. MBAgrader turned operations nerd." },
  { name: "Deepak V.", role: "Product Designer", desc: "Figma-first. Shaped the Partsly catalog UX so students can find components in under 10 seconds." },
  { name: "Sanjana M.", role: "Project Engineering", desc: "Ensures every project kit ships with tested firmware. Your demo day won't fail on her watch." },
];

const pillars = [
  { icon: Target, title: "Authentic Hardware Only", desc: "Every microcontroller and sensor batch is pin-tested on digital oscilloscopes before leaving our warehouse. Zero counterfeit silicon." },
  { icon: Zap, title: "Turnkey Rapid Turnaround", desc: "We operate rapid PCB fabrication and 3D printing farms to deliver enclosures and prototypes in days, not weeks." },
  { icon: Award, title: "Viva Defense Guarantee", desc: "Clean annotated firmware, vector schematics, and viva question banks ensure students understand and defend their project with confidence." },
];

const stats = [
  { label: "Components in Stock", value: "2,000+" },
  { label: "Projects Delivered", value: "1,800+" },
  { label: "Campus Partners", value: "12" },
  { label: "Student Reviews", value: "4.9 ★" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#ff6a00] selection:text-white">
      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6a00] text-xs font-bold mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About Partsly</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Built by Engineers,{" "}
            <span className="text-[#ff6a00]">for the Next Generation of Builders.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Partsly was founded on one simple premise: turning your engineering project idea into real, working hardware shouldn&apos;t be an agonizing journey.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-[#ff6a00]">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff6a00] uppercase tracking-wider mb-4">
            <Compass className="w-4 h-4" />
            <span>The Origin of Partsly</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-snug tracking-tight mb-8 max-w-3xl">
            Why College Projects Were Broken — And How Partsly Fixes Them
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed mb-12">
            <p className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              Every semester across engineering colleges, the exact same crisis unfolds: students hunt across crowded city electronics markets for elusive ICs, only to receive counterfeit chips that overheat on breadboards. PCB manufacturing takes 3 weeks with high import duties, custom enclosures have to be carved out of cardboard, and 48 hours before external review, erratic solder joints fail during bench tests.
            </p>
            <p className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              We created Partsly to be the <strong className="text-slate-900">student project infrastructure platform</strong>. Whether you need genuine bench-tested sensors, a turnkey project kit with pre-tested firmware, custom 2-layer PCB fabrication, precision 3D-printed enclosures, or presentation-ready IEEE documentation, Partsly delivers everything directly to your campus lab or hostel.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#ff6a00] hover:shadow-md transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00] mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6a00] text-xs font-bold mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>Our Team</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">The People Behind Partsly</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">Engineers, builders, and campus ops specialists who live and breathe student project delivery.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#ff6a00] hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00] text-lg font-black mb-4 group-hover:scale-105 transition-transform">
                  {member.name[0]}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                <div className="text-xs text-[#ff6a00] font-semibold mt-0.5 mb-2">{member.role}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            {/* Subtle orange glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a00]/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/15 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-bold mb-5">
                <Heart className="w-3.5 h-3.5" />
                <span>Ready to build?</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Have an idea for your capstone or mini project?
              </h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto mb-8">
                Upload your synopsis or component list today and let Partsly turn your vision into working hardware.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/build"
                  className="w-full sm:w-auto py-3 px-8 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all"
                >
                  <span>Build My Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/shop"
                  className="w-full sm:w-auto py-3 px-8 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-colors"
                >
                  Shop Electronic Parts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
