"use client";

import React, { useState } from "react";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"orders" | "utr" | "profile">("orders");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [email, setEmail] = useState("engineer@partsly.com");

  if (!isOpen) return null;

  const sampleOrders = [
    {
      id: "ORD-98241",
      date: "Oct 06, 2026",
      items: "2x ESP32-WROOM-32D, 1x NEMA 17 Stepper",
      total: 1147,
      status: "Dispatched (BlueDart: BD884192IN)",
      utr: "UTR-384792019482",
    },
    {
      id: "ORD-98112",
      date: "Sep 28, 2026",
      items: "Custom 2-Layer PCB Fabrication (10 Pcs)",
      total: 699,
      status: "Delivered",
      utr: "UTR-194820394812",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
              PA
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text)]">Partsly Engineer Portal</div>
              <div className="text-xs text-[var(--muted)]">{isLoggedIn ? email : "Guest User"}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-xs font-bold text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[var(--line)] bg-[var(--surface-2)]">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "orders"
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            📦 My Orders
          </button>
          <button
            onClick={() => setActiveTab("utr")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "utr"
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            💳 UTR Verification
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "profile"
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            👤 Account Details
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-[var(--muted)]">Recent Orders & Tracking</h3>
              {sampleOrders.map((ord) => (
                <div key={ord.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[var(--accent)]">{ord.id}</span>
                    <span className="text-[var(--muted)]">{ord.date}</span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[var(--text)]">{ord.items}</div>
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-2 text-xs">
                    <span className="text-emerald-500 font-semibold">✓ {ord.status}</span>
                    <span className="font-bold text-[var(--text)]">₹{ord.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "utr" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-[var(--muted)]">Bank UPI UTR History</h3>
              <p className="text-xs text-[var(--muted)]">
                All Indian UPI & UTR payment verification references linked to your registered phone number.
              </p>
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[var(--muted)]">UTR-384792019482</span>
                  <span className="text-emerald-500 font-bold">VERIFIED</span>
                </div>
                <div className="text-xs text-[var(--text)]">Amount: ₹1,147 • UPI ID: partsly@icici</div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-[var(--muted)]">Profile & Delivery Address</h3>
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] mb-1">GSTIN Number (Optional)</label>
                <input
                  type="text"
                  placeholder="27AAAAA0000A1Z5"
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
                />
              </div>
              <button
                onClick={() => setIsLoggedIn(!isLoggedIn)}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] py-2 text-xs font-bold text-[var(--text)] hover:bg-[var(--line)]"
              >
                {isLoggedIn ? "Log Out of Account" : "Sign In to Partsly Account"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
