"use client";

import React from "react";
import { BOMSourcingTool } from "@/components/BOMSourcingTool";

export default function SourcingPage() {
  return (
    <div className="wrap py-8 space-y-8">
      <div className="border-b border-[var(--line)] pb-4">
        <p className="eyebrow text-xs font-bold uppercase text-[var(--muted)]">Strategic Procurement</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">BOM Sourcing & Enterprise RFQ Desk</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Submit Bill of Materials (BOM) files for factory-direct component sourcing, volume discount tiers, and dedicated RFQs.
        </p>
      </div>

      <BOMSourcingTool />
    </div>
  );
}
