"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { PROJECT_KITS, COLLEGES } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import {
  Boxes,
  Clock,
  Code,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Layers,
  Printer,
  Wrench,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Truck,
  Sparkles,
  Plus,
} from "lucide-react";

export default function ProjectKitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, selectedCollege, addToast } = useApp();

  const kit = PROJECT_KITS.find((k) => k.slug === resolvedParams.slug);
  if (!kit) {
    notFound();
  }

  // Selected addons map: key is addon name, value is boolean
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const addonsTotal = kit.optionalAddons.reduce((acc, addon) => {
    return selectedAddons[addon.name] ? acc + addon.price : acc;
  }, 0);

  const finalKitPrice = kit.price + addonsTotal;

  const handleOrderKit = () => {
    addToCart({ kit });
    addToast(`Project Kit with custom addons added to cart!`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3 h-3 text-neutral-600" />
        <Link href="/projects" className="hover:text-white">Project Kits</Link>
        <ChevronRight className="w-3 h-3 text-neutral-600" />
        <span className="text-white truncate max-w-sm">{kit.title}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Overview, Includes, Schematics (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative aspect-video w-full rounded-3xl bg-[#111111] border border-[#262626] overflow-hidden shadow-2xl">
            <Image
              src={kit.images[0]}
              alt={kit.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#ff6a00] text-black font-extrabold text-xs">
                {kit.difficulty} Level
              </span>
              <span className="px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white font-medium text-xs border border-neutral-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#ff6a00]" />
                <span>Build Time: {kit.buildTime}</span>
              </span>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="space-y-4">
            <div className="text-xs font-mono text-[#ff6a00] font-bold uppercase tracking-wider">
              {kit.category}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {kit.title}
            </h1>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {kit.description}
            </p>
          </div>

          {/* Included Hardware Checklist */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#ff6a00]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Hardware Components Included in Kit
                </h3>
              </div>
              <span className="text-xs text-[#22c55e] font-semibold">
                {kit.includes.length} items verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {kit.includes.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-[#161616] border border-[#222222] text-xs text-neutral-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Banner */}
          <div className="p-6 rounded-3xl bg-[#121212] border border-[#ff6a00]/20 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-[#ff6a00]" />
              <span>Digital Deliverables Included (Direct Download)</span>
            </h3>
            <div className="grid grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-[#181818] border border-[#262626] text-center">
                <div className="font-bold text-white">Full Source Code</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Arduino & PlatformIO</div>
              </div>
              <div className="p-3 rounded-xl bg-[#181818] border border-[#262626] text-center">
                <div className="font-bold text-white">Circuit Schematic</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">High-Res Wiring PDF</div>
              </div>
              <div className="p-3 rounded-xl bg-[#181818] border border-[#262626] text-center">
                <div className="font-bold text-white">Assembly Guide</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Step-by-step 24 pages</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Buy Box & Addons Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626] shadow-2xl space-y-6">
            {/* Price Header */}
            <div>
              <div className="text-xs text-neutral-400">Total Project Kit Investment</div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  ₹{finalKitPrice}
                </span>
                <span className="text-base text-neutral-500 line-through">
                  ₹{kit.mrp + addonsTotal}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#ff6a00]/20 text-[#ff6a00] border border-[#ff6a00]/40">
                  SAVE ₹{kit.mrp - kit.price}
                </span>
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                {addonsTotal > 0
                  ? `(Base kit ₹${kit.price} + ₹${addonsTotal} in custom add-ons)`
                  : "Base kit hardware + code + guides"}
              </div>
            </div>

            {/* Interactive Add-ons Configurator */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  Optional Upgrades & Add-ons:
                </label>
                <span className="text-[11px] text-[#ff6a00]">Customized for you</span>
              </div>

              <div className="space-y-2.5">
                {kit.optionalAddons.map((addon) => {
                  const isChecked = !!selectedAddons[addon.name];
                  return (
                    <div
                      key={addon.name}
                      onClick={() => toggleAddon(addon.name)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isChecked
                          ? "bg-[#ff6a00]/10 border-[#ff6a00] shadow-md shadow-[#ff6a00]/5"
                          : "bg-[#161616] border-[#262626] hover:border-[#333333]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 w-4 h-4 rounded border-[#262626] accent-[#ff6a00]"
                          />
                          <div>
                            <div className="text-xs font-bold text-white">{addon.name}</div>
                            <div className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                              {addon.description}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#ff6a00] shrink-0">
                          +₹{addon.price}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleOrderKit}
                className="w-full py-3.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Configured Kit to Cart (₹{finalKitPrice})</span>
              </button>

              <button
                onClick={() => {
                  handleOrderKit();
                  router.push("/checkout");
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2e2e2e] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Fast Campus Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Campus Dispatch Guarantee */}
            <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#222222] flex items-center gap-3 text-xs text-neutral-300">
              <Truck className="w-5 h-5 text-[#ff6a00] shrink-0" />
              <div>
                <div className="font-semibold text-white">Campus Delivery Guaranteed</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Delivered directly to {selectedCollege.name} within 24–48h
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
