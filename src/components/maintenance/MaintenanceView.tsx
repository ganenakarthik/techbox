"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Clock,
  MessageSquare,
  Mail,
  Instagram,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Phone,
} from "lucide-react";
import { MAINTENANCE_CONFIG } from "@/config/maintenance";

export function MaintenanceView() {
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminError, setAdminError] = useState(false);

  const handleAdminBypass = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === "admin123" || adminPasscode === "partsly2026") {
      window.location.href = "/admin";
    } else {
      setAdminError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between selection:bg-[#ff6a00] selection:text-white font-sans relative overflow-hidden">
      {/* Background Animated Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#ff6a00]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Header Logo */}
      <header className="p-6 sm:p-10 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ff6a00] flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[#ff6a00]/30">
            P
          </div>
          <span className="text-xl font-black tracking-tight text-white">partsly</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>SCHEDULED MAINTENANCE</span>
        </div>
      </header>

      {/* Main Center Hero Box */}
      <main className="max-w-3xl mx-auto px-4 py-8 text-center space-y-8 z-10 my-auto">
        <div className="space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#ff6a00] to-amber-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-[#ff6a00]/30 animate-bounce" style={{ animationDuration: "3s" }}>
            <Wrench className="w-10 h-10" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            We Will Be <span className="text-[#ff6a00] underline decoration-amber-500/40 underline-offset-8">Right Back</span> Soon!
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-medium">
            {MAINTENANCE_CONFIG.description}
          </p>
        </div>

        {/* Live System Progress Bar */}
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 backdrop-blur-md shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Hardware Inventory Sync</span>
            </span>
            <span className="text-[#ff6a00] font-bold">85% Complete</span>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#ff6a00] to-amber-400 rounded-full transition-all duration-1000" style={{ width: "85%" }} />
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Est. Return: <strong>{MAINTENANCE_CONFIG.estimatedReturn}</strong></span>
            </span>
            <span>Refreshes Automatically</span>
          </div>
        </div>

        {/* Contact & Support Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs max-w-2xl mx-auto pt-2">
          {/* WhatsApp Direct */}
          <a
            href={MAINTENANCE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-all flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500 text-white font-bold group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="font-bold text-white text-xs">WhatsApp Support</div>
            <div className="text-[11px] font-mono text-emerald-400">{MAINTENANCE_CONFIG.whatsappDisplay}</div>
          </a>

          {/* Email Support */}
          <a
            href={`mailto:${MAINTENANCE_CONFIG.supportEmail}`}
            className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-[#ff6a00] text-white font-bold group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div className="font-bold text-white text-xs">Email Orders Desk</div>
            <div className="text-[11px] font-mono text-zinc-400">{MAINTENANCE_CONFIG.supportEmail}</div>
          </a>

          {/* Instagram Updates */}
          <a
            href={MAINTENANCE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 transition-all flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-pink-600 text-white font-bold group-hover:scale-110 transition-transform">
              <Instagram className="w-5 h-5" />
            </div>
            <div className="font-bold text-white text-xs">Instagram Updates</div>
            <div className="text-[11px] font-mono text-pink-400">{MAINTENANCE_CONFIG.instagram}</div>
          </a>
        </div>

        {/* Admin Access Section */}
        <div className="pt-4 border-t border-zinc-900">
          {!showAdminLogin ? (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Operations Staff & Admin Access →</span>
            </button>
          ) : (
            <form onSubmit={handleAdminBypass} className="max-w-xs mx-auto space-y-2">
              <div className="text-xs font-bold text-zinc-300">Staff Console Passcode:</div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={adminPasscode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAdminPasscode(e.target.value);
                    setAdminError(false);
                  }}
                  placeholder="Enter admin passcode..."
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
                />
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-[#ff6a00] text-white font-bold text-xs cursor-pointer"
                >
                  Enter
                </button>
              </div>
              {adminError && <div className="text-[11px] text-red-400">Invalid passcode. Contact ops lead.</div>}
            </form>
          )}
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="p-6 text-center text-xs text-zinc-600 font-mono z-10 border-t border-zinc-900">
        © 2026 Partsly Inc. All operations hardware systems reserved.
      </footer>
    </div>
  );
}
