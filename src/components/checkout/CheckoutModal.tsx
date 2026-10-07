"use client";

import React, { useState } from "react";
import { ComponentItem } from "@/data/componentsCatalog";
import { X, CheckCircle2, MapPin, CreditCard, Truck, ShieldCheck, ArrowRight, MessageSquare } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { [key: string]: number };
  catalog: ComponentItem[];
}

export function CheckoutModal({ isOpen, onClose, cartItems, catalog }: CheckoutModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<"shipping" | "delivery" | "payment" | "confirmed">("shipping");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("express");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [utrNumber, setUtrNumber] = useState("");

  const cartEntries = Object.entries(cartItems).filter(([_, qty]) => qty > 0);
  const totalCount = cartEntries.reduce((sum, [_, qty]) => sum + qty, 0);

  const subtotal = cartEntries.reduce((sum, [id, qty]) => {
    const p = catalog.find((c) => c.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const deliveryFee = deliveryMethod === "express" ? 0 : 40;
  const totalAmount = subtotal + deliveryFee;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirmed");

    setTimeout(() => {
      const itemsList = cartEntries
        .map(([id, qty]) => {
          const item = catalog.find((c) => c.id === id);
          return `${item?.name || id} (x${qty})`;
        })
        .join(", ");

      const messageText = `Hi Partsly Team! I placed an order.\n\n*Name*: ${fullName}\n*Phone*: ${phone}\n*Address*: ${address}\n*Delivery*: ${deliveryMethod === "express" ? "Express Campus Gate (10-30 Mins)" : "Standard Delivery"}\n*Payment*: ${paymentMethod.toUpperCase()} (UTR: ${utrNumber || "N/A"})\n*Total Amount*: ₹${totalAmount}\n*Items*: ${itemsList}`;

      const whatsappUrl = `https://wa.me/917032635858?text=${encodeURIComponent(messageText)}`;
      window.open(whatsappUrl, "_blank");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative border border-zinc-200/90 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4">
          <div>
            <h2 className="text-xl font-black text-zinc-950">Partsly Checkout</h2>
            <p className="text-xs text-zinc-500 font-mono">Step {step === "shipping" ? "1" : step === "delivery" ? "2" : step === "payment" ? "3" : "4"} of 4</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold">
          <div className={`p-2.5 rounded-xl border text-center ${step === "shipping" ? "bg-orange-50 text-[#ff6a00] border-[#ff6a00]" : "bg-zinc-50 text-zinc-400 border-zinc-200"}`}>
            1. Shipping
          </div>
          <div className={`p-2.5 rounded-xl border text-center ${step === "delivery" ? "bg-orange-50 text-[#ff6a00] border-[#ff6a00]" : "bg-zinc-50 text-zinc-400 border-zinc-200"}`}>
            2. Delivery
          </div>
          <div className={`p-2.5 rounded-xl border text-center ${step === "payment" ? "bg-orange-50 text-[#ff6a00] border-[#ff6a00]" : "bg-zinc-50 text-zinc-400 border-zinc-200"}`}>
            3. Payment
          </div>
        </div>

        {step !== "confirmed" ? (
          <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-4">
              {/* Step 1: Shipping Details */}
              {step === "shipping" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2 font-mono">
                    <MapPin className="w-4 h-4 text-[#ff6a00]" /> Shipping Address & Contact
                  </h3>

                  <div className="space-y-1 text-xs font-mono">
                    <label className="font-bold text-zinc-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Karthik Ganena..."
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div className="space-y-1 text-xs font-mono">
                    <label className="font-bold text-zinc-700">WhatsApp Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div className="space-y-1 text-xs font-mono">
                    <label className="font-bold text-zinc-700">Campus Gate / Lab Delivery Address *</label>
                    <textarea
                      rows={2}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Lab Room 302, Green Valley Apartments Gate 1..."
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (fullName && phone && address) setStep("delivery");
                    }}
                    className="w-full py-3 bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Continue to Delivery Method →
                  </button>
                </div>
              )}

              {/* Step 2: Delivery Method */}
              {step === "delivery" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2 font-mono">
                    <Truck className="w-4 h-4 text-[#ff6a00]" /> Select Delivery Speed
                  </h3>

                  <div className="space-y-2">
                    <label
                      onClick={() => setDeliveryMethod("express")}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        deliveryMethod === "express" ? "bg-orange-50 border-[#ff6a00]" : "bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-zinc-900">Express Campus Gate Dispatch (10-30 Mins)</div>
                        <div className="text-[11px] text-zinc-500 font-mono">Direct runner handoff at gate or lab</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700">FREE</span>
                    </label>

                    <label
                      onClick={() => setDeliveryMethod("standard")}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        deliveryMethod === "standard" ? "bg-orange-50 border-[#ff6a00]" : "bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-zinc-900">Standard Domestic Courier (1-3 Days)</div>
                        <div className="text-[11px] text-zinc-500 font-mono">Shipped via BlueDart / Delhivery</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-900">₹40</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep("shipping")}
                      className="py-3 px-4 bg-zinc-100 text-zinc-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("payment")}
                      className="flex-1 py-3 bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method & UTR Verification */}
              {step === "payment" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2 font-mono">
                    <CreditCard className="w-4 h-4 text-[#ff6a00]" /> Payment & UTR Verification
                  </h3>

                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                    <div className="text-xs font-mono font-bold text-zinc-900">Scan UPI / PhonePe / GPay:</div>
                    <div className="p-3 bg-white rounded-xl border border-zinc-200 font-mono text-xs text-center font-bold text-[#ff6a00]">
                      UPI ID: partsly@upi / 7032635858
                    </div>

                    <div className="space-y-1 text-xs font-mono">
                      <label className="font-bold text-zinc-700">Enter Payment UTR / Ref Number (Optional)</label>
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="12-digit UTR number (e.g. 427189012345)..."
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep("delivery")}
                      className="py-3 px-4 bg-zinc-100 text-zinc-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Dispatch on WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sticky Sidebar */}
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-3 font-mono text-xs">
              <div className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">Order Summary ({totalCount} items)</div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {cartEntries.map(([id, qty]) => {
                  const item = catalog.find((c) => c.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex items-center justify-between text-zinc-700">
                      <span className="truncate max-w-[140px]">{item.name}</span>
                      <span className="font-bold text-zinc-900">₹{item.price * qty}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-zinc-200 space-y-1">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Delivery:</span>
                  <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-zinc-950 font-black text-sm pt-2 border-t border-zinc-200">
                  <span>Total:</span>
                  <span className="text-[#ff6a00]">₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-zinc-950">Order Dispatch Initiated!</h3>
            <p className="text-xs text-zinc-600 max-w-md mx-auto">
              Redirecting to WhatsApp to send your order summary and UTR verification directly to Partsly campus runners...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
