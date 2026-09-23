"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { getProjectKitBySlug, ProjectKit } from "@/lib/data";
import { useApp } from "@/context/AppContext";
import {
  Boxes,
  Clock,
  Code,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Truck,
} from "lucide-react";

export default function ProjectKitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, selectedCollege, addToast } = useApp();

  const [kit, setKit] = useState<ProjectKit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectKitBySlug(resolvedParams.slug)
      .then((k) => {
        setKit(k);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [resolvedParams.slug]);

  // Selected addons map: key is addon name, value is boolean
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!kit) {
    notFound();
  }

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const addonsTotal = (kit.optionalAddons || []).reduce((acc, addon) => {
    return selectedAddons[addon.name] ? acc + addon.price : acc;
  }, 0);

  const finalKitPrice = kit.price + addonsTotal;

  const handleOrderKit = () => {
    addToCart({ kit });
    addToast(`Project Kit with custom addons added to cart!`, "success");
  };

  return (
    <div className="bg-white min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#ff6a00] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/projects" className="hover:text-[#ff6a00] transition-colors">Project Kits</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-medium truncate max-w-sm">{kit.title}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Overview, Includes, Schematics (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-video w-full rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shadow-xs">
              <Image
                src={kit.images[0] || "/banners/banner-kits.jpg"}
                alt={kit.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#ff6a00] text-white font-extrabold text-xs shadow-xs">
                  {kit.difficulty} Level
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-800 font-medium text-xs border border-slate-200 flex items-center gap-1 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span>Build Time: {kit.buildTime}</span>
                </span>
              </div>
            </div>

            {/* Description & Overview */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#ff6a00] font-bold uppercase tracking-wider">
                {kit.category}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {kit.title}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                {kit.description}
              </p>
            </div>

            {/* Included Hardware Checklist */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-[#ff6a00]" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Hardware Components Included in Kit
                  </h3>
                </div>
                <span className="text-xs text-emerald-700 font-bold">
                  {kit.includes.length} items verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {kit.includes.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables Banner */}
            <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-[#ff6a00]" />
                <span>Digital Deliverables Included (Direct Download)</span>
              </h3>
              <div className="grid grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-white border border-orange-200/80 text-center shadow-2xs">
                  <div className="font-bold text-slate-900">Full Source Code</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Arduino & PlatformIO</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-orange-200/80 text-center shadow-2xs">
                  <div className="font-bold text-slate-900">Circuit Schematic</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">High-Res Wiring PDF</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-orange-200/80 text-center shadow-2xs">
                  <div className="font-bold text-slate-900">Assembly Guide</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Step-by-step 24 pages</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Buy Box & Addons Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              {/* Price Header */}
              <div>
                <div className="text-xs text-slate-500">Total Project Kit Investment</div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    ₹{finalKitPrice}
                  </span>
                  <span className="text-base text-slate-400 line-through">
                    ₹{kit.mrp + addonsTotal}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-[#ff6a00] border border-orange-200">
                    SAVE ₹{kit.mrp - kit.price}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {addonsTotal > 0
                    ? `(Base kit ₹${kit.price} + ₹${addonsTotal} in custom add-ons)`
                    : "Base kit hardware + code + guides"}
                </div>
              </div>

              {/* Interactive Add-ons Configurator */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Optional Upgrades & Add-ons:
                  </label>
                  <span className="text-[11px] text-[#ff6a00] font-semibold">Customized for you</span>
                </div>

                <div className="space-y-2.5">
                  {(kit.optionalAddons || []).map((addon) => {
                    const isChecked = !!selectedAddons[addon.name];
                    return (
                      <div
                        key={addon.name}
                        onClick={() => toggleAddon(addon.name)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? "bg-orange-50 border-[#ff6a00] shadow-xs"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#ff6a00]"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-900">{addon.name}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
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
                  className="w-full py-3.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#ff6a00]/20 transition-all cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Configured Kit to Cart (₹{finalKitPrice})</span>
                </button>

                <button
                  onClick={() => {
                    handleOrderKit();
                    router.push("/checkout");
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Fast Campus Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Campus Dispatch Guarantee */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-700">
                <Truck className="w-5 h-5 text-[#ff6a00] shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">Campus Runner Delivery</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Direct runner handover at {selectedCollege.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
