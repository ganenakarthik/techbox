"use client";

import React, { useState } from "react";

export function ServicesSection() {
  const [activeTab, setActiveTab] = useState<"pcb" | "3d">("pcb");

  // PCB State
  const [pcbLayers, setPcbLayers] = useState("2-Layer");
  const [pcbLength, setPcbLength] = useState(100);
  const [pcbWidth, setPcbWidth] = useState(100);
  const [pcbQuantity, setPcbQuantity] = useState(5);
  const [pcbColor, setPcbColor] = useState("Green");
  const [pcbQuote, setPcbQuote] = useState<number | null>(null);

  // 3D Print State
  const [material, setMaterial] = useState("PETG (Tough)");
  const [infill, setInfill] = useState(20);
  const [printWeight, setPrintWeight] = useState(50);
  const [printQuote, setPrintQuote] = useState<number | null>(null);

  const calculatePcb = (e: React.FormEvent) => {
    e.preventDefault();
    const base = pcbLayers === "2-Layer" ? 499 : 1299;
    const sizeMultiplier = (pcbLength * pcbWidth) / 10000;
    const finalPrice = Math.round(base * sizeMultiplier * (pcbQuantity / 5));
    setPcbQuote(finalPrice);
  };

  const calculate3D = (e: React.FormEvent) => {
    e.preventDefault();
    const ratePerGram = material.includes("PETG") ? 12 : 8;
    const finalPrice = Math.round(printWeight * ratePerGram + 150);
    setPrintQuote(finalPrice);
  };

  return (
    <section id="services-section" className="py-12 max-w-5xl mx-auto px-4">
      <div className="text-center space-y-2 mb-8">
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20">
          PARTSLY CUSTOM MANUFACTURING & FABRICATION
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          PCB Fabrication & Precision 3D Printing
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Turn your Gerber design files or 3D CAD models into physical hardware prototypes with instant automated pricing.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setActiveTab("pcb")}
          className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all ${
            activeTab === "pcb"
              ? "bg-[#ff6a00] text-white shadow-md"
              : "liquid-pill text-slate-700 hover:text-slate-900"
          }`}
        >
          ⚡ Custom PCB Prototyping
        </button>
        <button
          onClick={() => setActiveTab("3d")}
          className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all ${
            activeTab === "3d"
              ? "bg-[#ff6a00] text-white shadow-md"
              : "liquid-pill text-slate-700 hover:text-slate-900"
          }`}
        >
          🖨 High-Precision 3D Printing
        </button>
      </div>

      {/* PCB Quote Box */}
      {activeTab === "pcb" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <form onSubmit={calculatePcb} className="liquid-card p-6 space-y-4 text-xs font-semibold text-slate-700">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200/80 pb-2">
              PCB Parameter Selector
            </h3>

            <div>
              <label className="block mb-1">Layer Count</label>
              <select
                value={pcbLayers}
                onChange={(e) => setPcbLayers(e.target.value)}
                className="w-full liquid-input px-3 py-2 text-xs"
              >
                <option value="2-Layer">2-Layer Standard FR-4</option>
                <option value="4-Layer">4-Layer High Density</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Length (mm)</label>
                <input
                  type="number"
                  value={pcbLength}
                  onChange={(e) => setPcbLength(parseInt(e.target.value) || 10)}
                  className="w-full liquid-input px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block mb-1">Width (mm)</label>
                <input
                  type="number"
                  value={pcbWidth}
                  onChange={(e) => setPcbWidth(parseInt(e.target.value) || 10)}
                  className="w-full liquid-input px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Batch Quantity</label>
                <select
                  value={pcbQuantity}
                  onChange={(e) => setPcbQuantity(parseInt(e.target.value))}
                  className="w-full liquid-input px-3 py-2 text-xs"
                >
                  <option value={5}>5 Boards</option>
                  <option value={10}>10 Boards</option>
                  <option value={20}>20 Boards</option>
                  <option value={50}>50 Boards</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Solder Mask Color</label>
                <select
                  value={pcbColor}
                  onChange={(e) => setPcbColor(e.target.value)}
                  className="w-full liquid-input px-3 py-2 text-xs"
                >
                  <option value="Green">Green Standard</option>
                  <option value="Black">Matte Black</option>
                  <option value="Blue">Royal Blue</option>
                  <option value="Red">Ruby Red</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full liquid-button-primary py-3 text-xs font-extrabold shadow-md">
              Calculate Instant PCB Quote
            </button>
          </form>

          {/* Result Card */}
          <div className="liquid-card p-6 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Estimated Instant Price
            </h3>
            {pcbQuote ? (
              <div className="space-y-4">
                <div className="text-3xl font-black text-slate-900">
                  ₹{pcbQuote.toLocaleString("en-IN")}{" "}
                  <span className="text-xs text-slate-400 font-normal">incl. electrical test</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div>• Spec: {pcbLayers} FR-4 ({pcbLength}x{pcbWidth}mm)</div>
                  <div>• Color: {pcbColor} Silkscreen</div>
                  <div>• Quantity: {pcbQuantity} fabricated boards</div>
                  <div>• Lead Time: 3 to 4 business days</div>
                </div>

                <button
                  onClick={() => alert("Gerber Upload Portal activated. Send your KiCad / EasyEDA zip to fab@partsly.in")}
                  className="w-full liquid-button-primary py-3 text-xs font-extrabold"
                >
                  Upload Gerber ZIP & Order PCB →
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select your board parameters on the left and click calculate.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3D Printing Quote Box */}
      {activeTab === "3d" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <form onSubmit={calculate3D} className="liquid-card p-6 space-y-4 text-xs font-semibold text-slate-700">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200/80 pb-2">
              3D Printing Spec Selector
            </h3>

            <div>
              <label className="block mb-1">Filament Material</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full liquid-input px-3 py-2 text-xs"
              >
                <option value="PETG (Tough)">PETG Tough (Outdoor & Enclosures)</option>
                <option value="PLA (Standard)">PLA Standard (Prototyping)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Infill Percentage ({infill}%)</label>
              <input
                type="range"
                min={15}
                max={100}
                value={infill}
                onChange={(e) => setInfill(parseInt(e.target.value))}
                className="w-full accent-[#ff6a00]"
              />
            </div>

            <div>
              <label className="block mb-1">Estimated Model Weight (Grams)</label>
              <input
                type="number"
                min={5}
                max={2000}
                value={printWeight}
                onChange={(e) => setPrintWeight(parseInt(e.target.value) || 10)}
                className="w-full liquid-input px-3 py-2 text-xs"
              />
            </div>

            <button type="submit" className="w-full liquid-button-primary py-3 text-xs font-extrabold shadow-md">
              Calculate 3D Print Quote
            </button>
          </form>

          {/* Result Card */}
          <div className="liquid-card p-6 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              3D Print Estimate
            </h3>
            {printQuote ? (
              <div className="space-y-4">
                <div className="text-3xl font-black text-slate-900">
                  ₹{printQuote.toLocaleString("en-IN")}{" "}
                  <span className="text-xs text-slate-400 font-normal">0.16mm layer resolution</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div>• Material: {material}</div>
                  <div>• Infill: {infill}% Grid Structure</div>
                  <div>• Weight: {printWeight}g</div>
                  <div>• Dispatch: 24 to 48 hours</div>
                </div>

                <button
                  onClick={() => alert("3D Print Portal activated. Upload your STL file to 3d@partsly.in")}
                  className="w-full liquid-button-primary py-3 text-xs font-extrabold"
                >
                  Upload STL / STEP Model & Print →
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Adjust material parameters and click calculate.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
