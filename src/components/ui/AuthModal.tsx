"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { BRAND } from "@/config/brand";
import { PartslyLogo } from "@/components/ui/PartslyLogo";
import {
  X,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

type AuthTab = "signin" | "signup";

export function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    user,
    logout,
    loginWithPassword,
    signup,
    addToast,
    authRedirectUrl,
    setAuthRedirectUrl,
  } = useApp();

  const [tab, setTab] = useState<AuthTab>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign In fields
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign Up fields
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suPhone, setSuPhone] = useState("");

  // Forgot password
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isAuthModalOpen) {
      setError(null);
      setLoading(false);
      setShowPassword(false);
      setForgotMode(false);
      setForgotSent(false);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!siEmail.trim() || !siPassword) {
      setError("Please enter your email or mobile number and password");
      return;
    }
    setLoading(true);
    const result = await loginWithPassword(siEmail.trim(), siPassword);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Invalid mobile/email or password. Please try again.");
    } else {
      // redirect handled in AppContext
      if (authRedirectUrl) {
        const dest = authRedirectUrl;
        setAuthRedirectUrl(null);
        window.location.href = dest;
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!suName.trim()) { setError("Please enter your full name"); return; }
    if (!suEmail.trim() || !suEmail.includes("@")) { setError("Please enter a valid email address"); return; }
    if (suPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (suPassword !== suConfirm) { setError("Passwords do not match"); return; }

    setLoading(true);
    const result = await signup({
      name: suName.trim(),
      email: suEmail.trim().toLowerCase(),
      password: suPassword,
      phone: suPhone.trim() || undefined,
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Could not create account. Email or mobile may already be in use.");
      if (result.error?.toLowerCase().includes("already")) {
        setSiEmail(suEmail.trim() || suPhone.trim());
      }
    } else {
      if (authRedirectUrl) {
        const dest = authRedirectUrl;
        setAuthRedirectUrl(null);
        window.location.href = dest;
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!forgotEmail.trim()) { setError("Please enter your email address"); return; }
    setLoading(true);
    // Call password reset API
    try {
      const res = await fetch("/api/auth/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      });
      setLoading(false);
      if (res.ok) {
        setForgotSent(true);
      } else {
        const data = await res.json();
        // Always show "sent" to prevent email enumeration
        setForgotSent(true);
      }
    } catch {
      setLoading(false);
      setForgotSent(true); // Still show success to prevent enumeration
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[92vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3.5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3">
            <PartslyLogo size="sm" href="" />
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* ── LOGGED IN STATE ── */}
          {user ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center text-[#ff6a00] font-black text-base">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">{user.name}</div>
                  <div className="text-xs text-slate-500 truncate">{user.email || user.phone}</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-[#ff6a00] border border-orange-200">
                      {user.role}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/account"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-center text-xs font-bold text-slate-800 transition-colors"
                >
                  My Account
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-center text-xs font-bold text-slate-800 transition-colors"
                >
                  My Orders
                </Link>
              </div>

              <button
                onClick={logout}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors"
              >
                Sign Out of {BRAND.displayName}
              </button>
            </div>
          ) : forgotMode ? (
            /* ── FORGOT PASSWORD ── */
            <div className="space-y-5">
              {forgotSent ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Check your email</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      If an account exists for <strong>{forgotEmail}</strong>, we've sent a password reset link.
                    </p>
                  </div>
                  <button
                    onClick={() => { setForgotMode(false); setForgotSent(false); }}
                    className="text-xs text-[#ff6a00] font-bold hover:underline"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Reset Password</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your email and we'll send a reset link.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          autoFocus
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-2xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#ff6a00]/20 transition-all disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset Link</span>}
                    </button>
                  </form>

                  <button
                    onClick={() => { setForgotMode(false); setError(null); }}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-900 font-medium"
                  >
                    ← Back to Sign In
                  </button>
                </>
              )}
            </div>
          ) : (
            /* ── SIGN IN / SIGN UP ── */
            <div className="space-y-5">
              {/* Tabs */}
              <div className="flex rounded-2xl bg-slate-100 p-1 gap-1">
                <button
                  onClick={() => { setTab("signin"); setError(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    tab === "signin"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setTab("signup"); setError(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    tab === "signup"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span className="font-semibold">{error}</span>
                  </div>
                  {error.toLowerCase().includes("already") && tab === "signup" && (
                    <button
                      type="button"
                      onClick={() => {
                        setTab("signin");
                        setError(null);
                      }}
                      className="text-[11px] font-bold text-[#ff6a00] hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Click here to Sign In with this account</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* ── SIGN IN FORM ── */}
              {tab === "signin" && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email or Mobile Number
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        autoFocus
                        required
                        value={siEmail}
                        onChange={(e) => { setSiEmail(e.target.value); setError(null); }}
                        placeholder="e.g. you@gmail.com or 9014808515"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => { setForgotMode(true); setError(null); setForgotEmail(siEmail); }}
                        className="text-[11px] text-[#ff6a00] hover:underline font-semibold"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={siPassword}
                        onChange={(e) => { setSiPassword(e.target.value); setError(null); }}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#ff6a00]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    New to {BRAND.displayName}?{" "}
                    <button
                      type="button"
                      onClick={() => { setTab("signup"); setError(null); }}
                      className="text-[#ff6a00] font-bold hover:underline"
                    >
                      Create an account
                    </button>
                  </p>
                </form>
              )}

              {/* ── SIGN UP FORM ── */}
              {tab === "signup" && (
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name <span className="text-[#ff6a00]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        autoFocus
                        required
                        value={suName}
                        onChange={(e) => { setSuName(e.target.value); setError(null); }}
                        placeholder="e.g. Arjun Sharma"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-[#ff6a00]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={suEmail}
                        onChange={(e) => { setSuEmail(e.target.value); setError(null); }}
                        placeholder="you@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mobile Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={suPhone}
                      onChange={(e) => setSuPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Password <span className="text-[#ff6a00]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={suPassword}
                        onChange={(e) => { setSuPassword(e.target.value); setError(null); }}
                        placeholder="At least 6 characters"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Confirm Password <span className="text-[#ff6a00]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={suConfirm}
                        onChange={(e) => { setSuConfirm(e.target.value); setError(null); }}
                        placeholder="Re-enter password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 mt-1 rounded-2xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#ff6a00]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => { setTab("signin"); setError(null); }}
                      className="text-[#ff6a00] font-bold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure & Encrypted</span>
                </div>
                <div className="w-px h-3 bg-slate-200" />
                <p className="text-[11px] text-slate-400">
                  <Link href="/privacy" className="hover:text-slate-600 underline" onClick={() => setIsAuthModalOpen(false)}>Privacy</Link>
                  {" · "}
                  <Link href="/terms" className="hover:text-slate-600 underline" onClick={() => setIsAuthModalOpen(false)}>Terms</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}