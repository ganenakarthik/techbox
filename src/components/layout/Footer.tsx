import React from "react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Everything for your hardware project. Premium electronics components, development boards, sensors, ICs, and custom engineering sourcing across India.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-600">
                Supplier Network Online • Dispatching Worldwide
              </span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Catalog Directory
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="hover:text-[#ff6a00] cursor-pointer transition-colors">Development Boards & MCUs</li>
              <li className="hover:text-[#ff6a00] cursor-pointer transition-colors">Sensors & IMUs</li>
              <li className="hover:text-[#ff6a00] cursor-pointer transition-colors">ICs & Semiconductor Passives</li>
              <li className="hover:text-[#ff6a00] cursor-pointer transition-colors">Power Regulators & LiPo</li>
              <li className="hover:text-[#ff6a00] cursor-pointer transition-colors">Motors, Servos & Actuators</li>
              <li className="hover:text-[#ff6a00] cursor-pointer transition-colors">Laptop Parts & Display Cables</li>
            </ul>
          </div>

          {/* Services & Sourcing */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Engineering Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="hover:text-[#ff6a00] cursor-pointer transition-colors">Custom PCB Fabrication (FR-4)</li>
              <li className="hover:text-[#ff6a00] cursor-pointer transition-colors">High Precision 3D Printing</li>
              <li className="hover:text-[#ff6a00] cursor-pointer transition-colors">BOM Supplier Sourcing</li>
              <li className="hover:text-[#ff6a00] cursor-pointer transition-colors">Obsolete Component Sourcing</li>
              <li className="hover:text-[#ff6a00] cursor-pointer transition-colors">Bulk Industrial Hardware</li>
            </ul>
          </div>

          {/* Verification & Payment Info */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Payment & Verification
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Direct UPI / Bank Transfer payment verification with WhatsApp runner dispatch support.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200">UPI Instant</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200">UTR Verification</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200">GST Invoice</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200">Runner Dispatch</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Partsly Engineering Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Terms & Datasheets</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Support Desk</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
