import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Layers,
  Wrench,
  Printer,
  FileText,
  Truck,
  ShieldCheck,
  Sparkles,
  Zap,
  Clock,
  Code,
} from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { ProjectDropzone } from "@/components/projects/ProjectDropzone";
import { HeroBannerSlider } from "@/components/home/HeroBannerSlider";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  // Graceful DB fetch — falls back to empty arrays if DB not connected (safe for Vercel cold start)
  let featuredProducts: any[] = [];
  let featuredKits: any[] = [];

  try {
    const prismaProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      take: 8,
      include: {
        brand: true,
        category: true,
        variants: {
          include: {
            inventory: true,
          },
        },
      },
    });

    featuredProducts = prismaProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand.name,
      category: p.category.name,
      description: p.description,
      details: p.details || "",
      specs: (typeof p.specs === "object" && p.specs !== null ? p.specs : {}) as Record<string, string>,
      pinoutUrl: p.pinoutUrl || undefined,
      datasheetUrl: p.datasheetUrl || undefined,
      rating: p.rating,
      reviewCount: p.reviewCount,
      isFeatured: p.isFeatured,
      isBestseller: p.isBestseller,
      images: Array.isArray(p.images) ? (p.images as string[]) : [],
      tags: [],
      variants: p.variants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: Number(v.price),
        mrp: Number(v.mrp),
        discount: v.discount,
        stock: v.inventory?.available || 0,
      })),
    }));

    const prismaKits = await prisma.projectKit.findMany({ take: 4 });
    featuredKits = prismaKits.map((k) => ({
      id: k.id,
      title: k.title,
      slug: k.slug,
      category: k.category,
      difficulty: k.difficulty as any,
      buildTime: k.buildTime,
      price: Number(k.price),
      mrp: Number(k.mrp),
      description: k.description,
      circuitDiagramUrl: k.circuitDiagramUrl || undefined,
      sourceCodeUrl: k.sourceCodeUrl || undefined,
      assemblyGuideUrl: k.assemblyGuideUrl || undefined,
      includes: Array.isArray(k.includes) ? (k.includes as string[]) : [],
      optionalAddons: Array.isArray(k.optionalAddons) ? (k.optionalAddons as any[]) : [],
      images: Array.isArray(k.images) ? (k.images as string[]) : [],
      rating: 4.8,
      reviewsCount: 0,
    }));
  } catch (e) {
    // DB not available (Vercel preview / no DATABASE_URL set) — page renders without products
    console.warn("DB fetch failed on homepage, rendering without products:", e);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-[#ff6a00] selection:text-slate-900">
      {/* 1. CLEAN FULL-WIDTH PHOTOGRAPHY BANNER SLIDESHOW */}
      <HeroBannerSlider />

      {/* 4. POPULAR COLLEGE COMPONENTS & SENSORS (Blinkit-style Instant Add Cards) */}
      <section className="py-10 sm:py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200">
                  ⚡ 10-30 MIN CAMPUS DISPATCH
                </span>
                <span className="text-xs text-slate-500 font-medium">Zero-DOA Bench Tested</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Popular College Components & Sensors
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Genuine microcontrollers, ultrasonic sensors, servos, OLEDs, and relays ready for fast campus delivery.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/shop"
                className="px-4 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-slate-900 text-xs font-black transition-all shadow-sm shadow-[#ff6a00]/25 flex items-center gap-1.5"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Product Grid with Blinkit Quantity Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-[#ff6a00] text-slate-800 text-xs font-bold transition-all shadow-2xs"
            >
              <span>Explore All 2,000+ Electronic Components in Stock</span>
              <ArrowRight className="w-4 h-4 text-[#ff6a00]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. READY-TO-BUILD COLLEGE PROJECT KITS */}
      <section className="py-10 sm:py-16 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-[#ff6a00] uppercase tracking-wider">
                Turnkey Engineering Builds
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 tracking-tight">
                Ready-to-Assemble Capstone Project Kits
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pre-tested hardware + circuit schematics + full source code + IEEE project presentation decks.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6a00] hover:text-[#ea580c] transition-colors"
            >
              <span>View All Project Kits</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredKits.map((kit) => (
              <div
                key={kit.id}
                className="rounded-2xl bg-white border border-slate-200 hover:border-[#ff6a00] transition-all flex flex-col justify-between overflow-hidden group shadow-2xs hover:shadow-lg"
              >
                <div>
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                    <Image
                      src={kit.images[0] || "/banners/banner-kits.jpg"}
                      alt={kit.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-bold text-[#ff6a00] border border-orange-200 shadow-2xs">
                      {kit.difficulty}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                      <span className="font-semibold uppercase text-[10px] text-slate-500">{kit.category}</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-3 h-3 text-[#ff6a00]" />
                        <span>{kit.buildTime}</span>
                      </span>
                    </div>

                    <Link href={`/projects/${kit.slug}`}>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#ff6a00] transition-colors line-clamp-2 leading-snug">
                        {kit.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {kit.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Code className="w-3 h-3 text-[#ff6a00]" />
                        <span>Includes full code & schematics</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Pre-tested before campus dispatch</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex items-baseline justify-between mb-3 pt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900">₹{kit.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{kit.mrp}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Save ₹{kit.mrp - kit.price}</span>
                  </div>

                  <Link
                    href={`/projects/${kit.slug}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-[#ff6a00] text-[#ff6a00] hover:text-slate-900 border border-orange-200 hover:border-[#ff6a00] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
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

      {/* 6. PROPER BOM & CIRCUIT SCANNER SECTION */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6a00] text-xs font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant BOM & Circuit Matcher</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Have a Circuit Diagram or Parts List?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Drag and drop any circuit PDF, parts list image, or Excel BOM. Our multi-stage catalog engine cross-references live inventory to build your 1-click cart.
            </p>
          </div>

          {/* Interactive Dropzone Scanner */}
          <ProjectDropzone />
        </div>
      </section>

      {/* 7. CUSTOM FABRICATION SERVICES */}
      <section className="py-12 sm:py-16 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#ff6a00] uppercase tracking-wider">
              Beyond Just Retail
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Fabrication & Senior Capstone Hub
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              partsly manages custom fabrication, assembly, and presentation materials for engineering mini and major capstone projects.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/services/pcb"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#ff6a00] hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00] mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#ff6a00] transition-colors">
                PCB Manufacturing
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Upload Gerber files. 1, 2, or 4-layer FR-4 boards with custom solder mask colors and HASL/ENIG finishes.
              </p>
              <div className="mt-4 text-xs font-bold text-[#ff6a00] flex items-center gap-1">
                <span>Instant PCB Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/services/3d-printing"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#ff6a00] hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00] mb-4 group-hover:scale-105 transition-transform">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#ff6a00] transition-colors">
                3D Sensor Enclosures
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Upload STL or STEP files. Precision FDM & SLA prints in tough PLA, PETG, ABS, and Resin for chassis & cases.
              </p>
              <div className="mt-4 text-xs font-bold text-[#ff6a00] flex items-center gap-1">
                <span>Instant 3D Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/services/prototypes"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#ff6a00] hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00] mb-4 group-hover:scale-105 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#ff6a00] transition-colors">
                Working Prototypes
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Our embedded hardware engineers assemble, solder, flash firmware, and bench-test your prototype.
              </p>
              <div className="mt-4 text-xs font-bold text-[#ff6a00] flex items-center gap-1">
                <span>Request Lab Assembly</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/services/documents"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#ff6a00] hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00] mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#ff6a00] transition-colors">
                Project Documentation
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Complete IEEE-standard reports, circuit block diagrams, flowcharts, and technical viva-voce decks.
              </p>
              <div className="mt-4 text-xs font-bold text-[#ff6a00] flex items-center gap-1">
                <span>Generate Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. TRUST & QUALITY PILLARS */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-slate-900">10-30m Campus Delivery</h4>
              <p className="text-xs text-slate-500 mt-1">Direct to your hostel gate or lab</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-slate-900">100% Tested Zero-DOA</h4>
              <p className="text-xs text-slate-500 mt-1">Every IC power tested before dispatch</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Code & Schematics</h4>
              <p className="text-xs text-slate-500 mt-1">Free pinout guides and Arduino scripts</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ff6a00] flex items-center justify-center mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-slate-900">UPI & Cash on Campus</h4>
              <p className="text-xs text-slate-500 mt-1">Zero payment friction for students</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
