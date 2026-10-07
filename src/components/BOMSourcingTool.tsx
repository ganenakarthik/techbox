"use client";

import React, { useState } from "react";

interface BOMItem {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  targetPrice: number;
}

export const BOMSourcingTool: React.FC = () => {
  const [bomList, setBomList] = useState<BOMItem[]>([
    {
      id: "bom-1",
      partNumber: "ESP32-WROOM-32D",
      description: "Espressif Wi-Fi + BLE Microcontroller Module",
      quantity: 50,
      targetPrice: 220,
    },
    {
      id: "bom-2",
      partNumber: "AMS1117-3.3V",
      description: "3.3V 1A LDO Voltage Regulator (SOT-223)",
      quantity: 100,
      targetPrice: 12,
    },
    {
      id: "bom-3",
      partNumber: "0805 10uF 16V Ceramic Cap",
      description: "SMD 0805 Capacitor Multi-Layer Ceramic",
      quantity: 500,
      targetPrice: 1.5,
    },
  ]);

  const [newPart, setNewPart] = useState({ partNumber: "", description: "", quantity: 10, targetPrice: 0 });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleAddPart = () => {
    if (!newPart.partNumber) return;
    setBomList([
      ...bomList,
      {
        id: `bom-${Date.now()}`,
        partNumber: newPart.partNumber,
        description: newPart.description || "Custom Electronic Component",
        quantity: newPart.quantity,
        targetPrice: newPart.targetPrice,
      },
    ]);
    setNewPart({ partNumber: "", description: "", quantity: 10, targetPrice: 0 });
  };

  const handleRemovePart = (id: string) => {
    setBomList(bomList.filter((item) => item.id !== id));
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);
      // Simulate reading BOM CSV lines
      setTimeout(() => {
        setBomList([
          ...bomList,
          {
            id: `bom-imported-1`,
            partNumber: "STM32F401RCT6",
            description: "ARM Cortex-M4 84MHz 256KB Flash LQFP-64",
            quantity: 25,
            targetPrice: 310,
          },
          {
            id: `bom-imported-2`,
            partNumber: "TPS62160DGST",
            description: "Step-Down Converter 17V 1A 10-VSSOP",
            quantity: 50,
            targetPrice: 145,
          },
        ]);
      }, 500);
    }
  };

  const totalEstimatedCost = bomList.reduce((acc, item) => acc + item.quantity * item.targetPrice, 0);

  const handleSubmitRFQ = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            📋 Strategic Component Sourcing
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text)]">
            BOM (Bill of Materials) Sourcing & RFQ Engine
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Upload your BOM spreadsheet or specify component part numbers for bulk procurement and factory-direct pricing.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-right">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)]">Target Total Budget</div>
          <div className="text-3xl font-extrabold text-[var(--accent)]">₹{totalEstimatedCost.toLocaleString()}</div>
          <div className="text-[11px] text-[var(--muted)]">{bomList.length} Unique Line Items</div>
        </div>
      </div>

      {/* CSV Import strip */}
      <div className="mb-6 rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-2)] p-4 text-center">
        <label className="cursor-pointer block">
          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleCsvUpload} className="hidden" />
          <div className="text-sm font-semibold text-[var(--text)]">
            {csvFile ? `📄 Import Complete: ${csvFile.name}` : "📂 Upload BOM File (.CSV or .XLSX)"}
          </div>
          <div className="mt-1 text-xs text-[var(--muted)]">
            Supports columns: MPN / Part Number, Quantity, Description, Target Price
          </div>
        </label>
      </div>

      {/* Manual Add Line Item Form */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <input
          type="text"
          placeholder="MPN / Part Number (e.g. ESP32-WROOM-32D)"
          value={newPart.partNumber}
          onChange={(e) => setNewPart({ ...newPart, partNumber: e.target.value })}
          className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
        />
        <input
          type="text"
          placeholder="Short Description / Package"
          value={newPart.description}
          onChange={(e) => setNewPart({ ...newPart, description: e.target.value })}
          className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
        />
        <input
          type="number"
          min={1}
          placeholder="Quantity"
          value={newPart.quantity}
          onChange={(e) => setNewPart({ ...newPart, quantity: parseInt(e.target.value) || 1 })}
          className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
        />
        <button
          onClick={handleAddPart}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          + Add Line Item
        </button>
      </div>

      {/* BOM Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Part Number (MPN)</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Target (₹)</th>
              <th className="px-4 py-3 text-right">Subtotal (₹)</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)] bg-[var(--surface)]">
            {bomList.map((item) => (
              <tr key={item.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-[var(--text)]">{item.partNumber}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted)]">{item.description}</td>
                <td className="px-4 py-3 text-center font-mono font-bold text-[var(--text)]">{item.quantity}</td>
                <td className="px-4 py-3 text-right font-mono text-[var(--text)]">₹{item.targetPrice}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-[var(--accent)]">
                  ₹{(item.quantity * item.targetPrice).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleRemovePart(item.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-[var(--muted)]">
          ⚡ Automated RFQ Response within 2 Business Hours • Global Manufacturer Direct Sourcing
        </div>
        <button
          onClick={handleSubmitRFQ}
          className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-98"
        >
          {submitted ? "✓ RFQ Submitted to Partsly Sourcing Desk!" : "Submit BOM RFQ to Sourcing Team"}
        </button>
      </div>
    </div>
  );
};
