"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Layers, UploadCloud, ShieldCheck, ArrowRight, Info, AlertTriangle, FileArchive } from "lucide-react";
import { validateClientFile } from "@/lib/validation";

export default function PcbServicePage() {
  const { user, setIsAuthModalOpen, addToast } = useApp();
  const [projectName, setProjectName] = useState<string>("");
  const [layers, setLayers] = useState<number>(2);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 100, height: 100 });
  const [quantity, setQuantity] = useState<number>(5);
  const [solderColor, setSolderColor] = useState<string>("Matte Black");
  const [surfaceFinish, setSurfaceFinish] = useState<string>("HASL with lead");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validation = validateClientFile(selectedFile, {
        allowedExtensions: [".zip", ".rar", ".tar", ".gz"],
        maxSizeBytes: 25 * 1024 * 1024,
      });
      if (!validation.isValid) {
        addToast(validation.error || "Invalid file format or size", "error");
        return;
      }
      setFile(selectedFile);
      setSubmissionError(null);
      if (!projectName) {
        setProjectName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
      addToast(`Gerber archive "${selectedFile.name}" selected!`, "success");
    }
  };

  const estimatedTotal = Math.round(
    (layers === 2 ? 450 : layers === 4 ? 980 : 1850) + (quantity > 5 ? (quantity - 5) * 40 : 0)
  );

  const handleSubmitGerber = async () => {
    setSubmissionError(null);

    if (!user) {
      addToast("Please log in to submit a PCB fabrication request", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    if (!file) {
      addToast("Please upload a Gerber archive (.zip or .rar) before submitting", "error");
      return;
    }

    if (dimensions.width <= 0 || dimensions.height <= 0) {
      addToast("Please specify valid board dimensions", "error");
      return;
    }

    const effectiveProjectName = projectName.trim() || file.name.replace(/\.[^/.]+$/, "");
    if (!effectiveProjectName) {
      addToast("Please specify a project / board name", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedFileUrl: string | undefined = undefined;
      let uploadedFileName: string | undefined = undefined;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "PCB");

        const uploadRes = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          addToast(uploadData.error || "Failed to upload Gerber archive", "error");
          setIsSubmitting(false);
          return;
        }

        uploadedFileUrl = uploadData.fileUrl;
        uploadedFileName = uploadData.originalName;
      }

      const res = await fetch("/api/services/pcb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: effectiveProjectName,
          layers: Number(layers),
          dimensions: `${dimensions.width}x${dimensions.height}mm`,
          quantity: Number(quantity),
          solderMaskColor: solderColor,
          surfaceFinish,
          gerberFileUrl: uploadedFileUrl,
          gerberFileName: uploadedFileName || file.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Failed to submit PCB order. Please try again.";
        setSubmissionError(errorMsg);
        addToast(errorMsg, "error");
        return;
      }

      setSubmittedOrder(data.orderNumber);
      addToast(`PCB request #${data.orderNumber} submitted successfully!`, "success");
    } catch (err: any) {
      const errorMsg = err.message || "Network error. Please check your connection.";
      setSubmissionError(errorMsg);
      addToast(errorMsg, "error");
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
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Custom PCB Manufacturing
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Upload Gerber ZIP archives. 1 to 4 layer FR-4 copper clad boards, delivered directly to campus.
        </p>
      </div>

      {submissionError && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs text-red-800">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <div className="font-bold">Submission Failed</div>
            <div>{submissionError}</div>
          </div>
        </div>
      )}

      {submittedOrder && (
        <div className="max-w-2xl mx-auto mb-8 p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
          <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">PCB Fabrication Request #{submittedOrder} Received</h3>
          <p className="text-xs text-slate-600">
            Our engineering team has received your Gerber archive for DFM trace & clearance review.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configurator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gerber Upload Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              01. Upload Gerber Archive (.ZIP / .RAR)
            </h3>

            <label className="border-2 border-dashed border-slate-300 hover:border-[#ff6a00] rounded-2xl p-6 text-center block cursor-pointer transition-colors bg-slate-50">
              <input
                type="file"
                accept=".zip,.rar,.tar.gz"
                onChange={handleFileUpload}
                className="hidden"
              />
              {file ? (
                <div className="flex flex-col items-center">
                  <FileArchive className="w-8 h-8 text-[#ff6a00] mb-2" />
                  <div className="text-xs font-bold text-slate-900">{file.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {(file.size / 1024).toFixed(1)} KB • Click to choose different file
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-[#ff6a00] mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-900">
                    Click to select or drop Gerber .ZIP file
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Supports KiCad, Altium, Eagle & EasyEDA exports
                  </div>
                </>
              )}
            </label>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Project / Board Label:
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. ESP32 Motor Controller Rev-B"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              02. Board Parameters
            </h3>

            {/* Layer Count */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-2">
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
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {l} {l === 1 ? "Layer" : "Layers"}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Width (mm):
                </label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Height (mm):
                </label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={dimensions.height}
                  onChange={(e) => setDimensions({ ...dimensions, height: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-2">
                Quantity (Boards):
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 20, 50, 100].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                      quantity === q
                        ? "bg-[#ff6a00] text-black border-[#ff6a00]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {q} pcs
                  </button>
                ))}
              </div>
            </div>

            {/* Solder Mask Color */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-2">
                Solder Mask Color:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { name: "Matte Black", hex: "#1e1e1e" },
                  { name: "Gloss Green", hex: "#166534" },
                  { name: "Cobalt Blue", hex: "#1d4ed8" },
                  { name: "Pure Red", hex: "#dc2626" },
                  { name: "Signal White", hex: "#f8fafc" },
                  { name: "Amber Yellow", hex: "#eab308" },
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSolderColor(c.name)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      solderColor === c.name
                        ? "border-[#ff6a00] bg-orange-50/50 scale-105"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-slate-300"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[10px] text-slate-700 font-medium truncate w-full text-center">
                      {c.name.split(" ")[1] || c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Surface Finish */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Surface Finish:
              </label>
              <select
                value={surfaceFinish}
                onChange={(e) => setSurfaceFinish(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
              >
                <option>HASL with lead (Standard Academic Prototyping)</option>
                <option>Lead-Free HASL (RoHS Compliant)</option>
                <option>ENIG (Electroless Nickel Immersion Gold - SMD pads)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Summary & Order (5 cols) */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 sticky top-24 shadow-2xl">
            <div>
              <div className="text-xs font-mono text-[#ff6a00] uppercase tracking-wider">
                Instant Estimation
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                PCB Fabrication Estimate
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Estimated Total (Excl. Tax)
              </div>
              <div className="text-3xl font-black text-slate-900 mt-1">
                ₹{estimatedTotal}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                ≈ ₹{Math.round(estimatedTotal / quantity)} per board ({quantity} pcs)
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Board Size:</span>
                <span className="text-slate-900 font-medium">
                  {dimensions.width} × {dimensions.height} mm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Layers:</span>
                <span className="text-slate-900 font-medium">{layers} Layers FR-4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Base Substrate:</span>
                <span className="text-slate-900 font-medium">FR-4 Standard TG130-140</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Copper Weight:</span>
                <span className="text-slate-900 font-medium">1 oz Cu (35μm)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Surface Finish:</span>
                <span className="text-slate-900 font-medium">{surfaceFinish}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Solder Mask:</span>
                <span className="text-[#ff6a00] font-semibold">{solderColor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Engineering Review:</span>
                <span className="text-[#22c55e] font-semibold">Included</span>
              </div>
            </div>

            {submittedOrder ? (
              <div className="p-4 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/30 text-center space-y-2">
                <div className="text-xs font-bold text-[#22c55e] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PCB Order #{submittedOrder} Queued</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittedOrder(null)}
                  className="text-xs text-[#ff6a00] underline font-medium hover:text-[#ff8533]"
                >
                  Submit another Gerber archive
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitGerber}
                className="w-full py-3.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] disabled:opacity-50 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all cursor-pointer"
              >
                <span>{isSubmitting ? "Submitting Gerber Archive..." : "Submit Gerber for DFM Review & Quote"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
              <span>
                Partsly hardware engineers perform 100% trace and clearance rule checks before production.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
