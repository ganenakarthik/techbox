"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  FileText,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ShieldAlert,
  GraduationCap,
} from "lucide-react";

export default function AccountPage() {
  const { user, logout, switchRole, selectedCollege, addToast } = useApp();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [hostel, setHostel] = useState(user?.room || "");
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setHostel(user.room || "");
    }
  }, [user]);

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Student Account</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your campus delivery address, active project orders, and support tickets.
          </p>
        </div>

        {(user?.role === "ADMIN" || user?.role === "STAFF") && (
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#ff6a00]/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Operations Hub</span>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Navigation Menu (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ff6a00]/15 text-[#ff6a00] font-black text-lg flex items-center justify-center">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "ST"}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-sm truncate">{user?.name || "Student User"}</div>
              <div className="text-xs text-slate-500 truncate">{user?.email || "student@srm.edu"}</div>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-[#ff6a00]/20 text-[#ff6a00]">
                {user?.role}
              </span>
            </div>
          </div>

          {[
            { label: "Profile & Campus Details", href: "/account", icon: User, active: true },
            { label: "Orders & Live Tracking", href: "/account/orders", icon: ShoppingBag },
            { label: "Project Hardware Wishlist", href: "/account/wishlist", icon: Heart },
            { label: "Support & Lab Helpdesk", href: "/account/support", icon: ShieldCheck },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-semibold transition-colors ${
                  link.active
                    ? "bg-[#ff6a00]/10 border-[#ff6a00] text-slate-900"
                    : "bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#ff6a00]" />
                  <span>{link.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-500 hover:text-[#ef4444] transition-colors mt-4"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Right: Profile Details Form (8 cols) */}
        <div className="lg:col-span-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Default Campus Delivery Details</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These details will prefill your checkout when ordering components and project kits.
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Phone Number:</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">University / Institute:</label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 flex items-center justify-between">
                  <span>{selectedCollege.name} ({selectedCollege.code})</span>
                  <MapPin className="w-4 h-4 text-[#ff6a00]" />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Hostel Block & Room / Lab:</label>
                <input
                  type="text"
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="py-2.5 px-5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] disabled:opacity-50 text-black font-bold text-xs shadow-md shadow-[#ff6a00]/20 transition-all"
                >
                  {isSaving ? "Saving..." : "Save Profile Updates"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
