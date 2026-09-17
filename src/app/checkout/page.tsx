"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { generateWhatsAppOrderUrl } from "@/lib/whatsapp";

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
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);

  // Form State
  const [contactName, setContactName] = useState(user?.name || "Arjun Sharma");
  const [contactEmail, setContactEmail] = useState(user?.email || "arjun@campus.edu");
  const [contactPhone, setContactPhone] = useState(user?.phone || "+91 98450 12345");
  const [alternatePhone, setAlternatePhone] = useState("+91 94440 67890");

  // Keep form updated when user logs in
  React.useEffect(() => {
    if (user) {
      if (user.name) setContactName(user.name);
      if (user.email) setContactEmail(user.email);
      if (user.phone) setContactPhone(user.phone);
    }
  }, [user]);

  // Freeform Campus & Delivery Details (No hardcoded forced colleges)
  const [collegeName, setCollegeName] = useState("National Institute of Technology");
  const [department, setDepartment] = useState("Electronics & Communication (ECE)");
  const [pickupPoint, setPickupPoint] = useState("Main Campus Security Desk / Gate 1");
  const [hostelBlock, setHostelBlock] = useState("Hostel Block 4, Room 312");
  const [cityState, setCityState] = useState("Bengaluru, Karnataka");

  // Delivery Speed
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "urgent">("standard");
  const [deliverySlot, setDeliverySlot] = useState("Evening Slot (4:30 PM - 7:30 PM)");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod" | "test_mode">("upi");
  const [upiId, setUpiId] = useState("student@oksbi");
  const [utrNumber, setUtrNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);
  const [placedOrderData, setPlacedOrderData] = useState<any>(null);

  const speedFee = deliverySpeed === "urgent" ? 99 : 0;
  const campusDeliveryFee = subtotal >= 499 ? 0 : 40;
  const grandTotal = Math.max(0, subtotal - discountAmount + campusDeliveryFee + speedFee);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!user) {
      addToast("Please sign in or create an account to complete campus checkout", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    if (cart.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Call transactional checkout API
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          recipientName: contactName,
          recipientPhone: contactPhone,
          collegeName,
          campusName: collegeName,
          department,
          pickupPoint,
          hostelBlock,
          deliverySlot,
          deliverySpeed,
          paymentMethod,
          couponCode,
          utrNumber: utrNumber.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const orderNum = data.orderNumber;
      setPlacedOrderNumber(orderNum);
      setPlacedOrderData({
        orderNumber: orderNum,
        orderId: data.orderId,
        total: data.total || grandTotal,
        paymentStatus: utrNumber.trim() ? "PAYMENT_SUBMITTED" : "PAYMENT_PENDING",
        utrNumber: utrNumber.trim() || null,
        recipientName: contactName,
        recipientPhone: contactPhone,
        campusDetail: `${collegeName} | ${pickupPoint} | ${hostelBlock}`,
        items: cart.map((c) => ({
          productName: c.name,
          quantity: c.quantity,
          unitPrice: c.price,
        })),
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      clearCart();
      addToast(`Order ${orderNum} created! Inventory reserved in database.`, "success");
    } catch (err: any) {
      console.error("Checkout failure:", err);
      setCheckoutError(err.message || "An error occurred during checkout");
      addToast(err.message || "Checkout failed", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Order Confirmed Celebration Screen
  if (placedOrderNumber && placedOrderData) {
    const waUrl = generateWhatsAppOrderUrl(placedOrderData);

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#ff6a00]/15 border border-[#ff6a00]/30 flex items-center justify-center mx-auto mb-6 text-[#ff6a00]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold mb-3">
          <Truck className="w-3.5 h-3.5" />
          <span>Campus Order Placed</span>
        </div>
        <h1 className="text-3xl font-black text-white">
          Order #{placedOrderNumber} Registered
        </h1>
        <p className="text-sm text-neutral-400 mt-2">
          Your project hardware components have been safely reserved in database inventory.
        </p>

        {/* Verification Alert Banner */}
        <div className="mt-6 p-6 rounded-3xl bg-[#111111] border border-[#262626] text-left text-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
            <span className="text-neutral-400">Campus Pickup Point:</span>
            <span className="text-white font-bold">{pickupPoint} ({collegeName})</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
            <span className="text-neutral-400">Scheduled Slot:</span>
            <span className="text-white font-bold">{deliverySlot}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
            <span className="text-neutral-400">Payment Status:</span>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
              placedOrderData.paymentStatus === "PAYMENT_SUBMITTED"
                ? "bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30"
                : "bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/30"
            }`}>
              {placedOrderData.paymentStatus === "PAYMENT_SUBMITTED" ? "PAYMENT SUBMITTED • PENDING VERIFICATION" : "PAYMENT PENDING"}
            </span>
          </div>
          {placedOrderData.utrNumber ? (
            <div className="flex items-center justify-between pt-1">
              <span className="text-neutral-400">Submitted UTR:</span>
              <span className="text-white font-mono font-bold">{placedOrderData.utrNumber}</span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-[#ff6a00]/10 border border-[#ff6a00]/25 text-[11px] text-neutral-300">
              Please pay via PhonePe QR and submit your 12-digit UTR on your order tracking page, or send screenshot directly on WhatsApp.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-6 rounded-xl bg-[#22c55e] hover:bg-[#25b85a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#22c55e]/25 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Order on WhatsApp</span>
          </a>
          <Link
            href={`/orders/${placedOrderNumber}`}
            className="py-3.5 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all"
          >
            <span>Track Order & Live Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Steps indicator */}
      <div className="mb-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs font-bold">
          {[
            { id: 1, name: "01 Contact" },
            { id: 2, name: "02 Campus Delivery" },
            { id: 3, name: "03 Speed & Slot" },
            { id: 4, name: "04 Payment (Test Mode)" },
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
                  : "border-transparent text-neutral-500"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Interactive Step Forms (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: CONTACT */}
          {step === 1 && (
            <div className="p-8 rounded-3xl bg-[#111111] border border-[#262626] space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">01. Student Contact Information</h2>
                <p className="text-xs text-neutral-400">
                  Our campus delivery runner will SMS/call you when approaching the pickup gate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Full Name:</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Student College Email:</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Mobile Number:</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Alternate Phone / Roommate:</label>
                  <input
                    type="tel"
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                    className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff6a00]"
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

          {/* STEP 2: CAMPUS SELECTION (OPEN / NON-RESTRICTED) */}
          {step === 2 && (
            <div className="p-8 rounded-3xl bg-[#111111] border border-[#262626] space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">02. Designated Campus Delivery Point</h2>
                <p className="text-xs text-neutral-400">
                  Enter your college, department, and designated pickup desk or hostel block.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">College / University Name:</label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. Indian Institute of Technology / RV College / SRM"
                    className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 block mb-1 font-semibold">City & State:</label>
                    <input
                      type="text"
                      value={cityState}
                      onChange={(e) => setCityState(e.target.value)}
                      placeholder="e.g. Chennai, Tamil Nadu"
                      className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 block mb-1 font-semibold">Department / Branch:</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. ECE / CSE / Mechanical Lab 2"
                      className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Campus Pickup Point / Gate:</label>
                  <input
                    type="text"
                    required
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    placeholder="e.g. Main Gate Reception / Tech Park Entrance Porch"
                    className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Hostel Block & Room / Lab Desk:</label>
                  <input
                    type="text"
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    placeholder="e.g. Hostel Block B, Room 204 or ECE Innovation Lab"
                    className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-xl bg-[#1c1c1c] text-neutral-300 hover:text-white text-xs"
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
            <div className="p-8 rounded-3xl bg-[#111111] border border-[#262626] space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">03. Select Campus Delivery Slot & Speed</h2>
                <p className="text-xs text-neutral-400">
                  Choose a run that fits around your classes, lab sessions, or upcoming viva deadlines.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-2 font-semibold">Campus Runner Slot:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["Morning Slot (10:30 AM - 1:00 PM)", "Evening Slot (4:30 PM - 7:30 PM)"].map((slot) => (
                      <div
                        key={slot}
                        onClick={() => setDeliverySlot(slot)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          deliverySlot === slot
                            ? "bg-[#ff6a00]/10 border-[#ff6a00] text-white font-bold"
                            : "bg-[#161616] border-[#262626] text-neutral-300"
                        }`}
                      >
                        <Clock className="w-4 h-4 text-[#ff6a00] mb-2" />
                        <div>{slot}</div>
                        <div className="text-[10px] text-neutral-400 font-normal mt-0.5">
                          Handover at designated pickup gate
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-2 font-semibold">Speed Tier:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setDeliverySpeed("standard")}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        deliverySpeed === "standard"
                          ? "bg-[#ff6a00]/10 border-[#ff6a00] text-white"
                          : "bg-[#161616] border-[#262626] text-neutral-400"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold">Standard Campus Dispatch</span>
                        <span className="text-[#22c55e] font-bold">FREE (₹0)</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Dispatched in 24-48 hours via regular campus runner batches.
                      </p>
                    </div>

                    <div
                      onClick={() => setDeliverySpeed("urgent")}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        deliverySpeed === "urgent"
                          ? "bg-[#ff6a00]/10 border-[#ff6a00] text-white"
                          : "bg-[#161616] border-[#262626] text-neutral-400"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[#ff6a00]">Emergency Viva Priority</span>
                        <span className="font-bold text-white">+₹99</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
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
                  className="py-2.5 px-4 rounded-xl bg-[#1c1c1c] text-neutral-300 hover:text-white text-xs"
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
            <div className="p-8 rounded-3xl bg-[#111111] border border-[#262626] space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">04. Select Payment Method</h2>
                <p className="text-xs text-neutral-400">
                  Scan the official PhonePe UPI QR code with any UPI app and submit your 12-digit UTR reference number.
                </p>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  {
                    id: "upi",
                    name: "PhonePe / UPI QR",
                    desc: "PhonePe, GPay, Paytm, BHIM with UTR verification",
                    icon: QrCode,
                    badge: "PRIMARY LAUNCH METHOD",
                  },
                  {
                    id: "cod",
                    name: "Cash on Delivery",
                    desc: "Pay campus runner at hostel gate upon delivery",
                    icon: Truck,
                  },
                  {
                    id: "card",
                    name: "Card / NetBanking",
                    desc: "Corporate lab cards & institutional billing",
                    icon: CreditCard,
                  },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;

                  return (
                    <div
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#ff6a00]/10 border-[#ff6a00] text-white"
                          : "bg-[#161616] border-[#262626] text-neutral-400 hover:border-[#333333]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-5 h-5 text-[#ff6a00]" />
                        {pm.badge && (
                          <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-[#ff6a00] text-black">
                            {pm.badge}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs text-white">{pm.name}</div>
                      <div className="text-[10px] text-neutral-400 mt-1 leading-snug">{pm.desc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Real PhonePe UPI QR Card */}
              {paymentMethod === "upi" && (
                <div className="p-6 rounded-3xl bg-[#141414] border border-[#2a2a2a] space-y-5">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative w-52 h-52 rounded-2xl overflow-hidden bg-black border border-[#333333] shadow-2xl shrink-0 p-2">
                      <Image
                        src="/images/partsly-upi-qr.jpg"
                        alt="Partsly PhonePe UPI QR Code"
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="space-y-3 text-left flex-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8b5cf6]/15 text-[#a78bfa] border border-[#8b5cf6]/30 text-xs font-bold">
                        <span>PhonePe Official Merchant QR</span>
                      </div>

                      <h3 className="text-base font-bold text-white">Scan & Pay Using Any UPI App</h3>

                      <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#262626] space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Account Holder:</span>
                          <strong className="text-white">PINNAM CHARLA CHARLA</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">UPI Phone / WhatsApp:</span>
                          <strong className="text-[#ff6a00] font-mono">+91 70326 35858</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">UPI ID (VPA):</span>
                          <span className="text-white font-mono">7032635858@ybl</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-[#262626]">
                          <span className="text-neutral-400">Exact Payable Total:</span>
                          <span className="text-sm font-black text-white">₹{grandTotal}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UTR Input Section */}
                  <div className="pt-4 border-t border-[#222222]">
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                      Enter 12-Digit Bank Reference / UTR Number:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="e.g. 423901824110 (from your UPI payment receipt)"
                        className="w-full bg-[#181818] border border-[#2e2e2e] focus:border-[#ff6a00] rounded-xl px-4 py-3 text-xs text-white font-mono tracking-wider focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">
                      Enter the 12-digit UTR from PhonePe, Google Pay, or Paytm receipt. Partsly operations team verifies the bank credit and confirms your order. If you haven't paid yet, you can also submit your UTR after placing the order.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-2.5 px-4 rounded-xl bg-[#1c1c1c] text-neutral-300 hover:text-white text-xs"
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
            <div className="p-8 rounded-3xl bg-[#111111] border border-[#262626] space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">05. Final Order Review & Campus Dispatch</h2>
                <p className="text-xs text-neutral-400">
                  Confirm recipient details, pickup location, and reserve catalog inventory.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] text-xs space-y-2.5">
                <div className="flex justify-between pb-2 border-b border-[#202020]">
                  <span className="text-neutral-400">College / Campus:</span>
                  <span className="text-white font-bold">{collegeName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#202020]">
                  <span className="text-neutral-400">Pickup Location:</span>
                  <span className="text-white font-bold">{pickupPoint}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#202020]">
                  <span className="text-neutral-400">Scheduled Run:</span>
                  <span className="text-white font-bold">{deliverySlot}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#202020]">
                  <span className="text-neutral-400">Recipient Contact:</span>
                  <span className="text-white font-bold">{contactName} ({contactPhone})</span>
                </div>
              </div>

              {checkoutError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{checkoutError}</span>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="py-2.5 px-4 rounded-xl bg-[#1c1c1c] text-neutral-300 hover:text-white text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="py-3.5 px-8 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Reserving Inventory & Creating Order...</span>
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

        {/* Right: Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626] shadow-2xl space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Project Hardware ({cart.length} items)
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <div className="relative w-12 h-12 rounded-lg bg-[#181818] border border-[#262626] overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">{item.name}</div>
                    <div className="text-[11px] text-neutral-400">
                      Qty: {item.quantity} × ₹{item.price}
                    </div>
                  </div>
                  <div className="font-bold text-white">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-neutral-400 pt-4 border-t border-[#222222]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-white font-medium">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#22c55e]">
                  <span>Discount ({couponCode})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Campus Runner Dispatch</span>
                <span className={campusDeliveryFee === 0 ? "text-[#22c55e] font-semibold" : "text-white"}>
                  {campusDeliveryFee === 0 ? "FREE" : `₹${campusDeliveryFee}`}
                </span>
              </div>
              {speedFee > 0 && (
                <div className="flex justify-between text-[#ff6a00]">
                  <span>Urgent Viva Priority</span>
                  <span>+₹{speedFee}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-[#262626]">
                <span>Total Payable</span>
                <span className="text-[#ff6a00] text-xl">₹{grandTotal}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-2 border-t border-[#1c1c1c]">
              <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0" />
              <span>Real-time inventory deduction guaranteed.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
