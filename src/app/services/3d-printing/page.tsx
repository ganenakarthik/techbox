"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Printer, UploadCloud, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function ThreeDPrintingPage() {
  const { user, setIsAuthModalOpen, addToast } = useApp();
  const [material, setMaterial] = useState<string>("PLA Tough");
  const [infill, setInfill] = useState<number>(20);
  const [color, setColor] = useState<string>("Matte Black");
  const [quantity, setQuantity] = useState<number>(1);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<string | null>(null);

  const materials = [
    { name: "PLA Tough", desc: "Rigid & reliable for project cases", ratePerGram: 4.5 },
    { name: "PETG High Strength", desc: "Chemical & outdoor weatherproof", ratePerGram: 6.0 },
    { name: "ABS Industrial", desc: "Impact & temperature resistant (85°C)", ratePerGram: 6.5 },
    { name: "SLA UV Resin", desc: "Ultra-high resolution for tiny gears", ratePerGram: 12.0 },
  ];

  const currentMat = materials.find((m) => m.name === material) || materials[0];
  const estimatedWeight = Math.round(45 * (1 + (infill - 20) / 100));
  const estimatedTotal = Math.round(estimatedWeight * currentMat.ratePerGram * quantity);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      addToast(`CAD Model "${e.target.files[0].name}" loaded!`, "success");
    }
  };

  const handleSubmitPrint = async () => {
    if (!user) {
      addToast("Please sign in or create an account to submit manufacturing requests", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/services/3d-printing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partName: fileName || "Custom Project Enclosure / Mount",
          material,
          infillPercent: infill,
          color,
          layerHeight: "0.2mm Standard Quality",
          quantity,
          stlFileName: fileName,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmittedOrder(data.orderNumber);
        addToast(`3D print request ${data.orderNumber} submitted for slicer inspection!`, "success");
      } else {
        addToast(data.error || "Failed to submit 3D print request", "error");
      }
    } catch {
      addToast("Network error submitting 3D print request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 text-[#ff6a00] text-xs font-bold mb-3">
          <Printer className="w-4 h-4" />
          <span>FDM & SLA Prototyping</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          3D-Printed Project Enclosures & Parts
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-400">
          Upload STL, OBJ, or STEP files. Custom sensor mounts, drone arms, and robot chassis printed on industrial machines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          {/* File Upload Box */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              01. Upload 3D CAD Model (.STL, .OBJ, .STEP)
            </h3>

            <label className="border-2 border-dashed border-[#2c2c2c] hover:border-[#ff6a00] rounded-2xl p-6 text-center block cursor-pointer transition-colors bg-[#141414]">
              <input
                type="file"
                accept=".stl,.obj,.step,.stp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <UploadCloud className="w-8 h-8 text-[#ff6a00] mx-auto mb-2" />
              <div className="text-xs font-bold text-white">
                {fileName ? fileName : "Click to select or drop .STL or .STEP model"}
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Max file size: 50MB • Automatic volume calculation
              </div>
            </label>
          </div>

          {/* Material selection */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626] space-y-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              02. Material & Infill Parameters
            </h3>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Filament / Resin Type:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {materials.map((m) => (
                  <div
                    key={m.name}
                    onClick={() => setMaterial(m.name)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      material === m.name
                        ? "bg-[#ff6a00]/10 border-[#ff6a00] text-white"
                        : "bg-[#141414] border-[#262626] text-neutral-300 hover:border-[#333333]"
                    }`}
                  >
                    <div className="text-xs font-bold">{m.name}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">{m.desc}</div>
                    <div className="text-[10px] text-[#ff6a00] font-mono mt-1">₹{m.ratePerGram}/g</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Infill Density Slider */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-neutral-300">Infill Density:</span>
                <span className="text-[#ff6a00] font-bold">{infill}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={infill}
                onChange={(e) => setInfill(Number(e.target.value))}
                className="w-full accent-[#ff6a00] bg-[#1e1e1e]"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                <span>10% (Light)</span>
                <span>20% (Standard)</span>
                <span>50% (Strong)</span>
                <span>100% (Solid)</span>
              </div>
            </div>

            {/* Color selection */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Enclosure Color:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["Matte Black", "Pure White", "Signal Orange", "Steel Grey"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                      color === c
                        ? "bg-[#ff6a00]/15 border-[#ff6a00] text-[#ff6a00] font-bold"
                        : "bg-[#141414] border-[#262626] text-neutral-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quote Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626] shadow-2xl space-y-6">
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider">
                Instant 3D Print Quote
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                ₹{estimatedTotal}
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                Est. ~{estimatedWeight}g print weight at {infill}% infill
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#222222] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Material:</span>
                <span className="text-white font-medium">{material}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Color:</span>
                <span className="text-[#ff6a00] font-semibold">{color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Layer Height:</span>
                <span className="text-white font-medium">0.2mm Standard Quality</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Campus Delivery:</span>
                <span className="text-[#22c55e] font-semibold">FREE</span>
              </div>
            </div>

            {submittedOrder ? (
              <div className="p-4 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/30 text-center space-y-2">
                <div className="text-xs font-bold text-[#22c55e] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3D Print Order #{submittedOrder} Queued</span>
                </div>
                <p className="text-[11px] text-neutral-300">
                  Our digital fabrication lab is preparing the slice preview and wall infill calculations.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedOrder(null)}
                  className="text-xs text-[#ff6a00] underline font-medium hover:text-[#ff8533]"
                >
                  Submit another 3D CAD model
                </button>
              </div>
            ) : (
              <button
                disabled={isSubmitting}
                onClick={handleSubmitPrint}
                className="w-full py-3.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] disabled:opacity-50 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all"
              >
                <span>{isSubmitting ? "Submitting Model..." : "Submit Model for 3D Printing"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-start gap-2 text-[11px] text-neutral-400 pt-2 border-t border-[#1c1c1c]">
              <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
              <span>
                Support removal and surface deburring included free with every print.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
