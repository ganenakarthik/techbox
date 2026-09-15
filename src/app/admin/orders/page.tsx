"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Truck, Search, CheckCircle2, ArrowRight, Clock, MapPin, Eye, Loader2, RotateCcw } from "lucide-react";

export default function AdminOrdersPage() {
  const { addToast, user } = useApp();
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "ALL") params.set("status", filter);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 150);
    return () => clearTimeout(timer);
  }, [filter, searchQuery, user]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          checkpointNote: `Campus runner dispatched to gate (${newStatus})`,
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        addToast(`Order updated to ${newStatus} with live checkpoint!`, "success");
      } else {
        const err = await res.json();
        addToast(err.error || "Failed to update order", "error");
      }
    } catch {
      addToast("Network error updating status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerifyPayment = async (orderId: string, action: "APPROVE" | "REJECT") => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/verify-payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  paymentStatus: action === "APPROVE" ? "PAYMENT_VERIFIED" : "PAYMENT_FAILED",
                  status: action === "APPROVE" && o.status === "PENDING" ? "CONFIRMED" : o.status,
                }
              : o
          )
        );
        addToast(
          action === "APPROVE"
            ? "Payment verified & order marked CONFIRMED!"
            : "Payment rejected. Customer notified.",
          action === "APPROVE" ? "success" : "warning"
        );
      } else {
        addToast(data.error || "Failed to update payment status", "error");
      }
    } catch {
      addToast("Network error verifying payment", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f] mb-8">
        <div>
          <div className="text-xs text-neutral-400 mb-1">
            <Link href="/admin" className="hover:text-white">Admin</Link> / <span className="text-white">Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Campus Order Management</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Update order lifecycle states, tracking checkpoints, and dispatch campus runners.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, student, phone..."
              className="w-64 bg-[#141414] border border-[#262626] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6a00]"
            />
          </div>
          <button
            onClick={fetchOrders}
            className="p-2.5 rounded-xl bg-[#1c1c1c] border border-[#262626] text-neutral-400 hover:text-white"
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {["ALL", "PAYMENT_SUBMITTED", "PENDING", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === st
                ? "bg-[#ff6a00] text-black"
                : "bg-[#141414] text-neutral-400 hover:text-white border border-[#262626]"
            }`}
          >
            {st === "PAYMENT_SUBMITTED" ? "⚡ Needs UTR Verification" : st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-[#111111] border border-[#262626] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#161616] text-neutral-400 font-bold border-b border-[#262626]">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Student & Contact</th>
                <th className="p-4">Campus Destination</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment & UTR</th>
                <th className="p-4">Live Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    <Loader2 className="w-6 h-6 animate-spin text-[#ff6a00] mx-auto mb-2" />
                    <span>Loading orders from database...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    No orders match current filter.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#151515] transition-colors">
                    <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                      {ord.orderNumber}
                      {ord.trackingNumber && (
                        <div className="text-[10px] text-[#ff6a00] font-normal mt-0.5">
                          {ord.trackingNumber}
                        </div>
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{ord.recipientName || ord.customerName}</div>
                      <div className="text-[11px] text-neutral-400">{ord.recipientPhone || ord.customerEmail}</div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="text-white truncate">{ord.campusDetail}</div>
                    </td>

                    <td className="p-4 font-bold text-white whitespace-nowrap">
                      ₹{ord.total}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-mono uppercase text-[10px] text-neutral-400">
                          {ord.paymentMethod}
                        </span>
                        {ord.paymentStatus === "PAYMENT_VERIFIED" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800/50">
                            VERIFIED
                          </span>
                        )}
                        {ord.paymentStatus === "PAYMENT_SUBMITTED" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/70 text-amber-400 border border-amber-800/50 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            UTR SUBMITTED
                          </span>
                        )}
                        {ord.paymentStatus === "PAYMENT_PENDING" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-900 text-neutral-400 border border-neutral-800">
                            PENDING
                          </span>
                        )}
                        {ord.paymentStatus === "PAYMENT_FAILED" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/70 text-rose-400 border border-rose-800/50">
                            FAILED
                          </span>
                        )}
                      </div>

                      {ord.utrNumber ? (
                        <div className="font-mono text-[11px] text-neutral-300 bg-[#161616] px-2 py-0.5 rounded border border-[#2b2b2b] inline-block">
                          UTR: <span className="text-[#ff6a00] font-bold">{ord.utrNumber}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-neutral-500 italic">No UTR submitted yet</div>
                      )}

                      {ord.paymentStatus === "PAYMENT_SUBMITTED" && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <button
                            onClick={() => handleVerifyPayment(ord.id, "APPROVE")}
                            disabled={updatingId === ord.id}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow disabled:opacity-50"
                            title="Verify bank credit and confirm order"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleVerifyPayment(ord.id, "REJECT")}
                            disabled={updatingId === ord.id}
                            className="px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[11px] font-semibold transition-all disabled:opacity-50"
                            title="Reject invalid UTR"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <select
                        value={ord.status}
                        disabled={updatingId === ord.id}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="bg-[#1a1a1a] border border-[#2e2e2e] text-white text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#ff6a00] font-mono"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <Link
                        href={`/orders/${ord.orderNumber}`}
                        className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-[#1f1f1f] hover:bg-[#282828] text-white font-medium text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
