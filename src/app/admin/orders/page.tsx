"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Truck, Search, CheckCircle2, ArrowRight, Clock, MapPin, Eye,
  Loader2, RotateCcw, Package, Printer, XCircle, AlertCircle, Phone,
  Send, ExternalLink, ShieldAlert, CheckSquare, FileText, FileSpreadsheet,
  Receipt, Square, Download, Layers, Tag
} from "lucide-react";

import { generateWhatsAppStatusUrl } from "@/lib/whatsapp";
import { playNewOrderChime } from "@/lib/audioAlert";
import { exportOrdersToCSV } from "@/lib/csvExport";
import GSTInvoiceModal from "@/components/admin/GSTInvoiceModal";
import ThermalLabelModal from "@/components/admin/ThermalLabelModal";

export default function AdminOrdersPage() {
  const { addToast, user } = useApp();
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState<boolean>(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any | null>(null);
  const [selectedOrderForThermal, setSelectedOrderForThermal] = useState<any | null>(null);

  // Multi-Select Batch Actions State
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkProcessing, setBulkProcessing] = useState<boolean>(false);

  // Packing Slip modal
  const [packingSlip, setPackingSlip] = useState<any | null>(null);
  const [slipLoading, setSlipLoading] = useState<boolean>(false);

  // Dispatch Runner Modal
  const [dispatchOrder, setDispatchOrder] = useState<any | null>(null);
  const [runnerName, setRunnerName] = useState("");
  const [runnerPhone, setRunnerPhone] = useState("");
  const [dispatchNotes, setDispatchNotes] = useState("");

  // Cancellation Modal
  const [cancelOrder, setCancelOrder] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const previousOrderCountRef = useRef<number>(0);

  const fetchOrders = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "ALL") params.set("status", filter);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const newOrders = data.orders || [];

        // Check if new orders arrived during live darkstore polling
        if (
          previousOrderCountRef.current > 0 &&
          newOrders.length > previousOrderCountRef.current
        ) {
          const latestOrder = newOrders[0];
          playNewOrderChime();
          setNewOrderAlert(
            `🚨 NEW ORDER RECEIVED: #${latestOrder.orderNumber} (₹${latestOrder.total}) — ${latestOrder.recipientName}`
          );
          addToast(
            `New Live Order #${latestOrder.orderNumber} received!`,
            "success"
          );
        }

        previousOrderCountRef.current = newOrders.length;
        setOrders(newOrders);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
    // 10-second Darkstore Live Polling
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [filter, searchQuery, user]);

  const openOrderWorkspace = async (orderId: string) => {
    setWorkspaceLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data.order);
      }
    } catch {
      addToast("Failed to load order details", "error");
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: string,
    extraData: any = {}
  ) => {
    setUpdatingId(orderId);
    try {
      const targetOrder = orders.find((o) => o.id === orderId) || selectedOrder;
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...extraData,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        addToast(`Order updated to ${newStatus}!`, "success");

        // Open WhatsApp Customer Alert if phone is present
        const phone = targetOrder?.recipientPhone || targetOrder?.user?.phone;
        if (phone && targetOrder) {
          const waUrl = generateWhatsAppStatusUrl(
            phone,
            targetOrder.orderNumber,
            newStatus,
            targetOrder.recipientName || "Student",
            extraData.runnerName || targetOrder.runnerName,
            extraData.runnerPhone || targetOrder.runnerPhone,
            extraData.trackingNumber || targetOrder.shipment?.trackingNumber
          );
          window.open(waUrl, "_blank");
        }

        await fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          await openOrderWorkspace(orderId);
        }
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

  const handleVerifyPayment = async (orderId: string, action: "APPROVE" | "REJECT", reason = "") => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/verify-payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast(
          action === "APPROVE"
            ? "Payment verified & order marked CONFIRMED!"
            : "Payment rejected. Customer flagged.",
          action === "APPROVE" ? "success" : "warning"
        );
        await fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          await openOrderWorkspace(orderId);
        }
      } else {
        addToast(data.error || "Failed to update payment status", "error");
      }
    } catch {
      addToast("Network error verifying payment", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenPackingSlip = async (orderId: string) => {
    setSlipLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/packing-slip`);
      if (res.ok) {
        const data = await res.json();
        setPackingSlip(data.packingSlip);
      } else {
        addToast("Failed to generate packing slip", "error");
      }
    } catch {
      addToast("Network error loading packing slip", "error");
    } finally {
      setSlipLoading(false);
    }
  };

  const handleConfirmDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchOrder) return;
    if (!runnerName.trim() || !runnerPhone.trim()) {
      addToast("Please provide Campus Runner name and contact phone", "error");
      return;
    }

    await handleUpdateStatus(dispatchOrder.id, "SHIPPED", {
      deliveryMethod: "PARTSLY_CAMPUS_DELIVERY",
      runnerName: runnerName.trim(),
      runnerPhone: runnerPhone.trim(),
      dispatchNotes: dispatchNotes.trim(),
      checkpointNote: `Dispatched with Campus Runner: ${runnerName.trim()} (${runnerPhone.trim()})`,
    });

    setDispatchOrder(null);
    setRunnerName("");
    setRunnerPhone("");
    setDispatchNotes("");
  };

  const handleConfirmCancellation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelOrder) return;
    if (!cancelReason.trim()) {
      addToast("Please provide a cancellation audit reason", "error");
      return;
    }

    await handleUpdateStatus(cancelOrder.id, "CANCELLED", {
      cancellationReason: cancelReason.trim(),
      checkpointNote: `Order cancelled by operations desk: ${cancelReason.trim()}`,
    });

    setCancelOrder(null);
    setCancelReason("");
  };

  // Multi-Select Helper Functions
  const toggleSelectAll = () => {
    if (selectedOrderIds.length === orders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedOrderIds.length === 0) return;
    setBulkProcessing(true);
    try {
      let successCount = 0;
      for (const id of selectedOrderIds) {
        const res = await fetch(`/api/admin/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) successCount++;
      }
      addToast(`Updated ${successCount} orders to ${newStatus}!`, "success");
      setSelectedOrderIds([]);
      await fetchOrders();
    } catch {
      addToast("Failed to run bulk status update", "error");
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleBulkExportCSV = () => {
    const selectedOrders = orders.filter((o) => selectedOrderIds.includes(o.id));
    exportOrdersToCSV(
      selectedOrders.length > 0 ? selectedOrders : orders,
      `partsly-orders-${selectedOrders.length > 0 ? "selected" : "all"}-${Date.now()}.csv`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f] mb-8">
        <div>
          <div className="text-xs text-neutral-400 mb-1">
            <Link href="/admin" className="hover:text-white">Admin</Link> / <span className="text-white">Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Partsly Order Operations Workspace</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Verify payments, generate packing slips with bin locations, and dispatch via campus runners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBulkExportCSV}
            className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-900/20"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Orders CSV</span>
          </button>
          <button
            onClick={() => fetchOrders(false)}
            className="py-2 px-4 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2e2e2e] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#ff6a00]" />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Live Audio & New Order Alert Banner (Blinkit / Zepto Style) */}
      {newOrderAlert && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#ff6a00] to-[#ea580c] text-white flex items-center justify-between gap-4 shadow-2xl animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔔</span>
            <span className="text-xs sm:text-sm font-extrabold">{newOrderAlert}</span>
          </div>
          <button
            onClick={() => setNewOrderAlert(null)}
            className="px-3 py-1 rounded-xl bg-black/30 hover:bg-black/50 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Operational Queues Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {[
          { key: "ALL", label: "All Orders" },
          { key: "PAYMENT_SUBMITTED", label: "Payment Verification Queue" },
          { key: "CONFIRMED", label: "Packing Queue" },
          { key: "PACKED", label: "Ready for Dispatch" },
          { key: "SHIPPED", label: "Out with Runner" },
          { key: "DELIVERED", label: "Delivered" },
          { key: "CANCELLED", label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === tab.key
                ? "bg-[#ff6a00] text-black shadow-lg shadow-[#ff6a00]/20"
                : "bg-[#111111] text-neutral-400 hover:text-white border border-[#262626]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Order # (e.g. TBX-), student phone, recipient name, or UTR..."
          className="w-full bg-[#111111] border border-[#262626] rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6a00]"
        />
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-[#111111] border border-[#262626] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222222] bg-[#141414] text-neutral-400">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-neutral-700 bg-[#222] text-[#ff6a00] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-4 font-semibold">Order #</th>
                <th className="p-4 font-semibold">Student & Delivery Point</th>
                <th className="p-4 font-semibold">Items & Qty</th>
                <th className="p-4 font-semibold">Payment / UTR</th>
                <th className="p-4 font-semibold">Operational Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#ff6a00] mb-2" />
                    <span>Loading operations queue...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-neutral-500">
                    No orders found in this queue.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className={`hover:bg-[#161616] transition-colors ${selectedOrderIds.includes(o.id) ? "bg-[#ff6a00]/5" : ""}`}>
                    <td className="p-4 align-top text-center">
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.includes(o.id)}
                        onChange={() => toggleSelectOrder(o.id)}
                        className="w-4 h-4 rounded border-neutral-700 bg-[#222] text-[#ff6a00] focus:ring-0 cursor-pointer mt-1"
                      />
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-mono font-bold text-white text-xs">{o.orderNumber}</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        {new Date(o.createdAt).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                      <div className="font-bold text-[#ff6a00] text-xs mt-1">₹{o.total}</div>
                    </td>

                    <td className="p-4 align-top">
                      <div className="font-semibold text-white">{o.recipientName}</div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#ff6a00]" />
                        <span>{o.recipientPhone}</span>
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-1 max-w-xs truncate">
                        {o.campusDetail || "Campus Pickup Point"}
                      </div>
                    </td>

                    <td className="p-4 align-top">
                      <div className="text-neutral-300 font-medium text-[11px]">
                        {o.items?.length || 0} item(s)
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5 max-w-xs truncate">
                        {o.items?.map((it: any) => `${it.productName} (x${it.quantity})`).join(", ")}
                      </div>
                    </td>

                    <td className="p-4 align-top">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          o.paymentStatus === "PAYMENT_VERIFIED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : o.paymentStatus === "PAYMENT_SUBMITTED"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {o.paymentStatus?.replace(/_/g, " ")}
                      </span>

                      {o.utrNumber ? (
                        <div className="font-mono text-[10px] text-neutral-300">
                          UTR: <span className="font-bold text-white">{o.utrNumber}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-neutral-500">No UTR submitted</div>
                      )}
                    </td>

                    <td className="p-4 align-top">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          o.status === "DELIVERED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : o.status === "OUT_FOR_DELIVERY" || o.status === "SHIPPED"
                            ? "bg-sky-500/20 text-sky-400"
                            : o.status === "PACKED"
                            ? "bg-purple-500/20 text-purple-400"
                            : o.status === "CONFIRMED"
                            ? "bg-indigo-500/20 text-indigo-400"
                            : o.status === "CANCELLED"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {o.status}
                      </span>

                      {o.runnerName && (
                        <div className="text-[10px] text-neutral-400 mt-1">
                          Runner: <span className="text-white font-medium">{o.runnerName}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4 align-top text-right space-y-1.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openOrderWorkspace(o.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white text-[11px] font-semibold flex items-center gap-1 border border-[#333]"
                        >
                          <Eye className="w-3 h-3 text-[#ff6a00]" />
                          <span>Workspace</span>
                        </button>

                        <button
                          onClick={() => handleOpenPackingSlip(o.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] text-neutral-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 border border-[#333]"
                          title="Generate Packing Slip"
                        >
                          <Printer className="w-3 h-3 text-[#38bdf8]" />
                          <span>Slip</span>
                        </button>
                        <button
                          onClick={() => setSelectedOrderForInvoice(o)}
                          className="px-2.5 py-1 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] text-amber-400 hover:text-amber-300 text-[11px] font-semibold flex items-center gap-1 border border-[#333]"
                          title="Print Official GST Tax Invoice"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>GST</span>
                        </button>
                        <button
                          onClick={() => setSelectedOrderForThermal(o)}
                          className="px-2.5 py-1 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1 border border-[#333]"
                          title="Print 4x6 Thermal Courier Label"
                        >
                          <Tag className="w-3 h-3" />
                          <span>Label</span>
                        </button>
                      </div>

                      {/* Quick Action Button based on operational stage */}
                      {o.paymentStatus === "PAYMENT_SUBMITTED" && o.status === "PENDING" && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            disabled={updatingId === o.id}
                            onClick={() => handleVerifyPayment(o.id, "APPROVE")}
                            className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                          >
                            Verify & Confirm
                          </button>
                          <button
                            disabled={updatingId === o.id}
                            onClick={() => handleVerifyPayment(o.id, "REJECT")}
                            className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px]"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {o.status === "CONFIRMED" && (
                        <button
                          disabled={updatingId === o.id}
                          onClick={() => handleUpdateStatus(o.id, "PACKED", { packingNotes: "Packed in ESD protective pouch" })}
                          className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] flex items-center gap-1 ml-auto"
                        >
                          <Package className="w-3 h-3" />
                          <span>Mark Packed</span>
                        </button>
                      )}

                      {o.status === "PACKED" && (
                        <button
                          onClick={() => setDispatchOrder(o)}
                          className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] flex items-center gap-1 ml-auto"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Assign Runner</span>
                        </button>
                      )}

                      {o.status === "SHIPPED" && (
                        <button
                          disabled={updatingId === o.id}
                          onClick={() => handleUpdateStatus(o.id, "OUT_FOR_DELIVERY", { checkpointNote: `Runner arriving at ${o.campusDetail || "Campus point"}` })}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 ml-auto"
                        >
                          <span>Out for Delivery</span>
                        </button>
                      )}

                      {o.status === "OUT_FOR_DELIVERY" && (
                        <button
                          disabled={updatingId === o.id}
                          onClick={() => handleUpdateStatus(o.id, "DELIVERED", { checkpointNote: `Handed over to ${o.recipientName}` })}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 ml-auto"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Mark Delivered</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FLOATING BATCH ACTIONS TOOLBAR (Shopify / Amazon Style) */}
      {selectedOrderIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#161616] border-2 border-[#ff6a00] rounded-2xl shadow-2xl p-4 flex flex-wrap items-center gap-3 text-xs text-white max-w-4xl w-[92%] animate-bounce-short">
          <div className="flex items-center gap-2 font-bold px-3 py-1 bg-[#ff6a00] text-black rounded-lg">
            <CheckSquare className="w-4 h-4" />
            <span>{selectedOrderIds.length} Selected</span>
          </div>

          <div className="h-5 w-px bg-neutral-800 hidden sm:block" />

          <div className="flex flex-wrap items-center gap-2">
            <button
              disabled={bulkProcessing}
              onClick={() => handleBulkStatusUpdate("CONFIRMED")}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold transition-all text-[11px]"
            >
              Set Confirmed
            </button>
            <button
              disabled={bulkProcessing}
              onClick={() => handleBulkStatusUpdate("PACKED")}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold transition-all text-[11px]"
            >
              Set Packed
            </button>
            <button
              disabled={bulkProcessing}
              onClick={() => handleBulkStatusUpdate("OUT_FOR_DELIVERY")}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 font-bold transition-all text-[11px]"
            >
              Set Out For Delivery
            </button>
            <button
              disabled={bulkProcessing}
              onClick={() => handleBulkStatusUpdate("DELIVERED")}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold transition-all text-[11px]"
            >
              Set Delivered
            </button>
            <button
              onClick={handleBulkExportCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-amber-400 border border-slate-700 flex items-center gap-1 text-[11px]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <button
            onClick={() => setSelectedOrderIds([])}
            className="ml-auto text-xs text-neutral-400 hover:text-white font-semibold underline px-2"
          >
            Deselect All
          </button>
        </div>
      )}

      {/* ORDER WORKSPACE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#222]">
              <div>
                <span className="text-xs font-bold text-[#ff6a00] uppercase tracking-wider">
                  Order Workspace
                </span>
                <h2 className="text-xl font-black text-white">{selectedOrder.orderNumber}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {/* Student & Delivery Info */}
              <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#282828] space-y-3">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Customer & Campus Delivery Point
                </h3>
                <div>
                  <div className="text-sm font-bold text-white">{selectedOrder.recipientName}</div>
                  <div className="text-xs text-neutral-300 flex items-center gap-2 mt-1">
                    <Phone className="w-3.5 h-3.5 text-[#ff6a00]" />
                    <span>{selectedOrder.recipientPhone}</span>
                    <a
                      href={`https://wa.me/91${selectedOrder.recipientPhone?.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-0.5 ml-2"
                    >
                      <span>WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="text-xs text-neutral-300 pt-2 border-t border-[#262626]">
                  <div className="font-semibold text-white">Campus Location:</div>
                  <div className="text-neutral-400 mt-0.5">
                    {selectedOrder.college?.name || "College"}, {selectedOrder.campus?.name || "Campus"}
                  </div>
                  <div className="text-neutral-300 mt-1 font-medium bg-[#111] p-2 rounded-lg border border-[#262626]">
                    📍 {selectedOrder.campusDetail || "Designated Pickup Point"}
                  </div>
                </div>
              </div>

              {/* Payment & Financial Clearance */}
              <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#282828] space-y-3">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Financial Clearance
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-400">Order Amount:</div>
                    <div className="text-xl font-black text-[#ff6a00]">₹{selectedOrder.total}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400">Payment Status:</div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                        selectedOrder.paymentStatus === "PAYMENT_VERIFIED"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#262626]">
                  <div className="text-xs text-neutral-400">Submitted UTR:</div>
                  <div className="text-sm font-mono font-bold text-white mt-0.5">
                    {selectedOrder.utrNumber || "No UTR submitted yet"}
                  </div>
                </div>

                {selectedOrder.paymentStatus === "PAYMENT_SUBMITTED" && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleVerifyPayment(selectedOrder.id, "APPROVE")}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      ✓ Approve Bank Credit
                    </button>
                    <button
                      onClick={() => handleVerifyPayment(selectedOrder.id, "REJECT", "Invalid bank credit")}
                      className="py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 font-bold text-xs"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Line Items with Physical Bin Locations */}
            <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#282828] mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Physical Order Items & Bin Locations
                </h3>
                <button
                  onClick={() => handleOpenPackingSlip(selectedOrder.id)}
                  className="px-3 py-1 rounded-lg bg-[#252525] hover:bg-[#333] text-white text-xs font-bold flex items-center gap-1.5 border border-[#383838]"
                >
                  <Printer className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Print Packing Slip</span>
                </button>
              </div>

              <div className="space-y-2">
                {selectedOrder.items?.map((it: any) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#262626]"
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{it.productName}</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-3">
                        <span>SKU: <span className="font-mono text-neutral-300">{it.sku}</span></span>
                        <span>Bin: <span className="font-mono text-[#ff6a00] font-semibold">{it.variant?.inventory?.binLocation || "Bay 1-A"}</span></span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-white">Qty: {it.quantity}</div>
                      <div className="text-[11px] text-neutral-400">₹{it.totalPrice}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Stage Pipeline */}
            <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626] space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Operational Stage Controls
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "CONFIRMED")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    selectedOrder.status === "CONFIRMED" ? "bg-indigo-600 text-white" : "bg-[#222] text-neutral-300 hover:text-white"
                  }`}
                >
                  1. Confirmed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "PACKED", { packingNotes: "Verified & packed into parcel" })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    selectedOrder.status === "PACKED" ? "bg-purple-600 text-white" : "bg-[#222] text-neutral-300 hover:text-white"
                  }`}
                >
                  2. Packed
                </button>
                <button
                  onClick={() => {
                    setDispatchOrder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    selectedOrder.status === "SHIPPED" ? "bg-sky-600 text-white" : "bg-[#222] text-neutral-300 hover:text-white"
                  }`}
                >
                  3. Assign Runner & Dispatch
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "OUT_FOR_DELIVERY")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    selectedOrder.status === "OUT_FOR_DELIVERY" ? "bg-indigo-600 text-white" : "bg-[#222] text-neutral-300 hover:text-white"
                  }`}
                >
                  4. Out for Delivery
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "DELIVERED")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    selectedOrder.status === "DELIVERED" ? "bg-emerald-600 text-white" : "bg-[#222] text-neutral-300 hover:text-white"
                  }`}
                >
                  5. Delivered
                </button>

                <button
                  onClick={() => {
                    setCancelOrder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="ml-auto px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 text-xs font-bold"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PACKING SLIP VIEW MODAL */}
      {packingSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:p-0">
          <div className="bg-white text-black rounded-3xl w-full max-w-2xl p-8 shadow-2xl overflow-y-auto max-h-[90vh] print:max-h-full print:rounded-none print:shadow-none">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-black">
              <div>
                <h1 className="text-2xl font-black tracking-tight">PARTSLY PACKING SLIP</h1>
                <div className="text-xs font-semibold text-neutral-600">Campus Hardware Operations & Fulfillment</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-black">{packingSlip.orderNumber}</div>
                <div className="text-xs text-neutral-600">
                  {new Date(packingSlip.orderDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            {/* Recipient & Campus Box */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-neutral-300 text-xs">
              <div>
                <div className="font-bold text-neutral-500 uppercase">SHIP TO / STUDENT</div>
                <div className="font-bold text-base mt-1">{packingSlip.recipient?.name}</div>
                <div className="font-semibold text-neutral-800">Phone: {packingSlip.recipient?.phone}</div>
                <div className="text-neutral-700 mt-1">{packingSlip.recipient?.college}</div>
                <div className="text-neutral-700">{packingSlip.recipient?.campus}</div>
              </div>

              <div>
                <div className="font-bold text-neutral-500 uppercase">DELIVERY LOCATION</div>
                <div className="font-bold text-sm text-neutral-900 mt-1 bg-neutral-100 p-2 rounded border border-neutral-300">
                  📍 {packingSlip.recipient?.roomOrBlock}
                </div>
                <div className="text-neutral-600 mt-1">Slot: {packingSlip.recipient?.slot}</div>
                <div className="text-neutral-600">Method: {packingSlip.deliveryMethod || "Campus Runner Delivery"}</div>
              </div>
            </div>

            {/* Packing Checklist */}
            <div className="py-4">
              <h2 className="text-xs font-black uppercase tracking-wider mb-2">
                PICKING & PACKING CHECKLIST
              </h2>
              <table className="w-full text-left text-xs border border-neutral-300">
                <thead className="bg-neutral-100 border-b border-neutral-300">
                  <tr>
                    <th className="p-2 w-8">Check</th>
                    <th className="p-2">SKU</th>
                    <th className="p-2">Item Description</th>
                    <th className="p-2">Warehouse Bin</th>
                    <th className="p-2 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {packingSlip.items?.map((item: any) => (
                    <tr key={item.itemId}>
                      <td className="p-2 text-center">
                        <div className="w-4 h-4 border-2 border-neutral-400 rounded"></div>
                      </td>
                      <td className="p-2 font-mono font-bold">{item.sku}</td>
                      <td className="p-2">{item.productName}</td>
                      <td className="p-2 font-mono font-bold text-blue-700">{item.binLocation}</td>
                      <td className="p-2 font-black text-right">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sign-off footer */}
            <div className="pt-4 border-t-2 border-black flex items-center justify-between text-xs">
              <div>
                <div>Total Items: <span className="font-bold">{packingSlip.totalQuantity}</span></div>
                <div>Payment: <span className="font-bold">{packingSlip.paymentStatus}</span> (UTR: {packingSlip.utrNumber || "N/A"})</div>
              </div>
              <div className="text-right">
                <div>Packed By: ___________________</div>
                <div className="text-[10px] text-neutral-500 mt-1">Partsly Operations Guarantee Seal</div>
              </div>
            </div>

            {/* Print / Close controls */}
            <div className="flex items-center justify-end gap-3 mt-6 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-black text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Slip</span>
              </button>
              <button
                onClick={() => setPackingSlip(null)}
                className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-black font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH RUNNER MODAL */}
      {dispatchOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleConfirmDispatch}
            className="bg-[#141414] border border-[#2a2a2a] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4"
          >
            <div>
              <span className="text-xs font-bold text-[#ff6a00] uppercase tracking-wider">
                Assign Campus Runner
              </span>
              <h2 className="text-lg font-black text-white">Dispatch {dispatchOrder.orderNumber}</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Assign the verified student runner who will deliver this parcel.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Campus Runner Name *
              </label>
              <input
                type="text"
                required
                value={runnerName}
                onChange={(e) => setRunnerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Campus Runner Mobile Phone *
              </label>
              <input
                type="tel"
                required
                value={runnerPhone}
                onChange={(e) => setRunnerPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Dispatch Instructions / Notes
              </label>
              <textarea
                rows={2}
                value={dispatchNotes}
                onChange={(e) => setDispatchNotes(e.target.value)}
                placeholder="e.g. Student requested delivery near Mech Block Gate #2 after 4 PM"
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDispatchOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-neutral-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#e05d00] text-black text-xs font-black"
              >
                Confirm Dispatch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {cancelOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleConfirmCancellation}
            className="bg-[#141414] border border-[#2a2a2a] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4"
          >
            <div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Cancel Order & Restore Inventory
              </span>
              <h2 className="text-lg font-black text-white">Cancel {cancelOrder.orderNumber}</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                This will restore reserved/allocated inventory back to available stock.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Cancellation Reason (Required for Audit Log) *
              </label>
              <textarea
                required
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Customer requested cancellation due to duplicate order"
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-neutral-300 text-xs font-bold"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Confirm Cancel & Restore Stock
              </button>
            </div>
          </form>
        </div>
      )}
      {/* GST INVOICE MODAL */}
      {selectedOrderForInvoice && (
        <GSTInvoiceModal
          order={selectedOrderForInvoice}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}

      {/* THERMAL SHIPPING LABEL MODAL */}
      {selectedOrderForThermal && (
        <ThermalLabelModal
          order={selectedOrderForThermal}
          onClose={() => setSelectedOrderForThermal(null)}
        />
      )}
    </div>
  );
}
