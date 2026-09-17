import React from "react";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-bold mb-4">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Terms & <span className="text-[#ff6a00]">Conditions</span>
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-slate-500">
          Last updated: September 2026. Standard terms of use for Partsly marketplace and services.
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 text-xs text-slate-600 space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="text-[#ff6a00]">1.</span> Acceptance of Terms
          </h2>
          <p>
            By accessing Partsly (partsly.in) or placing orders for electronic components, project kits, or engineering services, you agree to be bound by these terms. If you are ordering on behalf of a student college team or university club, you affirm you are authorized to place orders on their behalf.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="text-[#ff6a00]">2.</span> Product Specifications & Technical Datasheets
          </h2>
          <p>
            We strive to provide accurate pinouts, operating voltages, logic levels, and datasheets for all components. It is the builder&rsquo;s responsibility to observe correct power supply voltages (e.g., 3.3V vs 5V logic thresholds) when prototyping circuits.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="text-[#ff6a00]">3.</span> Custom Engineering & Fabrication Services
          </h2>
          <p>
            Custom fabrication quotes (PCB manufacturing, 3D printing, firmware development) are based on the user-submitted design files and BOM specifications. Changes to dimensions or layer stackups after quote approval may require price recalculation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="text-[#ff6a00]">4.</span> Order Cancellation
          </h2>
          <p>
            Component orders may be cancelled at no penalty before they are marked as <code>PACKED</code> or <code>SHIPPED</code> by our campus dispatch center. Custom fabrication orders cannot be cancelled once PCB etching or 3D filament printing has commenced.
          </p>
        </section>
      </div>
    </div>
  );
}
