"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { generateWhatsAppOrderUrl } from "@/lib/whatsapp";
import {
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  ArrowRight,
  ShieldCheck,
  Printer,
  ChevronRight,
  AlertCircle,
  MessageSquare,
  Copy,
  ExternalLink,
} from "lucide-react";

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const { addToast } = useApp();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [utrInput, setUtrInput] = useState("");
  const [submittingUtr, setSubmittingUtr] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Order not found");
          throw new Error("Failed to load order details");
        }
        const data = await res.json();
        if (isMounted) {
          setOrder(data.order);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrInput.trim()) return;

    setSubmittingUtr(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/utr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utr: utrInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit bank reference");
      }

      setOrder(data.order);
      setUtrInput("");
      addToast("UTR reference submitted successfully for verification!", "success");
    } catch (err: any) {
      addToast(err.message || "Failed to submit UTR", "error");
    } finally {
      setSubmittingUtr(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast(`Copied ${label} to clipboard!`, "info");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-500 font-mono">Loading order status...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4 text-red-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Order Record Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
            {error || `We could not locate an order matching "${orderId}". Please verify your order number or check your account order history.`}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/account/orders"
              className="py-2.5 px-5 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-bold text-xs shadow-xs transition-colors"
            >
              Go to My Orders
            </Link>
            <Link
              href="/shop"
              className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Define tracking milestone states
  const orderStatus = order.status;
  const statusLevels: Record<string, number> = {
    PENDING: 1,
    CONFIRMED: 2,
    PACKED: 3,
    SHIPPED: 4,
    OUT_FOR_DELIVERY: 5,
    DELIVERED: 6,
    CANCELLED: 0,
  };

  const currentLevel = statusLevels[orderStatus] ?? 1;

  const milestones = [
    { level: 1, title: "Order Placed", desc: "Order details received on campus ledger" },
    { level: 2, title: "Confirmed & Payment Verified", desc: "Payment verified, components reserved" },
    { level: 3, title: "Packed & Lab Inspected", desc: "Sealed & functional pinout verified" },
    { level: 4, title: "In Campus Transit", desc: "Dispatched to designated college transit runner" },
    { level: 5, title: "Out for Delivery", desc: "Runner approaching college gate or hostel pickup desk" },
    { level: 6, title: "Delivered", desc: "Package handed over to student recipient" },
  ];

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white min-h-screen text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 print:hidden">
          <Link href="/" className="hover:text-[#ff6a00] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/account/orders" className="hover:text-[#ff6a00] transition-colors">Orders</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-mono">{order.orderNumber}</span>
        </div>

        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 print:border-none print:p-0">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                order.status === "DELIVERED"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : order.status === "CANCELLED"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-orange-50 text-[#ff6a00] border-orange-200"
              }`}>
                {order.status}
              </span>
              <span className="text-xs text-slate-500">
                Carrier: {order.shipment?.carrier || "Partsly Campus Express Runner"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {formattedDate} • Recipient: <strong className="text-slate-900">{order.recipientName}</strong> ({order.recipientPhone})
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Payment Verification Banner if PENDING */}
        {order.paymentStatus === "PAYMENT_SUBMITTED" && (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 mb-8 flex items-start gap-4">
            <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-900">
                Bank Reference Submitted — Awaiting Verification
              </h3>
              <p className="text-xs text-amber-700 leading-relaxed">
                Your payment UTR was recorded. The Partsly campus team is verifying the transaction with our bank ledger.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={generateWhatsAppOrderUrl(order)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-700 underline hover:text-emerald-800 font-semibold flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send payment screenshot on WhatsApp (+91 70326 35858)</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {(order.paymentStatus === "PAYMENT_PENDING" || order.paymentStatus === "PAYMENT_FAILED") && (
          <div className="p-6 sm:p-8 rounded-2xl bg-orange-50/50 border border-orange-200 mb-8 space-y-6 print:hidden">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm shrink-0 p-2">
                <Image
                  src="/images/partsly-upi-qr.jpg"
                  alt="Partsly UPI QR"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="space-y-2 text-left flex-1 text-xs">
                <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-[#ff6a00] border border-orange-200">
                  Action Required • Scan & Pay
                </div>
                <h3 className="text-base font-bold text-slate-900">Complete Payment for Order #{order.orderNumber}</h3>
                <div className="p-3.5 rounded-xl bg-white border border-orange-200/80 space-y-1.5 shadow-2xs">
                  <div>Account: <strong className="text-slate-900">PINNAM CHARLA CHARLA</strong></div>
                  <div>UPI Phone / WhatsApp: <strong className="text-[#ff6a00] font-mono">+91 70326 35858</strong></div>
                  <div>UPI ID: <span className="text-slate-800 font-mono">7032635858@ybl</span></div>
                  <div>Total Payable: <strong className="text-slate-900 text-sm font-black">₹{order.total}</strong></div>
                </div>
              </div>
            </div>

            <form onSubmit={handleUtrSubmit} className="pt-4 border-t border-orange-200 flex flex-col sm:flex-row items-end gap-3 text-xs">
              <div className="flex-1 w-full">
                <label className="text-slate-700 font-semibold block mb-1">
                  Enter 12-Digit Bank Reference / UTR Number:
                </label>
                <input
                  type="text"
                  required
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  placeholder="e.g. 423901824110"
                  className="w-full bg-white border border-slate-300 focus:border-[#ff6a00] rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono tracking-wider focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={submittingUtr}
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-xs shrink-0 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {submittingUtr ? "Submitting UTR..." : "Submit Bank Reference (UTR)"}
              </button>
            </form>
          </div>
        )}

        {/* Order Tracking Timeline */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 mb-8 shadow-xs print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Truck className="w-4 h-4 text-[#ff6a00]" />
              <span>Campus Dispatch Timeline</span>
            </div>
            {order.shipment?.trackingNumber && (
              <div className="text-xs text-slate-500 font-mono">
                Tracking Code: <strong className="text-[#ff6a00]">{order.shipment.trackingNumber}</strong>
              </div>
            )}
          </div>

          {/* Campus Runner Contact Card if assigned */}
          {order.runnerName && (
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
                  🏃
                </div>
                <div>
                  <div className="text-[10px] text-sky-700 uppercase font-bold tracking-wider">Partsly Campus Runner</div>
                  <div className="text-sm font-bold text-slate-900">{order.runnerName}</div>
                  <div className="text-[11px] text-slate-500">{order.campusDetail || "Delivering directly to your campus point"}</div>
                </div>
              </div>

              {order.runnerPhone && (
                <a
                  href={`tel:${order.runnerPhone}`}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Runner ({order.runnerPhone})</span>
                </a>
              )}
            </div>
          )}

          {order.status === "CANCELLED" ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              This order was cancelled.
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {milestones.map((m) => {
                const isCompleted = currentLevel >= m.level;
                const isCurrent = currentLevel === m.level;

                return (
                  <div key={m.level} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-[#ff6a00] text-white shadow-xs"
                          : "bg-white border-2 border-slate-300 text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isCurrent ? "text-[#ff6a00]" : isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                          {m.title}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-[#ff6a00]">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Snapshot Items and Billing Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Purchased Items (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                Purchased Components Snapshot ({order.items?.length || 0} items)
              </h3>
              <div className="divide-y divide-slate-100">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.productName}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        SKU: {item.sku} • Qty: {item.quantity} × ₹{item.price}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      ₹{item.total}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Summary & Payment Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider">Payment & Total</h3>
              <div className="space-y-2 text-slate-500 pb-3 border-b border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-slate-900 font-medium">₹{order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount Applied:</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Campus Runner Dispatch:</span>
                  <span className={order.shippingFee === 0 ? "text-emerald-700 font-semibold" : "text-slate-900"}>
                    {order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Paid:</span>
                  <span className="text-[#ff6a00]">₹{order.total}</span>
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-900 mb-1">Payment Method:</div>
                <div className="text-slate-600 uppercase font-mono">
                  {order.paymentMethod} • Status: <span className="text-emerald-700 font-bold">{order.paymentStatus}</span>
                </div>
                {order.transactions && order.transactions.length > 0 && (
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    Txn Ref: {order.transactions[0].transactionRef}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
