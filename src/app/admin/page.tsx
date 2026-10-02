"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Cpu,
  Wrench,
  ShieldCheck,
  Globe,
  Layers,
  Activity,
  Package,
  Download,
  Plus,
  Home,
  User,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans selection:bg-[#ff6a00] selection:text-white">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-[#ff6a00] text-white text-xs font-bold shadow-xl animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* ── Left Sidebar Navigation ── */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ff6a00] font-black text-white text-base flex items-center justify-center">
              P
            </div>
            <span className="font-black text-[#ff6a00] tracking-wider text-base uppercase">PARTSLY ADMIN</span>
          </div>

          <nav className="space-y-1 text-xs font-bold">
            <Link
              href="/admin"
              className="px-4 py-3 rounded-2xl bg-[#ff6a00] text-white flex items-center gap-3 shadow-md shadow-[#ff6a00]/20"
            >
              <Activity className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>

            <Link
              href="/"
              className="px-4 py-3 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-3 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>View Maintenance Page</span>
            </Link>
          </nav>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
          <div className="font-bold text-white">Staff Console Active</div>
          <div>Node: US-EAST-CORE-01</div>
          <div className="text-[#ff6a00] font-mono font-bold">256-Bit TLS Active</div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl">
        {/* Top Operational Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-orange-500/10 text-[#ff6a00] border border-orange-500/20 font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>STAFF ACCESS OPEN</span>
              <span>•</span>
              <span>NODE: US-EAST-CORE-01</span>
            </div>
            <h1 className="text-3xl font-black text-white">Operations Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast("Exporting operational logs...")}
              className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-zinc-400" />
              <span>Export Logs</span>
            </button>

            <button
              onClick={() => showToast("Triggering batch dispatch queue...")}
              className="py-2.5 px-5 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-[#ff6a00]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Batch Run</span>
            </button>
          </div>
        </div>

        {/* ── 4 KPI Stats Widgets ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">DAILY ORDERS</span>
              <ShoppingBag className="w-4 h-4 text-[#ff6a00]" />
            </div>
            <div className="text-3xl font-black text-white">1,428</div>
            <div className="text-[11px] font-bold text-emerald-400">↗ +12.4% vs yesterday</div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">ACTIVE SOURCING</span>
              <Globe className="w-4 h-4 text-[#ff6a00]" />
            </div>
            <div className="text-3xl font-black text-white">384</div>
            <div className="text-[11px] font-bold text-emerald-400">✓ 94.2% on schedule</div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">PCB QUEUE</span>
              <Layers className="w-4 h-4 text-[#ff6a00]" />
            </div>
            <div className="text-3xl font-black text-white">64</div>
            <div className="text-[11px] text-amber-400 font-bold">12 urgent • avg 4.2h lead</div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">REVENUE (MTD)</span>
              <TrendingUp className="w-4 h-4 text-[#ff6a00]" />
            </div>
            <div className="text-3xl font-black text-white">$842.5K</div>
            <div className="text-[11px] font-bold text-emerald-400">↗ +8.1% vs target</div>
          </div>
        </div>

        {/* ── Main Dashboard Layout: Orders & Sidebars ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Recent Orders & Routing Table */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Recent Orders & Routing</h3>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">Live Stream</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-zinc-500 font-mono text-[10px] uppercase border-b border-zinc-800">
                    <tr>
                      <th className="py-2.5 px-3">ORDER ID</th>
                      <th className="py-2.5 px-3">CUSTOMER</th>
                      <th className="py-2.5 px-3">ITEMS</th>
                      <th className="py-2.5 px-3">TOTAL</th>
                      <th className="py-2.5 px-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 font-medium text-zinc-300">
                    {[
                      { id: "#ORD-98421", customer: "Apex Robotics Lab", items: "M8 Titanium Bolts (500x), PCB v2.1", total: "$2,450.00", status: "Processing", badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30" },
                      { id: "#ORD-98420", customer: "Krylon Aerospace", items: "Custom CNC Alum Chassis", total: "$8,120.50", status: "Dispatched", badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" },
                      { id: "#ORD-98419", customer: "Nexus IoT Solutions", items: "SMD Resistor Reel 10k", total: "$145.00", status: "Delivered", badge: "bg-blue-500/20 text-blue-300 border border-blue-500/30" },
                      { id: "#ORD-98418", customer: "Veloce EV Systems", items: "Copper Busbars (12x)", total: "$1,890.00", status: "Processing", badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30" },
                      { id: "#ORD-98417", customer: "Quantum Sensors Inc", items: "Flex PCB Assembly", total: "$4,310.00", status: "Sourcing", badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30" },
                    ].map((row) => (
                      <tr key={row.id} className="hover:bg-zinc-800/60 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#ff6a00]">{row.id}</td>
                        <td className="py-3 px-3 text-white font-bold">{row.customer}</td>
                        <td className="py-3 px-3 text-zinc-400">{row.items}</td>
                        <td className="py-3 px-3 font-mono font-bold text-white">{row.total}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${row.badge}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warehouse Fulfillment & Routing Widget */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-base font-bold text-white">Warehouse Fulfillment & Routing</h3>
                <span className="text-xs font-mono text-zinc-400">Hub: Frankfurt DC-2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-zinc-400">PICKING ACCURACY</div>
                  <div className="text-2xl font-black text-white">99.8%</div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-[#ff6a00] rounded-full" style={{ width: "99.8%" }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-zinc-400">PACKING LATENCY</div>
                  <div className="text-2xl font-black text-white">14.2 min</div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-[#ff6a00] rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-zinc-400">DISPATCH SUCCESS</div>
                  <div className="text-2xl font-black text-white">98.9%</div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-[#ff6a00] rounded-full" style={{ width: "98.9%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* PCB & Service Queue Box */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white">PCB & Service Queue</h3>
                <Layers className="w-4 h-4 text-zinc-500" />
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { name: "4-Layer Rigid-Flex Board", details: "Batch #PCB-3392 • 12 pcs", status: "Etching", badge: "bg-amber-500/20 text-amber-300" },
                  { name: "SMT Stencil Laser Cut", details: "Batch #PCB-3391 • 5 pcs", status: "Testing", badge: "bg-emerald-500/20 text-emerald-300" },
                  { name: "High-Freq RF Substrate", details: "Batch #PCB-3390 • 20 pcs", status: "CNC Mill", badge: "bg-blue-500/20 text-blue-300" },
                ].map((item) => (
                  <div key={item.name} className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{item.details}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.badge}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Sourcing Feed Box */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white">Global Sourcing Feed</h3>
                <Globe className="w-4 h-4 text-zinc-500" />
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { country: "JP", name: "Kyocera MLCC 10uF", supplier: "Supplier: Tokyo Semi-Parts", status: "Matched", badge: "text-emerald-400" },
                  { country: "DE", name: "Inconel 718 Bar Stock", supplier: "Supplier: Ruhr Metall AG", status: "In Transit", badge: "text-amber-400" },
                  { country: "US", name: "Molex Micro-Fit Connectors", supplier: "Supplier: Chicago Hub", status: "Verified", badge: "text-emerald-400" },
                ].map((item) => (
                  <div key={item.name} className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#ff6a00] font-black text-xs flex items-center justify-center shrink-0">
                      {item.country}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate">{item.name}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{item.supplier}</div>
                    </div>
                    <span className={`text-[10px] font-bold ${item.badge}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit & Payments Box */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white">Audit & Payments</h3>
                <ShieldCheck className="w-4 h-4 text-zinc-500" />
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">Stripe Gateway Payout</span>
                <span className="font-mono font-bold text-white">+$42,150.00</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">API Rate Limit Check</span>
                <span className="font-bold text-emerald-400">Normal (14ms)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">ERP Sync Status</span>
                <span className="font-bold text-white">Synced 2m ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
