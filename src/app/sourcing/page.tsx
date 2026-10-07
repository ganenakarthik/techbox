"use client";

import React from "react";
import { BOMSourcingTool } from "@/components/BOMSourcingTool";

export default function SourcingPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-[var(--line)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">BOM Sourcing & Enterprise Procurement Desk</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Submit Bill of Materials (BOM) files for factory-direct component sourcing, volume discount tiers, and dedicated RFQs.
        </p>
      </div>

      <BOMSourcingTool />

      {/* Sourcing Benefits */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-xs">
          <div className="font-bold text-[var(--text)] mb-1">🏬 100% Traceable Authorized Distributors</div>
          <div className="text-[var(--muted)]">Factory-direct supply chain sourcing from TI, ST, Espressif, Microchip & NXP.</div>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-xs">
          <div className="font-bold text-[var(--text)] mb-1">⚡ 2-Hour RFQ Turnaround</div>
          <div className="text-[var(--muted)]">Our procurement team verifies reel quantities and provides binding pricing quotes.</div>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-xs">
          <div className="font-bold text-[var(--text)] mb-1">📜 Custom GSTIN Invoicing</div>
          <div className="text-[var(--muted)]">B2B tax invoices with GST input tax credit details for R&D labs and manufacturers.</div>
        </div>
      </div>
    </div>
  );
}
