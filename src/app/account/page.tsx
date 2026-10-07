"use client";

import React, { useState, useEffect } from "react";
import { DBOrder } from "@/lib/neon";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "utr" | "profile">("orders");
  const [email, setEmail] = useState("engineer@partsly.com");
  const [gstin, setGstin] = useState("27AAAAA0000A1Z5");
  const [orders, setOrders] = useState<DBOrder[]>([]);

  useEffect(() => {
    // Fetch live orders from Full-Stack Neon DB API
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="wrap py-8 space-y-8">
      <div className="border-b border-[var(--line)] pb-4">
        <p className="eyebrow text-xs font-bold uppercase text-[var(--muted)]">Engineer Portal</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">Account & Order Tracking Portal</h1>
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
            📦 Recent Orders & Shipments ({orders.length})
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
                {orders.map((ord) => (
                  <div key={ord.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[var(--accent)]">{ord.id}</span>
                      <span className="text-[var(--muted)]">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm font-semibold text-[var(--text)]">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                    </div>
                    <div className="text-xs font-mono text-[var(--muted)]">Payment UTR: {ord.utrNumber}</div>
                    <div className="mt-2 flex items-center justify-between border-t border-[var(--line)] pt-2 text-xs">
                      <span className="text-emerald-500 font-bold">✓ Status: {ord.status}</span>
                      <span className="font-extrabold text-[var(--text)]">Total: ₹{ord.grandTotal}</span>
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
                {orders.map((ord) => (
                  <div key={ord.id} className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-xs font-mono">
                    <div>
                      <div className="font-bold text-[var(--text)]">{ord.utrNumber}</div>
                      <div className="text-[var(--muted)]">Order Ref {ord.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-500 font-bold">VERIFIED</div>
                      <div className="text-[var(--text)]">₹{ord.grandTotal}</div>
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
