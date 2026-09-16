"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Layers, UploadCloud, CheckCircle2, ShieldCheck, ArrowRight, Info } from "lucide-react";

export default function PcbServicePage() {
  const { addToast } = useApp();
  const [layers, setLayers] = useState<number>(2);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 100, height: 100 });
  const [quantity, setQuantity] = useState<number>(5);
  const [solderColor, setSolderColor] = useState<string>("Matte Black");
  const [surfaceFinish, setSurfaceFinish] = useState<string>("HASL with lead");
  const [fileName, setFileName] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<string | null>(null);
  const { user, setIsAuthModalOpen } = useApp();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      addToast(`Gerber file "${e.target.files[0].name}" loaded!`, "success");
    }
  };

  const estimatedTotal = Math.round(
    (layers === 2 ? 450 : layers === 4 ? 980 : 1850) + (quantity > 5 ? (quantity - 5) * 40 : 0)
  );

  const handleSubmitGerber = async () => {
    if (!user) {
      addToast("Please sign in or create an account to submit manufacturing requests", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/services/pcb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: fileName || "Custom College Project PCB",
          layers,
          dimensions: `${dimensions.width}x${dimensions.height}mm`,
          quantity,
          surfaceFinish,
          solderMaskColor: solderColor,
          gerberFileName: fileName,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmittedOrder(data.orderNumber);
        addToast(`PCB request ${data.orderNumber} submitted for DFM engineering review!`, "success");
      } else {
        addToast(data.error || "Failed to submit PCB order", "error");
      }
    } catch {
      addToast("Network error submitting PCB request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 text-[#ff6a00] text-xs font-bold mb-3">
          <Layers className="w-4 h-4" />
          <span>Rapid PCB Prototyping</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Custom PCB Manufacturing
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-400">
          Upload Gerber ZIP files. 1 to 4 layer FR-4 military-grade copper clad boards, delivered directly to campus.
        </p>
      </div>

      {submittedOrder && (
        <div className="max-w-xl mx-auto mb-8 p-6 rounded-3xl bg-[#22c55e]/10 border border-[#22c55e]/30 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-[#22c55e] mx-auto mb-1" />
          <h3 className="text-lg font-bold text-white">PCB Order #{submittedOrder} Received!</h3>
          <p className="text-xs text-neutral-300">
            Our hardware engineers will run DFM (Design for Manufacturing) rule checks and confirm your trace clearances within 2 business hours.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configurator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gerber Upload Box */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              01. Upload Gerber Archive (.ZIP / .RAR)
            </h3>

            <label className="border-2 border-dashed border-[#2c2c2c] hover:border-[#ff6a00] rounded-2xl p-6 text-center block cursor-pointer transition-colors bg-[#141414]">
              <input
                type="file"
                accept=".zip,.rar,.tar.gz"
                onChange={handleFileUpload}
                className="hidden"
              />
              <UploadCloud className="w-8 h-8 text-[#ff6a00] mx-auto mb-2" />
              <div className="text-xs font-bold text-white">
                {fileName ? fileName : "Click to select or drop Gerber .ZIP file"}
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Supports KiCad, Altium, Eagle & EasyEDA exports
              </div>
            </label>
          </div>

          {/* Specifications */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626] space-y-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              02. Board Parameters
            </h3>

            {/* Layer Count */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Layer Count:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 4, 6].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLayers(l)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      layers === l
                        ? "bg-[#ff6a00] text-black border-[#ff6a00]"
                        : "bg-[#161616] text-neutral-300 border-[#262626] hover:border-[#3a3a3a]"
                    }`}
                  >
                    {l} Layer{l > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Width (mm):
                </label>
                <input
                  type="number"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
                  className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Height (mm):
                </label>
                <input
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => setDimensions({ ...dimensions, height: Number(e.target.value) })}
                  className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Batch Quantity (Pcs):
              </label>
              <div className="flex gap-2">
                {[5, 10, 20, 50].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      quantity === q
                        ? "bg-[#ff6a00] text-black border-[#ff6a00]"
                        : "bg-[#161616] text-neutral-300 border-[#262626]"
                    }`}
                  >
                    {q} pcs
                  </button>
                ))}
              </div>
            </div>

            {/* Solder Mask Color */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Solder Mask Color:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {["Matte Black", "Green", "Blue", "Red", "White"].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSolderColor(col)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                      solderColor === col
                        ? "bg-[#ff6a00]/15 border-[#ff6a00] text-[#ff6a00] font-bold"
                        : "bg-[#161616] border-[#262626] text-neutral-300"
                    }`}
                  >
                    {col}
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
                Preliminary Benchmark Estimate
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                ₹{estimatedTotal}*
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                *Reference price for {quantity} pcs of {layers}-Layer {dimensions.width}×{dimensions.height}mm boards. Final quote is calculated after DFM review of trace widths and layer stackup.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#222222] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Base Substrate:</span>
                <span className="text-white font-medium">FR-4 Standard TG130-140</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Copper Weight:</span>
                <span className="text-white font-medium">1 oz Cu (35μm)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Surface Finish:</span>
                <span className="text-white font-medium">{surfaceFinish}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Solder Mask:</span>
                <span className="text-[#ff6a00] font-semibold">{solderColor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Engineering Review:</span>
                <span className="text-[#22c55e] font-semibold">Included</span>
              </div>
            </div>

            <button
              onClick={handleSubmitGerber}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? "Submitting for DFM Review..." : "Submit Gerber for Engineering Quote"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-2 text-[11px] text-neutral-400 pt-2 border-t border-[#1c1c1c]">
              <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
              <span>
                TechBox hardware engineers perform 100% trace and clearance rule checks before production.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
