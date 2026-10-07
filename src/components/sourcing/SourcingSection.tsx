"use client";

import React, { useState } from "react";
import { Upload, CheckCircle2, MessageSquare, ShieldCheck, Clock, FileText, Send, X } from "lucide-react";

interface SourcingSectionProps {
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export function SourcingSection({ isOpenModal, onCloseModal }: SourcingSectionProps) {
  const [partNumber, setPartNumber] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [description, setDescription] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState("24h Express");
  const [fileName, setFileName] = useState<string | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmitSourcing = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedStatus("Checking availability with Partsly supplier network...");

    setTimeout(() => {
      const msg = `Hi Partsly Sourcing Desk!\n\n*Part Sourcing Request*:\nPart Number: ${partNumber}\nQuantity: ${quantity}\nDelivery Preference: ${deliveryPreference}\nDescription: ${description}\nAttached File: ${fileName || "None"}`;
      window.open(`https://wa.me/917032635858?text=${encodeURIComponent(msg)}`, "_blank");
    }, 1200);
  };

  const mainContent = (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-zinc-200/90 shadow-xl space-y-8 relative overflow-hidden font-sans">
      {/* Background Accent Glow */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="max-w-2xl space-y-2 relative z-10">
        <span className="text-xs font-mono font-bold text-[#ff6a00] uppercase tracking-wider">
          PARTSLY SOURCING NETWORK
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight">
          Can't find your part?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
          Tell us what you need and our global supplier network will locate, verify lab specs, and quote within 2 hours.
        </p>
      </div>

      {!submittedStatus ? (
        <form onSubmit={handleSubmitSourcing} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-4">
            <div className="space-y-1 text-xs font-mono">
              <label className="font-bold text-zinc-800">Part Number / MPN *</label>
              <input
                type="text"
                required
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="e.g. ESP32-WROOM-32U, STM32F401RET6, LM358..."
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div className="space-y-1 text-xs font-mono">
              <label className="font-bold text-zinc-800">Required Quantity *</label>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 10 units, 500 pcs..."
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div className="space-y-1 text-xs font-mono">
              <label className="font-bold text-zinc-800">Preferred Delivery Timeline</label>
              <select
                value={deliveryPreference}
                onChange={(e) => setDeliveryPreference(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
              >
                <option value="24h Express">24h Express Campus Dispatch</option>
                <option value="2-3 Days">2-3 Business Days Domestic</option>
                <option value="1 Week Import">1 Week Global Import Sourcing</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1 text-xs font-mono">
              <label className="font-bold text-zinc-800">Description / Specs / Package Type</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention pin count, SMD/DIP package, operating voltage, or special requirements..."
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            {/* File Upload Box */}
            <div className="space-y-1 text-xs font-mono">
              <label className="font-bold text-zinc-800">Upload Datasheet / BOM / Image (Optional)</label>
              <label className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-50 border-2 border-dashed border-zinc-300 hover:border-[#ff6a00] cursor-pointer transition-colors text-center">
                <Upload className="w-5 h-5 text-[#ff6a00] mb-1" />
                <span className="text-[11px] font-bold text-zinc-700">
                  {fileName ? fileName : "Click to attach Gerber, PDF, Excel BOM, or Image"}
                </span>
                <span className="text-[10px] text-zinc-400">JPG, PNG, PDF, XLSX, CSV (Up to 25MB)</span>
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Submit Sourcing Request</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 space-y-4 font-mono">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-zinc-950 font-sans">Sourcing Request Submitted!</h3>
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-[#ff6a00] max-w-md mx-auto">
            Status: {submittedStatus}
          </div>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Redirecting to Partsly WhatsApp Helpdesk for real-time supplier availability updates...
          </p>
        </div>
      )}
    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-3xl relative">
          {onCloseModal && (
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {mainContent}
        </div>
      </div>
    );
  }

  return mainContent;
}
