"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, Package, ArrowRight, ShieldCheck, Clock, Loader2, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AccountOrdersPage() {
  const { user } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-[#1f1f1f] mb-8">
        <div className="text-xs text-neutral-400 mb-1">
          <Link href="/account" className="hover:text-white">Account</Link> / <span className="text-white">Orders</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Your Campus Orders</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Track real-time courier runners, gate delivery slots, and invoices from PostgreSQL database.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 rounded-3xl bg-[#111111] border border-[#222222]">
          <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-400">Loading order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center mx-auto text-neutral-500">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No orders yet</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              Start building your first project or explore our certified catalog of microcontrollers and sensors.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/shop"
              className="py-2.5 px-5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs transition-colors"
            >
              Explore Components
            </Link>
            <Link
              href="/build"
              className="py-2.5 px-5 rounded-xl bg-[#161616] hover:bg-[#222222] border border-[#262626] text-white font-semibold text-xs transition-colors"
            >
              Build My Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isDelivered = order.status === "DELIVERED";
            const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-[#111111] border border-[#262626] hover:border-[#ff6a00]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-white">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                        isDelivered
                          ? "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30"
                          : order.status === "CANCELLED"
                          ? "bg-red-500/15 text-red-400 border-red-500/30"
                          : "bg-[#ff6a00]/15 text-[#ff6a00] border-[#ff6a00]/30"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-400 space-y-1">
                    <div>Address / Hub: <strong className="text-neutral-200">{order.campusDetail}</strong></div>
                    <div>Recipient: <span className="text-neutral-300">{order.recipientName} ({order.recipientPhone})</span></div>
                    <div className="text-[11px] text-neutral-500 font-mono">Date: {formattedDate} • Items: {order.items.length}</div>
                    {order.shipment?.trackingNumber && (
                      <div className="text-[11px] text-[#ff6a00] font-mono">
                        Tracking: {order.shipment.trackingNumber} ({order.shipment.currentCheckpoint})
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 self-start md:self-auto">
                  <div className="text-right">
                    <div className="text-xs text-neutral-400">Total Paid</div>
                    <div className="text-lg font-black text-white">₹{order.total}</div>
                  </div>

                  <Link
                    href={`/orders/${order.orderNumber}`}
                    className="py-2.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#ff6a00]/20 transition-all"
                  >
                    <span>Track Live</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
