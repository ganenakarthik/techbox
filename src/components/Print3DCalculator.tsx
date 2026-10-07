"use client";

import React, { useState } from "react";

interface Print3DCalculatorProps {
  onAddToCart?: (item: {
    id: string;
    name: string;
    price: number;
    specs: string;
    image: string;
  }) => void;
}

export const Print3DCalculator: React.FC<Print3DCalculatorProps> = ({ onAddToCart }) => {
  const [material, setMaterial] = useState<string>("PLA Tough");
  const [infill, setInfill] = useState<number>(20);
  const [estimatedWeight, setEstimatedWeight] = useState<number>(45); // in grams
  const [quantity, setQuantity] = useState<number>(1);
  const [finish, setFinish] = useState<string>("Standard Raw");
  const [stlFile, setStlFile] = useState<File | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  // Price calculations
  const pricePerGram =
    material === "PLA Tough" ? 8 : material === "PETG Pro" ? 12 : material === "ABS Heat Resistant" ? 14 : 28; // Resin/SLA
  const infillMultiplier = 1 + infill / 100;
  const finishCost = finish === "Sanded & Polished" ? 250 : finish === "Vapor Smooth Finish" ? 400 : 0;
  const baseCost = Math.round(estimatedWeight * pricePerGram * infillMultiplier);
  const totalPrice = Math.max(199, (baseCost + finishCost) * quantity);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStlFile(file);
      // Auto estimate weight from file size
      const approxWeight = Math.min(350, Math.max(15, Math.round(file.size / 15000)));
      setEstimatedWeight(approxWeight);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        id: `3dprint-${Date.now()}`,
        name: `3D Print Job (${material}, ${infill}% Infill, ${estimatedWeight}g)`,
        price: totalPrice,
        specs: `Material: ${material}, Finish: ${finish}, Quantity: ${quantity} pcs`,
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2500);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            🧊 Precision Additive Manufacturing
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text)]">
            3D Printing On-Demand Slicing Calculator
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Upload your STL/STEP CAD files to calculate instant volume, infill density, material cost, and production schedule.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-right">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)]">Calculated Job Quote</div>
          <div className="text-3xl font-extrabold text-[var(--accent)]">₹{totalPrice.toLocaleString()}</div>
          <div className="text-[11px] text-[var(--muted)]">Dimensional Tolerance ±0.1mm</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Material */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">Print Material</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="PLA Tough">PLA Tough (Prototyping & Enclosures)</option>
            <option value="PETG Pro">PETG Pro (Weatherproof & Mechanical)</option>
            <option value="ABS Heat Resistant">ABS Industrial (High Heat Resistance)</option>
            <option value="SLA Precision Resin">SLA Precision Resin (Ultra Smooth Fine Detail)</option>
          </select>
        </div>

        {/* Infill Percentage */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">Infill Density ({infill}%)</label>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={infill}
            onChange={(e) => setInfill(parseInt(e.target.value))}
            className="w-full accent-[var(--accent)] cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-[11px] text-[var(--muted)]">
            <span>10% (Light)</span>
            <span>40% (Structural)</span>
            <span>100% (Solid)</span>
          </div>
        </div>

        {/* Weight / Volume */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">Estimated Model Weight (Grams)</label>
          <input
            type="number"
            min={5}
            max={2000}
            value={estimatedWeight}
            onChange={(e) => setEstimatedWeight(Math.max(5, parseInt(e.target.value) || 5))}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">Quantity (Units)</label>
          <input
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* Surface Finish */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">Surface Post-Processing</label>
          <select
            value={finish}
            onChange={(e) => setFinish(e.target.value)}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="Standard Raw">Standard Raw (Supports Removed)</option>
            <option value="Sanded & Polished">Sanded & Bead Polished (+₹250)</option>
            <option value="Vapor Smooth Finish">Vapor Chemical Smooth Gloss (+₹400)</option>
          </select>
        </div>
      </div>

      {/* STL / STEP File Upload */}
      <div className="mt-6 rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-2)] p-4 text-center">
        <label className="cursor-pointer block">
          <input type="file" accept=".stl,.step,.stp,.3mf,.obj" onChange={handleFileUpload} className="hidden" />
          <div className="text-sm font-semibold text-[var(--text)]">
            {stlFile ? `📦 STL/STEP Uploaded: ${stlFile.name}` : "📐 Upload .STL, .STEP, .3MF, or .OBJ 3D CAD files"}
          </div>
          <div className="mt-1 text-xs text-[var(--muted)]">
            Automated slicing & geometric volume calculation engine
          </div>
        </label>
      </div>

      {/* Action Button */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-[var(--muted)]">
          ✓ High resolution 0.12mm layer height available • 24-48 Hour Turnaround
        </div>
        <button
          onClick={handleAddToCart}
          className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-98"
        >
          {isAdded ? "✓ Added 3D Job to Cart" : `Add 3D Job to Cart (₹${totalPrice.toLocaleString()})`}
        </button>
      </div>
    </div>
  );
};
