"use client";

import React, { useState } from "react";
import { Layers, Printer, Cpu, Search, Laptop, Wrench, ArrowRight, MessageSquare, X } from "lucide-react";

const SERVICES_LIST = [
  {
    id: "pcb",
    title: "PCB Manufacturing",
    icon: Layers,
    badge: "2-4 Layer FR-4",
    description: "Industrial 2-layer & 4-layer FR-4 double-sided printed circuit board fabrication with 100% flying probe electrical testing.",
    customerProvides: "Gerber files (RS-274X), KiCad / EasyEDA zip archive",
    whatHappensNext: "DRC validation check & instant quote dispatch within 2 hours.",
  },
  {
    id: "3dprint",
    title: "3D Printing & Enclosures",
    icon: Printer,
    badge: "0.1mm Precision",
    description: "Custom CAD enclosure 3D printing in tough ABS, PETG, and PLA for hardware product prototypes.",
    customerProvides: "STL, STEP, or 3MF 3D model files",
    whatHappensNext: "Slicing volume estimate, bed density calculation, and print dispatch in 24h.",
  },
  {
    id: "prototypes",
    title: "Custom Prototypes",
    icon: Cpu,
    badge: "Turn-Key",
    description: "Turn-key electronic prototype assembly, SMD component soldering, and microcontroller firmware loading.",
    customerProvides: "BOM component list & schematic block diagram",
    whatHappensNext: "Parts sourcing verification & complete assembly milestone quote.",
  },
  {
    id: "sourcing",
    title: "Project Sourcing",
    icon: Search,
    badge: "Bulk BOM",
    description: "Complete Bill-of-Materials (BOM) component sourcing for college project kits, labs, and volume production.",
    customerProvides: "Excel / CSV BOM list with part numbers & quantities",
    whatHappensNext: "Distributor network lookup, volume tier pricing, and single-package kit dispatch.",
  },
  {
    id: "laptop",
    title: "Laptop Parts & Repair",
    icon: Laptop,
    badge: "Genuine Spares",
    description: "Replacement laptop batteries, displays, cooling fans, keyboards, and DC jack power socket repairs.",
    customerProvides: "Laptop model number & damaged component description",
    whatHappensNext: "Genuine replacement part match & gate pickup options.",
  },
  {
    id: "consulting",
    title: "Engineering Services",
    icon: Wrench,
    badge: "Expert Consulting",
    description: "Circuit schematic review, power efficiency optimization, and IoT wireless firmware debugging.",
    customerProvides: "Project goal summary & schematic PDF / code repository link",
    whatHappensNext: "Senior hardware engineer consultation & review report.",
  },
];

interface ServicesSectionProps {
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export function ServicesSection({ isOpenModal, onCloseModal }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<typeof SERVICES_LIST[0] | null>(null);

  const handleRequestQuote = (serviceTitle: string) => {
    const msg = `Hi Partsly Team! I would like to request a quote for *${serviceTitle}*.`;
    window.open(`https://wa.me/917032635858?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const content = (
    <section id="services" className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6a00] uppercase">
            PARTSLY CUSTOM MANUFACTURING & REPAIR
          </h2>
          <h3 className="text-2xl font-black text-zinc-950">Engineering Services & Services</h3>
        </div>

        <span className="text-xs text-zinc-500 font-mono">
          More than just components — we help you build.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES_LIST.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              className="p-6 rounded-2xl bg-white border border-zinc-200/90 hover:border-[#ff6a00]/70 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer"
              onClick={() => setSelectedService(service)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-[#ff6a00] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff6a00]">
                    {service.badge}
                  </span>
                </div>

                <h4 className="font-bold text-zinc-950 text-base group-hover:text-[#ff6a00] transition-colors">
                  {service.title}
                </h4>

                <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                  {service.description}
                </p>

                <div className="space-y-1.5 pt-2 text-[11px] font-mono text-zinc-500 border-t border-zinc-100">
                  <div>• <strong>Customer Provides:</strong> {service.customerProvides}</div>
                  <div>• <strong>What Happens Next:</strong> {service.whatHappensNext}</div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRequestQuote(service.title);
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-[#ff6a00] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                <span>Request Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Quote Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative border border-zinc-200">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#ff6a00] uppercase">
                {selectedService.badge}
              </span>
              <h3 className="text-2xl font-black text-zinc-950">{selectedService.title}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">{selectedService.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs font-mono">
              <div><strong>What Customer Provides:</strong></div>
              <div className="text-zinc-700">{selectedService.customerProvides}</div>
              <div className="pt-2"><strong>What Happens Next:</strong></div>
              <div className="text-zinc-700">{selectedService.whatHappensNext}</div>
            </div>

            <button
              onClick={() => handleRequestQuote(selectedService.title)}
              className="w-full py-3.5 rounded-xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp for Instant Quote</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-5xl relative">
          {onCloseModal && (
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {content}
        </div>
      </div>
    );
  }

  return content;
}
