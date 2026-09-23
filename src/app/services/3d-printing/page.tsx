"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Printer, UploadCloud, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, FileCode } from "lucide-react";
import { validateClientFile } from "@/lib/validation";

export default function ThreeDPrintingPage() {
  const { user, setIsAuthModalOpen, addToast } = useApp();
  const [partName, setPartName] = useState<string>("");
  const [material, setMaterial] = useState<string>("PLA Tough");
  const [infill, setInfill] = useState<number>(20);
  const [color, setColor] = useState<string>("Matte Black");
  const [quantity, setQuantity] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

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
      const selectedFile = e.target.files[0];
      const validation = validateClientFile(selectedFile, {
        allowedExtensions: [".stl", ".obj", ".step", ".stp"],
        maxSizeBytes: 25 * 1024 * 1024,
      });
      if (!validation.isValid) {
        addToast(validation.error || "Invalid file format or size", "error");
        return;
      }
      setFile(selectedFile);
      if (!partName) {
        setPartName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
      setSubmissionError(null);
      addToast(`CAD Model "${selectedFile.name}" selected!`, "success");
    }
  };

  const handleSubmitPrint = async () => {
    setSubmissionError(null);

    if (!user) {
      addToast("Please log in to submit a 3D printing request", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    if (!file) {
      addToast("Please upload a 3D model file (.stl, .obj, .step) before submitting", "error");
      return;
    }

    const effectivePartName = partName.trim() || file.name.replace(/\.[^/.]+$/, "");
    if (!effectivePartName) {
      addToast("Please specify a part name", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedFileUrl: string | undefined = undefined;
      let uploadedFileName: string | undefined = undefined;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "THREE_D_MODEL");

        const uploadRes = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          addToast(uploadData.error || "Failed to upload 3D model file", "error");
          setIsSubmitting(false);
          return;
        }

        uploadedFileUrl = uploadData.fileUrl;
        uploadedFileName = uploadData.originalName;
      }

      const res = await fetch("/api/services/3d-printing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partName: effectivePartName,
          material,
          infillPercent: Number(infill),
          color,
          layerHeight: "0.2mm Standard",
          quantity: Number(quantity),
          stlFileUrl: uploadedFileUrl,
          stlFileName: uploadedFileName || file.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Failed to submit 3D print order. Please try again.";
        setSubmissionError(errorMsg);
        addToast(errorMsg, "error");
        return;
      }

      setSubmittedOrder(data.orderNumber);
      addToast(`3D print request #${data.orderNumber} submitted successfully!`, "success");
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
          <Printer className="w-4 h-4" />
          <span>FDM & SLA Prototyping</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          3D-Printed Project Enclosures & Parts
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Upload STL, OBJ, or STEP files. Custom sensor mounts, drone arms, and robot chassis printed on industrial machines.
        </p>
      </div>

      {submissionError && (
        <div className="max-w-xl mx-auto mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <div className="font-bold">Submission Failed</div>
            <div>{submissionError}</div>
          </div>
        </div>
      )}

      {submittedOrder && (
        <div className="max-w-xl mx-auto mb-8 p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
          <h3 className="text-lg font-bold text-slate-900">3D Print Request #{submittedOrder} Received</h3>
          <p className="text-xs text-slate-600">
            Our fabrication lab has received your CAD model specifications for dimensional slicing and quotation.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configurator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* File Upload Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              01. Upload 3D CAD Model (.STL / .OBJ / .STEP)
            </h3>

            <label className="border-2 border-dashed border-slate-300 hover:border-[#ff6a00] rounded-2xl p-6 text-center block cursor-pointer transition-colors bg-slate-50">
              <input
                type="file"
                accept=".stl,.obj,.step,.stp"
                onChange={handleFileUpload}
                className="hidden"
              />
              {file ? (
                <div className="flex flex-col items-center">
                  <FileCode className="w-8 h-8 text-[#ff6a00] mb-2" />
                  <div className="text-xs font-bold text-slate-900">{file.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Click to choose different file
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-[#ff6a00] mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-900">
                    Click to select or drag & drop CAD file
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Supports STL, OBJ, STEP, STP • Max 25MB
                  </div>
                </>
              )}
            </label>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Part / Enclosure Label:
              </label>
              <input
                type="text"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="e.g. Ultrasonic Sensor Bracket or ESP32 Enclosure Top"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
              />
            </div>
          </div>

          {/* Material & Print Parameters */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              02. Print Material & Infill Parameters
            </h3>

            {/* Material Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-2">
                Filament / Resin Type:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {materials.map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setMaterial(m.name)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      material === m.name
                        ? "border-[#ff6a00] bg-orange-50/50 shadow-sm"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900">{m.name}</span>
                      <span className="text-xs font-mono font-bold text-[#ff6a00]">₹{m.ratePerGram}/g</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Infill Density Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Infill Density:
                </label>
                <span className="text-xs font-mono font-bold text-slate-900">{infill}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={infill}
                onChange={(e) => setInfill(Number(e.target.value))}
                className="w-full accent-[#ff6a00] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>10% (Lightweight Draft)</span>
                <span>20% (Standard Project Box)</span>
                <span>50%+ (Mechanical Gears/Brackets)</span>
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-2">
                Color:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "Matte Black", hex: "#1e1e1e" },
                  { name: "Signal White", hex: "#f8fafc" },
                  { name: "Industrial Grey", hex: "#64748b" },
                  { name: "Partsly Orange", hex: "#ff6a00" },
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    className={`py-2 px-2 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium transition-all ${
                      color === c.name
                        ? "border-[#ff6a00] bg-orange-50/50 text-slate-900 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="truncate text-[11px]">{c.name.split(" ")[1] || c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-2">
                Quantity:
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 5, 10].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      quantity === q
                        ? "bg-[#ff6a00] text-black border-[#ff6a00]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary & Submission (5 cols) */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 sticky top-24 shadow-2xl">
            <div>
              <div className="text-xs font-mono text-[#ff6a00] uppercase tracking-wider">
                Digital Fabrication Slicer
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Print Job Summary
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Estimated Material & Machine Cost
              </div>
              <div className="text-3xl font-black text-slate-900 mt-1">
                ₹{estimatedTotal}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                ≈ {estimatedWeight}g estimated raw material weight
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Material:</span>
                <span className="text-slate-900 font-medium">{material}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Color:</span>
                <span className="text-slate-900 font-medium">{color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rate per Gram:</span>
                <span className="text-[#ff6a00] font-semibold">₹{currentMat.ratePerGram}/g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Infill:</span>
                <span className="text-slate-900 font-medium">{infill}% Grid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Slicing & Toolpath Check:</span>
                <span className="text-[#22c55e] font-semibold">Included</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Campus Pickup:</span>
                <span className="text-[#22c55e] font-semibold">FREE</span>
              </div>
            </div>

            {submittedOrder ? (
              <div className="p-4 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/30 text-center space-y-2">
                <div className="text-xs font-bold text-[#22c55e] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3D Print Order #{submittedOrder} Queued</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Our digital fabrication lab is slicing your CAD model to compute exact material weight and generate your official quote.
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
                className="w-full py-3.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] disabled:opacity-50 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all cursor-pointer"
              >
                <span>{isSubmitting ? "Submitting Model..." : "Submit Model for Slicing & Quote"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
              <span>
                Support removal, tolerance checks, and deburring included free with every project print.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
