"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  ArrowRight,
  UploadCloud,
  Cpu,
  Boxes,
  Layers,
  Wrench,
  Printer,
  FileText,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Star,
  ShoppingBag,
  Clock,
  Code,
  MapPin,
  ChevronRight,
  Users,
} from "lucide-react";
import { PRODUCTS, PROJECT_KITS, CATEGORIES } from "@/data/mockData";
import { ProductCard } from "@/components/products/ProductCard";
import { ProjectDropzone } from "@/components/projects/ProjectDropzone";

export default function HomePage() {
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const featuredProducts = PRODUCTS.slice(0, 8);
  const featuredKits = PROJECT_KITS.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-[#080808] text-white selection:bg-[#ff6a00] selection:text-black">
      {/* 1. HERO SECTION - 5-SECOND PROJECT FIRST HOOK */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden border-b border-[#1f1f1f]">
        {/* Subtle high-tech ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[350px] bg-[#ff6a00]/[0.07] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Campus Active Pill - cleanly positioned at top of hero */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#2a2a2a] text-xs text-neutral-300 mb-6 shadow-md shadow-black/40">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span>Campus & Hostel Delivery Active</span>
              <strong className="text-white font-semibold">Across Engineering Institutes</strong>
            </div>

            {/* Main Statement with enhanced kerning & line spacing */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.16]">
              Building a college project?{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] via-[#ff8533] to-[#ffb380] block mt-2 sm:mt-2.5">
                We&apos;ll figure out what you need.
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-5 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Upload your project PDF, circuit schematic, or component list. Get verified parts, custom PCBs, 3D enclosures, and working prototypes — delivered directly to your campus.
            </p>

            {/* CTA Group with Drag-and-Drop Hint */}
            <div className="mt-8 flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
                <button
                  onClick={scrollToUpload}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <UploadCloud className="w-4 h-4 text-black" />
                  <span>Upload Project File</span>
                </button>

                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#171717] hover:bg-[#222222] border border-[#2e2e2e] hover:border-neutral-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Cpu className="w-4 h-4 text-[#ff6a00]" />
                  <span>Shop Components</span>
                </Link>
              </div>

              {/* Upload CTA Expectation Hint */}
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-3 font-medium tracking-wide">
                <Sparkles className="w-3 h-3 text-[#ff6a00] shrink-0" />
                <span>Supports PDF, KiCad, Schematics, BOM CSV up to 25MB • Instant matching</span>
              </div>
            </div>

            {/* Social Proof / Hardware Compatibility Strip */}
            <div className="mt-8 pt-6 border-t border-[#1a1a1a] flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
              <span className="text-neutral-500 text-[11px] font-semibold uppercase tracking-wider mr-1">
                Engineered For:
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#121212] border border-[#222222] text-neutral-300 font-mono text-[11px]">
                Arduino
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#121212] border border-[#222222] text-neutral-300 font-mono text-[11px]">
                ESP32 / NodeMCU
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#121212] border border-[#222222] text-neutral-300 font-mono text-[11px]">
                Raspberry Pi
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#121212] border border-[#222222] text-neutral-300 font-mono text-[11px]">
                STM32
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#121212] border border-[#222222] text-neutral-300 font-mono text-[11px]">
                KiCad & EasyEDA
              </span>
            </div>

            {/* Quick Micro-Stats */}
            <div className="mt-8 pt-6 border-t border-[#1a1a1a] grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">2,000+</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Verified Lab Parts</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#ff6a00]">24–48h</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Campus Delivery</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">500+</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Projects Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 6-STEP VALUE CHAIN BANNER */}
      <section className="bg-[#0e0e0e] border-b border-[#222222] py-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-max md:min-w-0">
          <div className="flex items-center justify-between gap-4 text-xs font-semibold">
            <span className="text-[#ff6a00] font-black uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-[#ff6a00]" /> Student Engine:
            </span>

            {[
              { label: "Components", href: "/shop" },
              { label: "Project Kits", href: "/projects" },
              { label: "PCB Manufacturing", href: "/services/pcb" },
              { label: "Working Prototype", href: "/services/prototypes" },
              { label: "Documentation", href: "/services/documents" },
              { label: "Campus Delivery", href: "/checkout" },
            ].map((step, idx) => (
              <React.Fragment key={step.label}>
                <Link
                  href={step.href}
                  className="text-neutral-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span className="text-[#ff6a00] font-mono text-[11px]">0{idx + 1}.</span>
                  <span>{step.label}</span>
                </Link>
                {idx < 5 && <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FLAGSHIP PROJECT DROPZONE & ANALYZER */}
      <section ref={uploadSectionRef} className="py-16 md:py-24 bg-[#0a0a0a] border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ff6a00]/10 border border-[#ff6a00]/25 text-[#ff6a00] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flagship Feature</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              BOM & Document Analyzer
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Drag and drop any circuit PDF, parts list image, or Excel BOM. Our multi-stage engine cross-references live inventory to build your kit.
            </p>
          </div>

          {/* Interactive Dropzone Component */}
          <ProjectDropzone />
        </div>
      </section>

      {/* 4. DUAL FAST TRACKS: SHOP PARTS vs BUILD PROJECT */}
      <section className="py-16 bg-[#080808] border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Shop Parts */}
            <div className="rounded-3xl bg-[#111111] border border-[#262626] p-8 flex flex-col justify-between group hover:border-neutral-500 transition-all relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] flex items-center justify-center text-[#ff6a00]">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#ff6a00] uppercase tracking-wider">Fast-Track 01</span>
                  <h3 className="text-2xl font-bold text-white mt-1">Shop Individual Components</h3>
                  <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                    Over 2,000+ bench-tested microcontrollers, ultrasonic sensors, relays, OLEDs, DuPont wires, and soldering gear with verified datasheets.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {CATEGORIES.slice(0, 4).map((c) => (
                    <span
                      key={c.id}
                      className="px-2.5 py-1 rounded-lg bg-[#181818] border border-[#2a2a2a] text-xs text-neutral-300"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#1f1f1f]">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#ff6a00] transition-colors"
                >
                  <span>Browse Components Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2: Build Project */}
            <div className="rounded-3xl bg-[#111111] border border-[#ff6a00]/30 p-8 flex flex-col justify-between group hover:border-[#ff6a00] transition-all relative overflow-hidden bg-gradient-to-br from-[#111111] to-[#1a120b]">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#ff6a00]/15 border border-[#ff6a00]/30 flex items-center justify-center text-[#ff6a00]">
                  <Boxes className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff6a00] text-black mb-1">
                    MOST POPULAR FOR SENIORS
                  </div>
                  <h3 className="text-2xl font-bold text-white">Build My Project Configurator</h3>
                  <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
                    Pick your build level: from components-only kits to custom fabricated PCBs, 3D enclosures, and fully bench-tested working prototypes.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300 pt-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6a00]" />
                    <span>Components Only</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6a00]" />
                    <span>Project Kit + Code</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6a00]" />
                    <span>Working Prototype</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6a00]" />
                    <span>PCB + Enclosure + PPT</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#2e2216]">
                <Link
                  href="/build"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#ff6a00] group-hover:text-white transition-colors"
                >
                  <span>Launch 4-Level Build Configurator</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEET THE FOUNDERS SPOTLIGHT */}
      <section className="py-16 bg-[#0a0a0a] border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 md:p-12 rounded-3xl bg-[#111111] border border-[#262626] flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ff6a00]/10 text-[#ff6a00] text-xs font-bold">
                <Users className="w-4 h-4" />
                <span>The Minds Behind Partsly</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Built by Engineers Who Faced the Same Struggles.
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Partsly was created by hardware engineers and researchers to solve the painful experience of sourcing electronics and building final-year projects in college. We guarantee authentic hardware, verified code, and direct campus delivery.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#ff6a00] hover:text-[#ff7a1a] transition-colors"
                >
                  <span>Read Founder Story & Team Profiles</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 w-full lg:w-auto max-w-md shrink-0">
              <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#2a2a2a] hover:border-[#ff6a00]/40 transition-colors">
                <div className="text-sm font-bold text-white">Vara Prasad</div>
                <div className="text-[10px] text-[#ff6a00] font-mono mt-0.5 font-semibold">Founder & CEO</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#2a2a2a] hover:border-[#ff6a00]/40 transition-colors">
                <div className="text-sm font-bold text-white">Mallikarjun</div>
                <div className="text-[10px] text-[#ff6a00] font-mono mt-0.5 font-semibold">Co-Founder & Hardware</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#262626] hover:border-[#ff6a00]/30 transition-colors">
                <div className="text-sm font-bold text-white">Nageshwara Rao</div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Chief Operating Officer (COO)</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#262626] hover:border-[#ff6a00]/30 transition-colors">
                <div className="text-sm font-bold text-white">Karthik</div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Tech Lead</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#262626] hover:border-[#ff6a00]/30 transition-colors">
                <div className="text-sm font-bold text-white">Bhanu & Kundhan</div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Software Engineering</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#262626] hover:border-[#ff6a00]/30 transition-colors">
                <div className="text-sm font-bold text-white">Lokesh</div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Hardware & Lab QA</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#262626] hover:border-[#ff6a00]/30 transition-colors col-span-2">
                <div className="text-sm font-bold text-white">Nikrosh</div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Growth & Marketing Lead</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED PROJECT KITS */}
      <section className="py-16 md:py-20 bg-[#0a0a0a] border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#ff6a00] uppercase tracking-wider">
                Turnkey Engineering Builds
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Popular College Project Kits
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Pre-tested hardware + circuit diagrams + source code + presentation guides.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6a00] hover:text-[#ff7a1a] transition-colors"
            >
              <span>View All 8+ Project Kits</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredKits.map((kit) => (
              <div
                key={kit.id}
                className="rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#ff6a00]/40 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
              >
                <div>
                  <div className="relative aspect-video w-full bg-[#161616] overflow-hidden">
                    <Image
                      src={kit.images[0]}
                      alt={kit.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-[#ff6a00] border border-[#ff6a00]/30">
                      {kit.difficulty}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
                      <span>{kit.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#ff6a00]" />
                        <span>{kit.buildTime}</span>
                      </span>
                    </div>

                    <Link href={`/projects/${kit.slug}`}>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#ff6a00] transition-colors line-clamp-2 leading-snug">
                        {kit.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                      {kit.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-[#1c1c1c] space-y-1 text-[11px] text-neutral-400">
                      <div className="flex items-center gap-1 text-neutral-300">
                        <Code className="w-3 h-3 text-[#ff6a00]" />
                        <span>Includes full source code & schematics</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-300">
                        <ShieldCheck className="w-3 h-3 text-[#22c55e]" />
                        <span>Pre-tested before campus dispatch</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-white">₹{kit.price}</span>
                      <span className="text-xs text-neutral-500 line-through">₹{kit.mrp}</span>
                    </div>
                    <span className="text-xs font-bold text-[#22c55e]">Save ₹{kit.mrp - kit.price}</span>
                  </div>

                  <Link
                    href={`/projects/${kit.slug}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#1c1c1c] hover:bg-[#ff6a00] text-white hover:text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Kit Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TRENDING LAB COMPONENTS CATALOG */}
      <section className="py-16 md:py-20 bg-[#080808] border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#ff6a00] uppercase tracking-wider">
                Lab-Grade Electronics
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Trending College Hardware & Sensors
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Genuine silicon, pin-inspected, and breadboard-ready.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              <Link
                href="/shop"
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#ff6a00] text-black"
              >
                All
              </Link>
              {CATEGORIES.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white border border-[#262626] transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#141414] hover:bg-[#1c1c1c] border border-[#2a2a2a] text-white text-xs font-bold transition-all"
            >
              <span>Explore All 2,000+ Electronic Components</span>
              <ArrowRight className="w-4 h-4 text-[#ff6a00]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. CUSTOM ENGINEERING SERVICES HUB */}
      <section className="py-16 md:py-24 bg-[#0c0c0c] border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#ff6a00] uppercase tracking-wider">
              Beyond Just Retail
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mt-1">
              Engineering Services for Senior Projects
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400">
              Partsly manages fabrication, assembly, and presentation materials for college mini and capstone projects.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1: PCB */}
            <Link
              href="/services/pcb"
              className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#ff6a00]/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#ff6a00] mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#ff6a00] transition-colors">
                PCB Manufacturing
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Upload Gerber files. 1, 2, or 4-layer FR-4 boards with custom solder mask colors and HASL/ENIG finishes.
              </p>
              <div className="mt-4 text-xs font-semibold text-[#ff6a00] flex items-center gap-1">
                <span>Instant PCB Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Service 2: 3D Printing */}
            <Link
              href="/services/3d-printing"
              className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#ff6a00]/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#ff6a00] mb-4 group-hover:scale-105 transition-transform">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#ff6a00] transition-colors">
                3D Print Enclosures
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Upload STL/OBJ/STEP files. Durable PLA, ABS, PETG, and high-detail Resin for custom sensor brackets and robot chassis.
              </p>
              <div className="mt-4 text-xs font-semibold text-[#ff6a00] flex items-center gap-1">
                <span>Instant 3D Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Service 3: Working Prototype */}
            <Link
              href="/services/prototypes"
              className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#ff6a00]/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#ff6a00] mb-4 group-hover:scale-105 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#ff6a00] transition-colors">
                Working Prototype
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Don&apos;t have time to debug erratic solder joints before review? We assemble, flash firmware, and QA test the hardware.
              </p>
              <div className="mt-4 text-xs font-semibold text-[#ff6a00] flex items-center gap-1">
                <span>Request Prototype</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Service 4: Documentation */}
            <Link
              href="/services/documents"
              className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#ff6a00]/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#ff6a00] mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#ff6a00] transition-colors">
                Project Documentation
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Professional IEEE reports, viva presentation PPT decks, architecture flowcharts, and circuit schematic prints.
              </p>
              <div className="mt-4 text-xs font-semibold text-[#ff6a00] flex items-center gap-1">
                <span>View Documentation Kits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
