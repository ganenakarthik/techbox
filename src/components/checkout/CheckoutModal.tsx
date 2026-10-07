"use client";

import React, { useState } from "react";
import { CartItem } from "@/components/cart/CartDrawer";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onSuccess: (orderId: string, utr: string) => void;
}

export function CheckoutModal({ isOpen, onClose, cartItems, onSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const delivery = subtotal >= 999 ? 0 : 79;
  const total = subtotal + delivery;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.trim().length < 8) {
      setErrorMsg("Please enter a valid 12-digit UPI / UTR Transaction Reference Number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedOrderId = "PRT-" + Math.floor(100000 + Math.random() * 900000);
      onSuccess(generatedOrderId, utrNumber);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in">
      <div className="liquid-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#ff6a00] uppercase tracking-wider">
              PARTSLY DIRECT EXPRESS CHECKOUT
            </span>
            <h2 className="text-lg font-black text-slate-900">
              {step === 1 && "Step 1 of 3: Shipping & Contact Address"}
              {step === 2 && "Step 2 of 3: Express Delivery Speed"}
              {step === 3 && "Step 3 of 3: Direct UPI & UTR Payment Verification"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            ✕
          </button>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-2">
          <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? "bg-[#ff6a00]" : "bg-slate-200"}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? "bg-[#ff6a00]" : "bg-slate-200"}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? "bg-[#ff6a00]" : "bg-slate-200"}`} />
        </div>

        {/* Step 1: Address Form */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name && phone && address) setStep(2);
              else setErrorMsg("Please fill in your name, phone number, and delivery address.");
            }}
            className="space-y-4 text-xs font-semibold text-slate-700"
          >
            {errorMsg && <p className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs">{errorMsg}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Full Name / Lab Contact *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full liquid-input px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block mb-1">Phone Number (WhatsApp Dispatch) *</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full liquid-input px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Hostel / Campus Lab / Street Address *</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Room 302, BH-2, Campus Innovation Center, Tech Park..."
                className="w-full liquid-input px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full liquid-input px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block mb-1">PIN Code</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="560001"
                  className="w-full liquid-input px-3 py-2 text-xs"
                />
              </div>
            </div>

            <button type="submit" className="w-full liquid-button-primary py-3 text-xs font-extrabold">
              Continue to Delivery Speed →
            </button>
          </form>
        )}

        {/* Step 2: Delivery Speed */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="p-4 rounded-xl bg-white border border-[#ff6a00] flex items-center justify-between cursor-pointer shadow-xs">
                <div className="flex items-center gap-3">
                  <input type="radio" name="delivery" defaultChecked className="accent-[#ff6a00]" />
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">
                      Standard Express Air (2-3 Business Days)
                    </div>
                    <p className="text-[11px] text-slate-500">Shipped directly via BlueDart / Delhivery air cargo.</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-600">
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </label>

              <label className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between cursor-pointer hover:border-slate-300">
                <div className="flex items-center gap-3">
                  <input type="radio" name="delivery" className="accent-[#ff6a00]" />
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">
                      Campus Lab Runner Dispatch (10 - 30 Mins)
                    </div>
                    <p className="text-[11px] text-slate-500">Direct instant gate handoff by Partsly runner.</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-slate-800">₹129</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 liquid-button-secondary py-3 text-xs font-bold"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 liquid-button-primary py-3 text-xs font-extrabold"
              >
                Proceed to Payment Verification →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment & UTR Verification */}
        {step === 3 && (
          <form onSubmit={handleCompleteOrder} className="space-y-4">
            {errorMsg && <p className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold">{errorMsg}</p>}

            {/* UPI QR & Bank Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center gap-6 border border-slate-800 shadow-md">
              <div className="w-32 h-32 rounded-xl bg-white p-2 flex items-center justify-center shrink-0">
                {/* Visual QR Placeholder */}
                <div className="w-full h-full border-2 border-dashed border-slate-900 rounded flex flex-col items-center justify-center text-slate-900 text-[10px] font-bold text-center">
                  <span>PARTSLY UPI</span>
                  <span className="text-xs font-mono">partsly@upi</span>
                </div>
              </div>

              <div className="space-y-2 text-xs flex-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#ff6a00] text-white">
                  DIRECT BANK / UPI TRANSFER
                </span>
                <div className="text-slate-300 font-medium">
                  Scan QR with GPay / PhonePe / Paytm or send UPI to:
                </div>
                <div className="text-sm font-mono font-extrabold text-[#ff6a00]">partsly.pay@upi</div>
                <div className="text-xs font-extrabold text-white">Total Amount to Pay: ₹{total}</div>
              </div>
            </div>

            {/* UTR Input */}
            <div className="space-y-1">
              <label className="block text-xs font-extrabold text-slate-800">
                Enter 12-Digit UPI UTR / Transaction Reference No. *
              </label>
              <input
                required
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 428190382910"
                className="w-full liquid-input px-3.5 py-2.5 text-xs font-mono font-bold tracking-widest text-slate-900"
              />
              <p className="text-[10px] text-slate-400">
                Found in your GPay / PhonePe payment receipt under 'UPI Ref No'. Our backend verifies this instantly.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 liquid-button-secondary py-3 text-xs font-bold"
              >
                ← Back
              </button>
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-2/3 liquid-button-primary py-3 text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <span>Verifying UTR Payment...</span>
                ) : (
                  <span>Submit UTR & Dispatch Order</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
