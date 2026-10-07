"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { getProductById, calculateTierPrice } from "@/data/componentsCatalog";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const product = getProductById(resolvedParams.id);
  const { addToCart, pincode, setPincode, wishlist, toggleWishlist } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [localPincode, setLocalPincode] = useState(pincode);
  const [deliveryStatus, setDeliveryStatus] = useState("Delivered by Tomorrow via Express Air Courier");

  if (!product) {
    return (
      <div className="wrap py-20 text-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-xl font-bold text-[var(--text)]">Component Not Found</h2>
        <p className="text-xs text-[var(--muted)]">The product ID &quot;{resolvedParams.id}&quot; does not exist in our inventory catalog.</p>
        <Link href="/catalog" className="inline-block rounded-xl bg-[var(--accent)] px-6 py-2.5 text-xs font-bold text-white">
          Return to Hardware Catalog →
        </Link>
      </div>
    );
  }

  const isFav = wishlist.includes(product.id);
  const unitPrice = calculateTierPrice(product, quantity);
  const totalPrice = unitPrice * quantity;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (localPincode.length === 6) {
      setPincode(localPincode);
      setDeliveryStatus(`Express Courier Delivery confirmed to Pincode ${localPincode} (24-48 Hours)`);
    }
  };

  return (
    <div className="wrap py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:underline">Hardware Store</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="font-bold text-[var(--text)]">{product.sku}</span>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm">
        {/* Product Image Viewer */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] relative">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 h-10 w-10 rounded-full border border-[var(--line)] bg-[var(--surface)] text-sm flex items-center justify-center transition-all ${
                isFav ? "text-red-500 font-bold bg-red-500/10 border-red-500/30" : "text-[var(--muted)] hover:text-red-500"
              }`}
            >
              {isFav ? "♥" : "♡"}
            </button>
          </div>
        </div>

        {/* Product Meta & Pricing Panel */}
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {product.manufacturer} • MPN: {product.sku}
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--text)]">{product.name}</h1>
            <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">{product.description}</p>
          </div>

          {/* Volume Tier Discount Table */}
          {product.volumeTiers && (
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase text-[var(--muted)]">Bulk Tier Pricing Table</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {product.volumeTiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border p-2 transition-all ${
                      quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty)
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 font-bold text-[var(--accent)] shadow"
                        : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)]"
                    }`}
                  >
                    <div className="text-[10px] text-[var(--muted)]">
                      {tier.maxQty ? `${tier.minQty}-${tier.maxQty} Pcs` : `${tier.minQty}+ Pcs`}
                    </div>
                    <div className="text-sm font-extrabold font-mono mt-0.5">₹{tier.pricePerUnit}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Pincode Estimator */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[var(--text)]">📍 Pincode Delivery Checker</span>
              <span className="text-emerald-500 font-bold">✓ In Stock ({product.inStockCount} Pcs)</span>
            </div>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={localPincode}
                onChange={(e) => setLocalPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit Pincode"
                className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] font-mono font-bold focus:border-[var(--accent)] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-[var(--surface)] border border-[var(--line)] px-4 py-2 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)]"
              >
                Check
              </button>
            </form>
            <p className="text-[11px] text-[var(--muted)]">{deliveryStatus}</p>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="border-t border-[var(--line)] pt-4 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[var(--accent)] font-mono">₹{unitPrice}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-[var(--muted)] line-through">₹{product.originalPrice}</span>
                  )}
                  <span className="text-xs font-bold text-emerald-500">Includes 18% GST</span>
                </div>
                <div className="text-xs text-[var(--muted)] font-mono">
                  Total for {quantity} Pcs: <strong className="text-[var(--text)]">₹{totalPrice.toLocaleString()}</strong>
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-1.5">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 rounded-lg bg-[var(--surface)] text-xs font-bold text-[var(--text)]"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold font-mono text-[var(--text)]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-8 w-8 rounded-lg bg-[var(--surface)] text-xs font-bold text-[var(--text)]"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: unitPrice,
                  specs: product.specs,
                  image: product.image,
                  quantity,
                })
              }
              className="w-full rounded-2xl bg-[var(--accent)] py-4 text-sm font-extrabold text-white shadow-lg transition-transform hover:opacity-90 active:scale-98"
            >
              + Add {quantity} Pcs of {product.name} to Cart (₹{totalPrice.toLocaleString()})
            </button>
          </div>
        </div>
      </div>

      {/* Datasheet & Tech Specs Table */}
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div>
            <h3 className="text-lg font-black text-[var(--text)]">Technical Parameters & Specifications</h3>
            <p className="text-xs text-[var(--muted)]">Certified factory datasheet parameters for engineering design integration.</p>
          </div>

          {product.datasheetUrl && (
            <a
              href={product.datasheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 px-4 py-2 text-xs font-bold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-sm"
            >
              📄 Download Official PDF Datasheet →
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(product.techSpecs).map(([key, val]) => (
            <div key={key} className="flex justify-between rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3.5 text-xs">
              <span className="font-bold text-[var(--text)] capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
              <span className="text-[var(--muted)] font-mono">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
