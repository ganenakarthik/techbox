"use client";

import React from "react";
import { PCBQuoteCalculator } from "@/components/PCBQuoteCalculator";
import { useCart } from "@/context/CartContext";

export default function PCBPage() {
  const { addToCart } = useCart();

  return (
    <div className="space-y-8">
      <div className="border-b border-[var(--line)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Industrial PCB Fabrication Desk</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          High-precision 1, 2, 4, and 6-layer FR-4 custom printed circuit board prototyping with flying-probe electrical testing.
        </p>
      </div>

      <PCBQuoteCalculator onAddToCart={addToCart} />

      {/* PCB Capabilities Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-xs">
          <div className="font-bold text-[var(--text)] mb-1">⚡ 48-Hour Rapid Lead Time</div>
          <div className="text-[var(--muted)]">Automated GERBER processing and express air courier dispatch.</div>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-xs">
          <div className="font-bold text-[var(--text)] mb-1">🛡️ IPC-A-600 Class 2 Standard</div>
          <div className="text-[var(--muted)]">100% E-test electrical flying probe verification on every panel.</div>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-xs">
          <div className="font-bold text-[var(--text)] mb-1">🎨 Custom Silkscreen & Colors</div>
          <div className="text-[var(--muted)]">Green, Black, Blue, Red, White & ENIG Gold Plating finishes available.</div>
        </div>
      </div>
    </div>
  );
}
