"use client";

import React from "react";
import { PartslyLogo } from "@/components/ui/Logo";
import { MessageSquare, ArrowUp, ShieldCheck, Truck, Zap, Wrench } from "lucide-react";

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenServices: () => void;
  onOpenSourcing: () => void;
}

export function Footer({ onSelectCategory, onOpenServices, onOpenSourcing }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0f172a] text-white pt-10 pb-16 md:pb-8 border-t border-zinc-800 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="w-full bg-[#1e293b] hover:bg-zinc-800 py-3 text-center text-xs font-mono font-bold text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-lg border border-zinc-800 shadow-sm"
        >
          <ArrowUp className="w-4 h-4 text-[#ff6a00]" />
          <span>Back to Top</span>
        </button>

        {/* Core Value Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-zinc-800/80 text-xs">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="p-2 rounded-lg bg-orange-500/10 text-[#ff6a00]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Express Gate Delivery</div>
              <div className="text-zinc-400 text-[11px] leading-relaxed">
                10-30 min express dispatch to campus gate or engineering lab.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Lab Tested Genuine</div>
              <div className="text-zinc-400 text-[11px] leading-relaxed">
                100% verified original ICs, dev boards & zero-DOA replacement.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Custom Fab Services</div>
              <div className="text-zinc-400 text-[11px] leading-relaxed">
                Instant Gerber quotes for 2/4-layer PCBs & ABS 3D printed cases.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Supplier Network</div>
              <div className="text-zinc-400 text-[11px] leading-relaxed">
                Can't find a part? Let our global network source it for you.
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono text-zinc-400">
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-[11px]">Hardware Catalog</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onSelectCategory("Microcontrollers")} className="hover:text-white transition-colors cursor-pointer">Microcontrollers</button></li>
              <li><button onClick={() => onSelectCategory("Development Boards")} className="hover:text-white transition-colors cursor-pointer">Development Boards</button></li>
              <li><button onClick={() => onSelectCategory("Sensors")} className="hover:text-white transition-colors cursor-pointer">Sensors & Modules</button></li>
              <li><button onClick={() => onSelectCategory("Power")} className="hover:text-white transition-colors cursor-pointer">Power & Batteries</button></li>
              <li><button onClick={() => onSelectCategory("Motors")} className="hover:text-white transition-colors cursor-pointer">Motors & Robotics</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-[11px]">Engineering Services</h4>
            <ul className="space-y-2">
              <li><button onClick={onOpenServices} className="hover:text-white transition-colors cursor-pointer">PCB Fabrication</button></li>
              <li><button onClick={onOpenServices} className="hover:text-white transition-colors cursor-pointer">3D Print Enclosures</button></li>
              <li><button onClick={onOpenServices} className="hover:text-white transition-colors cursor-pointer">Custom Prototypes</button></li>
              <li><button onClick={onOpenServices} className="hover:text-white transition-colors cursor-pointer">Laptop Parts & Repair</button></li>
              <li><button onClick={onOpenSourcing} className="hover:text-white transition-colors cursor-pointer">BOM Sourcing Desk</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-[11px]">Help & Support</h4>
            <ul className="space-y-2">
              <li><a href="https://wa.me/917032635858" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> WhatsApp Desk (+91 70326 35858)</a></li>
              <li><button onClick={onOpenSourcing} className="hover:text-white transition-colors cursor-pointer">Sourcing Request</button></li>
              <li><a href="https://instagram.com/partsly.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram @partsly.in</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-[11px]">Partsly Platform</h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
              High-speed hardware engineering marketplace for students, labs, and electronics creators. Build, repair, and innovate faster.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <PartslyLogo isLight={false} />
          <div>© 2026 Partsly Inc. All rights reserved. • Everything for your project.</div>
        </div>
      </div>
    </footer>
  );
}
