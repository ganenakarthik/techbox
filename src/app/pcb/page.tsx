"use client";

import React from "react";
import { PCBQuoteCalculator } from "@/components/PCBQuoteCalculator";
import { useCart } from "@/context/CartContext";

export default function PCBPage() {
  const { addToCart } = useCart();

  return (
    <div className="wrap py-8 space-y-8">
      <div className="border-b border-[var(--line)] pb-4">
        <p className="eyebrow text-xs font-bold uppercase text-[var(--muted)]">Industrial Circuit Fabrication</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">Industrial PCB Fabrication Engine</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          High-precision 1, 2, 4, and 6-layer FR-4 custom printed circuit board prototyping with flying-probe electrical testing.
        </p>
      </div>

      <PCBQuoteCalculator onAddToCart={addToCart} />
    </div>
  );
}
