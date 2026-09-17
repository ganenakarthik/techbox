"use client";

import React, { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Boxes,
  Layers,
  Wrench,
  FileSpreadsheet,
  Info,
  Bookmark,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function ProjectDropzone() {
  const { addToCart, addToast, user, setIsAuthModalOpen } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analyzingStage, setAnalyzingStage] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [savedProjectCode, setSavedProjectCode] = useState<string | null>(null);

  const [analysisResult, setAnalysisResult] = useState<{
    projectTitle: string;
    domain: string;
    detectedItems: any[];
    summary: {
      totalDetected: number;
      totalAvailable: number;
      estimatedKitPrice: number;
      catalogMatchRate: number;
    };
    fileInfo?: any;
  } | null>(null);

  const stages = [
    "Uploading file & verifying binary format...",
    "Extracting schematic text & BOM line items...",
    "Normalizing component aliases & package footprints...",
    "Catalog matching against PostgreSQL inventory...",
    "Stock verification & project kit synthesis...",
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
    setFile(uploadedFile);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setSavedProjectCode(null);
    setAnalyzingStage(0);

    try {
      // Stage 0: Uploading
      const formData = new FormData();
      formData.append("file", uploadedFile);

      setAnalyzingStage(1); // Extracting text
      const uploadRes = await fetch("/api/projects/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "File upload failed");
      }

      setAnalyzingStage(2); // Normalizing
      // Small pause for realistic pipeline stages
      await new Promise((r) => setTimeout(r, 400));
      setAnalyzingStage(3); // Matching catalog

      // Stage 3: Analyze extracted text against real database
      const analyzeRes = await fetch("/api/projects/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: uploadData.extractedText,
        }),
      });

      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) {
        throw new Error(analyzeData.error || "Failed to analyze requirements");
      }

      setAnalyzingStage(4); // Synthesizing
      await new Promise((r) => setTimeout(r, 300));

      const cleanName = uploadedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const title = cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + " Project Kit";

      setAnalysisResult({
        projectTitle: title,
        domain: "Engineering Project Hardware",
        detectedItems: analyzeData.matchedComponents || [],
        summary: analyzeData.summary,
        fileInfo: uploadData,
      });

      addToast("BOM extracted and matched with live database!", "success");
    } catch (err: any) {
      console.error("Upload error:", err);
      addToast(err.message || "Failed to process project file", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddAllDetected = () => {
    if (!analysisResult) return;
    let count = 0;
    analysisResult.detectedItems.forEach((item) => {
      if (item.variantId) {
        addToCart({
          variant: {
            id: item.variantId,
            name: item.name,
            sku: item.sku,
            price: item.unitPrice,
            mrp: item.unitPrice,
            discount: 0,
            stock: item.stock,
          },
          quantity: item.quantity,
        });
        count++;
      }
    });
    addToast(`Added ${count} matched components to your cart!`, "success");
  };

  const handleSaveProject = async () => {
    if (!user) {
      addToast("Please log in to save this project to your account", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    if (!analysisResult) return;

    setIsSavingProject(true);
    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: analysisResult.projectTitle,
          matchedComponents: analysisResult.detectedItems,
          fileInfo: analysisResult.fileInfo,
          buildLevel: "COMPONENTS_ONLY",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSavedProjectCode(data.project.projectCode);
        addToast(`Project ${data.project.projectCode} saved to your dashboard!`, "success");
      } else {
        addToast(data.error || "Failed to save project", "error");
      }
    } catch {
      addToast("Error saving project to database", "error");
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
            Upload your project synopsis, IEEE paper, circuit schematic (PDF/Image) or BOM spreadsheet. Our server-side catalog engine matches parts against genuine inventory.
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-slate-900 font-extrabold text-xs shadow-md shadow-[#ff6a00]/25 transition-all group-hover:scale-[1.02]">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Browse Project PDF, Image, or BOM</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 text-xs text-slate-500 font-mono">
            <span className="text-slate-400 font-sans text-[11px] uppercase tracking-wider font-semibold">
              Accepted Formats:
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
              PDF Document
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
              CSV / TXT BOM
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
              PNG / JPG Schematic
            </span>
            <span className="text-slate-400 text-[11px]">â€¢ Max 15MB</span>
          </div>
        </div>
      )}

      {/* Analyzing Progress State */}
      {isAnalyzing && (
        <div className="rounded-3xl bg-white border border-slate-200 p-8 md:p-10 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00]">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Processing &ldquo;{file?.name || "Project Document"}&rdquo;
                </h4>
                <p className="text-xs text-slate-500">
                  Running component extraction and database inventory match
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
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Top Banner */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-[#ff6a00] border border-orange-200 uppercase">
                  Project Detected
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
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 shadow-xs">
                <Info className="w-3.5 h-3.5 text-[#ff6a00]" />
                <span>Live PostgreSQL Catalog Match</span>
              </div>
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setFile(null);
                  setSavedProjectCode(null);
                }}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
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
                Est. Parts Total: <strong className="text-slate-900">â‚¹{totalDetectedCost}</strong>
              </span>
            </div>

            <div className="space-y-2.5">
              {analysisResult.detectedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-slate-800 text-xs shrink-0 shadow-xs">
                        Ã—{item.quantity}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          SKU: {item.sku} â€¢ {item.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 pl-2">
                      <span className={item.available ? "text-emerald-600 font-semibold" : "text-slate-400"}>
                        {item.available ? `In Stock (${item.stock})` : "Special Order"}
                      </span>
                      <span className="font-bold text-slate-900">â‚¹{item.totalPrice}</span>
                    </div>
                  </div>

                  {item.needsReview && (
                    <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-1.5 text-[11px] text-[#ff6a00]">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.reviewPrompt || "Please review this component."}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Saved Notification */}
            {savedProjectCode && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Project successfully saved with code <strong>{savedProjectCode}</strong>. Track in your Account Projects tab.</span>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleAddAllDetected}
                className="py-3 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#ff6a00]/20 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Available Parts to Cart (â‚¹{totalDetectedCost})</span>
              </button>

              <button
                onClick={handleSaveProject}
                disabled={isSavingProject}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
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