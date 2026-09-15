"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Cpu,
  AlertTriangle,
  FileText,
  Wrench,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Layers,
  IndianRupee,
  Loader2,
  Activity,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAdminOverview() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/overview");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Admin overview fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminOverview();
  }, [user]);

  const metrics = data?.metrics || {
    totalOrders: 0,
    grossRevenue: 0,
    pendingOrders: 0,
    totalUsers: 0,
    lowStockCount: 0,
    totalProjects: 0,
  };

  const kpis = [
    { title: "Campus Revenue", value: `₹${Number(metrics.grossRevenue).toLocaleString("en-IN")}`, change: "PostgreSQL Live", icon: TrendingUp, badgeType: "success" },
    { title: "Total Orders", value: `${metrics.totalOrders}`, change: "Database Total", icon: ShoppingBag, badgeType: "success" },
    { title: "Pending Orders", value: `${metrics.pendingOrders}`, change: "Action Required", icon: Truck, badgeType: "action" },
    { title: "Student Accounts", value: `${metrics.totalUsers}`, change: "Registered", icon: Users, badgeType: "success" },
    { title: "Low Stock Alerts", value: `${metrics.lowStockCount}`, change: "Reorder Flag", icon: Cpu, badgeType: "warning" },
    { title: "Project Submissions", value: `${metrics.totalProjects}`, change: "In Pipeline", icon: FileText, badgeType: "action" },
  ];

  const recentOrders = data?.recentOrders || [];
  const recentAudits = data?.recentAudits || [];

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-mono">
            {status}
          </span>
        );
      case "SHIPPED":
      case "PACKED":
      case "OUT_FOR_DELIVERY":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/25 font-mono">
            {status}
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/25 font-mono">
            CANCELLED
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f] mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ff6a00] text-black uppercase">
              Staff & Operations Console
            </span>
            <span className="text-xs text-neutral-400 font-mono">PostgreSQL Single Source of Truth</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            TechBox Operations Hub
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time fulfillment metrics, automated inventory logs, and dispatch manager.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/products"
            className="py-2 px-3.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2e2e2e] text-xs font-semibold text-white"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/inventory"
            className="py-2 px-3.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2e2e2e] text-xs font-semibold text-white"
          >
            Inventory Stock
          </Link>
          <Link
            href="/admin/orders"
            className="py-2 px-3.5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black text-xs font-bold shadow-md shadow-[#ff6a00]/20"
          >
            Manage Orders ({metrics.totalOrders})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-[#111111] border border-[#222222] hover:border-[#ff6a00]/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-[11px] font-medium leading-tight">{kpi.title}</span>
                <Icon className="w-4 h-4 text-[#ff6a00]" />
              </div>
              <div>
                <div className="text-xl font-black text-white">{kpi.value}</div>
                <div className="mt-1.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                      kpi.badgeType === "warning"
                        ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        : kpi.badgeType === "action"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Dual Grid: Orders & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#111111] border border-[#262626] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Live Customer Orders</h2>
              <p className="text-xs text-neutral-400">Directly fetched from PostgreSQL `Order` table</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#ff6a00] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-neutral-500">
              <Loader2 className="w-6 h-6 animate-spin text-[#ff6a00] mx-auto mb-2" />
              <span>Fetching live orders...</span>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs">
              No orders placed yet. As students checkout, orders will populate here instantly.
            </div>
          ) : (
            <div className="space-y-2.5 pt-2">
              {recentOrders.map((ord: any) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl bg-[#161616] border border-[#222222] flex items-center justify-between text-xs hover:border-[#333333] transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                      {renderStatusBadge(ord.status)}
                    </div>
                    <div className="text-neutral-400 text-[11px]">
                      Student: <strong className="text-neutral-200">{ord.customerName}</strong> • {ord.itemCount} items
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-white">₹{ord.total}</div>
                    <Link
                      href={`/orders/${ord.orderNumber}`}
                      className="text-[10px] text-[#ff6a00] hover:underline"
                    >
                      Track Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Admin Audit Log (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#111111] border border-[#262626] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#ff6a00]" />
              <h2 className="text-base font-bold text-white">AdminAuditLog Ledger</h2>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">Immutable</span>
          </div>

          <p className="text-xs text-neutral-400">
            Automated operational trail recording inventory updates, status transitions, and quotes.
          </p>

          {recentAudits.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs">
              Audit log empty. Administrative operations will be tracked here.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {recentAudits.map((a: any) => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-[#161616] border border-[#222222] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#ff6a00] text-[11px]">
                      {a.action}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {new Date(a.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="text-neutral-300 font-medium text-[11px]">{a.target}</div>
                  {a.details && (
                    <div className="text-neutral-400 text-[10px] leading-snug">{a.details}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
