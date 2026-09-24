"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { QrCode, Download, Printer, ArrowRight, Smartphone, Sparkles, CheckCircle2 } from "lucide-react";
import { PartslyLogo } from "@/components/ui/PartslyLogo";
import { generateWebsiteQrCodeUrl } from "@/lib/qr";
import { BRAND } from "@/config/brand";

export default function WebsiteQrPage() {
  const qrImageUrl = generateWebsiteQrCodeUrl("https://partsly.in", 600);

  const handleDownload = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "partsly-website-qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(qrImageUrl, "_blank");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      {/* Printable Poster Container */}
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="flex justify-center">
          <PartslyLogo size="lg" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6a00] text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#ff6a00]" />
            Official Campus Website QR
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Scan to Visit {BRAND.domain}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Point any phone camera or QR scanner to instantly access {BRAND.displayName}'s student hardware shop, custom PCBs, 3D printing & campus delivery.
          </p>
        </div>

        {/* High-Res QR Code Card */}
        <div className="relative p-6 rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-xl inline-block mx-auto group">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-white rounded-2xl p-4 flex items-center justify-center shadow-inner">
            <Image
              src={qrImageUrl}
              alt="Scan to visit Partsly.in"
              width={300}
              height={300}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-3 text-[11px] font-mono font-bold text-[#ff6a00] tracking-widest uppercase">
            https://partsly.in
          </div>
        </div>

        {/* Verification Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 py-2.5 px-4 rounded-2xl max-w-sm mx-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Direct HTTPS Link to {BRAND.appUrl}</span>
        </div>

        {/* Download & Print Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center print:hidden">
          <button
            onClick={handleDownload}
            className="py-3.5 px-6 rounded-2xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#ff6a00]/30 transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Image</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Campus Flyer</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 print:hidden">
          <Link href="/" className="text-[#ff6a00] font-bold hover:underline inline-flex items-center gap-1">
            <span>← Back to {BRAND.displayName} Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
