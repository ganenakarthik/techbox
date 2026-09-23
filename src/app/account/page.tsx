"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  User,
  ShoppingBag,
  Search,
  Heart,
  MapPin,
  FileText,
  ShieldCheck,
  LogOut,
  LogIn,
  ChevronRight,
  ShieldAlert,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Box,
  FileCheck,
  Paperclip,
  Wrench,
} from "lucide-react";

export default function AccountPage() {
  const { user, logout, selectedCollege, addToast, setIsAuthModalOpen } = useApp();

  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Profile Form state
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [hostel, setHostel] = useState(user?.room || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setHostel(user.room || "");
      fetchOverview();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/overview");
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
      }
    } catch (err) {
      console.error("Failed to load account overview:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, room: hostel }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast("Campus profile updated successfully!", "success");
      } else {
        addToast(data.error || "Failed to update profile", "error");
      }
    } catch {
      addToast("Network error updating profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const stats = overview?.stats;
  const orders = overview?.orders || [];
  const quotes = overview?.quotes || [];
  const sourcingRequests = overview?.sourcingRequests || [];
  const pcbOrders = overview?.pcbOrders || [];
  const printOrders = overview?.printOrders || [];
  const documentOrders = overview?.documentOrders || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ff6a00]/15 text-[#ff6a00] text-[10px] font-bold uppercase tracking-wider">
              Partsly Command Center
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">{selectedCollege.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "Student"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your hardware orders, engineering quotes, component sourcing requests, and campus delivery settings.
          </p>
        </div>

        {(user?.role === "ADMIN" || user?.role === "STAFF") && (
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#ff6a00]" />
              <span>Admin Operations Hub</span>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Navigation Menu (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ff6a00]/15 text-[#ff6a00] font-black text-lg flex items-center justify-center shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "GU"}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-sm truncate">{user?.name || "Guest Student"}</div>
              <div className="text-xs text-slate-500 truncate">{user?.email || "Not signed in"}</div>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 font-mono">
                {user?.role || "GUEST"}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            {[
              { label: "Overview & Activity", href: "/account", icon: User, active: true },
              { label: "Orders & Tracking", href: "/account/orders", icon: ShoppingBag, badge: stats?.activeOrders },
              { label: "Engineering Quotes", href: "/account/quotes", icon: FileText, badge: stats?.actionRequiredQuotes },
              { label: "Projects & Services", href: "/account/services", icon: Wrench, badge: (stats?.totalSourcingRequests || 0) + pcbOrders.length + printOrders.length + documentOrders.length },
              { label: "Component Sourcing", href: "/services/component-sourcing", icon: Search },
              { label: "Hardware Wishlist", href: "/account/wishlist", icon: Heart },
              { label: "Support & Lab Helpdesk", href: "/account/support", icon: ShieldCheck },
            ].map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-semibold transition-all ${
                    link.active
                      ? "bg-[#ff6a00]/10 border-[#ff6a00] text-slate-900"
                      : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#ff6a00]" />
                    <span>{link.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!!link.badge && link.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#ff6a00] text-black">
                        {link.badge}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </Link>
              );
            })}
          </div>

          {user ? (
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 hover:text-[#ef4444] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-xs font-bold text-black transition-colors shadow-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>

        {/* Right: Workspace Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {!user ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00] mx-auto shadow-xs">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Sign in to your Partsly account</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Track active hardware orders, manage engineering quotes, view component sourcing status, and download custom project files.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="py-3 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold text-xs shadow-md shadow-[#ff6a00]/25 transition-all cursor-pointer"
                >
                  Sign In / Create Account
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center">
              <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-medium">Fetching real workspace data from Neon...</p>
            </div>
          ) : (
            <>
              {/* Metric Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link
                  href="/account/orders"
                  className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#ff6a00] transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between text-slate-400 group-hover:text-[#ff6a00]">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-[10px] font-bold font-mono uppercase">Orders</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{stats?.totalOrders || 0}</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {stats?.activeOrders ? `${stats.activeOrders} in progress` : "All delivered"}
                  </div>
                </Link>

                <Link
                  href="/account/quotes"
                  className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#ff6a00] transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between text-slate-400 group-hover:text-[#ff6a00]">
                    <FileText className="w-5 h-5" />
                    <span className="text-[10px] font-bold font-mono uppercase">Quotes</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{overview?.quotes?.length || 0}</div>
                  <div className="text-[11px] text-amber-600 font-semibold">
                    {stats?.actionRequiredQuotes ? `${stats.actionRequiredQuotes} action needed` : "None pending"}
                  </div>
                </Link>

                <Link
                  href="/account/services"
                  className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-[#ff6a00] transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between text-slate-400 group-hover:text-[#ff6a00]">
                    <Wrench className="w-5 h-5" />
                    <span className="text-[10px] font-bold font-mono uppercase">Services</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {(stats?.totalSourcingRequests || 0) + pcbOrders.length + printOrders.length + documentOrders.length}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Sourcing & PCB/3D</div>
                </Link>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <Paperclip className="w-5 h-5" />
                    <span className="text-[10px] font-bold font-mono uppercase">Files</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{stats?.totalFiles || 0}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Phase 6 persistent</div>
                </div>
              </div>

              {/* Action Required Banner if quotes awaiting customer */}
              {!!stats?.actionRequiredQuotes && stats.actionRequiredQuotes > 0 && (
                <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">Action Required: Quotes Awaiting Your Review</h4>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        You have {stats.actionRequiredQuotes} engineering quote(s) ready for review & UPI Scan & Pay acceptance.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/account/quotes"
                    className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors"
                  >
                    View Quotes
                  </Link>
                </div>
              )}

              {/* Recent Active Orders Section */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#ff6a00]" />
                    <span>Recent Orders</span>
                  </h3>
                  <Link href="/account/orders" className="text-xs text-[#ff6a00] hover:underline font-bold flex items-center gap-1">
                    <span>View All ({orders.length})</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 text-center space-y-3">
                    <Box className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-500">No component orders placed yet.</p>
                    <Link
                      href="/shop"
                      className="inline-block px-4 py-2 rounded-xl bg-[#ff6a00] text-black font-bold text-xs"
                    >
                      Browse Certified Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {orders.slice(0, 3).map((order: any) => (
                      <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900">{order.orderNumber}</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#ff6a00]/15 text-[#ff6a00]">
                              {order.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {order.items?.length || 0} item(s) • Total: ₹{order.total} • {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </div>
                        </div>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-colors"
                        >
                          Detail
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Engineering Quotes Section */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#ff6a00]" />
                    <span>Recent Engineering Quotes</span>
                  </h3>
                  <Link href="/account/quotes" className="text-xs text-[#ff6a00] hover:underline font-bold flex items-center gap-1">
                    <span>View All ({quotes.length})</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {quotes.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 text-center space-y-3">
                    <FileCheck className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-500">No engineering quotes received yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {quotes.slice(0, 3).map((quote: any) => (
                      <div key={quote.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900">{quote.quoteNumber}</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                              {quote.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Amount: ₹{quote.total} • Created: {new Date(quote.createdAt).toLocaleDateString("en-IN")}
                          </div>
                        </div>
                        <Link
                          href={`/account/quotes/${quote.id}`}
                          className="py-1.5 px-3 rounded-xl bg-[#ff6a00] text-black text-xs font-bold transition-colors"
                        >
                          Review
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Campus Delivery Profile Details Form */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#ff6a00]" />
                    <span>Default Campus Delivery Details</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    These details prefill your checkout when ordering components and project kits.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-600 block mb-1 font-semibold">Your Name:</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-1 font-semibold">Phone Number:</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">University / Institute:</label>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 flex items-center justify-between">
                      <span>{selectedCollege.name} ({selectedCollege.code})</span>
                      <GraduationCap className="w-4 h-4 text-[#ff6a00]" />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold font-mono">Hostel Block & Room / Lab:</label>
                    <input
                      type="text"
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      placeholder="e.g. Hostel Block B, Room 204"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="py-2.5 px-5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] disabled:opacity-50 text-black font-bold text-xs shadow-md shadow-[#ff6a00]/20 transition-all cursor-pointer"
                    >
                      {isSaving ? "Saving..." : "Save Profile Updates"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
