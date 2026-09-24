"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, Package, ArrowRight, ShieldCheck, Clock, Loader2, ShoppingBag, RefreshCw } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AccountOrdersPage() {
  const { user, addToCart, addToast } = useApp();
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

  const handleReorder = (order: any) => {
    if (!order.items || order.items.length === 0) return;

    let addedCount = 0;
    order.items.forEach((item: any) => {
      addToCart({
        variantId: item.variantId,
        productId: item.productId,
        name: item.productName || "Component",
        price: item.price,
        originalPrice: item.price,
        sku: item.sku || "SKU",
        quantity: item.quantity || 1,
        image: item.image || "/images/placeholder.jpg",
        openDrawer: false,
      });
      addedCount += item.quantity || 1;
    });

    addToast(`Re-added ${addedCount} components from Order #${order.orderNumber} to your cart!`, "success");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-slate-200 mb-8">
        <div className="text-xs text-slate-500 mb-1">
          <Link href="/account" className="hover:text-slate-900">Account</Link> / <span className="text-slate-900">Orders</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your Campus Orders</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track campus runner dispatch, gate delivery slots, and order invoices.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 rounded-3xl bg-white border border-slate-200">
          <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-mono">Loading order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-white border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No orders yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Start building your first project or explore our certified catalog of microcontrollers and sensors.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/shop"
              className="py-2.5 px-5 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-xs transition-colors shadow-sm"
            >
              Explore Components
            </Link>
            <Link
              href="/build"
              className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 font-bold text-xs transition-colors"
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
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-[#ff6a00]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-slate-900">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                        isDelivered
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : order.status === "CANCELLED"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-orange-50 text-[#ff6a00] border-orange-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div>Address / Hub: <strong className="text-slate-700">{order.campusDetail}</strong></div>
                    <div>Recipient: <span className="text-slate-600">{order.recipientName} ({order.recipientPhone})</span></div>
                    <div className="text-[11px] text-slate-500 font-mono">Date: {formattedDate} • Items: {order.items?.length || 0}</div>
                    {order.shipment?.trackingNumber && (
                      <div className="text-[11px] text-[#ff6a00] font-mono">
                        Tracking: {order.shipment.trackingNumber} ({order.shipment.currentCheckpoint})
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start md:self-auto">
                  <div className="text-left sm:text-right pr-2">
                    <div className="text-xs text-slate-500">Total Paid</div>
                    <div className="text-lg font-black text-slate-900">₹{order.total}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(order)}
                      className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Add all items from this order to cart again"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#ff6a00]" />
                      <span>Reorder BOM</span>
                    </button>

                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className="py-2.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#ff6a00]/20 transition-all"
                    >
                      <span>Track Live</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
