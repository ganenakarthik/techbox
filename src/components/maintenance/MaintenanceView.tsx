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
  ShieldCheck,
} from "lucide-react";
import { MAINTENANCE_CONFIG } from "@/config/maintenance";
import { PartslyLogo } from "@/components/ui/Logo";

export function MaintenanceView() {
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminError, setAdminError] = useState(false);
  const [progress, setProgress] = useState(88);

  // Helper to compute remaining seconds until target end date
  const calculateRemainingSeconds = () => {
    const targetMs = MAINTENANCE_CONFIG.targetEndTimeMs;
    const nowMs = Date.now();
    const diffSeconds = Math.floor((targetMs - nowMs) / 1000);
    return diffSeconds > 0 ? diffSeconds : 0;
  };

  const [timeLeft, setTimeLeft] = useState<number>(calculateRemainingSeconds());

  useEffect(() => {
    // Recalculate immediately on mount
    setTimeLeft(calculateRemainingSeconds());

    const timer = setInterval(() => {
      setTimeLeft(calculateRemainingSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimerComponents = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => (num < 10 ? `0${num}` : `${num}`);

    return {
      days: pad(days),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
    };
  };

  const { days, hours, minutes, seconds } = getTimerComponents(timeLeft);

  const handleAdminBypass = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === "admin123" || adminPasscode === "partsly2026") {
      window.location.href = MAINTENANCE_CONFIG.adminBypassPath;
    } else {
      setAdminError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-zinc-900 flex flex-col justify-between selection:bg-[#ff6a00] selection:text-white font-sans relative overflow-hidden">
      {/* Background Soft Orange Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-[#ff6a00]/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-orange-400/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header with Official PA Partsly Logo */}
      <header className="p-6 sm:p-8 max-w-6xl mx-auto w-full flex items-center justify-between z-10 border-b border-zinc-200/80 bg-white/70 backdrop-blur-md">
        <PartslyLogo isLight={true} />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-mono font-bold tracking-wide shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff6a00] animate-ping" />
          <span>SYSTEM MAINTENANCE</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-10 text-center space-y-10 z-10 my-auto">
        {/* Title Block */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-mono shadow-sm">
            <Wrench className="w-4 h-4 text-[#ff6a00]" />
            <span>Infrastructure & Hardware Database Upgrade</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 leading-tight">
            We Will Be <span className="text-[#ff6a00] underline decoration-[#ff6a00]/30 underline-offset-8">Right Back</span> Soon!
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed font-medium">
            {MAINTENANCE_CONFIG.description}
          </p>
        </div>

        {/* Real-Time Persistent Countdown Timer Card */}
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white/90 border border-zinc-200/90 shadow-2xl shadow-orange-500/10 backdrop-blur-xl space-y-6">
          <div className="flex justify-between items-center text-xs font-mono border-b border-zinc-100 pb-3">
            <span className="text-zinc-900 flex items-center gap-2 font-bold">
              <Clock className="w-4 h-4 text-[#ff6a00]" />
              <span>Services Will Return In</span>
            </span>
            <span className="text-[#ff6a00] font-black text-xs uppercase tracking-wider">Real-Time Persistent Timer</span>
          </div>

          {/* 4-Block Clock Timer (Days : Hours : Minutes : Seconds) */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 font-mono">
            <div className="p-3 sm:p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 flex flex-col items-center shadow-sm">
              <span className="text-2xl sm:text-4xl font-black text-[#ff6a00]">{days}</span>
              <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest pt-1">Days</span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 flex flex-col items-center shadow-sm">
              <span className="text-2xl sm:text-4xl font-black text-zinc-900">{hours}</span>
              <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest pt-1">Hours</span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 flex flex-col items-center shadow-sm">
              <span className="text-2xl sm:text-4xl font-black text-zinc-900">{minutes}</span>
              <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest pt-1">Mins</span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 flex flex-col items-center shadow-sm">
              <span className="text-2xl sm:text-4xl font-black text-[#ff6a00] animate-pulse">{seconds}</span>
              <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest pt-1">Secs</span>
            </div>
          </div>

          {/* System Sync Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-700 flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-[#ff6a00]" />
                <span>Database Indexing & Catalog Calibration</span>
              </span>
              <span className="text-[#ff6a00] font-bold">{progress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#ff6a00] to-orange-400 rounded-full transition-all duration-700 shadow-md shadow-[#ff6a00]/30"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Services We Provide Grid */}
        <div className="pt-2 text-left space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6a00] uppercase">
              PARTSLY SERVICES & CAPABILITIES
            </h2>
            <p className="text-xl font-black text-zinc-950">What We Build & Deliver</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {MAINTENANCE_CONFIG.services.map((service, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gradient-to-b from-white to-orange-50/20 border border-zinc-200/80 hover:border-[#ff6a00]/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all space-y-2.5 group cursor-pointer backdrop-blur-sm shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#ff6a00]/10 text-[#ff6a00] flex items-center justify-center font-bold border border-[#ff6a00]/20 shadow-sm">
                    {idx === 0 && <DollarSign className="w-5 h-5" />}
                    {idx === 1 && <Layers className="w-5 h-5" />}
                    {idx === 2 && <Search className="w-5 h-5" />}
                    {idx === 3 && <Cpu className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/25">
                    {service.badge}
                  </span>
                </div>

                <h3 className="font-bold text-zinc-950 text-base group-hover:text-[#ff6a00] transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact Buttons (WhatsApp & Instagram - Email Removed) */}
        <div className="pt-4 max-w-xl mx-auto space-y-3">
          <div className="text-xs font-mono text-zinc-600">Need urgent hardware support or order status during maintenance?</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* WhatsApp Direct */}
            <a
              href={MAINTENANCE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-3 font-bold group cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <div className="p-2 rounded-xl bg-white/20 text-white font-bold group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-black text-white text-xs">WhatsApp Support</div>
                <div className="text-[11px] font-mono text-emerald-100">{MAINTENANCE_CONFIG.whatsappDisplay}</div>
              </div>
            </a>

            {/* Instagram Updates */}
            <a
              href={MAINTENANCE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#ff6a00] hover:bg-orange-600 text-white transition-all flex items-center justify-center gap-3 font-bold group cursor-pointer shadow-lg shadow-orange-500/20"
            >
              <div className="p-2 rounded-xl bg-white/20 text-white font-bold group-hover:scale-110 transition-transform">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-black text-white text-xs">Instagram Updates</div>
                <div className="text-[11px] font-mono text-orange-100">{MAINTENANCE_CONFIG.instagram}</div>
              </div>
            </a>
          </div>
        </div>

        {/* Staff Console Access Passcode Drawer */}
        <div className="pt-6 border-t border-zinc-200">
          {!showAdminLogin ? (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-800 inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Operations Staff & Admin Access →</span>
            </button>
          ) : (
            <form onSubmit={handleAdminBypass} className="max-w-xs mx-auto space-y-3 p-4 rounded-2xl bg-white border border-zinc-300 shadow-xl">
              <div className="text-xs font-mono font-bold text-zinc-900">Staff Console Passcode</div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={adminPasscode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAdminPasscode(e.target.value);
                    setAdminError(false);
                  }}
                  placeholder="Enter passcode..."
                  className="flex-1 bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
                />
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs cursor-pointer transition-colors shadow-md"
                >
                  Enter
                </button>
              </div>
              {adminError && <div className="text-[11px] text-red-500 font-mono">Invalid passcode. Try 'admin123'.</div>}
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-zinc-500 font-mono z-10 border-t border-zinc-200 bg-white/50 backdrop-blur-md">
        © 2026 Partsly Inc. All rights reserved. • High-Speed Hardware Engineering & Sourcing
      </footer>
    </div>
  );
}
