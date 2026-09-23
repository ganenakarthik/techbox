"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Copy,
  ExternalLink,
  Loader2,
  MapPin,
  Calendar,
  Send,
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string[];
    slug: string;
  };
  variant?: {
    name: string;
    sku?: string;
  };
}

interface OrderEvent {
  id: string;
  status: string;
  note?: string;
  createdAt: string;
}

interface Shipment {
  carrier: string;
  trackingNumber: string;
  status: string;
  currentCheckpoint?: string;
  estimatedDelivery?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  recipientName: string;
  recipientPhone: string;
  campusDetail: string;
  deliverySlot?: string;
  utrNumber?: string;
  createdAt: string;
  items: OrderItem[];
  events?: OrderEvent[];
  shipment?: Shipment;
}

export default function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, setIsAuthModalOpen, addToast } = useApp();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [utrInput, setUtrInput] = useState<string>("");
  const [submittingUtr, setSubmittingUtr] = useState<boolean>(false);

  const fetchOrderDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load order details");
        return;
      }
      setOrder(data.order);
      if (data.order.utrNumber) {
        setUtrInput(data.order.utrNumber);
      }
    } catch (err: any) {
      setError(err.message || "Network error loading order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrderDetail();
    } else {
      setLoading(false);
    }
  }, [id, user]);

  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    if (!utrInput.trim()) {
      addToast("Please enter a valid 12-digit UTR number", "error");
      return;
    }

    setSubmittingUtr(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/utr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utr: utrInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to submit UTR", "error");
        return;
      }
      addToast("UTR submitted successfully! Operations team will verify.", "success");
      setOrder(data.order);
    } catch (err: any) {
      addToast(err.message || "Error submitting UTR", "error");
    } finally {
      setSubmittingUtr(false);
    }
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-lg">
          <Package className="w-12 h-12 text-[#ff6a00] mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-xs text-slate-500 mb-6">
            Please log in to your Partsly account to view order details.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs shadow-md cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-lg space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Order Not Found</h2>
          <p className="text-xs text-slate-500">{error || "Unable to locate order."}</p>
          <Link
            href="/account/orders"
            className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Return to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Order status milestones
  const statusLevels: Record<string, number> = {
    PENDING: 1,
    CONFIRMED: 2,
    PACKED: 3,
    SHIPPED: 4,
    OUT_FOR_DELIVERY: 5,
    DELIVERED: 6,
    CANCELLED: 0,
  };

  const currentLevel = statusLevels[order.status] ?? 1;

  const milestones = [
    { title: "Order Placed", level: 1 },
    { title: "Order Confirmed", level: 2 },
    { title: "Packed & Tested", level: 3 },
    { title: "Campus Runner Dispatched", level: 4 },
    { title: "Out for Gate Delivery", level: 5 },
    { title: "Delivered", level: 6 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#ff6a00] mb-6 font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden mb-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono font-bold text-xs text-[#ff6a00] px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {order.orderNumber}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black">Campus Order Details</h1>
              <p className="text-xs text-slate-400 mt-1">
                Recipient: {order.recipientName} ({order.recipientPhone})
              </p>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Total Paid
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#ff6a00]">
                ₹{order.total}
              </span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/70">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-6">
              Live Dispatch Timeline
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative">
              {milestones.map((m) => {
                const isPassed = currentLevel >= m.level;
                const isCurrent = currentLevel === m.level;
                return (
                  <div
                    key={m.title}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                      isCurrent
                        ? "bg-[#ff6a00] text-black border-[#ff6a00] font-black shadow-md"
                        : isPassed
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold"
                        : "bg-white text-slate-400 border-slate-200 opacity-60"
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 shrink-0" />
                    )}
                    <span className="text-[10px] leading-tight">{m.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items Table */}
          <div className="p-6 sm:p-8 space-y-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Ordered Items ({order.items.length})
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        {item.product?.images?.[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.product?.name || "Product"}</h4>
                        {item.variant?.name && (
                          <span className="text-[10px] text-slate-500 font-mono block">
                            Variant: {item.variant.name}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">
                          Qty: <strong>{item.quantity}</strong> × ₹{item.price}
                        </span>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      ₹{item.quantity * item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address & Shipment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#ff6a00]" />
                  <span>Campus Delivery Hub:</span>
                </span>
                <p className="text-slate-700 font-medium leading-relaxed">{order.campusDetail}</p>
                {order.deliverySlot && (
                  <div className="pt-2 text-slate-500 font-mono text-[11px]">
                    Delivery Slot: {order.deliverySlot}
                  </div>
                )}
              </div>

              {/* Shipment Info */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#ff6a00]" />
                  <span>Shipment & Courier Status:</span>
                </span>
                {order.shipment?.trackingNumber ? (
                  <div className="space-y-1 text-slate-700">
                    <div>Courier: <strong>{order.shipment.carrier}</strong></div>
                    <div>Tracking #: <strong className="font-mono text-[#ff6a00]">{order.shipment.trackingNumber}</strong></div>
                    <div>Location: {order.shipment.currentCheckpoint || "En route"}</div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">
                    Campus runner dispatch in progress. Tracking details update upon gate dispatch.
                  </p>
                )}
              </div>
            </div>

            {/* Payment & UTR Submission if required */}
            {order.paymentStatus !== "VERIFIED" && (
              <div className="p-5 rounded-2xl bg-slate-900 text-white text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#ff6a00] uppercase tracking-wider text-[10px]">
                    UPI Payment Status: {order.paymentStatus}
                  </span>
                  {order.utrNumber && (
                    <span className="text-[10px] font-mono text-purple-300">
                      UTR Submitted: {order.utrNumber}
                    </span>
                  )}
                </div>

                <form onSubmit={handleUtrSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value)}
                    placeholder="Enter 12-digit UTR number"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6a00]"
                  />
                  <button
                    type="submit"
                    disabled={submittingUtr}
                    className="py-2 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs shrink-0 transition-all cursor-pointer flex items-center gap-1"
                  >
                    {submittingUtr ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Submit UTR</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
