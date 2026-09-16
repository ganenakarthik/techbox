"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  ShieldCheck, AlertTriangle, ArrowRight, History, CheckCircle2,
  RotateCcw, Loader2, Edit2, Plus, Minus, Package, UploadCloud,
  FileSpreadsheet, MapPin, AlertCircle
} from "lucide-react";

export default function AdminInventoryPage() {
  const { addToast, user } = useApp();
  const [items, setItems] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Stock Adjustment Modal State
  const [adjustItem, setAdjustItem] = useState<any | null>(null);
  const [adjustType, setAdjustType] = useState<string>("RECEIVE_STOCK");
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>("");
  const [adjustBin, setAdjustBin] = useState<string>("");
  const [adjustSubmitting, setAdjustSubmitting] = useState<boolean>(false);

  // Bulk Import Modal State
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importJson, setImportJson] = useState<string>("");
  const [importing, setImporting] = useState<boolean>(false);

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

  const handleOpenAdjust = (item: any) => {
    setAdjustItem(item);
    setAdjustType("RECEIVE_STOCK");
    setAdjustQty(10);
    setAdjustReason("");
    setAdjustBin(item.binLocation || "Warehouse Bay 1-A");
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem) return;
    if (!adjustReason.trim()) {
      addToast("A physical reason is mandatory for the audit log", "error");
      return;
    }

    setAdjustSubmitting(true);
    try {
      const res = await fetch(`/api/admin/inventory/${adjustItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adjustmentType: adjustType,
          quantity: adjustQty,
          reason: adjustReason.trim(),
          binLocation: adjustBin.trim(),
        }),
      });

      if (res.ok) {
        addToast("Physical inventory updated and audit log recorded!", "success");
        setAdjustItem(null);
        await fetchInventory();
      } else {
        const err = await res.json();
        addToast(err.error || "Failed to adjust inventory", "error");
      }
    } catch {
      addToast("Network error during inventory adjustment", "error");
    } finally {
      setAdjustSubmitting(false);
    }
  };

  const handleBulkImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImporting(true);
    try {
      let parsedProducts = [];
      try {
        parsedProducts = JSON.parse(importJson);
      } catch {
        addToast("Invalid JSON format. Please check syntax.", "error");
        setImporting(false);
        return;
      }

      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: parsedProducts }),
      });

      const data = await res.json();
      if (res.ok) {
        addToast(`Successfully imported ${data.importedCount} products!`, "success");
        setShowImportModal(false);
        setImportJson("");
        await fetchInventory();
      } else {
        addToast(data.error || "Bulk import failed", "error");
      }
    } catch {
      addToast("Network error during bulk import", "error");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f] mb-8">
        <div>
          <div className="text-xs text-neutral-400 mb-1">
            <Link href="/admin" className="hover:text-white">Admin</Link> / <span className="text-white">Inventory & Physical Stock</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Physical Stock Ledger & Warehouse Bins</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real physical inventory state: Available • Reserved (Orders) • Allocated (Packing) • Sold • Damaged.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="py-2 px-3.5 rounded-xl bg-[#ff6a00] hover:bg-[#e05d00] text-xs font-bold text-black flex items-center gap-2 shadow-lg shadow-[#ff6a00]/20"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Import Catalog (JSON)</span>
          </button>

          <button
            onClick={fetchInventory}
            className="py-2 px-3.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2e2e2e] text-xs font-semibold text-white flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#ff6a00]" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="rounded-3xl bg-[#111111] border border-[#262626] overflow-hidden shadow-2xl mb-10">
        <div className="p-5 bg-[#161616] border-b border-[#222222] flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Live SKU Ledger
          </h2>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Physical State Synchronized
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222222] bg-[#141414] text-neutral-400">
                <th className="p-4 font-semibold">SKU & Item Name</th>
                <th className="p-4 font-semibold">Bin Location</th>
                <th className="p-4 font-semibold text-center text-emerald-400">Available</th>
                <th className="p-4 font-semibold text-center text-amber-400">Reserved</th>
                <th className="p-4 font-semibold text-center text-purple-400">Allocated</th>
                <th className="p-4 font-semibold text-center text-blue-400">Sold</th>
                <th className="p-4 font-semibold text-center text-red-400">Damaged</th>
                <th className="p-4 font-semibold text-center text-neutral-300">Reorder</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#ff6a00] mb-2" />
                    <span>Loading physical inventory ledger...</span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-neutral-500">
                    No inventory records found.
                  </td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it.id} className="hover:bg-[#161616] transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-bold text-white">{it.sku}</div>
                      <div className="text-neutral-300 font-medium text-xs mt-0.5">{it.productName}</div>
                      <div className="text-[10px] text-neutral-500">{it.category} • {it.brand}</div>
                    </td>

                    <td className="p-4">
                      <div className="inline-flex items-center gap-1 font-mono text-xs text-[#38bdf8] bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        <MapPin className="w-3 h-3" />
                        <span>{it.binLocation || "Bay 1-A"}</span>
                      </div>
                    </td>

                    <td className="p-4 text-center font-bold text-sm text-emerald-400 bg-emerald-500/5">
                      {it.available}
                    </td>

                    <td className="p-4 text-center font-semibold text-xs text-amber-400">
                      {it.reserved}
                    </td>

                    <td className="p-4 text-center font-semibold text-xs text-purple-400">
                      {it.allocated}
                    </td>

                    <td className="p-4 text-center font-semibold text-xs text-blue-400">
                      {it.sold}
                    </td>

                    <td className="p-4 text-center font-semibold text-xs text-red-400">
                      {it.damaged}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        it.available <= it.minThreshold
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "text-neutral-400"
                      }`}>
                        {it.minThreshold} (min)
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenAdjust(it)}
                        className="px-3 py-1.5 rounded-xl bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white text-xs font-semibold border border-[#333] hover:border-[#ff6a00] transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3 text-[#ff6a00]" />
                        <span>Adjust Stock</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Audit Trail Section */}
      <div className="rounded-3xl bg-[#111111] border border-[#262626] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#222] mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#ff6a00]" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Immutable Operations Audit Trail
            </h2>
          </div>
          <span className="text-[11px] text-neutral-500">Last 20 Administrative Actions</span>
        </div>

        <div className="space-y-2">
          {auditLogs.length === 0 ? (
            <div className="text-xs text-neutral-500 py-4 text-center">
              No audit log entries recorded yet.
            </div>
          ) : (
            auditLogs.slice(0, 20).map((log: any) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#141414] border border-[#222] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-mono font-bold text-[#ff6a00] mr-2">[{log.action}]</span>
                  <span className="text-white font-medium">{log.details || log.target}</span>
                  {log.adminUser?.name && (
                    <span className="text-neutral-400 ml-2">by {log.adminUser.name}</span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-500 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString("en-IN")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* STOCK ADJUSTMENT MODAL */}
      {adjustItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleAdjustSubmit}
            className="bg-[#141414] border border-[#2a2a2a] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4"
          >
            <div>
              <span className="text-xs font-bold text-[#ff6a00] uppercase tracking-wider">
                Physical Inventory Adjustment
              </span>
              <h2 className="text-lg font-black text-white mt-0.5">{adjustItem.productName}</h2>
              <div className="text-xs font-mono text-neutral-400">SKU: {adjustItem.sku}</div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Adjustment Action *
              </label>
              <select
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
              >
                <option value="RECEIVE_STOCK">Receive New Stock (+ Available)</option>
                <option value="MARK_DAMAGED">Mark Units Damaged (- Available / + Damaged)</option>
                <option value="WRITE_OFF_DAMAGED">Permanently Dispose Damaged (- Damaged)</option>
                <option value="INCOMING_ORDER">Record Vendor Purchase Order (+ Incoming)</option>
                <option value="SET_BIN_LOCATION">Update Warehouse Bin Location</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Quantity Units *
              </label>
              <input
                type="number"
                required
                min={1}
                value={adjustQty}
                onChange={(e) => setAdjustQty(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Warehouse Bin Location
              </label>
              <input
                type="text"
                value={adjustBin}
                onChange={(e) => setAdjustBin(e.target.value)}
                placeholder="e.g. Rack B, Shelf 3, Bin 12"
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Audit Reason (Mandatory) *
              </label>
              <textarea
                required
                rows={2}
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g. Received 50 ESP32 boards from supplier invoice #4401"
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdjustItem(null)}
                className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-neutral-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={adjustSubmitting}
                className="px-4 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#e05d00] text-black text-xs font-black flex items-center gap-1.5"
              >
                {adjustSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Adjustment</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BULK IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleBulkImportSubmit}
            className="bg-[#141414] border border-[#2a2a2a] rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4"
          >
            <div>
              <span className="text-xs font-bold text-[#ff6a00] uppercase tracking-wider">
                Bulk Catalog Importer
              </span>
              <h2 className="text-lg font-black text-white">Import Products & Physical Stock</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Paste JSON array of products with SKU, name, price, stock, and bin location.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                JSON Array of Products *
              </label>
              <textarea
                required
                rows={10}
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder={`[\n  {\n    "name": "Raspberry Pi Pico W",\n    "sku": "DEV-RPI-PICOW",\n    "brandName": "Raspberry Pi",\n    "categoryName": "Microcontrollers",\n    "price": 620,\n    "stock": 50,\n    "binLocation": "Bay 2-C"\n  }\n]`}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl p-3 font-mono text-xs text-white focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-neutral-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={importing}
                className="px-4 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#e05d00] text-black text-xs font-black flex items-center gap-1.5"
              >
                {importing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Run Import</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
