"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ShieldCheck,
  Download,
  ArrowRight,
  ChevronRight,
  Package,
  Printer,
  RotateCcw,
  AlertCircle,
  QrCode,
  CreditCard,
  Loader2,
  MessageSquare,
  Phone,
} from "lucide-react";
import { generateWhatsAppOrderUrl } from "@/lib/whatsapp";

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, addToast } = useApp();
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [utrInput, setUtrInput] = useState("");
  const [submittingUtr, setSubmittingUtr] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    async function fetchOrder(silent = false) {
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        } else if (!silent) {
          const err = await res.json();
          setError(err.error || "Order not found");
        }
      } catch {
        if (!silent) setError("Failed to load order details");
      } finally {
        if (!silent) setLoading(false);
      }
    }

    fetchOrder();

    // Real-time reactive polling every 4 seconds while order is actively being processed
    interval = setInterval(() => {
      fetchOrder(true);
    }, 4000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderId]);

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrInput.trim()) {
      addToast("Please enter a valid 12-digit UTR reference number", "warning");
      return;
    }

    setSubmittingUtr(true);
    try {
      const res = await fetch(`/api/orders/${order.orderNumber}/utr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utrNumber: utrInput.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        addToast("Bank reference (UTR) submitted! Our team will verify.", "success");
        setOrder((prev: any) => ({
          ...prev,
          paymentStatus: "PAYMENT_SUBMITTED",
          utrNumber: utrInput.trim(),
        }));
        setUtrInput("");
      } else {
        addToast(data.error || "Failed to submit UTR", "error");
      }
    } catch {
      addToast("Network error submitting UTR", "error");
    } finally {
      setSubmittingUtr(false);
    }
  };

  const handleReorder = () => {
    if (!order || !order.items) return;
    for (const item of order.items) {
      if (item.variantId) {
        addToCart({
          variant: {
            id: item.variantId,
            name: item.variantName || item.productName,
            sku: item.sku,
            price: item.price,
            mrp: item.price,
            discount: 0,
            stock: 10,
          },
          quantity: item.quantity,
        });
      }
    }
    addToast("Items added back to your cart!", "success");
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-10 h-10 text-[#ff6a00] animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white">Retrieving Live Order Tracking...</h2>
        <p className="text-xs text-neutral-400 mt-1">Connecting to campus fulfillment ledger</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Order Record Not Found</h2>
        <p className="text-xs text-neutral-400 mt-2 max-w-md mx-auto">
          {error || `We could not locate an order matching "${orderId}". Please verify your order number or check your account order history.`}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/account/orders"
            className="py-2.5 px-5 rounded-xl bg-[#ff6a00] text-black font-bold text-xs"
          >
            Go to My Orders
          </Link>
          <Link
            href="/shop"
            className="py-2.5 px-5 rounded-xl bg-[#161616] border border-[#262626] text-white text-xs font-semibold"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Define tracking milestone states
  const orderStatus = order.status; // PENDING, CONFIRMED, PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
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
    { level: 2, title: "Confirmed & Payment Verified", desc: "Payment verified, inventory reserved in database" },
    { level: 3, title: "Packed & Lab Inspected", desc: "Antistatic bag sealed & functional pinout verified" },
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:p-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6 print:hidden">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3 h-3 text-neutral-600" />
        <Link href="/account/orders" className="hover:text-white">Orders</Link>
        <ChevronRight className="w-3 h-3 text-neutral-600" />
        <span className="text-white font-mono">{order.orderNumber}</span>
      </div>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-[#111111] border border-[#262626] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 print:border-none print:p-0">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
              order.status === "DELIVERED"
                ? "bg-green-500/15 text-green-400 border-green-500/30"
                : order.status === "CANCELLED"
                ? "bg-red-500/15 text-red-400 border-red-500/30"
                : "bg-[#ff6a00]/15 text-[#ff6a00] border-[#ff6a00]/30"
            }`}>
              {order.status}
            </span>
            <span className="text-xs text-neutral-400">
              Carrier: {order.shipment?.carrier || "TechBox Campus Express Runner"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Placed on {formattedDate} • Recipient: <strong className="text-white">{order.recipientName}</strong> ({order.recipientPhone})
          </p>
          <p className="text-xs text-neutral-400 mt-0.5">
            Delivery Address: <span className="text-neutral-300">{order.campusDetail}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto print:hidden flex-wrap">
          <a
            href={generateWhatsAppOrderUrl(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 rounded-xl bg-[#22c55e] hover:bg-[#25b85a] text-black text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#22c55e]/20"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Send Order Details to TechBox WhatsApp</span>
          </a>
          <button
            onClick={handlePrintInvoice}
            className="py-2.5 px-4 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2e2e2e] text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#ff6a00]" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={handleReorder}
            className="py-2.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#ff6a00]/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reorder Hardware</span>
          </button>
        </div>
      </div>

      {/* Real-time Payment & UTR Verification Status Banner */}
      {order.paymentStatus === "PAYMENT_VERIFIED" && (
        <div className="p-6 rounded-3xl bg-[#22c55e]/10 border border-[#22c55e]/30 mb-8 flex items-start gap-4 print:hidden">
          <ShieldCheck className="w-6 h-6 text-[#22c55e] shrink-0 mt-0.5" />
          <div className="text-xs">
            <h3 className="font-bold text-white text-sm">Payment Verified & Approved</h3>
            <p className="text-neutral-300 mt-0.5">
              Bank credit of ₹{order.total} has been verified by TechBox Operations. UTR Reference: <strong className="font-mono text-white">{order.utrNumber || "Verified"}</strong>.
            </p>
          </div>
        </div>
      )}

      {order.paymentStatus === "PAYMENT_SUBMITTED" && (
        <div className="p-6 rounded-3xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 mb-8 flex items-start gap-4 print:hidden">
          <Clock className="w-6 h-6 text-[#3b82f6] shrink-0 mt-0.5" />
          <div className="text-xs flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Payment Verification In Progress</h3>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#3b82f6]/20 text-[#60a5fa] border border-[#3b82f6]/30">
                PENDING OPERATIONS APPROVAL
              </span>
            </div>
            <p className="text-neutral-300 mt-1">
              UTR Reference: <strong className="font-mono text-white">{order.utrNumber}</strong> submitted. TechBox operations team is verifying the credit in our PhonePe merchant account. Your order will be confirmed once cleared.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href={generateWhatsAppOrderUrl(order)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#22c55e] underline hover:text-[#4ade80] font-semibold flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send payment screenshot on WhatsApp (+91 70326 35858)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {(order.paymentStatus === "PAYMENT_PENDING" || order.paymentStatus === "PAYMENT_FAILED") && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#ff6a00]/40 mb-8 space-y-6 print:hidden">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-black border border-[#333333] shadow-xl shrink-0 p-2">
              <Image
                src="/images/techbox-upi-qr.jpg"
                alt="TechBox PhonePe UPI QR"
                fill
                className="object-contain"
              />
            </div>
            <div className="space-y-2 text-left flex-1 text-xs">
              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#ff6a00]/15 text-[#ff6a00] border border-[#ff6a00]/30">
                Action Required • Scan & Pay
              </div>
              <h3 className="text-base font-bold text-white">Complete Payment for Order #{order.orderNumber}</h3>
              <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#262626] space-y-1">
                <div>Account: <strong className="text-white">PINNAM CHARLA CHARLA</strong></div>
                <div>UPI Phone / WhatsApp: <strong className="text-[#ff6a00] font-mono">+91 70326 35858</strong></div>
                <div>UPI ID: <span className="text-white font-mono">7032635858@ybl</span></div>
                <div>Total Payable: <strong className="text-white text-sm font-black">₹{order.total}</strong></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleUtrSubmit} className="pt-4 border-t border-[#222] flex flex-col sm:flex-row items-end gap-3 text-xs">
            <div className="flex-1 w-full">
              <label className="text-neutral-300 font-semibold block mb-1">
                Enter 12-Digit Bank Reference / UTR Number:
              </label>
              <input
                type="text"
                required
                value={utrInput}
                onChange={(e) => setUtrInput(e.target.value)}
                placeholder="e.g. 423901824110"
                className="w-full bg-[#181818] border border-[#2e2e2e] focus:border-[#ff6a00] rounded-xl px-4 py-2.5 text-xs text-white font-mono tracking-wider focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submittingUtr}
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs shrink-0 transition-all disabled:opacity-50"
            >
              {submittingUtr ? "Submitting UTR..." : "Submit Bank Reference (UTR)"}
            </button>
          </form>
        </div>
      )}

      {/* Real-time Order Tracking Timeline */}
      <div className="p-8 rounded-3xl bg-[#111111] border border-[#262626] mb-8 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Truck className="w-4 h-4 text-[#ff6a00]" />
            <span>Live Campus Dispatch Timeline</span>
          </div>
          {order.shipment?.trackingNumber && (
            <div className="text-xs text-neutral-400 font-mono">
              Tracking Code: <strong className="text-[#ff6a00]">{order.shipment.trackingNumber}</strong>
            </div>
          )}
        </div>

        {/* Campus Runner Contact Card if assigned */}
        {order.runnerName && (
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-lg">
                🏃
              </div>
              <div>
                <div className="text-[10px] text-sky-400 uppercase font-bold tracking-wider">TechBox Campus Runner</div>
                <div className="text-sm font-bold text-white">{order.runnerName}</div>
                <div className="text-[11px] text-neutral-400">{order.campusDetail || "Delivering directly to your campus point"}</div>
              </div>
            </div>

            {order.runnerPhone && (
              <a
                href={`tel:${order.runnerPhone}`}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Runner ({order.runnerPhone})</span>
              </a>
            )}
          </div>
        )}

        {order.status === "CANCELLED" ? (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            This order was cancelled. Reserved inventory has been safely restored to warehouse stock.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#262626]">
            {milestones.map((m) => {
              const isCompleted = currentLevel >= m.level;
              const isCurrent = currentLevel === m.level;

              return (
                <div key={m.level} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-[#ff6a00] text-black shadow-lg shadow-[#ff6a00]/30"
                        : "bg-[#181818] border border-[#333333] text-neutral-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isCurrent ? "text-[#ff6a00]" : isCompleted ? "text-white" : "text-neutral-500"}`}>
                        {m.title}
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#ff6a00]/20 text-[#ff6a00]">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{m.desc}</p>
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
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Purchased Components Snapshot ({order.items?.length || 0} items)
            </h3>
            <div className="divide-y divide-[#202020]">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-bold text-white">{item.productName}</div>
                    <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      SKU: {item.sku} • Qty: {item.quantity} × ₹{item.price}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-white">
                    ₹{item.total}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Summary & Payment Info (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626] space-y-4 text-xs">
            <h3 className="font-bold text-white uppercase tracking-wider">Payment & Total</h3>
            <div className="space-y-2 text-neutral-400 pb-3 border-b border-[#222222]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-white font-medium">₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#22c55e]">
                  <span>Discount Applied:</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Campus Runner Dispatch:</span>
                <span className={order.shippingFee === 0 ? "text-[#22c55e]" : "text-white"}>
                  {order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#222222]">
                <span>Total Paid:</span>
                <span className="text-[#ff6a00]">₹{order.total}</span>
              </div>
            </div>

            <div>
              <div className="font-semibold text-white mb-1">Payment Method:</div>
              <div className="text-neutral-400 uppercase font-mono">
                {order.paymentMethod} • Status: <span className="text-[#22c55e] font-bold">{order.paymentStatus}</span>
              </div>
              {order.transactions && order.transactions.length > 0 && (
                <div className="text-[10px] text-neutral-500 font-mono mt-1">
                  Txn Ref: {order.transactions[0].transactionRef}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
