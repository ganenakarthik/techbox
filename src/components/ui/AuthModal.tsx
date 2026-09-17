"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { BRAND } from "@/config/brand";
import {
  X,
  Phone,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { validateAndNormalizeIndianPhone } from "@/lib/phone";

type AuthStep = "PHONE_INPUT" | "OTP_INPUT" | "NEW_USER_SETUP" | "PASSWORD_LOGIN" | "FORGOT_PASSWORD" | "RESET_PASSWORD";

export function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    user,
    logout,
    sendOtp,
    verifyOtp,
    registerWithPhone,
    loginWithPassword,
    addToast,
    authRedirectUrl,
  } = useApp();

  const [step, setStep] = useState<AuthStep>("PHONE_INPUT");
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isExistingUser, setIsExistingUser] = useState(false);

  // New user setup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password login fields
  const [passwordIdentifier, setPasswordIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Forgot / Reset password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset states when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setError(null);
      if (!user) {
        setStep("PHONE_INPUT");
        setOtp(["", "", "", "", "", ""]);
      }
    }
  }, [isAuthModalOpen, user]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  // Handle Phone input formatting (digits only, max 10)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(raw);
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const validation = validateAndNormalizeIndianPhone(phone);
    if (!validation.isValid) {
      setError(validation.error || "Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setLoading(true);
    const res = await sendOtp(validation.normalized, step === "FORGOT_PASSWORD" ? "RESET_PASSWORD" : "LOGIN");
    setLoading(false);

    if (res.success) {
      setFormattedPhone(validation.formatted);
      setIsExistingUser(Boolean(res.isExistingUser));
      setResendCooldown(res.resendAfterSeconds || 45);
      if (res.devOtp) {
        setDevOtp(res.devOtp);
      }
      setStep(step === "FORGOT_PASSWORD" ? "RESET_PASSWORD" : "OTP_INPUT");
    } else {
      setError(res.error || "Failed to send verification code. Please try again.");
    }
  };

  // Step 2: Handle OTP box inputs
  const handleOtpChange = (index: number, value: string) => {
    setError(null);
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    const nextOtp = [...otp];
    if (cleaned.length === 6) {
      // Pasted full OTP
      for (let i = 0; i < 6; i++) {
        nextOtp[i] = cleaned[i] || "";
      }
      setOtp(nextOtp);
      otpInputRefs.current[5]?.focus();
      return;
    }

    nextOtp[index] = cleaned[0];
    setOtp(nextOtp);

    // Auto-focus next input
    if (index < 5 && cleaned[0]) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    const validation = validateAndNormalizeIndianPhone(phone);
    setLoading(true);
    const res = await verifyOtp(validation.normalized, fullOtp, "LOGIN");
    setLoading(false);

    if (res.success) {
      if (res.isNewUser) {
        setStep("NEW_USER_SETUP");
      }
      // If existing user, verifyOtp automatically logged them in, updated user state, and closed modal
    } else {
      setError(res.error || "Verification failed");
      if (res.attemptsRemaining !== undefined) {
        setError(`Incorrect OTP. ${res.attemptsRemaining} attempts remaining.`);
      }
    }
  };

  // Step 3: Complete New User Setup
  const handleNewUserRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    const validation = validateAndNormalizeIndianPhone(phone);
    setLoading(true);
    const res = await registerWithPhone({
      phone: validation.normalized,
      name: name.trim(),
      email: email.trim() || undefined,
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to create account. Please try again.");
    }
  };

  // Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordIdentifier.trim() || !password) {
      setError("Please enter mobile/email and password");
      return;
    }

    setLoading(true);
    const ok = await loginWithPassword(passwordIdentifier.trim(), password);
    setLoading(false);

    if (!ok) {
      setError("Invalid mobile/email or password");
    }
  };

  // Password Reset Handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const validation = validateAndNormalizeIndianPhone(phone);
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: validation.normalized,
          otp: fullOtp,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast("Password reset successfully! Logged in.", "success");
        setIsAuthModalOpen(false);
        window.location.reload();
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("Network error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#ff6a00] flex items-center justify-center font-black text-white text-base shadow-md shadow-[#ff6a00]/20">
              P
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wide">
                {user ? "Student Account" : `${BRAND.displayName} Authentication`}
              </h3>
              <p className="text-[11px] text-slate-500">
                {user ? "Secure session active" : "Verified Campus & Engineering Access"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 bg-white">
          {/* If already logged in */}
          {user ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center text-[#ff6a00] font-black text-base">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "P"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">{user.name}</div>
                  <div className="text-xs text-slate-500 truncate">{user.phone || user.email}</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-[#ff6a00] border border-orange-200 font-mono">
                      {user.role}
                    </span>
                    {user.phoneVerified && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Mobile Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/account"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-center text-xs font-bold text-slate-800 transition-colors"
                >
                  My Account Hub
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
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors mt-2"
              >
                Sign Out of {BRAND.displayName}
              </button>
            </div>
          ) : (
            <div>
              {/* Error Banner */}
              {error && (
                <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: MOBILE INPUT */}
              {step === "PHONE_INPUT" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Welcome to {BRAND.displayName}</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your 10-digit mobile number for instant OTP sign-in.
                    </p>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Mobile Number
                      </label>
                      <div className="flex items-center rounded-2xl bg-slate-50 border border-slate-300 focus-within:border-[#ff6a00] focus-within:ring-1 focus-within:ring-[#ff6a00] overflow-hidden transition-all">
                        <div className="px-3.5 py-3 bg-slate-100 border-r border-slate-300 text-xs font-bold text-slate-700 flex items-center gap-1.5 select-none">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          autoFocus
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="w-full bg-transparent px-3.5 py-3 text-sm font-bold text-slate-900 tracking-wider placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || phone.length < 10}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-black text-sm transition-all shadow-md shadow-[#ff6a00]/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-white px-3 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                      or
                    </span>
                  </div>

                  {/* Alternative Login Options */}
                  <button
                    onClick={() => {
                      setError(null);
                      setStep("PASSWORD_LOGIN");
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Login with Password</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-500 pt-2 leading-relaxed">
                    By continuing, you agree to {BRAND.displayName}{" "}
                    <Link href="/terms" className="text-slate-700 underline hover:text-[#ff6a00]">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-slate-700 underline hover:text-[#ff6a00]">
                      Privacy Policy
                    </Link>.
                  </p>
                </div>
              )}

              {/* STEP 2: OTP VERIFICATION */}
              {step === "OTP_INPUT" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Verify Mobile Number</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter the 6-digit OTP sent to{" "}
                      <span className="text-slate-900 font-mono font-bold">{formattedPhone || `+91 ${phone}`}</span>
                    </p>
                  </div>

                  {/* DEV OTP Helper Banner */}
                  {devOtp && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#ff6a00]" />
                        <span>
                          Dev OTP: <strong className="font-mono text-slate-900 text-sm">{devOtp}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const digits = devOtp.split("");
                          setOtp(digits);
                          otpInputRefs.current[5]?.focus();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#ff6a00] text-white font-bold text-[11px] hover:bg-[#ea580c]"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    {/* 6 Digit OTP Input Boxes */}
                    <div className="flex items-center justify-between gap-2">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpInputRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={digit}
                          autoFocus={idx === 0}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-mono font-black bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.join("").length !== 6}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-black text-sm transition-all shadow-md shadow-[#ff6a00]/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Verify & Continue</span>
                      )}
                    </button>
                  </form>

                  {/* Resend and Change Number actions */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setOtp(["", "", "", "", "", ""]);
                        setStep("PHONE_INPUT");
                      }}
                      className="text-slate-500 hover:text-slate-900 transition-colors font-medium"
                    >
                      Change Number
                    </button>

                    {resendCooldown > 0 ? (
                      <span className="text-slate-400 font-mono text-[11px]">
                        Resend code in {resendCooldown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="text-[#ff6a00] hover:underline font-bold"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: NEW USER NAME SETUP */}
              {step === "NEW_USER_SETUP" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Complete Your Profile</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Phone verified. Let us know who you are to personalize your lab orders.
                    </p>
                  </div>

                  <form onSubmit={handleNewUserRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name <span className="text-[#ff6a00]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          autoFocus
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Arjun Sharma"
                          className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Campus Email <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="arjun@campus.edu"
                          className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !name.trim()}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-black text-sm transition-all shadow-md shadow-[#ff6a00]/25 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Complete Setup & Enter {BRAND.displayName}</span>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* PASSWORD LOGIN */}
              {step === "PASSWORD_LOGIN" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Login with Password</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your mobile number or email address and password.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Mobile Number or Email
                      </label>
                      <input
                        type="text"
                        required
                        autoFocus
                        value={passwordIdentifier}
                        onChange={(e) => setPasswordIdentifier(e.target.value)}
                        placeholder="9876543210 or student@campus.edu"
                        className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">Password</label>
                        <button
                          type="button"
                          onClick={() => {
                            setError(null);
                            setStep("FORGOT_PASSWORD");
                          }}
                          className="text-[11px] text-[#ff6a00] hover:underline font-semibold"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-black text-sm transition-all shadow-md shadow-[#ff6a00]/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
                    </button>
                  </form>

                  {/* Switch to OTP */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setStep("PHONE_INPUT");
                      }}
                      className="text-xs text-[#ff6a00] hover:underline font-bold"
                    >
                      ← Login with Mobile OTP instead
                    </button>
                  </div>
                </div>
              )}

              {/* FORGOT PASSWORD: ENTER MOBILE */}
              {step === "FORGOT_PASSWORD" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Forgot Password</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your registered 10-digit mobile number to receive a password reset OTP.
                    </p>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Registered Mobile Number
                      </label>
                      <div className="flex items-center rounded-2xl bg-slate-50 border border-slate-300 focus-within:border-[#ff6a00] overflow-hidden">
                        <div className="px-3.5 py-3 bg-slate-100 border-r border-slate-300 text-xs font-bold text-slate-700">
                          +91
                        </div>
                        <input
                          type="tel"
                          autoFocus
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="w-full bg-transparent px-3.5 py-3 text-sm font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || phone.length < 10}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-black text-sm shadow-md shadow-[#ff6a00]/20"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset OTP</span>}
                    </button>
                  </form>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setStep("PHONE_INPUT");
                      }}
                      className="text-xs text-slate-500 hover:text-slate-900 font-medium"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </div>
              )}

              {/* RESET PASSWORD: OTP + NEW PASSWORD */}
              {step === "RESET_PASSWORD" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Set New Password</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter the reset OTP sent to <strong className="text-slate-900">{phone}</strong> and your new password.
                    </p>
                  </div>

                  {devOtp && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                      <span>Dev OTP: <strong>{devOtp}</strong></span>
                      <button
                        type="button"
                        onClick={() => setOtp(devOtp.split(""))}
                        className="text-[11px] font-bold text-[#ff6a00] underline"
                      >
                        Autofill
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">6-Digit OTP</label>
                      <div className="flex gap-2">
                        {otp.map((d, i) => (
                          <input
                            key={i}
                            ref={(el) => { otpInputRefs.current[i] = el; }}
                            type="text"
                            maxLength={1}
                            value={d}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className="w-11 h-12 text-center text-base font-mono font-black bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.join("").length !== 6 || !newPassword}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-black text-sm shadow-md shadow-[#ff6a00]/20"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Reset Password & Login</span>}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
