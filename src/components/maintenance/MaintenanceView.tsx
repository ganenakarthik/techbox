"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  Clock,
  MessageSquare,
  Instagram,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Search,
  DollarSign,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { MAINTENANCE_CONFIG } from "@/config/maintenance";

export function MaintenanceView() {
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminError, setAdminError] = useState(false);
  const [progress, setProgress] = useState(88);
  const [timeLeft, setTimeLeft] = useState(1420); // seconds (~23 mins)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  const handleAdminBypass = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === "admin123" || adminPasscode === "partsly2026") {
      window.location.href = MAINTENANCE_CONFIG.adminBypassPath;
    } else {
      setAdminError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between selection:bg-[#ff6a00] selection:text-white font-sans relative overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#ff6a00]/15 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#ff6a00]/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header with Official Logo & Status */}
      <header className="p-6 sm:p-8 max-w-6xl mx-auto w-full flex items-center justify-between z-10 border-b border-zinc-900/80">
        <div className="flex items-center gap-3">
          {/* Official Partsly SVG Brand Mark */}
          <div className="w-10 h-10 rounded-xl bg-[#ff6a00] flex items-center justify-center text-white shadow-lg shadow-[#ff6a00]/25">
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-white">partsly</span>
            <span className="text-xs font-mono font-bold text-[#ff6a00]">.in</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>SYSTEM MAINTENANCE</span>
        </div>
      </header>

      {/* Main Hero & Content Section */}
      <main className="max-w-4xl mx-auto px-4 py-12 text-center space-y-10 z-10 my-auto">
        {/* Title Block */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
            <Wrench className="w-3.5 h-3.5 text-[#ff6a00]" />
            <span>Infrastructure & Hardware Database Upgrade</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            We Will Be <span className="text-[#ff6a00]">Right Back</span> Soon!
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {MAINTENANCE_CONFIG.description}
          </p>
        </div>

        {/* Live System Progress Bar Box */}
        <div className="max-w-lg mx-auto p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-zinc-300 flex items-center gap-2 font-medium">
              <Zap className="w-4 h-4 text-[#ff6a00]" />
              <span>Catalog & Price Engine Calibration</span>
            </span>
            <span className="text-[#ff6a00] font-bold">{progress}% Complete</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden p-0.5">
            <div
              className="h-full bg-[#ff6a00] rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Estimated Return: <strong className="text-white">{formatTimer(timeLeft)}</strong></span>
            </span>
            <span className="text-zinc-500">Auto-refreshing</span>
          </div>
        </div>

        {/* Services We Provide Grid */}
        <div className="pt-4 text-left space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6a00] uppercase">
              PARTSLY SERVICES & CAPABILITIES
            </h2>
            <p className="text-lg font-bold text-white">What We Build & Deliver</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {MAINTENANCE_CONFIG.services.map((service, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#ff6a00]/10 text-[#ff6a00] flex items-center justify-center font-bold">
                    {idx === 0 && <DollarSign className="w-4 h-4" />}
                    {idx === 1 && <Layers className="w-4 h-4" />}
                    {idx === 2 && <Search className="w-4 h-4" />}
                    {idx === 3 && <Cpu className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    {service.badge}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-[#ff6a00] transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact Buttons (WhatsApp & Instagram - Email Removed) */}
        <div className="pt-4 max-w-xl mx-auto space-y-3">
          <div className="text-xs font-mono text-zinc-400">Need urgent hardware support or order status during maintenance?</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* WhatsApp Support Button */}
            <a
              href={MAINTENANCE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-all flex items-center justify-center gap-3 font-semibold group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-emerald-500 text-white font-bold group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-white">WhatsApp Support</div>
                <div className="text-[11px] font-mono text-emerald-400">{MAINTENANCE_CONFIG.whatsappDisplay}</div>
              </div>
            </a>

            {/* Instagram Updates Button */}
            <a
              href={MAINTENANCE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 transition-all flex items-center justify-center gap-3 font-semibold group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-pink-600 text-white font-bold group-hover:scale-105 transition-transform">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-white">Instagram Updates</div>
                <div className="text-[11px] font-mono text-pink-400">{MAINTENANCE_CONFIG.instagram}</div>
              </div>
            </a>
          </div>
        </div>

        {/* Staff Bypass Modal / Drawer */}
        <div className="pt-6 border-t border-zinc-900">
          {!showAdminLogin ? (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Operations Staff & Admin Access →</span>
            </button>
          ) : (
            <form onSubmit={handleAdminBypass} className="max-w-xs mx-auto space-y-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs font-mono font-bold text-zinc-300">Staff Console Passcode</div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={adminPasscode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAdminPasscode(e.target.value);
                    setAdminError(false);
                  }}
                  placeholder="Enter passcode..."
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
                />
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-[#ff6a00] text-white font-bold text-xs cursor-pointer hover:bg-orange-600 transition-colors"
                >
                  Enter
                </button>
              </div>
              {adminError && <div className="text-[11px] text-red-400">Invalid passcode. Try 'admin123'.</div>}
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-zinc-600 font-mono z-10 border-t border-zinc-900">
        © 2026 Partsly Inc. All rights reserved. • High-Speed Hardware Engineering & Sourcing
      </footer>
    </div>
  );
}
