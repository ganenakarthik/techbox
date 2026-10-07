"use client";

import React, { use } from "react";
import Link from "next/link";
import { getProductById } from "@/data/componentsCatalog";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const product = getProductById(resolvedParams.id);
  const { addToCart } = useCart();

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

  return (
    <div className="wrap py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:underline">Hardware Store</Link>
        <span>/</span>
        <span className="font-bold text-[var(--text)]">{product.sku}</span>
      </div>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-2)]">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Product Meta & Actions */}
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {product.manufacturer} • SKU: {product.sku}
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text)]">{product.name}</h1>
            <p className="mt-2 text-xs text-[var(--muted)]">{product.description}</p>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Availability Status:</span>
              <span className="font-bold text-emerald-500">✓ {product.stock} ({product.inStockCount} Pcs in Stock)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Customer Rating:</span>
              <span className="font-bold text-[var(--text)]">⭐ {product.rating} / 5.0 ({product.reviewCount} Reviews)</span>
            </div>
            {product.datasheetUrl && (
              <div className="flex items-center justify-between border-t border-[var(--line)] pt-2">
                <span className="text-[var(--muted)]">Official PDF Datasheet:</span>
                <a
                  href={product.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[var(--accent)] hover:underline"
                >
                  📄 Download PDF Datasheet
                </a>
              </div>
            )}
          </div>

          <div className="border-t border-[var(--line)] pt-4 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[var(--accent)]">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-[var(--muted)] line-through">₹{product.originalPrice}</span>
              )}
              <span className="text-xs font-bold text-emerald-500">Includes 18% GST</span>
            </div>

            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  specs: product.specs,
                  image: product.image,
                })
              }
              className="w-full rounded-xl bg-[var(--accent)] py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              + Add {product.name} to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 space-y-4">
        <h3 className="text-lg font-bold text-[var(--text)]">Technical Parameters & Specs Breakdown</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(product.techSpecs).map(([key, val]) => (
            <div key={key} className="flex justify-between rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs">
              <span className="font-bold text-[var(--text)] capitalize">{key}:</span>
              <span className="text-[var(--muted)]">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
