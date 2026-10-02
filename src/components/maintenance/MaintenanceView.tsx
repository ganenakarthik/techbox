"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  Clock,
  MessageSquare,
  Instagram,
  Lock,
  Zap,
  Cpu,
  Layers,
  Search,
  DollarSign,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { MAINTENANCE_CONFIG } from "@/config/maintenance";
import { PartslyLogo } from "@/components/ui/Logo";

export function MaintenanceView() {
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminError, setAdminError] = useState(false);
  const [progress, setProgress] = useState(88);
  const [timeLeft, setTimeLeft] = useState(1420); // ~23 mins

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
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-[#ff6a00] selection:text-white font-sans relative overflow-hidden">
      {/* Background Ambience - White & Orange Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ff6a00]/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Header with Official PA Partsly Logo */}
      <header className="p-6 sm:p-8 max-w-6xl mx-auto w-full flex items-center justify-between z-10 border-b border-white/10">
        <PartslyLogo />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/40 text-[#ff6a00] text-xs font-mono font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#ff6a00] animate-ping" />
          <span>SCHEDULED MAINTENANCE</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-10 text-center space-y-10 z-10 my-auto">
        {/* Title Block */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-white text-xs font-mono">
            <Wrench className="w-4 h-4 text-[#ff6a00]" />
            <span>Hardware Database & Sourcing Engine Upgrade</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            We Will Be <span className="text-[#ff6a00] underline decoration-[#ff6a00]/30 underline-offset-8">Right Back</span> Soon!
          </h1>

          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed font-normal">
            {MAINTENANCE_CONFIG.description}
          </p>
        </div>

        {/* Live Progress Card - High Contrast White & Orange */}
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-zinc-950 border-2 border-white/20 shadow-2xl space-y-4 backdrop-blur-xl">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-white flex items-center gap-2 font-bold">
              <Zap className="w-4 h-4 text-[#ff6a00]" />
              <span>Catalog & Price Engine Sync</span>
            </span>
            <span className="text-[#ff6a00] font-black text-sm">{progress}% Complete</span>
          </div>

          <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#ff6a00] to-orange-400 rounded-full transition-all duration-700 shadow-lg shadow-[#ff6a00]/30"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-white/70 font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Estimated Return: <strong className="text-white font-bold">{formatTimer(timeLeft)}</strong></span>
            </span>
            <span className="text-white/40">Auto-refreshing</span>
          </div>
        </div>

        {/* Services We Provide Grid */}
        <div className="pt-2 text-left space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6a00] uppercase">
              PARTSLY SERVICES & CAPABILITIES
            </h2>
            <p className="text-xl font-black text-white">What We Build & Deliver</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {MAINTENANCE_CONFIG.services.map((service, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-950 border border-white/15 hover:border-[#ff6a00] transition-all space-y-2.5 group cursor-pointer shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#ff6a00]/10 text-[#ff6a00] flex items-center justify-center font-bold border border-[#ff6a00]/20">
                    {idx === 0 && <DollarSign className="w-5 h-5" />}
                    {idx === 1 && <Layers className="w-5 h-5" />}
                    {idx === 2 && <Search className="w-5 h-5" />}
                    {idx === 3 && <Cpu className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#ff6a00]/15 text-[#ff6a00] border border-[#ff6a00]/30">
                    {service.badge}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-[#ff6a00] transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-normal">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Buttons (WhatsApp & Instagram - Email Removed) */}
        <div className="pt-4 max-w-xl mx-auto space-y-3">
          <div className="text-xs font-mono text-white/70">Need urgent hardware support or order status during maintenance?</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* WhatsApp Direct */}
            <a
              href={MAINTENANCE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-zinc-950 hover:bg-[#ff6a00]/10 border-2 border-emerald-500/40 hover:border-emerald-500 text-white transition-all flex items-center justify-center gap-3 font-bold group cursor-pointer shadow-lg"
            >
              <div className="p-2 rounded-lg bg-emerald-500 text-white font-bold group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-black text-white text-xs">WhatsApp Support</div>
                <div className="text-[11px] font-mono text-emerald-400">{MAINTENANCE_CONFIG.whatsappDisplay}</div>
              </div>
            </a>

            {/* Instagram Updates */}
            <a
              href={MAINTENANCE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-zinc-950 hover:bg-[#ff6a00]/10 border-2 border-pink-500/40 hover:border-pink-500 text-white transition-all flex items-center justify-center gap-3 font-bold group cursor-pointer shadow-lg"
            >
              <div className="p-2 rounded-lg bg-pink-600 text-white font-bold group-hover:scale-110 transition-transform">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-black text-white text-xs">Instagram Updates</div>
                <div className="text-[11px] font-mono text-pink-400">{MAINTENANCE_CONFIG.instagram}</div>
              </div>
            </a>
          </div>
        </div>

        {/* Staff Console Access Passcode Drawer */}
        <div className="pt-6 border-t border-white/10">
          {!showAdminLogin ? (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="text-xs font-mono text-white/50 hover:text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Operations Staff & Admin Access →</span>
            </button>
          ) : (
            <form onSubmit={handleAdminBypass} className="max-w-xs mx-auto space-y-3 p-4 rounded-xl bg-zinc-950 border-2 border-white/20">
              <div className="text-xs font-mono font-bold text-white">Staff Console Passcode</div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={adminPasscode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAdminPasscode(e.target.value);
                    setAdminError(false);
                  }}
                  placeholder="Enter passcode..."
                  className="flex-1 bg-black border border-white/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
                />
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs cursor-pointer transition-colors shadow-md"
                >
                  Enter
                </button>
              </div>
              {adminError && <div className="text-[11px] text-red-400 font-mono">Invalid passcode. Try 'admin123'.</div>}
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-white/50 font-mono z-10 border-t border-white/10">
        © 2026 Partsly Inc. All rights reserved. • High-Speed Hardware Engineering & Sourcing
      </footer>
    </div>
  );
}
