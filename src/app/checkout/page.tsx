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

  // Real order confirmation state — only populated after successful API response
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    total: number;
    whatsappUrl?: string;
    paymentStatus: string;
    utrNumber: string | null;
  } | null>(null);

  const speedFee = deliverySpeed === "urgent" ? 99 : 0;
  const campusDeliveryFee = subtotal >= 499 ? 0 : 40;
  const grandTotal = Math.max(0, subtotal - discountAmount + campusDeliveryFee + speedFee);

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
      const payload = {
        items: cart.map((item) => ({
          variantId: item.variantId,
          name: item.name,
          quantity: item.quantity,
        })),
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
        // API returned an error — show it, do NOT clear cart
        const errorMsg = data.error || "Order could not be placed. Please try again.";
        setCheckoutError(errorMsg);
        addToast(errorMsg, "error");
        return;
      }

      // Order successfully created — NOW clear cart and show confirmation
      clearCart();
      setConfirmedOrder({
        orderNumber: data.orderNumber,
        total: data.total,
        whatsappUrl: data.whatsappUrl,
        paymentStatus: cleanUtr ? "PAYMENT_SUBMITTED" : "PAYMENT_PENDING",
        utrNumber: cleanUtr || null,
      });
      addToast(`Order ${data.orderNumber} confirmed!`, "success");
    } catch (err: any) {
      // Network/server error — show error, do NOT clear cart
      const errorMsg =
        "Unable to reach the order server. Please check your connection and try again.";
      setCheckoutError(errorMsg);
      addToast(errorMsg, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Confirmed Order Screen ────────────────────────────────────────────────
  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6 text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
          <Truck className="w-3.5 h-3.5" />
          <span>Order Confirmed — Campus Dispatch Queued</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Order #{confirmedOrder.orderNumber}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          {confirmedOrder.utrNumber
            ? "Your payment reference has been submitted. Partsly will verify your UTR and confirm dispatch."
            : "Your order is placed. Please complete UPI payment and submit your UTR reference to confirm dispatch."}
        </p>

        {/* Order Summary */}
        <div className="mt-6 p-6 rounded-3xl bg-white border border-slate-200 text-left text-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-slate-500">Order Number:</span>
            <span className="text-slate-900 font-mono font-bold">{confirmedOrder.orderNumber}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-slate-500">Amount Payable:</span>
            <span className="text-[#ff6a00] font-black text-base">₹{confirmedOrder.total}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-slate-500">Payment Status:</span>
            <span className={`font-bold ${confirmedOrder.paymentStatus === "PAYMENT_SUBMITTED" ? "text-emerald-600" : "text-amber-600"}`}>
              {confirmedOrder.paymentStatus === "PAYMENT_SUBMITTED" ? "UTR Submitted — Pending Verification" : "Awaiting Payment"}
            </span>
          </div>
          {confirmedOrder.utrNumber && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">Submitted UTR:</span>
              <span className="text-slate-900 font-mono font-bold">{confirmedOrder.utrNumber}</span>
            </div>
          )}
        </div>

        {/* UPI QR — show if not yet paid */}
        {!confirmedOrder.utrNumber && (
          <div className="mt-6 p-5 rounded-3xl bg-[#ff6a00]/5 border border-[#ff6a00]/25 text-left space-y-3">
            <p className="text-xs font-bold text-slate-900">Complete Your UPI Payment</p>
            <p className="text-[11px] text-slate-600">
              Pay ₹{confirmedOrder.total} to <strong>7032635858@ybl</strong> (PINNAM CHARLA CHARLA) using any UPI app, then submit your 12-digit UTR from the payment receipt.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">UPI ID:</span>
              <code className="text-xs text-[#ff6a00] font-mono font-bold">7032635858@ybl</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("7032635858@ybl");
                  addToast("UPI ID copied", "success");
                }}
                className="p-1 rounded hover:bg-slate-100 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>
        )}

        {/* WhatsApp Confirmation */}
        {confirmedOrder.whatsappUrl && (
          <a
            href={confirmedOrder.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-all shadow-lg shadow-[#25D366]/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Confirm Order on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-75" />
          </a>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href={`/account`}
            className="py-3.5 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all"
          >
            <span>View My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop"
            className="py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Checkout Form ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Auth gate */}
      {!user && (
        <div className="mb-6 max-w-3xl mx-auto p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="text-amber-800">
            You need to <button onClick={() => setIsAuthModalOpen(true)} className="font-bold underline">sign in</button> to place an order.
          </span>
        </div>
      )}

      {/* Steps indicator */}
      <div className="mb-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs font-bold">
          {[
            { id: 1, name: "01 Contact" },
            { id: 2, name: "02 Campus Delivery" },
            { id: 3, name: "03 Speed & Slot" },
            { id: 4, name: "04 Payment (PhonePe UPI)" },
            { id: 5, name: "05 Review & Order" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`pb-2 border-b-2 transition-colors ${
                step === s.id
                  ? "border-[#ff6a00] text-[#ff6a00]"
                  : step > s.id
                  ? "border-[#22c55e] text-[#22c55e]"
                  : "border-transparent text-slate-500"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Step Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: CONTACT */}
          {step === 1 && (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">01. Student Contact Information</h2>
                <p className="text-xs text-slate-500">
                  Our campus delivery runner will SMS/call you when approaching the pickup gate.
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
                  <label className="text-slate-600 block mb-1 font-semibold">Student College Email:</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. rahul@campus.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Mobile Number:</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Alternate Phone / Roommate:</label>
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
                  className="py-3 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold text-xs flex items-center gap-2"
                >
                  <span>Continue to Campus Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CAMPUS */}
          {step === 2 && (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">02. Designated Campus Delivery Point</h2>
                <p className="text-xs text-slate-500">
                  Enter your college, department, and designated pickup desk or hostel block.
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
                    placeholder="e.g. Indian Institute of Technology / RV College / SRM"
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
                    <label className="text-slate-600 block mb-1 font-semibold">Department / Branch:</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. ECE / CSE / Mechanical Lab 2"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Campus Pickup Point / Gate: *</label>
                  <input
                    type="text"
                    required
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    placeholder="e.g. Main Gate Reception / Tech Park Entrance Porch"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Hostel Block & Room / Lab Desk:</label>
                  <input
                    type="text"
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    placeholder="e.g. Hostel Block B, Room 204 or ECE Innovation Lab"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
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
            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">03. Select Campus Delivery Slot & Speed</h2>
                <p className="text-xs text-slate-500">
                  Choose a run that fits around your classes, lab sessions, or upcoming viva deadlines.
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
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          deliverySlot === slot
                            ? "bg-[#ff6a00]/10 border-[#ff6a00] text-slate-900 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        <Clock className="w-4 h-4 text-[#ff6a00] mb-2" />
                        <div>{slot}</div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                          Handover at designated pickup gate
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
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
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
                        Dispatched in 24-48 hours via regular campus runner batches.
                      </p>
                    </div>

                    <div
                      onClick={() => setDeliverySpeed("urgent")}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
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
                        Immediate packing & dedicated courier runner directly to your lab door.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
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

          {/* STEP 4: PAYMENT */}
          {step === 4 && (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">04. Select Payment Method</h2>
                <p className="text-xs text-slate-500">
                  Scan the official PhonePe UPI QR code with any UPI app and submit your 12-digit UTR reference number.
                </p>
              </div>

              {/* Official UPI Payment */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-52 h-52 rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-md shrink-0 p-3 flex items-center justify-center">
                    <Image
                      src="/images/partsly-upi-qr.jpg"
                      alt="Partsly PhonePe UPI QR Code"
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="space-y-3 text-left flex-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6739b7]/10 text-[#6739b7] border border-[#6739b7]/25 text-xs font-bold">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>PhonePe Official Merchant QR</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">Scan & Pay Using Any UPI App</h3>
                    <p className="text-xs text-slate-500">
                      Scan with PhonePe, Google Pay, Paytm, or BHIM. Zero convenience fee.
                    </p>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs shadow-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Holder:</span>
                        <strong className="text-slate-900">PINNAM CHARLA CHARLA</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">UPI Phone / WhatsApp:</span>
                        <strong className="text-[#ff6a00] font-mono font-bold">+91 70326 35858</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">UPI ID (VPA):</span>
                        <span className="text-slate-900 font-mono font-bold">7032635858@ybl</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Exact Payable Total:</span>
                        <span className="text-base font-black text-[#ff6a00]">₹{grandTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UTR Input */}
                <div className="pt-4 border-t border-slate-200">
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Enter 12-Digit Bank Reference / UTR Number:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 423901824110 (from your UPI payment receipt)"
                      className="w-full bg-white border border-slate-200 focus:border-[#ff6a00] rounded-xl px-4 py-3 text-xs text-slate-900 font-mono tracking-wider focus:outline-none shadow-sm"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Enter the 12-digit UTR from PhonePe, Google Pay, or Paytm receipt. You can also submit your UTR after placing the order from your account page.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
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
            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">05. Final Order Review & Campus Dispatch</h2>
                <p className="text-xs text-slate-500">
                  Confirm recipient details, pickup location, and reserve catalog inventory.
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

              {/* Error Banner */}
              {checkoutError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Order Failed</span>
                    <span>{checkoutError}</span>
                  </div>
                </div>
              )}

              {!user && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>You must <button onClick={() => setIsAuthModalOpen(true)} className="font-bold underline">sign in</button> to place an order.</span>
                </div>
              )}

              <div className="pt-4 flex justify-between">
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
                  className="py-3.5 px-8 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Reserving Inventory & Creating Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize & Place Campus Order (₹{grandTotal})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Project Hardware ({cart.length} items)
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <div className="relative w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-500">
                      Qty: {item.quantity} × ₹{item.price}
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            {cart.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">Your cart is empty.</p>
            )}

            {/* Price Summary */}
            <div className="space-y-2 text-xs text-slate-500 pt-4 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-slate-900 font-medium">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#22c55e]">
                  <span>Discount ({couponCode})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Campus Runner Dispatch</span>
                <span className={campusDeliveryFee === 0 ? "text-[#22c55e] font-semibold" : "text-slate-900"}>
                  {campusDeliveryFee === 0 ? "FREE" : `₹${campusDeliveryFee}`}
                </span>
              </div>
              {speedFee > 0 && (
                <div className="flex justify-between text-[#ff6a00]">
                  <span>Urgent Viva Priority</span>
                  <span>+₹{speedFee}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Payable</span>
                <span className="text-[#ff6a00] text-xl">₹{grandTotal}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0" />
              <span>Orders dispatched directly from campus runner hub.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
