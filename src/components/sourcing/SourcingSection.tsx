"use client";

import React, { useState } from "react";

export function SourcingSection() {
  const [partNumber, setPartNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [timeframe, setTimeframe] = useState("Standard (3-5 Days)");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [submittedRequest, setSubmittedRequest] = useState<{
    id: string;
    status: string;
    part: string;
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f) => f.name);
      setUploadedFiles((prev) => [...prev, ...names]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestId = "SRC-" + Math.floor(100000 + Math.random() * 900000);
    setSubmittedRequest({
      id: requestId,
      status: "Under Review by Supplier Network",
      part: partNumber || "Custom BOM Sourcing",
    });
  };

  return (
    <section id="sourcing-section" className="py-12 max-w-5xl mx-auto px-4">
      <div className="text-center space-y-2 mb-8">
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20">
          PARTSLY GLOBAL SUPPLIER NETWORK
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Can't find your exact part?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Specify your part number, IC package, or bulk BOM list. Our sourcing engineers query 500+ authorized distributors across India and Asia.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Liquid Glass Request Form */}
        <div className="lg:col-span-2 liquid-card p-6 space-y-6">
          {submittedRequest ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto font-bold">
                ✓
              </div>
              <h3 className="text-lg font-black text-slate-900">Sourcing Request Submitted!</h3>
              <p className="text-xs text-slate-600">
                Request Reference ID: <span className="font-mono font-bold text-[#ff6a00]">{submittedRequest.id}</span>
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1 inline-block text-left">
                <div>• Status: <span className="font-bold text-amber-600">{submittedRequest.status}</span></div>
                <div>• Target Part: <span className="font-mono font-bold">{submittedRequest.part}</span></div>
                <div>• Average quote response time: 2 to 4 hours</div>
              </div>

              <div>
                <button
                  onClick={() => setSubmittedRequest(null)}
                  className="liquid-button-secondary px-6 py-2.5 text-xs font-bold"
                >
                  Submit Another Sourcing Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Part Number / SKU / IC Name *</label>
                  <input
                    required
                    type="text"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    placeholder="e.g. STM32F407VGT6 or LM358"
                    className="w-full liquid-input px-3.5 py-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block mb-1">Target Quantity *</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 50 units"
                    className="w-full liquid-input px-3.5 py-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Technical Description & Package Requirements</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specify LQFP-100 package, operating voltage range, pin pitch, or target manufacturer brand..."
                  className="w-full liquid-input px-3.5 py-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block mb-1">Required Delivery Timeframe</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full liquid-input px-3.5 py-2.5 text-xs font-semibold"
                >
                  <option value="Urgent (24-48 Hours)">Urgent (24 - 48 Hours)</option>
                  <option value="Standard (3-5 Days)">Standard (3 - 5 Days)</option>
                  <option value="Bulk Import (7-14 Days)">Bulk Import (7 - 14 Days)</option>
                </select>
              </div>

              {/* Upload Dropzone (4 File types: Images, Datasheet, BOM Excel, PDF) */}
              <div>
                <label className="block mb-1">Upload Datasheet / BOM / Gerber / Reference Image</label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-[#ff6a00] rounded-xl p-4 text-center bg-slate-50/50 hover:bg-white transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.xlsx,.csv,.zip,.png,.jpg"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1 text-slate-500">
                    <svg className="w-8 h-8 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-xs font-bold text-slate-800">Drop your BOM Excel, Datasheet PDF, or image here</div>
                    <div className="text-[10px] text-slate-400">Supports .PDF, .XLSX, .CSV, .ZIP, .PNG (Max 25MB)</div>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {uploadedFiles.map((file, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700">
                        📎 {file}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="w-full liquid-button-primary py-3 text-xs font-extrabold shadow-md">
                Request Sourcing Quote →
              </button>
            </form>
          )}
        </div>

        {/* Right Info Card */}
        <div className="liquid-card p-6 space-y-4 text-xs">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Truthful Sourcing Workflow
          </h3>
          <div className="space-y-3 text-slate-600">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#ff6a00] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
              <div>
                <strong className="text-slate-900 block">Query Verification</strong>
                Our team checks catalog distributors (Mouser, Digikey, Element14, Arrow).
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#ff6a00] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
              <div>
                <strong className="text-slate-900 block">Quote Generation</strong>
                You receive a verified price and estimated dispatch date via WhatsApp / Email.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#ff6a00] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
              <div>
                <strong className="text-slate-900 block">Single Batch Delivery</strong>
                All sourced parts are consolidated and delivered directly to your doorstep.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
