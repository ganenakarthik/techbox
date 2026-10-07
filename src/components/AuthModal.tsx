"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SOLE_ADMIN_EMAIL } from "@/lib/security";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, signup } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">(authModalMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isAuthModalOpen) return null;

  const isEmailSoleAdmin = email.trim().toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.message);
        } else {
          setSuccessMsg(res.message);
        }
      } else {
        const res = await signup(name, email, password);
        if (!res.success) {
          setErrorMsg(res.message);
        } else {
          setSuccessMsg(res.message);
        }
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail(SOLE_ADMIN_EMAIL);
    setPassword("admin123");
    setName("Ganen Karthik");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
        >
          ✕
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3 py-1 border border-[var(--line)]">
            <span className="text-lg">🛡️</span>
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Partsly Web Security & RBAC</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--text)]">
            {mode === "login" ? "Account Sign In" : "Create New Account"}
          </h2>
          <p className="text-xs text-[var(--muted)]">
            Access components, PCB quotes, order history and role-based permissions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-1 text-xs font-bold">
          <button
            onClick={() => {
              setMode("login");
              setErrorMsg("");
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === "login" ? "bg-[var(--accent)] text-white shadow" : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            🔑 Sign In
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setErrorMsg("");
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === "signup" ? "bg-[var(--accent)] text-white shadow" : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            ✨ Sign Up
          </button>
        </div>

        {/* Live Admin Access Indicator */}
        {email && (
          <div
            className={`rounded-xl p-3 text-xs flex items-center justify-between border ${
              isEmailSoleAdmin
                ? "bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold"
                : "bg-blue-500/10 border-blue-500/30 text-blue-400"
            }`}
          >
            <span>Role Allocation Preview:</span>
            <span className="font-mono uppercase font-extrabold">
              {isEmailSoleAdmin ? "👑 Sole Admin Privilege Granted" : "👤 Standard Customer Account"}
            </span>
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400 font-medium">
            ✓ {successMsg}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === "signup" && (
            <div>
              <label className="block mb-1 font-bold text-[var(--text)]">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ganen Karthik"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-bold text-[var(--text)]">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. ganenakartiks7@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block mb-1 font-bold text-[var(--text)]">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[var(--accent)] py-3 text-xs font-bold text-white shadow-lg transition-transform hover:opacity-95 disabled:opacity-50"
          >
            {isSubmitting ? "Authenticating & Hashing..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        {/* Quick Demo Fill for Sole Admin */}
        <div className="border-t border-[var(--line)] pt-3 text-center">
          <button
            type="button"
            onClick={handleQuickFillAdmin}
            className="text-[11px] font-bold text-amber-500 hover:underline"
          >
            ⚡ Auto-Fill Sole Admin Credentials ({SOLE_ADMIN_EMAIL})
          </button>
        </div>
      </div>
    </div>
  );
}
