"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ProjectDropzone } from "@/components/projects/ProjectDropzone";
import {
  Sparkles,
  Layers,
  Cpu,
  Boxes,
  Wrench,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Truck,
  DollarSign,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function BuildMyProjectPage() {
  const router = useRouter();
  const { addToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [projectTitle, setProjectTitle] = useState<string>("Autonomous Obstacle Rover & Telemetry");
  const [projectDomain, setProjectDomain] = useState<string>("Robotics & IoT");
  const [selectedBuildLevel, setSelectedBuildLevel] = useState<string>("working_prototype");
  const [needPcb, setNeedPcb] = useState<boolean>(true);
  const [need3dPrint, setNeed3dPrint] = useState<boolean>(true);
  const [needDocs, setNeedDocs] = useState<boolean>(true);

  const buildLevels = [
    {
      id: "components_only",
      title: "Level 1: Components Only",
      subtitle: "Raw verified hardware delivered to your lab",
      price: 1499,
      icon: Cpu,
      features: [
        "100% bench-tested genuine components",
        "Exact quantities based on your BOM",
        "Free jumper wires & breadboard pack",
        "Dispatched in 24 hours",
      ],
    },
    {
      id: "project_kit",
      title: "Level 2: Project Kit + Code",
      subtitle: "Hardware + instructions + firmware",
      price: 2199,
      icon: Boxes,
      features: [
        "All Level 1 components included",
        "Pre-written Arduino / Python source code",
        "High-resolution wiring schematic diagram",
        "Step-by-step assembly & debugging guide",
      ],
    },
    {
      id: "working_prototype",
      title: "Level 3: Working Prototype",
      subtitle: "Assembled, soldered, flashed & tested by TechBox engineers",
      price: 3499,
      popular: true,
      icon: Wrench,
      features: [
        "Everything in Level 2 included",
        "Professional soldering and circuit fabrication",
        "Firmware flashed, calibrated & benchmarked",
        "Video verification proof before campus dispatch",
        "Zero-hassle guarantee for project viva review",
      ],
    },
    {
      id: "complete_build",
      title: "Level 4: Complete Turnkey Build",
      subtitle: "Working prototype + Custom PCB + 3D Enclosure + Final Documentation",
      price: 5299,
      icon: Layers,
      features: [
        "Everything in Level 3 included",
        "Custom double-layer manufactured PCB",
        "Custom CAD 3D-printed case/enclosure",
        "Full university project report (IEEE format)",
        "Presentation PPT slide deck + viva prep pack",
      ],
    },
  ];

  const activeLevel = buildLevels.find((l) => l.id === selectedBuildLevel) || buildLevels[2];

  // Dynamic add-ons calculation if Level 1 or 2 is picked
  const pcbAddon = needPcb && selectedBuildLevel !== "complete_build" ? 450 : 0;
  const printAddon = need3dPrint && selectedBuildLevel !== "complete_build" ? 550 : 0;
  const docAddon = needDocs && selectedBuildLevel !== "complete_build" ? 699 : 0;

  const totalCalculated = activeLevel.price + pcbAddon + printAddon + docAddon;

  const handleConfirmQuote = () => {
    addToast("Project Build Quote generated! Transferred to Campus Checkout.", "success");
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/25 text-[#ff6a00] text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Student Project Infrastructure</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          You have the idea. <span className="text-[#ff6a00]">We help build it.</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
          From schematic verification to custom PCB manufacturing, 3D enclosure printing, and working prototypes — configure exactly how much support you need.
        </p>

        {/* Step Progress Bar */}
        <div className="mt-8 flex items-center justify-center gap-3 text-xs font-semibold">
          <span
            className={`px-3 py-1.5 rounded-lg ${
              currentStep >= 1 ? "bg-[#ff6a00] text-black font-bold" : "bg-[#1c1c1c] text-neutral-500"
            }`}
          >
            01. Upload or Specify
          </span>
          <ArrowRight className="w-3 h-3 text-neutral-600" />
          <span
            className={`px-3 py-1.5 rounded-lg ${
              currentStep >= 2 ? "bg-[#ff6a00] text-black font-bold" : "bg-[#1c1c1c] text-neutral-500"
            }`}
          >
            02. Choose Build Level
          </span>
          <ArrowRight className="w-3 h-3 text-neutral-600" />
          <span
            className={`px-3 py-1.5 rounded-lg ${
              currentStep >= 3 ? "bg-[#ff6a00] text-black font-bold" : "bg-[#1c1c1c] text-neutral-500"
            }`}
          >
            03. Instant Quote & Dispatch
          </span>
        </div>
      </div>

      {/* Step 1: Upload or Document Drop */}
      <div className="mb-16">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-white">Step 1: Upload Project File or Synopsis</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Drag your IEEE abstract, circuit diagram, or list of parts below.
          </p>
        </div>

        <ProjectDropzone />
      </div>

      {/* Step 2: Choose Build Level */}
      <div className="mb-16 pt-10 border-t border-[#1f1f1f]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-mono text-[#ff6a00] font-bold uppercase tracking-wider">
            Step 2: Execution Tier
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Select Your Project Build Level
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Choose whether you only need the raw parts or want our engineering team to deliver a bench-tested working prototype.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {buildLevels.map((lvl) => {
            const isSelected = selectedBuildLevel === lvl.id;
            const Icon = lvl.icon;

            return (
              <div
                key={lvl.id}
                onClick={() => setSelectedBuildLevel(lvl.id)}
                className={`rounded-3xl p-6 border cursor-pointer transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? "bg-[#141414] border-[#ff6a00] shadow-2xl shadow-[#ff6a00]/10 scale-[1.02]"
                    : "bg-[#111111] border-[#222222] hover:border-[#333333]"
                }`}
              >
                {lvl.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#ff6a00] text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
                    Recommended for Capstone
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-[#ff6a00] text-black" : "bg-[#1c1c1c] text-[#ff6a00]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="text-[#ff6a00] font-bold text-xs">✓ Selected</span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{lvl.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-snug">{lvl.subtitle}</p>

                  <div className="mt-4 pt-4 border-t border-[#1e1e1e]">
                    <div className="text-2xl font-black text-white">₹{lvl.price}</div>
                    <span className="text-[10px] text-neutral-500">Estimated base cost</span>
                  </div>

                  <ul className="space-y-2 mt-4 text-xs text-neutral-300">
                    {lvl.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-[#1e1e1e]">
                  <button
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      isSelected
                        ? "bg-[#ff6a00] text-black"
                        : "bg-[#1c1c1c] text-neutral-300 hover:text-white"
                    }`}
                  >
                    {isSelected ? "Active Choice" : "Select Level"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Quotation Summary & Instant Campus Delivery */}
      <div className="pt-10 border-t border-[#1f1f1f]">
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#111111] border border-[#262626] p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
            <div>
              <div className="text-xs font-mono text-[#ff6a00] uppercase tracking-wider">
                Step 3: Verified Project Quotation
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Project Quote Summary</h3>
              <p className="text-xs text-neutral-400">
                Itemized breakdown based on selected {activeLevel.title}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-neutral-400 block">Total Est. Quote</span>
              <span className="text-3xl font-black text-[#ff6a00]">₹{totalCalculated}</span>
            </div>
          </div>

          <div className="py-6 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
              <span className="text-neutral-300 font-medium">Selected Tier: {activeLevel.title}</span>
              <span className="text-white font-bold">₹{activeLevel.price}</span>
            </div>
            {pcbAddon > 0 && (
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-300">Custom FR-4 2-Layer PCB Manufacturing</span>
                <span className="text-white font-bold">+₹{pcbAddon}</span>
              </div>
            )}
            {printAddon > 0 && (
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-300">3D-Printed Custom Sensor Enclosure</span>
                <span className="text-white font-bold">+₹{printAddon}</span>
              </div>
            )}
            {docAddon > 0 && (
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-300">Project Report & Presentation PPT Deck</span>
                <span className="text-white font-bold">+₹{docAddon}</span>
              </div>
            )}
            <div className="flex justify-between py-1 text-[#22c55e]">
              <span>Direct Campus Delivery (SRM / VIT / BITS)</span>
              <span className="font-bold">FREE</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
              <span>Full testing & code walkthrough guarantee included</span>
            </div>

            <button
              onClick={handleConfirmQuote}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all"
            >
              <span>Accept Quote & Order for Campus</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
