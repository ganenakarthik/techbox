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
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Layers,
  Activity,
  Package,
  Printer,
  Sparkles,
} from "lucide-react";
import { BRAND } from "@/config/brand";

export default function AdminDashboardPage() {
  const { user } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);

  useEffect(() => {
    async function loadAdminOverview() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/overview");
        if (res.status === 403 || res.status === 401) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }
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

  // Secondary layer of defense: If user is not admin/staff or API returned 403/401
  if (!loading && (accessDenied || (!user || (user.role !== "ADMIN" && user.role !== "STAFF")))) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">403 — Operations Console Locked</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md">
          Administrative privileges are restricted to verified Partsly campus operations leads and dispatch staff.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/login?redirect=/admin"
            className="px-5 py-2.5 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-bold text-xs shadow-md shadow-[#ff6a00]/20 transition-all"
          >
            Staff Login
          </Link>
          <Link
            href="/shop"
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

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
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
            {status}
          </span>
        );
      case "SHIPPED":
      case "PACKED":
      case "OUT_FOR_DELIVERY":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-[#ff6a00] border border-orange-200 font-mono">
            {status}
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 font-mono">
            CANCELLED
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 font-mono">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8 bg-white p-6 rounded-3xl border shadow-2xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ff6a00] text-white uppercase tracking-wider">
                Staff & DarkStore Operations Hub
              </span>
              <span className="text-[11px] text-slate-400 font-mono font-bold">10-Min Dispatch Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {BRAND.displayName} Operations Console
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time fulfillment metrics, runner dispatch logs, and campus inventory ledger.
            </p>
          </div>

          {/* Quick Navigation Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/orders"
              className="py-2.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white text-xs font-extrabold shadow-md shadow-[#ff6a00]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Manage Orders ({metrics.totalOrders})</span>
            </Link>
            <Link
              href="/admin/products"
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              Manage Catalog
            </Link>
            <Link
              href="/admin/inventory"
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              Inventory Ledger
            </Link>
            <Link
              href="/admin/tickets"
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              Helpdesk Desk
            </Link>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-[#ff6a00] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-bold text-slate-500 leading-tight">{kpi.title}</span>
                  <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00]">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">{kpi.value}</div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        kpi.badgeType === "warning"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : kpi.badgeType === "action"
                          ? "bg-orange-50 text-[#ff6a00] border-orange-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
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

        {/* Dual Grid: Live Orders Pipeline & System Audit Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Recent Orders Table (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#ff6a00]" />
                  <span>Recent Campus Dispatches</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Live order queue from engineering dropzones</p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-[#ff6a00] hover:underline flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading order queue...</div>
            ) : recentOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No active orders found in database.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-mono">
                      <th className="py-2.5">Order #</th>
                      <th className="py-2.5">Student / Campus</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentOrders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-900">
                          {order.orderNumber}
                        </td>
                        <td className="py-3">
                          <div className="font-bold text-slate-900">{order.recipientName}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {order.collegeName || order.recipientPhone}
                          </div>
                        </td>
                        <td className="py-3 font-black text-slate-900">
                          ₹{order.total}
                        </td>
                        <td className="py-3">
                          {renderStatusBadge(order.status)}
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href="/admin/orders"
                            className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#ff6a00] font-bold text-[11px] border border-orange-200 transition-colors inline-block"
                          >
                            Dispatch
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Audit Logs / Activity Stream (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Operations Audit Stream</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Real-time ledger events & staff actions</p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading audit events...</div>
            ) : recentAudits.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No recent audit logs.</div>
            ) : (
              <div className="space-y-3">
                {recentAudits.map((log: any) => (
                  <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900 font-mono uppercase text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{log.details || log.target}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
