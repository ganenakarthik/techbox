"use client";

import React from "react";
import { Print3DCalculator } from "@/components/Print3DCalculator";
import { useCart } from "@/context/CartContext";

export default function Print3DPage() {
  const { addToCart } = useCart();

  return (
    <div className="wrap py-8 space-y-8">
      <div className="border-b border-[var(--line)] pb-4">
        <p className="eyebrow text-xs font-bold uppercase text-[var(--muted)]">Additive Manufacturing</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">3D Printing On-Demand Slicing Desk</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Upload .STL or .STEP files for instant geometry volume slicing, material cost estimation, and rapid manufacturing.
        </p>
      </div>

      <Print3DCalculator onAddToCart={addToCart} />
    </div>
  );
}
