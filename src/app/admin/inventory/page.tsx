"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, AlertTriangle, ArrowRight, History, CheckCircle2, RotateCcw, Loader2, Edit2, Plus, Minus } from "lucide-react";

export default function AdminInventoryPage() {
  const { addToast, user } = useApp();
  const [items, setItems] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [invRes, auditRes] = await Promise.all([
        fetch("/api/admin/inventory"),
        fetch("/api/admin/audit-logs"),
      ]);

      if (invRes.ok) {
        const invData = await invRes.json();
        setItems(invData.items || []);
      }

      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs || []);
      }
    } catch (err) {
      console.error("Failed to load admin inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user]);

  const handleAdjustStock = async (variantId: string, delta: number) => {
    setUpdatingId(variantId);
    try {
      const res = await fetch(`/api/admin/inventory/${variantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adjustAmount: delta }),
      });

      if (res.ok) {
        addToast(`Inventory stock adjusted by ${delta > 0 ? "+" + delta : delta}!`, "success");
        await fetchInventory();
      } else {
        const err = await res.json();
        addToast(err.error || "Failed to update stock", "error");
      }
    } catch {
      addToast("Network error updating inventory", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f] mb-8">
        <div>
          <div className="text-xs text-neutral-400 mb-1">
            <Link href="/admin" className="hover:text-white">Admin</Link> / <span className="text-white">Inventory & Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Campus Inventory Ledger & Audit</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time stock reservation, available vs sold tracking, and immutable AdminAuditLog.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="py-2 px-4 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2e2e2e] text-xs font-semibold text-white flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#ff6a00]" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Real-time Inventory Table */}
      <div className="rounded-3xl bg-[#111111] border border-[#262626] overflow-hidden shadow-2xl mb-10">
        <div className="p-5 bg-[#161616] border-b border-[#222222] flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Campus Stock Ledger (Available • Reserved • Sold)
          </h2>
          <span className="text-xs text-[#22c55e] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Overselling Prevention Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141414] border-b border-[#202020] text-neutral-400 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Component & SKU</th>
                <th className="px-5 py-3 text-center">Available Stock</th>
                <th className="px-5 py-3 text-center">Reserved</th>
                <th className="px-5 py-3 text-center">Sold</th>
                <th className="px-5 py-3 text-center">Threshold</th>
                <th className="px-5 py-3 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e] text-neutral-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500">
                    <Loader2 className="w-6 h-6 animate-spin text-[#ff6a00] mx-auto mb-2" />
                    <span>Reading inventory records from PostgreSQL...</span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500">
                    No components registered in inventory.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isLow = item.available <= item.minThreshold;
                  return (
                    <tr key={item.id} className="hover:bg-[#151515] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-white">{item.productName}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {item.sku} • {item.variantName}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-center font-mono font-bold">
                        <span className={isLow ? "text-[#ff6a00]" : "text-white"}>
                          {item.available}
                        </span>
                        {isLow && (
                          <span className="block text-[9px] text-[#ff6a00] uppercase font-bold">
                            LOW STOCK
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-center font-mono text-neutral-400">
                        {item.reserved}
                      </td>

                      <td className="px-5 py-3.5 text-center font-mono text-neutral-400">
                        {item.sold}
                      </td>

                      <td className="px-5 py-3.5 text-center font-mono text-neutral-400">
                        {item.minThreshold}
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 bg-[#181818] border border-[#2a2a2a] p-1 rounded-xl">
                          <button
                            disabled={updatingId === item.id || item.available <= 0}
                            onClick={() => handleAdjustStock(item.id, -5)}
                            className="px-2 py-1 bg-[#222222] hover:bg-[#2c2c2c] rounded-lg text-white font-mono text-[11px] disabled:opacity-40"
                            title="Decrease stock by 5"
                          >
                            -5
                          </button>
                          <button
                            disabled={updatingId === item.id || item.available <= 0}
                            onClick={() => handleAdjustStock(item.id, -1)}
                            className="px-2 py-1 bg-[#222222] hover:bg-[#2c2c2c] rounded-lg text-white font-mono text-[11px] disabled:opacity-40"
                            title="Decrease stock by 1"
                          >
                            -1
                          </button>
                          <span className="px-2 font-mono font-bold text-white text-xs">{item.available}</span>
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleAdjustStock(item.id, 1)}
                            className="px-2 py-1 bg-[#ff6a00]/20 hover:bg-[#ff6a00]/30 text-[#ff6a00] rounded-lg font-mono text-[11px]"
                            title="Increase stock by 1"
                          >
                            +1
                          </button>
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => handleAdjustStock(item.id, 10)}
                            className="px-2 py-1 bg-[#ff6a00]/20 hover:bg-[#ff6a00]/30 text-[#ff6a00] rounded-lg font-mono text-[11px]"
                            title="Increase stock by 10"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Ledger */}
      <div className="rounded-3xl bg-[#111111] border border-[#262626] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#ff6a00]" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Chronological AdminAuditLog (Actions • Targets • Timestamps)
            </h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Total Recorded: {auditLogs.length}</span>
        </div>

        {auditLogs.length === 0 ? (
          <div className="py-8 text-center text-neutral-500 text-xs">
            No audit records logged yet. Any inventory or order status changes will record here with previous and new values.
          </div>
        ) : (
          <div className="divide-y divide-[#1e1e1e]">
            {auditLogs.map((log: any) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#ff6a00] px-1.5 py-0.5 rounded bg-[#ff6a00]/10 border border-[#ff6a00]/20">
                      {log.action}
                    </span>
                    <span className="font-bold text-white">{log.target}</span>
                  </div>
                  {log.details && (
                    <div className="text-neutral-400 text-[11px]">{log.details}</div>
                  )}
                </div>

                <div className="text-right text-[11px] text-neutral-500 font-mono">
                  <div>{log.adminUser?.name || "Operations Lead"}</div>
                  <div>{new Date(log.createdAt).toLocaleString("en-IN")}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
