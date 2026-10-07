"use client";

import React, { useState } from "react";
import { ComponentItem } from "@/data/componentsCatalog";
import { X, CheckCircle2 } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { [key: string]: number };
  catalog: ComponentItem[];
}

export function CheckoutModal({ isOpen, onClose, cartItems, catalog }: CheckoutModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<"shipping" | "payment" | "review" | "confirmed">("shipping");

  // Form Fields
  const [fullName, setFullName] = useState("Karthik Ganena");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("Flat 302, Green Valley Apartments");
  const [city, setCity] = useState("Hyderabad");
  const [state, setState] = useState("Telangana");
  const [pincode, setPincode] = useState("500081");
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "express" | "sameday">("standard");
  const [utrNumber, setUtrNumber] = useState("");

  const cartEntries = Object.entries(cartItems).filter(([_, qty]) => qty > 0);
  const subtotal = cartEntries.reduce((sum, [id, qty]) => {
    const p = catalog.find((c) => c.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const deliveryFee = deliverySpeed === "standard" ? 60 : deliverySpeed === "express" ? 120 : 220;
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

      const msg = `Hi Partsly Team! I placed an order.\n\n*Name*: ${fullName}\n*Phone*: ${phone}\n*Address*: ${address}, ${city}, ${state} - ${pincode}\n*Delivery*: ${deliverySpeed.toUpperCase()}\n*Payment*: UPI/UTR (${utrNumber || "Verified"})\n*Total Amount*: ₹${totalAmount}\n*Items*: ${itemsList}`;

      window.open(`https://wa.me/917032635858?text=${encodeURIComponent(msg)}`, "_blank");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-xl font-black text-slate-950">Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="flex items-center gap-6 border-b border-slate-200 pb-3 text-xs font-bold font-mono">
          <span className={step === "shipping" ? "text-[#ff6a00] font-black border-b-2 border-[#ff6a00] pb-2" : "text-slate-400"}>
            ● 1 Shipping
          </span>
          <span>—</span>
          <span className={step === "payment" ? "text-[#ff6a00] font-black border-b-2 border-[#ff6a00] pb-2" : "text-slate-400"}>
            2 Payment
          </span>
          <span>—</span>
          <span className={step === "review" ? "text-[#ff6a00] font-black border-b-2 border-[#ff6a00] pb-2" : "text-slate-400"}>
            3 Review
          </span>
        </div>

        {step !== "confirmed" ? (
          <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <h3 className="font-black text-sm text-slate-900">Shipping Address</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method Options */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-xs text-slate-900">Delivery Method</h4>
                <div className="space-y-2 text-xs">
                  <label
                    onClick={() => setDeliverySpeed("standard")}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      deliverySpeed === "standard" ? "bg-orange-50/80 border-[#ff6a00]" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">Standard Delivery</div>
                      <div className="text-[11px] text-slate-500">1-3 days</div>
                    </div>
                    <span className="font-bold text-slate-900">₹60</span>
                  </label>

                  <label
                    onClick={() => setDeliverySpeed("express")}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      deliverySpeed === "express" ? "bg-orange-50/80 border-[#ff6a00]" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">Express Delivery</div>
                      <div className="text-[11px] text-slate-500">1-2 days</div>
                    </div>
                    <span className="font-bold text-slate-900">₹120</span>
                  </label>

                  <label
                    onClick={() => setDeliverySpeed("sameday")}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      deliverySpeed === "sameday" ? "bg-orange-50/80 border-[#ff6a00]" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">Same Day Delivery</div>
                      <div className="text-[11px] text-slate-500">1-2 days</div>
                    </div>
                    <span className="font-bold text-slate-900">₹220</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Order Summary Panel */}
            <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs font-sans">
              <h4 className="font-black text-sm text-slate-950 border-b border-slate-200 pb-2">Order Summary</h4>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {cartEntries.map(([id, qty]) => {
                  const item = catalog.find((c) => c.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex items-center justify-between gap-2">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded bg-white border border-slate-200 p-1" />
                      <div className="flex-1 truncate">
                        <div className="font-bold text-slate-900 truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-400">Qty: {qty}</div>
                      </div>
                      <span className="font-bold text-slate-900">₹{item.price * qty}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-bold text-slate-900">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-[#ff6a00]">₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-950">Order Confirmed!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Redirecting to Partsly WhatsApp Helpdesk for instant dispatch...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
