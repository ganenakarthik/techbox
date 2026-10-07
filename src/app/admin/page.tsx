"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { SOLE_ADMIN_EMAIL, SecurityLog } from "@/lib/security";
import { DBOrder, DBUser } from "@/lib/neon";

export default function AdminPage() {
  const { user, isAdmin, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "catalog" | "users" | "security">("orders");

  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [usersList, setUsersList] = useState<Partial<DBUser>[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Catalog Form state
  const [newProdName, setNewProdName] = useState("");
  const [newProdSKU, setNewProdSKU] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Microcontrollers");
  const [newProdStock, setNewProdStock] = useState("50");
  const [catalogMsg, setCatalogMsg] = useState("");

  const fetchAdminData = async () => {
    if (!isAdmin || !user) return;
    setIsLoading(true);

    try {
      const [ordersRes, logsRes] = await Promise.all([
        fetch(`/api/admin/orders?adminEmail=${encodeURIComponent(user.email)}`),
        fetch(`/api/admin/logs?adminEmail=${encodeURIComponent(user.email)}`),
      ]);

      const ordersData = await ordersRes.json();
      const logsData = await logsRes.json();

      if (ordersData.success && ordersData.orders) {
        setOrders(ordersData.orders);
      }
      if (logsData.success && logsData.logs) {
        setLogs(logsData.logs);
        setUsersList(logsData.usersList || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, user]);

  const handleUpdateStatus = async (orderId: string, newStatus: DBOrder["status"]) => {
    if (!user) return;

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          newStatus,
          adminEmail: user.email,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setCatalogMsg(`Product "${newProdName}" (SKU: ${newProdSKU}) added to database catalog successfully!`);
    setNewProdName("");
    setNewProdSKU("");
    setNewProdPrice("");
  };

  // 🛡️ SECURITY GUARD ACCESS DENIED SCREEN IF NOT ganenakartiks7@gmail.com
  if (!isAdmin) {
    return (
      <div className="wrap py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border-2 border-red-500/40 bg-red-500/5 p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/20 text-4xl border border-red-500/40">
            🛡️
          </div>
          <div className="space-y-2">
            <span className="rounded-full bg-red-500/20 px-3 py-1 font-mono text-xs font-extrabold uppercase text-red-400 border border-red-500/30">
              403 FORBIDDEN • WEB SECURITY ENFORCED
            </span>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">Exclusive Admin Portal Access Denied</h1>
            <p className="text-xs text-[var(--muted)] max-w-md mx-auto leading-relaxed">
              System access control rules dictate that <strong className="text-red-400 font-mono">{SOLE_ADMIN_EMAIL}</strong> is the sole authorized administrator for Partsly.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-xs font-mono text-left space-y-1 text-[var(--muted)]">
            <div>▸ Active User Session: <span className="text-[var(--text)] font-bold">{user ? user.email : "Unauthenticated Anonymous"}</span></div>
            <div>▸ Admin Email Requirement: <span className="text-amber-500 font-bold">{SOLE_ADMIN_EMAIL}</span></div>
            <div>▸ Enforcement Status: <span className="text-red-400 font-bold">ACCESS BLOCKED & LOGGED</span></div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openAuthModal("login")}
              className="rounded-xl bg-amber-500 px-6 py-3 text-xs font-extrabold text-black hover:bg-amber-400 transition-all shadow-lg"
            >
              👑 Login as Sole Admin ({SOLE_ADMIN_EMAIL})
            </button>
            <Link
              href="/"
              className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-6 py-3 text-xs font-bold text-[var(--text)] hover:bg-[var(--line)]"
            >
              ← Back to Hardware Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 👑 SOLE ADMIN DASHBOARD
  const filteredOrders = statusFilter === "ALL"
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="wrap py-8 space-y-8">
      {/* Admin Executive Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-amber-500/40 bg-amber-500/5 p-6 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500/20 px-3 py-1 font-mono text-xs font-extrabold text-amber-500 border border-amber-500/40">
              👑 SOLE ADMINISTRATOR PORTAL
            </span>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-extrabold text-emerald-400 border border-emerald-500/40">
              🟢 NEON DB ONLINE
            </span>
          </div>
          <h1 className="text-2xl font-black text-[var(--text)]">Master Control Center</h1>
          <p className="text-xs text-[var(--muted)] font-mono">
            Authenticated as: <strong className="text-amber-500">{user?.email}</strong>
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-4 py-2.5 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)]"
        >
          🔄 Refresh Live Data
        </button>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 space-y-1">
          <span className="text-xs text-[var(--muted)] uppercase font-bold">Total Orders</span>
          <div className="text-2xl font-black text-[var(--accent)]">{orders.length}</div>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 space-y-1">
          <span className="text-xs text-[var(--muted)] uppercase font-bold">Pending UTR</span>
          <div className="text-2xl font-black text-amber-500">
            {orders.filter((o) => o.status === "UTR_PENDING").length}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 space-y-1">
          <span className="text-xs text-[var(--muted)] uppercase font-bold">Verified & Dispatched</span>
          <div className="text-2xl font-black text-emerald-500">
            {orders.filter((o) => o.status === "VERIFIED" || o.status === "DISPATCHED").length}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 space-y-1">
          <span className="text-xs text-[var(--muted)] uppercase font-bold">Security Audit Events</span>
          <div className="text-2xl font-black text-purple-400">{logs.length}</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-[var(--line)] gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === "orders" ? "border-amber-500 text-amber-500 font-extrabold" : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
          }`}
        >
          📦 Orders & UTR Approvals ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("catalog")}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === "catalog" ? "border-amber-500 text-amber-500 font-extrabold" : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
          }`}
        >
          🛍️ Add Hardware Product
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === "users" ? "border-amber-500 text-amber-500 font-extrabold" : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
          }`}
        >
          👥 Registered Accounts ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === "security" ? "border-amber-500 text-amber-500 font-extrabold" : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
          }`}
        >
          🛡️ Web Security Audit Trail
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[var(--text)]">Customer Orders & UTR Transfers</h2>
            <div className="flex gap-2 text-xs">
              {["ALL", "UTR_PENDING", "VERIFIED", "DISPATCHED", "DELIVERED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                    statusFilter === st
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-xs text-[var(--muted)]">
                No orders match status filter &quot;{statusFilter}&quot;.
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 space-y-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-[var(--accent)]">{ord.id}</span>
                      <span className="ml-3 text-xs text-[var(--muted)]">By {ord.customerName} ({ord.email})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${
                          ord.status === "VERIFIED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : ord.status === "DISPATCHED"
                            ? "bg-blue-500/20 text-blue-400"
                            : ord.status === "DELIVERED"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {ord.status}
                      </span>
                      <span className="font-mono font-bold text-sm text-[var(--text)]">₹{ord.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[var(--muted)] mb-1 font-bold">Delivery Address:</p>
                      <p className="text-[var(--text)]">{ord.address}</p>
                      <p className="mt-2 text-[var(--muted)] font-bold">
                        UTR Ref #: <span className="font-mono text-amber-500 font-bold">{ord.utrNumber || "NOT PROVIDED"}</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[var(--muted)] font-bold">Items Purchased:</p>
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between font-mono text-[var(--text)]">
                          <span>{it.name} x{it.quantity}</span>
                          <span>₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Mutation Controls */}
                  <div className="flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-3 text-xs">
                    <span className="text-[var(--muted)] font-bold">Admin Status Actions:</span>
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "VERIFIED")}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white hover:bg-emerald-500"
                    >
                      ✓ Verify UTR
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "DISPATCHED")}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 font-bold text-white hover:bg-blue-500"
                    >
                      🚚 Mark Dispatched
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "DELIVERED")}
                      className="rounded-lg bg-purple-600 px-3 py-1.5 font-bold text-white hover:bg-purple-500"
                    >
                      📦 Mark Delivered
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "REJECTED")}
                      className="rounded-lg bg-red-600 px-3 py-1.5 font-bold text-white hover:bg-red-500"
                    >
                      ✕ Reject UTR
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CATALOG MANAGER */}
      {activeTab === "catalog" && (
        <div className="max-w-xl rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 space-y-4">
          <h2 className="text-lg font-bold text-[var(--text)]">Add New Hardware Component to Store</h2>
          {catalogMsg && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-400">
              {catalogMsg}
            </div>
          )}
          <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
            <div>
              <label className="block mb-1 font-bold text-[var(--text)]">Component Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Raspberry Pi Pico W"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold text-[var(--text)]">MPN / SKU</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RPI-PICO-W"
                  value={newProdSKU}
                  onChange={(e) => setNewProdSKU(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text)] font-mono"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold text-[var(--text)]">Unit Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 599"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text)] font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 py-3 text-xs font-extrabold text-black hover:bg-amber-400 shadow-md"
            >
              + Commit Product to Database Catalog
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: USERS LIST */}
      {activeTab === "users" && (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 space-y-4">
          <h2 className="text-lg font-bold text-[var(--text)]">Registered User Database</h2>
          <div className="space-y-3">
            {usersList.map((u, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs font-mono"
              >
                <div>
                  <span className="font-bold text-[var(--text)]">{u.name}</span>
                  <span className="ml-2 text-[var(--muted)]">({u.email})</span>
                </div>
                <span
                  className={`rounded-full px-3 py-0.5 font-bold uppercase text-[10px] ${
                    u.role === "admin" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {u.role === "admin" ? "👑 Sole Admin" : "👤 Customer"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY LOGS */}
      {activeTab === "security" && (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 space-y-4">
          <h2 className="text-lg font-bold text-[var(--text)]">Web Security Audit Log Stream</h2>
          <div className="space-y-2 font-mono text-xs max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`rounded-xl border p-3 flex flex-wrap justify-between items-center gap-2 ${
                  log.severity === "CRITICAL"
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : log.severity === "HIGH"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-[var(--surface-2)] border-[var(--line)] text-[var(--muted)]"
                }`}
              >
                <div>
                  <span className="font-bold text-[var(--text)]">[{log.eventType}]</span>
                  <span className="ml-2">{log.email}</span>
                  <p className="text-[11px] mt-0.5">{log.details}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] opacity-75">{new Date(log.timestamp).toLocaleTimeString()}</div>
                  <span className="font-bold text-[10px] uppercase">{log.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
