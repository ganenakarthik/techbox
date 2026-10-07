"use client";

import React from "react";
import { Print3DCalculator } from "@/components/Print3DCalculator";
import { useCart } from "@/context/CartContext";

export default function Print3DPage() {
  const { addToCart } = useCart();

  return (
    <div className="space-y-8">
      <div className="border-b border-[var(--line)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">On-Demand 3D Printing & Additive Fabrication</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Upload .STL or .STEP files for instant geometry volume slicing, material cost estimation, and rapid manufacturing.
        </p>
      </div>

      <Print3DCalculator onAddToCart={addToCart} />

      {/* Materials Guide */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-xs">
          <div className="font-bold text-[var(--accent)] mb-1">PLA Tough</div>
          <div className="text-[var(--muted)]">Standard prototyping, functional enclosures, rapid fit checks.</div>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-xs">
          <div className="font-bold text-[var(--accent)] mb-1">PETG Pro</div>
          <div className="text-[var(--muted)]">High mechanical strength, outdoor UV & chemical resistance.</div>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-xs">
          <div className="font-bold text-[var(--accent)] mb-1">ABS Heat Resistant</div>
          <div className="text-[var(--muted)]">Thermal durability up to 100°C for automotive & motor mounts.</div>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-xs">
          <div className="font-bold text-[var(--accent)] mb-1">SLA Precision Resin</div>
          <div className="text-[var(--muted)]">Ultra-high detail 50 micron layer height for optical components.</div>
        </div>
      </div>
    </div>
  );
}
