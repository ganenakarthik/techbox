"use client";

import React, { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  FileSpreadsheet,
  Info,
  Bookmark,
  AlertTriangle,
  FileText,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { validateClientFile } from "@/lib/validation";

export function ProjectDropzone() {
  const { addToCart, addToast, user, setIsAuthModalOpen } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analyzingStage, setAnalyzingStage] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [formatNotice, setFormatNotice] = useState<string | null>(null);

  const [isSavingProject, setIsSavingProject] = useState(false);
  const [savedProjectCode, setSavedProjectCode] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [analysisResult, setAnalysisResult] = useState<{
    projectTitle: string;
    domain: string;
    detectedItems: any[];
    summary: {
      totalDetected: number;
      totalAvailable: number;
      estimatedKitPrice: number;
      catalogMatchRate: number;
      manualReviewRequired: boolean;
    };
    fileInfo?: any;
  } | null>(null);

  const stages = [
    "Validating file integrity client-side...",
    "Extracting component line items from document...",
    "Querying genuine catalog for hardware matches...",
    "Computing inventory stock and pricing...",
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const processUploadedFile = async (uploadedFile: File) => {
    // 1. Client-side file validation
    const validation = validateClientFile(uploadedFile, {
      allowedExtensions: [".pdf", ".txt", ".csv", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".zip"],
      maxSizeBytes: 15 * 1024 * 1024,
    });

    if (!validation.isValid) {
      addToast(validation.error || "Invalid file format or size", "error");
      return;
    }

    setFile(uploadedFile);
    setAnalysisError(null);
    setFormatNotice(null);
    setAnalysisResult(null);
    setSavedProjectCode(null);
    setSaveError(null);

    const ext = uploadedFile.name.split(".").pop()?.toLowerCase() || "";
    const isTextBOM = ext === "csv" || ext === "txt";

    // If file is binary (PDF, Word doc, Image, ZIP), automated text parsing pipeline is in development
    if (!isTextBOM) {
      setFormatNotice(
        `File "${uploadedFile.name}" validated and preserved (${(uploadedFile.size / 1024).toFixed(1)} KB). Automated schematic/PDF text extraction pipeline is currently in development. Upload a CSV or TXT Bill of Materials for live catalog matching, or request manual engineering review below.`
      );
      return;
    }

    // Process text-based BOM against the real backend API
    setIsAnalyzing(true);
    setAnalyzingStage(0);

    try {
      setAnalyzingStage(1);
      const textContent = await uploadedFile.text();

      if (!textContent.trim()) {
        throw new Error("The uploaded file is empty.");
      }

      setAnalyzingStage(2);
      const res = await fetch("/api/projects/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textContent }),
      });

      setAnalyzingStage(3);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze project BOM requirements");
      }

      const cleanName = uploadedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const title = cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + " Project Kit";

      const matched = data.matchedComponents || [];
      const summary = data.summary || {
        totalDetected: matched.length,
        totalAvailable: matched.filter((m: any) => m.available).length,
        estimatedKitPrice: matched.reduce((s: number, m: any) => s + (m.totalPrice || 0), 0),
        catalogMatchRate: data.summary?.catalogMatchRate ?? 0,
        manualReviewRequired: data.summary?.manualReviewRequired ?? false,
      };

      setAnalysisResult({
        projectTitle: title,
        domain: "Live Catalog BOM Analysis",
        detectedItems: matched,
        summary,
        fileInfo: {
          name: uploadedFile.name,
          size: uploadedFile.size,
          type: uploadedFile.type,
        },
      });

      addToast("BOM analyzed against catalog successfully", "success");
    } catch (err: any) {
      console.error("BOM analysis error:", err);
      const msg = err.message || "Failed to analyze project BOM";
      setAnalysisError(msg);
      addToast(msg, "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddAllDetected = () => {
    if (!analysisResult) return;
    let count = 0;
    analysisResult.detectedItems.forEach((item) => {
      if (item.variantId && item.available) {
        addToCart({
          variant: {
            id: item.variantId,
            name: item.name,
            sku: item.sku,
            price: item.unitPrice || 0,
            mrp: item.unitPrice || 0,
            discount: 0,
            stock: item.stock || 0,
          },
          quantity: item.quantity || 1,
        });
        count++;
      }
    });

    if (count > 0) {
      addToast(`Added ${count} in-stock components to your cart!`, "success");
    } else {
      addToast("No in-stock catalog matched items available to add to cart", "info");
    }
  };

  const handleSaveProject = async () => {
    if (!user) {
      addToast("Please log in to save this project to your account", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    if (!analysisResult) return;

    setIsSavingProject(true);
    setSaveError(null);

    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: analysisResult.projectTitle,
          description: `Uploaded BOM file: ${file?.name || "BOM Document"}`,
          buildLevel: "PROJECT_KIT",
          matchedComponents: analysisResult.detectedItems,
          fileInfo: file
            ? {
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type || "text/plain",
              }
            : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save project");
      }

      const code = data.project?.projectCode || "SAVED";
      setSavedProjectCode(code);
      addToast(`Project saved to your account with code ${code}!`, "success");
    } catch (err: any) {
      const msg = err.message || "Failed to save project";
      setSaveError(msg);
      addToast(msg, "error");
    } finally {
      setIsSavingProject(false);
    }
  };

  const totalDetectedCost = analysisResult ? analysisResult.summary.estimatedKitPrice : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Upload Zone */}
      {!analysisResult && !isAnalyzing && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed p-8 md:p-12 text-center cursor-pointer transition-all duration-300 group shadow-xs ${
            isDragging
              ? "border-[#ff6a00] bg-orange-50/60 scale-[1.01] shadow-md"
              : "border-slate-300 hover:border-[#ff6a00] bg-white hover:bg-orange-50/30"
          }`}
        >
          <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#ff6a00] rounded-tl pointer-events-none" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#ff6a00] rounded-tr pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#ff6a00] rounded-bl pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#ff6a00] rounded-br pointer-events-none" />

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.txt"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-4 text-[#ff6a00] group-hover:scale-110 transition-transform shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-2">
            Have a project? <span className="text-[#ff6a00]">Drop your BOM or schematic here.</span>
          </h3>

          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
            Upload your project synopsis, schematic, or BOM spreadsheet. Component requirements are validated against live catalog inventory.
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-xs shadow-md shadow-[#ff6a00]/25 transition-all group-hover:scale-[1.02]">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Browse Project PDF, Image, or BOM</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 text-xs text-slate-500 font-mono">
            <span className="text-slate-400 font-sans text-[11px] uppercase tracking-wider font-semibold">
              Accepted Formats:
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
              CSV / TXT BOM (Live Match)
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
              PDF / Schematic
            </span>
            <span className="text-slate-400 text-[11px]">• Max 15MB</span>
          </div>
        </div>
      )}

      {/* Notice for non-text formats */}
      {formatNotice && (
        <div className="mt-6 rounded-3xl bg-amber-50 border border-amber-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-950">File Validated — Server-Side Pipeline Notice</h4>
              <p className="text-xs text-amber-900 leading-relaxed">{formatNotice}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-amber-200/60 flex flex-wrap gap-3">
            <Link
              href="/services/prototypes"
              className="py-2.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-black font-extrabold text-xs flex items-center gap-1.5 transition-all"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Request Engineering Review & Assembly</span>
            </Link>
            <button
              onClick={() => {
                setFile(null);
                setFormatNotice(null);
              }}
              className="py-2.5 px-4 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors"
            >
              Upload Different File
            </button>
          </div>
        </div>
      )}

      {/* Analysis Error */}
      {analysisError && (
        <div className="mt-6 rounded-3xl bg-red-50 border border-red-200 p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-red-900 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>BOM Analysis Failed</span>
          </div>
          <p className="text-xs text-red-800">{analysisError}</p>
          <button
            onClick={() => {
              setAnalysisError(null);
              setFile(null);
            }}
            className="text-xs text-red-700 underline font-medium hover:text-red-900 cursor-pointer"
          >
            Try again with another file
          </button>
        </div>
      )}

      {/* Analyzing Progress State */}
      {isAnalyzing && (
        <div className="rounded-3xl bg-white border border-slate-200 p-8 md:p-10 shadow-xl mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00]">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Processing &ldquo;{file?.name || "BOM File"}&rdquo;
                </h4>
                <p className="text-xs text-slate-500">
                  Matching component lines with catalog database
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-50 text-[#ff6a00] border border-orange-200">
              STAGE {analyzingStage + 1} OF {stages.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full bg-gradient-to-r from-[#ff6a00] to-[#ea580c]"
              initial={{ width: "15%" }}
              animate={{ width: `${((analyzingStage + 1) / stages.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Stage Checkpoints */}
          <div className="space-y-3">
            {stages.map((stg, idx) => {
              const isDone = idx < analyzingStage;
              const isCurrent = idx === analyzingStage;

              return (
                <div
                  key={stg}
                  className={`flex items-center gap-3 text-xs p-2.5 rounded-xl transition-colors ${
                    isCurrent
                      ? "bg-orange-50 border border-orange-200 text-slate-900 font-medium"
                      : isDone
                      ? "text-slate-600"
                      : "text-slate-400"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-[#ff6a00] border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span>{stg}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 mt-6">
          {/* Top Banner */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-[#ff6a00] border border-orange-200 uppercase">
                  Catalog Matched
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Match Rate: {analysisResult.summary.catalogMatchRate}%
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 mt-1">
                {analysisResult.projectTitle}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setFile(null);
                  setSavedProjectCode(null);
                  setSaveError(null);
                }}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Upload another file"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Components List */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#ff6a00]" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Extracted Bill of Materials ({analysisResult.detectedItems.length} items)
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Est. Parts Total: <strong className="text-slate-900">₹{totalDetectedCost}</strong>
              </span>
            </div>

            <div className="space-y-2.5">
              {analysisResult.detectedItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-slate-800 text-xs shrink-0 shadow-xs">
                        ×{item.quantity}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          SKU: {item.sku} • {item.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 pl-2">
                      <span className={item.isCatalogMatch ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                        {item.isCatalogMatch ? (item.available ? "In Stock" : "Catalog Backorder") : "Unmatched Item"}
                      </span>
                      <span className="font-bold text-slate-900">
                        {item.unitPrice ? `₹${item.totalPrice}` : "Quote Required"}
                      </span>
                    </div>
                  </div>

                  {item.needsReview && (
                    <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-1.5 text-[11px] text-[#ff6a00]">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.reviewPrompt || "Verification required for this item."}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Saved Notification */}
            {savedProjectCode && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Project saved to your account with code <strong>{savedProjectCode}</strong>.</span>
              </div>
            )}

            {saveError && (
              <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleAddAllDetected}
                disabled={totalDetectedCost === 0}
                className="py-3 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#ff6a00]/20 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Available Parts to Cart (₹{totalDetectedCost})</span>
              </button>

              <button
                onClick={handleSaveProject}
                disabled={isSavingProject}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Bookmark className="w-4 h-4 text-[#ff6a00]" />
                <span>{isSavingProject ? "Saving..." : "Save Project to My Account"}</span>
              </button>

              <Link
                href="/services/prototypes"
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Wrench className="w-4 h-4 text-[#ff6a00]" />
                <span>Request Prototype Quote</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}