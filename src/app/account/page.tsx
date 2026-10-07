"use client";

import React, { useState } from "react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "utr" | "profile">("orders");
  const [email, setEmail] = useState("engineer@partsly.com");
  const [gstin, setGstin] = useState("27AAAAA0000A1Z5");

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
    {
      id: "ORD-97980",
      date: "Sep 15, 2026",
      items: "Partsly Pro PETG Filament 1kg Spool",
      total: 1199,
      status: "Delivered",
      utr: "UTR-994820192841",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-[var(--line)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Engineer Account & Order Tracking Portal</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">Manage registered profile, GSTIN invoicing details, order dispatches, and UPI UTR payment history.</p>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--line)] bg-[var(--surface-2)]">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "orders"
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)] font-bold"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            📦 Recent Orders & Shipments
          </button>
          <button
            onClick={() => setActiveTab("utr")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "utr"
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)] font-bold"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            💳 Bank UPI & UTR Verification Log
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "profile"
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)] font-bold"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            👤 Profile & GSTIN Settings
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6">
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Active Orders & Shipping Status</h3>
              <div className="space-y-3">
                {sampleOrders.map((ord) => (
                  <div key={ord.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[var(--accent)]">{ord.id}</span>
                      <span className="text-[var(--muted)]">{ord.date}</span>
                    </div>
                    <div className="text-sm font-semibold text-[var(--text)]">{ord.items}</div>
                    <div className="text-xs font-mono text-[var(--muted)]">Payment Ref: {ord.utr}</div>
                    <div className="mt-2 flex items-center justify-between border-t border-[var(--line)] pt-2 text-xs">
                      <span className="text-emerald-500 font-bold">✓ {ord.status}</span>
                      <span className="font-extrabold text-[var(--text)]">Total: ₹{ord.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "utr" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Indian Bank UPI & UTR Reference Ledger</h3>
              <div className="space-y-3">
                {sampleOrders.map((ord) => (
                  <div key={ord.id} className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-xs font-mono">
                    <div>
                      <div className="font-bold text-[var(--text)]">{ord.utr}</div>
                      <div className="text-[var(--muted)]">Linked to Order {ord.id} ({ord.date})</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-500 font-bold">VERIFIED & SETTLED</div>
                      <div className="text-[var(--text)]">₹{ord.total}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-4 max-w-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Organization & Tax Profile</h3>
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] mb-1">Account Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] mb-1">GSTIN Number (For Input Tax Credit Invoices)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-xs font-mono font-bold text-[var(--text)]"
                />
              </div>
              <button
                onClick={() => alert("Profile updated successfully!")}
                className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-xs font-bold text-white hover:opacity-90"
              >
                Save Profile Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
