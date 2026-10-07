"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export const CartDrawerGlobal: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    gstAmount,
    shippingFee,
    grandTotal,
    clearCart,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"address" | "payment" | "success">("address");
  const [utrNumber, setUtrNumber] = useState("");

  if (!isCartOpen && !isCheckoutOpen) return null;

  return (
    <>
      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--surface)] border-l border-[var(--line)] p-6 flex flex-col justify-between h-full shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 mb-4">
                <h3 className="text-lg font-bold text-[var(--text)]">🛒 Shopping Cart</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-lg p-2 text-xs font-bold text-[var(--muted)] hover:bg-[var(--surface-2)]"
                >
                  ✕ Close
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-sm text-[var(--muted)]">Your shopping cart is empty</div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3"
                    >
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                        <div>
                          <div className="text-xs font-bold text-[var(--text)] line-clamp-1">{item.name}</div>
                          <div className="text-[11px] text-[var(--accent)] font-bold">₹{item.price}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-6 w-6 rounded border border-[var(--line)] bg-[var(--surface)] text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-6 w-6 rounded border border-[var(--line)] bg-[var(--surface)] text-xs font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-xs text-red-500 hover:underline"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[var(--line)] pt-4 space-y-3">
                <div className="space-y-1 text-xs text-[var(--muted)]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono text-[var(--text)]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span className="font-mono text-[var(--text)]">₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Shipping:</span>
                    <span className="font-mono text-[var(--text)]">
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[var(--text)] border-t border-[var(--line)] pt-2">
                    <span>Grand Total:</span>
                    <span className="font-mono text-[var(--accent)]">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] py-3 text-center text-xs font-bold text-[var(--text)] hover:bg-[var(--line)]"
                  >
                    View Full Cart Page
                  </Link>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="rounded-xl bg-[var(--accent)] py-3 text-xs font-bold text-white hover:opacity-90"
                  >
                    Pay & Verify UTR
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3-Step UTR Verification Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 mb-4">
              <h3 className="text-base font-bold text-[var(--text)]">💳 Indian UPI & UTR Payment Checkout</h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-xs font-bold text-[var(--muted)] hover:text-[var(--text)]"
              >
                ✕
              </button>
            </div>

            {checkoutStep === "address" && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-[var(--muted)] font-mono">Step 1 of 2: Delivery Address</h4>
                <input
                  type="text"
                  placeholder="Full Name / Engineering Org"
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text)]"
                />
                <input
                  type="text"
                  placeholder="Street Address / Lab Location"
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text)]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City (e.g. Bangalore)"
                    className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text)]"
                  />
                  <input
                    type="text"
                    placeholder="Pincode (e.g. 560001)"
                    className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text)]"
                  />
                </div>
                <button
                  onClick={() => setCheckoutStep("payment")}
                  className="w-full rounded-xl bg-[var(--accent)] py-3 text-xs font-bold text-white"
                >
                  Continue to UPI QR & UTR Entry →
                </button>
              </div>
            )}

            {checkoutStep === "payment" && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-[var(--muted)] font-mono">Step 2 of 2: Scan UPI QR & Submit 12-Digit UTR</h4>
                <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-center">
                  <div className="text-xs font-bold text-[var(--text)] mb-1">Scan & Pay ₹{grandTotal.toLocaleString()}</div>
                  <div className="text-[11px] text-[var(--muted)] mb-3">UPI ID: <span className="font-mono text-[var(--accent)]">partsly@icici</span></div>
                  <div className="inline-block border-4 border-white rounded-lg p-2 bg-white">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=partsly@icici&pn=Partsly%20Hardware&am=1000"
                      alt="UPI QR Code"
                      className="h-32 w-32"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--muted)] mb-1">
                    Enter 12-Digit UPI Transaction UTR Reference Number
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="e.g. 384910293847"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2.5 font-mono text-sm font-bold text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>

                <button
                  disabled={utrNumber.length < 10}
                  onClick={() => setCheckoutStep("success")}
                  className="w-full rounded-xl bg-[var(--accent)] py-3 text-xs font-bold text-white disabled:opacity-50"
                >
                  Verify UTR & Confirm Order (₹{grandTotal.toLocaleString()})
                </button>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="py-6 text-center space-y-3">
                <div className="text-4xl">🎉</div>
                <h4 className="text-lg font-bold text-[var(--text)]">Order Verified & Confirmed!</h4>
                <p className="text-xs text-[var(--muted)]">
                  UTR Reference <span className="font-mono font-bold text-[var(--accent)]">{utrNumber}</span> has been logged. Tracking details sent to your registered phone.
                </p>
                <button
                  onClick={() => {
                    clearCart();
                    setIsCheckoutOpen(false);
                    setCheckoutStep("address");
                  }}
                  className="rounded-xl bg-[var(--surface-2)] border border-[var(--line)] px-6 py-2.5 text-xs font-bold text-[var(--text)]"
                >
                  Back to Partsly Store
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
