"use client";

import React, { useState } from "react";
import { Upload, CheckCircle2, FileText, Image as ImageIcon, FileSpreadsheet, File } from "lucide-react";

export function SourcingSection() {
  const [partNumber, setPartNumber] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [description, setDescription] = useState("");
  const [preferredDelivery, setPreferredDelivery] = useState("Select delivery timeline...");
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFile = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setUploadedFiles((prev) => ({ ...prev, [type]: f.name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      const msg = `Hi Partsly Sourcing!\n\nPart Number: ${partNumber || "N/A"}\nQuantity: ${quantity}\nDelivery: ${preferredDelivery}\nDescription: ${description}`;
      window.open(`https://wa.me/917032635858?text=${encodeURIComponent(msg)}`, "_blank");
    }, 1200);
  };

  return (
    <section id="sourcing" className="liquid-glass rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-6 font-sans">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-950">Can't find what you need?</h2>
        <p className="text-xs text-slate-500 font-medium">
          Tell us what you're looking for. We'll check our supplier network and get back to you.
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4 File Upload Boxes */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {/* Upload 1: Image */}
            <label className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#ff6a00] flex flex-col items-center justify-center text-center cursor-pointer transition-colors space-y-2">
              <div className="p-2.5 rounded-xl bg-orange-100/80 text-[#ff6a00]">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-900">
                {uploadedFiles.image ? uploadedFiles.image : "Upload Image"}
              </span>
              <span className="text-[10px] text-slate-400">JPG, PNG (Max 10MB)</span>
              <input type="file" accept="image/*" onChange={(e) => handleFile("image", e)} className="hidden" />
            </label>

            {/* Upload 2: Datasheet */}
            <label className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#ff6a00] flex flex-col items-center justify-center text-center cursor-pointer transition-colors space-y-2">
              <div className="p-2.5 rounded-xl bg-blue-100/80 text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-900">
                {uploadedFiles.datasheet ? uploadedFiles.datasheet : "Upload Datasheet"}
              </span>
              <span className="text-[10px] text-slate-400">PDF, DOC (Max 15MB)</span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFile("datasheet", e)} className="hidden" />
            </label>

            {/* Upload 3: BOM */}
            <label className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#ff6a00] flex flex-col items-center justify-center text-center cursor-pointer transition-colors space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-100/80 text-emerald-600">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-900">
                {uploadedFiles.bom ? uploadedFiles.bom : "Upload BOM"}
              </span>
              <span className="text-[10px] text-slate-400">Excel, CSV (Max 15MB)</span>
              <input type="file" accept=".xlsx,.csv,.xls" onChange={(e) => handleFile("bom", e)} className="hidden" />
            </label>

            {/* Upload 4: PDF */}
            <label className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#ff6a00] flex flex-col items-center justify-center text-center cursor-pointer transition-colors space-y-2">
              <div className="p-2.5 rounded-xl bg-purple-100/80 text-purple-600">
                <File className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-900">
                {uploadedFiles.pdf ? uploadedFiles.pdf : "Upload PDF"}
              </span>
              <span className="text-[10px] text-slate-400">PDF (Max 15MB)</span>
              <input type="file" accept=".pdf" onChange={(e) => handleFile("pdf", e)} className="hidden" />
            </label>
          </div>

          {/* Right Column: Form Inputs */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Part Number (optional)</label>
              <input
                type="text"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="e.g. ESP32-WROOM-32"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Required Quantity *</label>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 100"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Description (optional)</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about your requirement..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Preferred Delivery</label>
              <select
                value={preferredDelivery}
                onChange={(e) => setPreferredDelivery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
              >
                <option value="Select delivery timeline...">Select delivery timeline...</option>
                <option value="Standard (3-5 days)">Standard (3-5 days)</option>
                <option value="Express (1-2 days)">Express (1-2 days)</option>
                <option value="Global Import (1-2 weeks)">Global Import (1-2 weeks)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Request Sourcing
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-10 space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-950">Sourcing Request Sent!</h3>
          <p className="text-xs text-slate-500">Redirecting to Partsly WhatsApp Helpdesk for supplier availability check...</p>
        </div>
      )}
    </section>
  );
}
