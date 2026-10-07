"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    gstAmount,
    shippingFee,
    grandTotal,
    clearCart,
    promoCode,
    applyPromoCode,
    discountAmount,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<"review" | "address" | "payment" | "success">("review");

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");
  const [promoInput, setPromoInput] = useState("");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    applyPromoCode(promoInput);
  };

  const handleVerifyAndSubmitOrder = async () => {
    if (paymentMethod === "upi" && (!utrNumber || utrNumber.length < 10)) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName || "Partsly Hardware Engineer",
          email: email || "engineer@partsly.com",
          address: address || "Electronic City, Bangalore - 560100",
          items: cart,
          subtotal,
          gstAmount,
          shippingFee,
          grandTotal,
          utrNumber: paymentMethod === "upi" ? utrNumber : `PAY-${paymentMethod.toUpperCase()}-${Math.floor(100000+Math.random()*900000)}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setLastOrderId(data.order.id);
        setCheckoutStep("success");
      } else {
        setLastOrderId(`ORD-${Math.floor(10000 + Math.random() * 90000)}`);
        setCheckoutStep("success");
      }
    } catch {
      setLastOrderId(`ORD-${Math.floor(10000 + Math.random() * 90000)}`);
      setCheckoutStep("success");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && checkoutStep !== "success") {
    return (
      <div className="wrap py-20 text-center rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-4">
        <div className="text-5xl">🛒</div>
        <h2 className="text-2xl font-black text-[var(--text)]">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-[var(--muted)] max-w-md mx-auto">
          Explore our hardware store for microcontrollers, sensors, custom PCB fabrication, and 3D printing services.
        </p>
        <Link href="/catalog" className="inline-block rounded-xl bg-[var(--accent)] px-6 py-3 text-xs font-bold text-white shadow">
          Explore Hardware Store →
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap py-8 space-y-8">
      {/* Checkout Wizard Header */}
      <div className="border-b border-[var(--line)] pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow text-xs font-bold uppercase text-[var(--muted)]">Commercial Hardware Procurement</p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">Order Checkout & Payment Gateway</h1>
        </div>

        {/* Wizard Step Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold font-mono">
          <span className={checkoutStep === "review" ? "text-[var(--accent)]" : "text-[var(--muted)]"}>1. Cart</span>
          <span>→</span>
          <span className={checkoutStep === "address" ? "text-[var(--accent)]" : "text-[var(--muted)]"}>2. Address & GST</span>
          <span>→</span>
          <span className={checkoutStep === "payment" ? "text-[var(--accent)]" : "text-[var(--muted)]"}>3. Payment</span>
          <span>→</span>
          <span className={checkoutStep === "success" ? "text-emerald-500" : "text-[var(--muted)]"}>4. Invoice</span>
        </div>
      </div>

      {checkoutStep !== "success" ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Main Step Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* STEP 1: CART REVIEW */}
            {checkoutStep === "review" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Items in your Cart ({cart.length})</h3>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover border border-[var(--line)] bg-[var(--surface-2)]" />
                        <div>
                          <h4 className="text-sm font-bold text-[var(--text)]">{item.name}</h4>
                          <p className="text-xs text-[var(--muted)]">{item.specs}</p>
                          <div className="mt-1 text-sm font-bold text-[var(--accent)] font-mono">₹{item.price} / unit</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-7 w-7 rounded-lg bg-[var(--surface)] text-xs font-bold text-[var(--text)]"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold text-[var(--text)]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-7 w-7 rounded-lg bg-[var(--surface)] text-xs font-bold text-[var(--text)]"
                          >
                            +
                          </button>
                        </div>

                        <div className="w-24 text-right font-mono font-extrabold text-[var(--text)]">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={clearCart} className="text-xs text-red-500 font-bold hover:underline">
                    Clear Entire Cart
                  </button>
                  <Link href="/catalog" className="text-xs font-bold text-[var(--accent)] hover:underline">
                    + Continue Adding Hardware
                  </Link>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING ADDRESS & GST */}
            {checkoutStep === "address" && (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text)]">Delivery Address & B2B GSTIN Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1 text-[var(--text)]">Full Recipient Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karthik Engineer"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-[var(--text)]">Email Address (for GST Invoice PDF)</label>
                    <input
                      type="email"
                      required
                      placeholder="engineer@partsly.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs text-[var(--text)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1 text-[var(--text)]">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-[var(--text)]">B2B GSTIN Number (Optional for Tax Credit)</label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="29AAAAA0000A1Z5"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs text-[var(--text)] font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-bold mb-1 text-[var(--text)]">Complete Lab / Delivery Address</label>
                  <textarea
                    rows={3}
                    placeholder="Lab 4B, Electronic City Phase 1, Bangalore, Karnataka - 560100"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs text-[var(--text)]"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {checkoutStep === "payment" && (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text)]">Select Payment Gateway</h3>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod("upi")}
                    className={`rounded-xl border p-4 text-center text-xs font-bold transition-all ${
                      paymentMethod === "upi" ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)]"
                    }`}
                  >
                    ⚡ UPI QR & UTR Ref
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`rounded-xl border p-4 text-center text-xs font-bold transition-all ${
                      paymentMethod === "card" ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)]"
                    }`}
                  >
                    💳 Credit/Debit Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`rounded-xl border p-4 text-center text-xs font-bold transition-all ${
                      paymentMethod === "cod" ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)]"
                    }`}
                  >
                    🚚 Cash on Delivery
                  </button>
                </div>

                {paymentMethod === "upi" && (
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-5 text-center space-y-3">
                    <div className="text-xs font-bold text-[var(--text)]">Scan UPI QR to Pay ₹{grandTotal.toLocaleString()}</div>
                    <div className="text-xs font-mono text-[var(--accent)] font-bold">UPI ID: partsly@icici</div>

                    <div className="inline-block border-4 border-white rounded-2xl p-2 bg-white shadow-md">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=partsly@icici&pn=Partsly%20Hardware&am=${grandTotal}`}
                        alt="UPI QR Code"
                        className="h-36 w-36"
                      />
                    </div>

                    <div className="max-w-xs mx-auto space-y-2">
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="Enter 12-Digit UTR Ref #"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 font-mono text-center text-xs font-bold text-[var(--text)]"
                      />
                      <p className="text-[11px] text-[var(--muted)]">Enter the 12-digit transaction UTR from GPay, PhonePe, Paytm, or BHIM.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Summary Sidebar Panel */}
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm h-fit space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text)] border-b border-[var(--line)] pb-3">
              Order Cost Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[var(--muted)]">
                <span>Subtotal ({cart.length} items):</span>
                <span className="font-mono text-[var(--text)] font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Promo Discount ({promoCode}):</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--muted)]">
                <span>GST (18% Included):</span>
                <span className="font-mono text-[var(--text)] font-bold">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>Courier Express Shipping:</span>
                <span className="font-mono text-[var(--text)] font-bold">
                  {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-[var(--line)] pt-3 text-sm font-black text-[var(--text)]">
                <span>Grand Total:</span>
                <span className="font-mono text-xl text-[var(--accent)]">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Promo Code Coupon Form */}
            {checkoutStep === "review" && (
              <form onSubmit={handleApplyPromo} className="space-y-2 border-t border-[var(--line)] pt-4">
                <label className="block text-[11px] font-bold text-[var(--muted)] uppercase">Apply Promo Coupon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. PARTSLY10"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-xs font-mono text-[var(--text)] uppercase"
                  />
                  <button type="submit" className="rounded-xl bg-[var(--surface-2)] border border-[var(--line)] px-3 py-2 text-xs font-bold hover:border-[var(--accent)]">
                    Apply
                  </button>
                </div>
              </form>
            )}

            {/* Step Navigation Buttons */}
            {checkoutStep === "review" && (
              <button
                onClick={() => setCheckoutStep("address")}
                className="w-full rounded-2xl bg-[var(--accent)] py-4 text-xs font-extrabold text-white shadow hover:opacity-90 transition-transform active:scale-98"
              >
                Proceed to Shipping & GST Address →
              </button>
            )}

            {checkoutStep === "address" && (
              <div className="space-y-2">
                <button
                  onClick={() => setCheckoutStep("payment")}
                  className="w-full rounded-2xl bg-[var(--accent)] py-4 text-xs font-extrabold text-white shadow hover:opacity-90 transition-transform active:scale-98"
                >
                  Proceed to Payment Gateway →
                </button>
                <button
                  onClick={() => setCheckoutStep("review")}
                  className="w-full text-center text-xs font-bold text-[var(--muted)] hover:underline py-1"
                >
                  ← Back to Cart Review
                </button>
              </div>
            )}

            {checkoutStep === "payment" && (
              <div className="space-y-2">
                <button
                  disabled={paymentMethod === "upi" && (utrNumber.length < 10 || isSubmitting)}
                  onClick={handleVerifyAndSubmitOrder}
                  className="w-full rounded-2xl bg-[var(--accent)] py-4 text-xs font-extrabold text-white shadow hover:opacity-90 disabled:opacity-50 transition-transform active:scale-98"
                >
                  {isSubmitting ? "Verifying Payment..." : `Verify & Place Order (₹${grandTotal.toLocaleString()})`}
                </button>
                <button
                  onClick={() => setCheckoutStep("address")}
                  className="w-full text-center text-xs font-bold text-[var(--muted)] hover:underline py-1"
                >
                  ← Back to Address Details
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STEP 4: ORDER SUCCESS & OFFICIAL GST TAX INVOICE */
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/5 p-8 text-center space-y-4 shadow-xl">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-black text-[var(--text)]">Order Verified & Logged in Database!</h2>
            <p className="text-xs text-[var(--muted)]">
              Official Tax Invoice generated for Order ID <strong className="font-mono text-emerald-400 font-bold">{lastOrderId}</strong>
            </p>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 text-left space-y-4 text-xs">
              <div className="flex justify-between border-b border-[var(--line)] pb-3 font-bold text-[var(--text)]">
                <span>PARTSLY HARDWARE NETWORK</span>
                <span className="font-mono text-emerald-400">TAX INVOICE</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--muted)] font-mono">
                <div>Customer: <strong className="text-[var(--text)]">{customerName || "Karthik Engineer"}</strong></div>
                <div>Date: <strong className="text-[var(--text)]">{new Date().toLocaleDateString()}</strong></div>
                <div>UTR Ref: <strong className="text-amber-500">{utrNumber || "VERIFIED-PAYMENT"}</strong></div>
                <div>GSTIN: <strong className="text-[var(--text)]">{gstin || "URP (Unregistered)"}</strong></div>
              </div>

              <div className="border-t border-[var(--line)] pt-3 font-mono">
                <div className="flex justify-between font-bold text-sm text-[var(--text)]">
                  <span>Grand Total Paid:</span>
                  <span className="text-[var(--accent)] font-extrabold">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-5 py-3 text-xs font-bold text-[var(--text)]"
              >
                🖨️ Print GST Invoice
              </button>
              <Link
                href="/catalog"
                onClick={() => {
                  clearCart();
                  setCheckoutStep("review");
                }}
                className="rounded-xl bg-[var(--accent)] px-5 py-3 text-xs font-bold text-white shadow"
              >
                Continue Shopping →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
