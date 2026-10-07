"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function Mark() {
  return (
    <span className="brand-mark shrink-0" aria-hidden="true">
      <img src="/logo.png" alt="Partsly" className="h-7 w-7 object-contain rounded-md inline-block" />
    </span>
  );
}

export default function LoginPage() {
  const { login, signup } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const res = await login(identifier, password);
        if (!res.success) {
          setErrorMsg(res.message);
        } else {
          setSuccessMsg(res.message);
          setTimeout(() => router.push("/"), 800);
        }
      } else {
        const res = await signup(name, identifier, password);
        if (!res.success) {
          setErrorMsg(res.message);
        } else {
          setSuccessMsg(res.message);
          setTimeout(() => router.push("/"), 800);
        }
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wrap py-12 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Emblem Logo Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <Mark />
            <span className="text-2xl font-black tracking-tight text-[var(--text)]">PARTSLY</span>
          </Link>
        </div>

        {/* Amazon / Flipkart Style Auth Card */}
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-xl space-y-6">
          <h1 className="text-2xl font-black text-[var(--text)]">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>

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

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === "signup" && (
              <div>
                <label className="block mb-1.5 font-bold text-[var(--text)]">Your name</label>
                <input
                  type="text"
                  required
                  placeholder="First and last name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3.5 py-3 text-xs text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block mb-1.5 font-bold text-[var(--text)]">Email or mobile phone number</label>
              <input
                type="text"
                required
                placeholder="e.g. 9014808515 or name@domain.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3.5 py-3 text-xs text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 font-bold">
                <label className="text-[var(--text)]">Password</label>
                {mode === "login" && (
                  <button type="button" className="text-[11px] text-[var(--accent)] hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3.5 py-3 text-xs text-[var(--text)] focus:border-[var(--accent)] focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[var(--accent)] py-3.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition-transform active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : mode === "login" ? "Sign in" : "Create your Partsly account"}
            </button>
          </form>

          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            By continuing, you agree to Partsly&apos;s <span className="underline cursor-pointer">Conditions of Use</span> and <span className="underline cursor-pointer">Privacy Notice</span>.
          </p>

          <div className="border-t border-[var(--line)] pt-4 text-center space-y-3">
            <div className="text-[11px] text-[var(--muted)] font-bold">
              {mode === "login" ? "New to Partsly?" : "Already have an account?"}
            </div>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] py-2.5 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)] transition-all"
            >
              {mode === "login" ? "Create your Partsly account" : "Sign in to existing account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
