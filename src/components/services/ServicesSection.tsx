"use client";

import React, { useState } from "react";
import { Layers, Printer, Cpu, Search, Laptop, Wrench, ArrowRight, X } from "lucide-react";

const SERVICES = [
  {
    id: "pcb",
    title: "PCB Manufacturing",
    subtitle: "From prototype to production.",
    cta: "Get Quote ->",
    icon: Layers,
    description: "Industrial 2-layer & 4-layer FR-4 double-sided printed circuit board fabrication with 100% electrical testing.",
  },
  {
    id: "3dprint",
    title: "3D Printing",
    subtitle: "Custom parts & enclosures.",
    cta: "Get Quote ->",
    icon: Printer,
    description: "Custom CAD enclosure 3D printing in tough ABS, PETG, and PLA for hardware product prototypes.",
  },
  {
    id: "prototypes",
    title: "Custom Prototypes",
    subtitle: "Turn your ideas into reality.",
    cta: "Get Quote ->",
    icon: Cpu,
    description: "Turn-key electronic prototype assembly, SMD component soldering, and microcontroller firmware loading.",
  },
  {
    id: "sourcing",
    title: "Project Sourcing",
    subtitle: "Rare parts & bulk orders.",
    cta: "Request ->",
    icon: Search,
    description: "Complete Bill-of-Materials (BOM) component sourcing for college project kits, labs, and volume production.",
  },
  {
    id: "laptop",
    title: "Laptop Parts & Repair",
    subtitle: "Genuine parts & support.",
    cta: "Explore ->",
    icon: Laptop,
    description: "Replacement laptop batteries, displays, cooling fans, keyboards, and DC jack power socket repairs.",
  },
  {
    id: "consulting",
    title: "Engineering Services",
    subtitle: "Design, development, consulting.",
    cta: "Explore ->",
    icon: Wrench,
    description: "Circuit schematic review, power efficiency optimization, and IoT wireless firmware debugging.",
  },
];

export function ServicesSection() {
  const [activeService, setActiveService] = useState<typeof SERVICES[0] | null>(null);

  const handleCTA = (title: string) => {
    window.open(`https://wa.me/917032635858?text=${encodeURIComponent(`Hi Partsly! I am interested in ${title}.`)}`, "_blank");
  };

  return (
    <section className="space-y-6 font-sans">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-950">Our Services</h2>
        <p className="text-xs text-slate-500 font-medium">
          More than just components. We help you build.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((service) => {
          const IconComp = service.icon;
          return (
            <div
              key={service.id}
              onClick={() => setActiveService(service)}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#ff6a00]/70 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100/90 text-slate-700 group-hover:bg-orange-100 group-hover:text-[#ff6a00] flex items-center justify-center font-bold transition-transform group-hover:scale-105">
                  <IconComp className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-950 text-base group-hover:text-[#ff6a00] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium pt-0.5">
                    {service.subtitle}
                  </p>
                </div>
              </div>

              <div className="text-xs font-bold text-[#ff6a00] group-hover:underline flex items-center gap-1">
                <span>{service.cta}</span>
              </div>
            </div>
          );
        })}
      </div>

      {activeService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 relative border border-slate-200">
            <button onClick={() => setActiveService(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-full cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-slate-950">{activeService.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{activeService.description}</p>

            <button
              onClick={() => handleCTA(activeService.title)}
              className="w-full py-3 bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Connect on WhatsApp for Instant Quote →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
