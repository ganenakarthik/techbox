"use client";

import React, { useState } from "react";

interface PCBQuoteCalculatorProps {
  onAddToCart?: (item: {
    id: string;
    name: string;
    price: number;
    specs: string;
    image: string;
  }) => void;
}

export const PCBQuoteCalculator: React.FC<PCBQuoteCalculatorProps> = ({ onAddToCart }) => {
  const [layers, setLayers] = useState<number>(2);
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(5);
  const [thickness, setThickness] = useState<string>("1.6mm");
  const [solderMask, setSolderMask] = useState<string>("Green");
  const [surfaceFinish, setSurfaceFinish] = useState<string>("HASL Lead-Free");
  const [gerberFile, setGerberFile] = useState<File | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  // Dynamic price math
  const areaSqMm = width * height;
  const basePricePerBoard = (areaSqMm / 1000) * (layers === 1 ? 12 : layers === 2 ? 18 : layers === 4 ? 35 : 65);
  const setupFee = layers > 2 ? 800 : 350;
  const finishMultiplier = surfaceFinish.includes("ENIG") ? 1.35 : 1.0;
  const estimatedPrice = Math.round((basePricePerBoard * quantity + setupFee) * finishMultiplier);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGerberFile(e.target.files[0]);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        id: `pcb-custom-${Date.now()}`,
        name: `Custom ${layers}-Layer PCB (${width}x${height}mm, ${quantity}pcs)`,
        price: estimatedPrice,
        specs: `FR4 ${thickness}, ${solderMask} Mask, ${surfaceFinish}`,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
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
            ⚡ Instant Quote Engine
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text)]">
            Industrial PCB Fabrication Quote
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Configure your board parameters below for automated instant pricing and 48-hour prototype dispatch.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-right">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)]">Est. Total Price</div>
          <div className="text-3xl font-extrabold text-[var(--accent)]">₹{estimatedPrice.toLocaleString()}</div>
          <div className="text-[11px] text-[var(--muted)]">Includes flying probe test & 18% GST</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Layer Count */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">Layer Count</label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 4, 6].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLayers(l)}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-all ${
                  layers === l
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--muted)]"
                }`}
              >
                {l} L
              </button>
            ))}
          </div>
        </div>

        {/* Board Dimensions */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">
            Dimensions (Width × Height mm)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={10}
              max={500}
              value={width}
              onChange={(e) => setWidth(Math.max(10, parseInt(e.target.value) || 10))}
              className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              placeholder="Width mm"
            />
            <span className="self-center text-sm font-bold text-[var(--muted)]">×</span>
            <input
              type="number"
              min={10}
              max={500}
              value={height}
              onChange={(e) => setHeight(Math.max(10, parseInt(e.target.value) || 10))}
              className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              placeholder="Height mm"
            />
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">Quantity (Pcs)</label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          >
            {[5, 10, 20, 50, 100, 250, 500].map((q) => (
              <option key={q} value={q}>
                {q} Boards
              </option>
            ))}
          </select>
        </div>

        {/* Solder Mask Color */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">Solder Mask Color</label>
          <select
            value={solderMask}
            onChange={(e) => setSolderMask(e.target.value)}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          >
            {["Green", "Black", "Blue", "Red", "White", "Yellow"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Surface Finish */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">Surface Finish</label>
          <select
            value={surfaceFinish}
            onChange={(e) => setSurfaceFinish(e.target.value)}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="HASL Lead-Free">HASL Lead-Free</option>
            <option value="ENIG (Electroless Nickel Immersion Gold)">ENIG (Gold Plated)</option>
            <option value="OSP (Organic Solderability Preservatives)">OSP</option>
          </select>
        </div>

        {/* Thickness */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[var(--muted)]">Board Thickness</label>
          <select
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          >
            {["0.8mm", "1.0mm", "1.2mm", "1.6mm Standard", "2.0mm"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gerber File Upload */}
      <div className="mt-6 rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-2)] p-4 text-center">
        <label className="cursor-pointer block">
          <input type="file" accept=".zip,.rar,.tar,.gerber" onChange={handleFileUpload} className="hidden" />
          <div className="text-sm font-semibold text-[var(--text)]">
            {gerberFile ? `📁 Uploaded: ${gerberFile.name}` : "📤 Drop Gerber Zip Archive here or click to browse"}
          </div>
          <div className="mt-1 text-xs text-[var(--muted)]">
            Supports KiCad, Altium, Eagle, EasyEDA Gerber RS-274X archives (.zip)
          </div>
        </label>
      </div>

      {/* Action Button */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-[var(--muted)]">
          ✓ Free Flying-Probe Electrical Testing Included • 48-Hour Express Lead Time
        </div>
        <button
          onClick={handleAddToCart}
          className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-98"
        >
          {isAdded ? "✓ Added PCB Job to Cart" : `Add PCB Job to Cart (₹${estimatedPrice.toLocaleString()})`}
        </button>
      </div>
    </div>
  );
};
