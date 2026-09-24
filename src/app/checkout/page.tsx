"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  QrCode,
  MapPin,
  Clock,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  MessageSquare,
  Copy,
  ExternalLink,
} from "lucide-react";
import { validateIndianPhone, validateUTR } from "@/lib/validation";
import { PartslyLogo } from "@/components/ui/PartslyLogo";
import { PartslyLoader } from "@/components/ui/PartslyLoader";
import { generateUpiQrCodeUrl } from "@/lib/upi";
import { generateWhatsAppReceiptUrl } from "@/lib/whatsapp";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    subtotal,
    discountAmount,
    couponCode,
    addToast,
    user,
    setIsAuthModalOpen,
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [paymentCheckLoading, setPaymentCheckLoading] = useState(false);
  const [paymentCheckStatus, setPaymentCheckStatus] = useState<string>("Submitted — Pending Verification");

  // Form State
  const [contactName, setContactName] = useState(user?.name || "");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactPhone, setContactPhone] = useState(user?.phone || "");
  const [alternatePhone, setAlternatePhone] = useState("");

  // Keep form updated when user logs in
  React.useEffect(() => {
    if (user) {
      if (user.name) setContactName(user.name);
      if (user.email) setContactEmail(user.email);
      if (user.phone) setContactPhone(user.phone);
    }
  }, [user]);

  // Campus & Delivery Details
  const [collegeName, setCollegeName] = useState(user?.college || "");
  const [department, setDepartment] = useState("");
  const [pickupPoint, setPickupPoint] = useState("");
  const [hostelBlock, setHostelBlock] = useState(user?.room || "");
  const [cityState, setCityState] = useState("");

  // Delivery Speed
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "urgent">("standard");
  const [deliverySlot, setDeliverySlot] = useState("Evening Slot (4:30 PM - 7:30 PM)");

  // Payment
  const [utrNumber, setUtrNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Real order confirmation state
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    total: number;
    subtotal: number;
    shipping: number;
    recipientName: string;
    recipientPhone: string;
    campusDetail: string;
    items: { name: string; quantity: number; price: number; variant?: string }[];
    whatsappUrl?: string;
    paymentStatus: string;
    utrNumber: string | null;
  } | null>(null);

  const speedFee = deliverySpeed === "urgent" ? 99 : 0;
  const campusDeliveryFee = subtotal >= 499 ? 0 : 40;
  const grandTotal = Math.max(0, subtotal - discountAmount + campusDeliveryFee + speedFee);

  const dynamicQrUrl = generateUpiQrCodeUrl({
    amount: grandTotal,
    transactionNote: `Partsly Order ₹${grandTotal}`,
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!user) {
      addToast("Please log in to place an order", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    if (cart.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }

    if (!contactName.trim()) {
      addToast("Please enter your name", "error");
      setStep(1);
      return;
    }

    const phoneValidation = validateIndianPhone(contactPhone);
    if (!phoneValidation.isValid) {
      addToast(phoneValidation.error || "Please enter a valid 10-digit Indian mobile number", "error");
      setStep(1);
      return;
    }

    if (!collegeName.trim()) {
      addToast("Campus / College name is required for delivery", "error");
      setStep(2);
      return;
    }

    if (!hostelBlock.trim()) {
      addToast("Hostel block / room number is required for campus delivery", "error");
      setStep(2);
      return;
    }

    if (!pickupPoint.trim()) {
      addToast("Campus pickup point is required", "error");
      setStep(2);
      return;
    }

    const cleanUtr = utrNumber.trim();
    if (cleanUtr) {
      const utrValidation = validateUTR(cleanUtr);
      if (!utrValidation.isValid) {
        addToast(utrValidation.error || "Invalid UTR format. Must be a 12-digit number.", "error");
        setStep(4);
        return;
      }
    }

    setIsProcessing(true);

    try {
      const orderItems = cart.map((item) => ({
        variantId: item.variantId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const payload = {
        items: orderItems,
        recipientName: contactName.trim(),
        recipientPhone: phoneValidation.normalized || contactPhone.trim(),
        collegeName: collegeName.trim(),
        campusName: cityState.trim() || undefined,
        department: department.trim() || undefined,
        pickupPoint: pickupPoint.trim(),
        hostelBlock: hostelBlock.trim(),
        deliverySlot,
        deliverySpeed,
        paymentMethod: "upi",
        couponCode: couponCode || undefined,
        utrNumber: cleanUtr || undefined,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Order could not be placed. Please try again.";
        setCheckoutError(errorMsg);
        addToast(errorMsg, "error");
        return;
      }

      const receiptPayload = {
        orderNumber: data.orderNumber,
        recipientName: contactName.trim(),
        recipientPhone: phoneValidation.normalized || contactPhone.trim(),
        campusDetail: `${collegeName.trim()} (${hostelBlock.trim()})`,
        items: orderItems,
        subtotal,
        shipping: campusDeliveryFee + speedFee,
        total: data.total || grandTotal,
        paymentStatus: cleanUtr ? "UTR Submitted — Pending Verification" : "Payment Pending",
        utrNumber: cleanUtr || undefined,
      };

      const generatedWaUrl = generateWhatsAppReceiptUrl(receiptPayload);

      clearCart();
      setConfirmedOrder({
        orderNumber: data.orderNumber,
        total: data.total || grandTotal,
        subtotal,
        shipping: campusDeliveryFee + speedFee,
        recipientName: contactName.trim(),
        recipientPhone: phoneValidation.normalized || contactPhone.trim(),
        campusDetail: `${collegeName.trim()} (${hostelBlock.trim()})`,
        items: orderItems,
        whatsappUrl: generatedWaUrl,
        paymentStatus: cleanUtr ? "PAYMENT_SUBMITTED" : "PAYMENT_PENDING",
        utrNumber: cleanUtr || null,
      });
      addToast(`Order ${data.orderNumber} confirmed!`, "success");
    } catch (err: any) {
      const errorMsg = "Unable to reach the order server. Please check your connection and try again.";
      setCheckoutError(errorMsg);
      addToast(errorMsg, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Confirmed Order Screen ────────────────────────────────────────────────
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16 text-center">
        <div className="mb-6 flex justify-center">
          <PartslyLogo size="lg" />
        </div>

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#ff6a00]/10 border border-[#ff6a00]/30 flex items-center justify-center mx-auto mb-6 text-[#ff6a00]">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-bold mb-3">
          <Truck className="w-3.5 h-3.5" />
          <span>Order Confirmed — Campus Runner Queued</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Order #{confirmedOrder.orderNumber}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
          {confirmedOrder.utrNumber
            ? "Your payment reference has been submitted. Partsly operations will verify your UTR and confirm gate dispatch."
            : "Your order is placed. Scan the instant UPI QR code to complete payment and submit your 12-digit UTR."}
        </p>

        {/* Order Breakdown Card */}
        <div className="mt-6 p-6 rounded-3xl bg-white border border-slate-200 text-left text-xs space-y-3 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-500">Order Number:</span>
            <span className="text-slate-900 font-mono font-bold">{confirmedOrder.orderNumber}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-500">Recipient Name & Mobile:</span>
            <span className="text-slate-900 font-bold">{confirmedOrder.recipientName} ({confirmedOrder.recipientPhone})</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-500">Amount Payable:</span>
            <span className="text-[#ff6a00] font-black text-lg">₹{confirmedOrder.total}</span>
          </div>

          {/* Itemized list preview */}
          <div className="pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-900 block mb-2">Itemized Components ({confirmedOrder.items.length}):</span>
            <div className="space-y-1.5">
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-600 font-mono text-[11px]">
                  <span>• {item.name} (Qty: {item.quantity})</span>
                  <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Payment Verification Card */}
        <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Payment Status: <strong className="text-[#ff6a00]">{paymentCheckStatus}</strong></span>
            </div>
            <p className="text-[11px] text-amber-700 mt-0.5">
              UTR reference is logged. Our automated ledger and campus ops team verify UTRs in real time.
            </p>
          </div>
          <button
            onClick={async () => {
              setPaymentCheckLoading(true);
              try {
                const res = await fetch(`/api/orders/${confirmedOrder.orderNumber}`);
                const data = await res.json();
                const currentStatus = data?.paymentStatus || data?.order?.paymentStatus;
                if (currentStatus === "VERIFIED" || currentStatus === "CONFIRMED") {
                  setPaymentCheckStatus("VERIFIED — Payment Confirmed!");
                  addToast("Payment Verified by Partsly Ops!", "success");
                } else {
                  setPaymentCheckStatus("UTR Submitted — Pending Ops Verification");
                  addToast("Payment UTR is logged and pending ops verification", "info");
                }
              } catch {
                setPaymentCheckStatus("UTR Logged — Verification Queued");
              } finally {
                setPaymentCheckLoading(false);
              }
            }}
            disabled={paymentCheckLoading}
            className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-bold text-xs shrink-0 transition-colors cursor-pointer"
          >
            {paymentCheckLoading ? "Verifying..." : "Check Status"}
          </button>
        </div>

        {/* WhatsApp Notification Button to Partsly Sourcing (+91 70326 35858) */}
        {confirmedOrder.whatsappUrl && (
          <div className="mt-6">
            <a
              href={confirmedOrder.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs shadow-xl shadow-[#25D366]/25 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Send Order Alert & Receipt to Partsly Ops (+91 70326 35858)</span>
              <ExternalLink className="w-4 h-4 opacity-75" />
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href={`/account/orders`}
            className="py-3.5 px-6 rounded-2xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#ff6a00]/20 transition-all"
          >
            <span>View My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop"
            className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Checkout Form ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
      {isProcessing && (
        <PartslyLoader fullScreen text="Creating Order & Registering UTR Ledger..." />
      )}
      {/* Header Logo & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="mb-2">
            <PartslyLogo size="md" />
          </div>
          <p className="text-xs text-slate-500">
            Express Campus Delivery • Real-time Hardware Dispatch
          </p>
        </div>
      </div>

      {/* Auth Gate Banner */}
      {!user && (
        <div className="mb-6 max-w-3xl mx-auto p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="text-amber-800 font-medium">
              Please sign in to complete your campus checkout.
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="py-1.5 px-4 rounded-xl bg-[#ff6a00] text-black font-bold text-xs shadow-xs"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Mobile-Friendly Navigation Steps */}
      <div className="mb-8 max-w-3xl mx-auto overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max text-xs font-bold">
          {[
            { id: 1, name: "01 Contact" },
            { id: 2, name: "02 Campus" },
            { id: 3, name: "03 Slot" },
            { id: 4, name: "04 Instant UPI" },
            { id: 5, name: "05 Confirm" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`py-2 px-3.5 rounded-xl border text-xs transition-all ${
                step === s.id
                  ? "bg-[#ff6a00] border-[#ff6a00] text-black shadow-sm font-black"
                  : step > s.id
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold"
                  : "bg-white border-slate-200 text-slate-500"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Step Form Screens (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: CONTACT */}
          {step === 1 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">01. Student Contact Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Our campus runner will send an SMS/call when approaching your designated pickup gate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Full Name:</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Student Email:</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. rahul@campus.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold font-mono">Mobile Number (WhatsApp):</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 90148 08515"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold font-mono">Alternate Mobile / Roommate:</label>
                  <input
                    type="tel"
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                    placeholder="e.g. +91 98765 43211 (optional)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#ff6a00]/20"
                >
                  <span>Continue to Campus Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CAMPUS */}
          {step === 2 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">02. Designated Campus Pickup Location</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specify your college campus, department lab, or hostel gate.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">College / University Name:</label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. IIT / RVCE / SRM / SRM AP"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">City & State:</label>
                    <input
                      type="text"
                      value={cityState}
                      onChange={(e) => setCityState(e.target.value)}
                      placeholder="e.g. Chennai, Tamil Nadu"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Department / Lab:</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. ECE / Robotics Lab"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold font-mono">Pickup Point / Main Gate: *</label>
                  <input
                    type="text"
                    required
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    placeholder="e.g. Gate 2 / Tech Park Entrance Porch"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold font-mono">Hostel Block & Room / Desk:</label>
                  <input
                    type="text"
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    placeholder="e.g. Hostel Block B, Room 204"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-3 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold text-xs flex items-center gap-2"
                >
                  <span>Continue to Delivery Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SPEED & SLOTS */}
          {step === 3 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">03. Select Delivery Slot & Speed</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose a runner slot that fits your project viva schedule.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-600 block mb-2 font-semibold">Campus Runner Slot:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["Morning Slot (10:30 AM - 1:00 PM)", "Evening Slot (4:30 PM - 7:30 PM)"].map((slot) => (
                      <div
                        key={slot}
                        onClick={() => setDeliverySlot(slot)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          deliverySlot === slot
                            ? "bg-[#ff6a00]/10 border-[#ff6a00] text-slate-900 font-bold shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        <Clock className="w-4 h-4 text-[#ff6a00] mb-2" />
                        <div>{slot}</div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                          Handover at pickup gate
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 block mb-2 font-semibold">Speed Tier:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setDeliverySpeed("standard")}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        deliverySpeed === "standard"
                          ? "bg-[#ff6a00]/10 border-[#ff6a00] text-slate-900"
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold">Standard Campus Dispatch</span>
                        <span className="text-[#22c55e] font-bold">FREE (₹0)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Regular campus runner batch delivery.
                      </p>
                    </div>

                    <div
                      onClick={() => setDeliverySpeed("urgent")}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        deliverySpeed === "urgent"
                          ? "bg-[#ff6a00]/10 border-[#ff6a00] text-slate-900"
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[#ff6a00]">Emergency Viva Priority</span>
                        <span className="font-bold text-slate-900">+₹99</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Immediate packing & direct dedicated courier runner.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="py-3 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold text-xs flex items-center gap-2"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: INSTANT UPI PAYMENT */}
          {step === 4 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">04. Dynamic Instant UPI Payment</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scan the dynamic UPI QR code with GPay, PhonePe, Paytm, or BHIM and submit your 12-digit UTR.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Dynamic QR Image */}
                  <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-2xl overflow-hidden bg-white border-2 border-[#ff6a00]/30 shadow-md shrink-0 p-2 flex items-center justify-center">
                    <img
                      src={dynamicQrUrl}
                      alt="Instant Dynamic UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-3 text-left flex-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/25 text-xs font-bold">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Instant Dynamic UPI QR</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">Scan & Pay via Any App</h3>
                    <p className="text-xs text-slate-500">
                      GPay, PhonePe, Paytm, BHIM supported. Pre-filled with exact amount.
                    </p>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs shadow-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Name:</span>
                        <strong className="text-slate-900">PINNAM CHARLA CHARLA</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">UPI VPA:</span>
                        <code className="text-[#ff6a00] font-mono font-bold">7032635858@ybl</code>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Exact Payable Amount:</span>
                        <span className="text-base font-black text-[#ff6a00]">₹{grandTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UTR Input */}
                <div className="pt-4 border-t border-slate-200">
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5 font-mono">
                    Enter 12-Digit Bank UTR Reference Number:
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 423901824110 (from GPay / PhonePe receipt)"
                    className="w-full bg-white border border-slate-200 focus:border-[#ff6a00] rounded-xl px-4 py-3 text-xs text-slate-900 font-mono tracking-wider focus:outline-none shadow-xs"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Enter your 12-digit UTR from payment receipt. You can also submit UTR anytime from your account orders tab.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="py-3 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold text-xs flex items-center gap-2"
                >
                  <span>Review & Confirm Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & CONFIRM */}
          {step === 5 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">05. Final Order Review & Campus Dispatch</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm recipient contact, campus hub location, and reserve catalog items.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">College / Campus:</span>
                  <span className="text-slate-900 font-bold">{collegeName || "—"}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Pickup Location:</span>
                  <span className="text-slate-900 font-bold">{pickupPoint || "—"}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Scheduled Run:</span>
                  <span className="text-slate-900 font-bold">{deliverySlot}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Recipient Contact:</span>
                  <span className="text-slate-900 font-bold">{contactName} ({contactPhone})</span>
                </div>
                {utrNumber.trim() && (
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Payment UTR:</span>
                    <span className="text-slate-900 font-mono font-bold">{utrNumber.trim()}</span>
                  </div>
                )}
              </div>

              {checkoutError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Order Failed</span>
                    <span>{checkoutError}</span>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessing || !user}
                  onClick={handlePlaceOrder}
                  className="py-3.5 px-8 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Creating Order...</span>
                  ) : (
                    <>
                      <span>Authorize Order (₹{grandTotal})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Order Summary</span>
              <span className="px-2 py-0.5 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-[10px] font-mono">
                {cart.length} items
              </span>
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 flex items-center gap-3 text-xs">
                  <div className="relative w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Qty: {item.quantity} × ₹{item.price}
                    </div>
                  </div>
                  <div className="font-mono font-bold text-slate-900">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#22c55e]">
                  <span>Discount:</span>
                  <span className="font-mono font-bold">-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Campus Runner Delivery:</span>
                <span className="font-mono font-semibold">
                  {campusDeliveryFee === 0 ? "FREE" : `₹${campusDeliveryFee}`}
                </span>
              </div>
              {speedFee > 0 && (
                <div className="flex justify-between text-[#ff6a00]">
                  <span>Emergency Priority Fee:</span>
                  <span className="font-mono font-bold">+₹{speedFee}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>Grand Total:</span>
                <span className="text-[#ff6a00]">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
