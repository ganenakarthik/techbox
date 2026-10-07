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
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<"review" | "address" | "payment" | "success">("review");
  const [utrNumber, setUtrNumber] = useState("");

  if (cart.length === 0 && checkoutStep !== "success") {
    return (
      <div className="py-20 text-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-4">
        <div className="text-4xl">🛒</div>
        <h2 className="text-xl font-bold text-[var(--text)]">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-[var(--muted)]">Explore our hardware catalog to add microcontrollers, ICs, or custom fabrication jobs.</p>
        <Link href="/catalog" className="inline-block rounded-xl bg-[var(--accent)] px-6 py-2.5 text-xs font-bold text-white">
          Explore Hardware Store →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-[var(--line)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Shopping Cart & Checkout</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">Review order items, tax breakdown, delivery address, and UPI UTR payment verification.</p>
      </div>

      {checkoutStep !== "success" ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Item List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Order Items ({cart.length})</h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover border border-[var(--line)] bg-[var(--surface-2)]" />
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text)]">{item.name}</h4>
                      <p className="text-xs text-[var(--muted)]">{item.specs}</p>
                      <div className="mt-1 text-sm font-bold text-[var(--accent)]">₹{item.price}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-7 w-7 rounded bg-[var(--surface)] text-xs font-bold text-[var(--text)]"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[var(--text)]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-7 w-7 rounded bg-[var(--surface)] text-xs font-bold text-[var(--text)]"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-20 text-right font-mono font-bold text-[var(--text)]">
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
          </div>

          {/* Order Summary Box */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm h-fit space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text)] border-b border-[var(--line)] pb-3">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-[var(--muted)]">
              <div className="flex justify-between">
                <span>Subtotal Items:</span>
                <span className="font-mono text-[var(--text)] font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% Invoiced):</span>
                <span className="font-mono text-[var(--text)] font-bold">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Courier Shipping:</span>
                <span className="font-mono text-[var(--text)] font-bold">
                  {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-[var(--line)] pt-3 text-sm font-bold text-[var(--text)]">
                <span>Grand Total:</span>
                <span className="font-mono text-lg text-[var(--accent)]">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {checkoutStep === "review" && (
              <button
                onClick={() => setCheckoutStep("address")}
                className="w-full rounded-xl bg-[var(--accent)] py-3 text-xs font-bold text-white hover:opacity-90"
              >
                Proceed to Delivery Address →
              </button>
            )}

            {checkoutStep === "address" && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase text-[var(--muted)]">Delivery Address</h4>
                <input
                  type="text"
                  placeholder="Recipient Name / Lab Name"
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2 text-xs text-[var(--text)]"
                />
                <input
                  type="text"
                  placeholder="Building / Street Address"
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2 text-xs text-[var(--text)]"
                />
                <button
                  onClick={() => setCheckoutStep("payment")}
                  className="w-full rounded-xl bg-[var(--accent)] py-3 text-xs font-bold text-white hover:opacity-90"
                >
                  Continue to UPI QR & UTR Entry →
                </button>
              </div>
            )}

            {checkoutStep === "payment" && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase text-[var(--muted)]">UPI QR Payment</h4>
                <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-center">
                  <div className="text-xs font-bold text-[var(--text)]">Scan & Pay ₹{grandTotal.toLocaleString()}</div>
                  <div className="text-[11px] text-[var(--muted)] mb-2">UPI ID: <span className="font-mono text-[var(--accent)]">partsly@icici</span></div>
                  <div className="inline-block border-2 border-white rounded-lg p-1 bg-white">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=upi://pay?pa=partsly@icici&pn=Partsly%20Hardware&am=1000"
                      alt="UPI QR Code"
                      className="h-28 w-28"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  maxLength={12}
                  placeholder="Enter 12-Digit UTR Ref #"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2 font-mono text-xs font-bold text-[var(--text)]"
                />

                <button
                  disabled={utrNumber.length < 10}
                  onClick={() => setCheckoutStep("success")}
                  className="w-full rounded-xl bg-[var(--accent)] py-3 text-xs font-bold text-white disabled:opacity-50"
                >
                  Verify UTR & Complete Order
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-4 max-w-xl mx-auto">
          <div className="text-5xl">🎉</div>
          <h2 className="text-xl font-bold text-[var(--text)]">Order Successfully Placed!</h2>
          <p className="text-xs text-[var(--muted)]">
            UTR Reference <span className="font-mono font-bold text-[var(--accent)]">{utrNumber}</span> recorded. Order confirmation & courier tracking link sent to your registered account.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link href="/account" className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-5 py-2.5 text-xs font-bold text-[var(--text)]">
              View Order in Account →
            </Link>
            <Link
              href="/catalog"
              onClick={() => {
                clearCart();
                setCheckoutStep("review");
              }}
              className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-xs font-bold text-white"
            >
              Continue Shopping →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
