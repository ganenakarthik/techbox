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
  CheckCircle2,
} from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { ProjectDropzone } from "@/components/projects/ProjectDropzone";
import { HeroBannerSlider } from "@/components/home/HeroBannerSlider";
import { getProducts, getProjectKits } from "@/lib/data";

export default async function HomePage() {
  const featuredProducts = await getProducts({ limit: 8 });
  const featuredKits = (await getProjectKits()).slice(0, 4);

  // Amazon Quad Grid Categories Data
  const quadDevBoards = [
    { name: "Arduino Uno R3", img: "/products/arduino-uno.jpg", href: "/shop?search=Arduino" },
    { name: "ESP32 Wi-Fi + BLE", img: "/products/esp32-devkit.jpg", href: "/shop?search=ESP32" },
    { name: "Raspberry Pi Pico W", img: "/products/rpi-pico-w.jpg", href: "/shop?search=Pico" },
    { name: "L298N Motor Driver", img: "/products/l298n-driver.jpg", href: "/shop?search=L298N" },
  ];

  const quadSensors = [
    { name: "Ultrasonic HC-SR04", img: "/products/hc-sr04.jpg", href: "/shop?search=HC-SR04" },
    { name: "SG90 Micro Servo", img: "/products/sg90-servo.jpg", href: "/shop?search=Servo" },
    { name: "0.96\" I2C OLED Display", img: "/products/oled-display.jpg", href: "/shop?search=OLED" },
    { name: "5V Single Relay Module", img: "/products/relay-module.jpg", href: "/shop?search=Relay" },
  ];

  const quadProjectKits = [
    { name: "IoT Smart Agriculture", img: "/banners/banner-kits.jpg", href: "/projects" },
    { name: "Obstacle Avoidance Robot", img: "/banners/banner-kits.jpg", href: "/projects" },
    { name: "Smart Home Automation", img: "/banners/banner-kits.jpg", href: "/projects" },
    { name: "Health Monitoring Band", img: "/banners/banner-kits.jpg", href: "/projects" },
  ];

  const quadServices = [
    { name: "Custom PCB Prototyping", icon: Layers, href: "/services/pcb", desc: "1-4 Layer FR-4" },
    { name: "3D Sensor Enclosures", icon: Printer, href: "/services/3d-printing", desc: "Tough PLA/PETG" },
    { name: "Working Prototype Lab", icon: Wrench, href: "/services/prototypes", desc: "Assembly & Flash" },
    { name: "Project Documentation", icon: FileText, href: "/services/documents", desc: "IEEE & Viva Decks" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#eaeded] text-slate-900 selection:bg-[#ff6a00] selection:text-white">
      {/* 1. HERO BANNER SLIDESHOW WITH BOTTOM FADE */}
      <HeroBannerSlider />

      {/* 2. AMAZON-STYLE 4-CARD QUAD GRID OVERLAPPING HERO */}
      <div className="mt-3 sm:-mt-24 md:-mt-36 relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Quad Card 1: Development Boards */}
          <div className="bg-white p-5 rounded-sm shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight mb-3">
                Microcontrollers & Dev Boards
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quadDevBoards.map((item) => (
                  <Link key={item.name} href={item.href} className="group block text-center">
                    <div className="relative aspect-square w-full bg-slate-50 border border-slate-100 rounded-sm overflow-hidden mb-1.5 group-hover:opacity-90">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="140px"
                        className="object-contain p-2 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] text-slate-700 font-medium line-clamp-1 group-hover:text-[#ff6a00] transition-colors">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/shop?category=development-boards"
              className="text-xs font-semibold text-[#ff6a00] hover:text-[#ea580c] hover:underline mt-4 inline-block"
            >
              See all development boards
            </Link>
          </div>

          {/* Quad Card 2: Sensors & Modules */}
          <div className="bg-white p-5 rounded-sm shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight mb-3">
                Essential Sensors & Modules
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quadSensors.map((item) => (
                  <Link key={item.name} href={item.href} className="group block text-center">
                    <div className="relative aspect-square w-full bg-slate-50 border border-slate-100 rounded-sm overflow-hidden mb-1.5 group-hover:opacity-90">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="140px"
                        className="object-contain p-2 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] text-slate-700 font-medium line-clamp-1 group-hover:text-[#ff6a00] transition-colors">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/shop?category=sensors-modules"
              className="text-xs font-semibold text-[#ff6a00] hover:text-[#ea580c] hover:underline mt-4 inline-block"
            >
              Explore all sensors
            </Link>
          </div>

          {/* Quad Card 3: Ready Project Kits */}
          <div className="bg-white p-5 rounded-sm shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight mb-3">
                Ready Capstone Project Kits
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quadProjectKits.map((item) => (
                  <Link key={item.name} href={item.href} className="group block text-center">
                    <div className="relative aspect-square w-full bg-slate-50 border border-slate-100 rounded-sm overflow-hidden mb-1.5 group-hover:opacity-90">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="140px"
                        className="object-contain p-2 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] text-slate-700 font-medium line-clamp-1 group-hover:text-[#ff6a00] transition-colors">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-[#ff6a00] hover:text-[#ea580c] hover:underline mt-4 inline-block"
            >
              Browse all project kits
            </Link>
          </div>

          {/* Quad Card 4: Engineering Services */}
          <div className="bg-white p-5 rounded-sm shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight mb-3">
                Campus Engineering Services
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quadServices.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href} className="group block text-center">
                      <div className="aspect-square w-full bg-slate-50 border border-slate-100 rounded-sm flex flex-col items-center justify-center p-2 mb-1.5 group-hover:bg-orange-50/50 group-hover:border-orange-200 transition-colors">
                        <Icon className="w-7 h-7 text-[#ff6a00] mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                      </div>
                      <span className="text-[11px] text-slate-700 font-medium line-clamp-1 group-hover:text-[#ff6a00] transition-colors">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <Link
              href="/services/pcb"
              className="text-xs font-semibold text-[#ff6a00] hover:text-[#ea580c] hover:underline mt-4 inline-block"
            >
              View fabrication hub
            </Link>
          </div>
        </div>
      </div>

      {/* 3. AMAZON FULL-WIDTH SHELF: TODAY'S DEALS IN ELECTRONICS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 w-full">
        <div className="bg-white p-5 sm:p-6 rounded-sm shadow-xs border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-5 gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Today&apos;s Deals in Electronic Components
              </h2>
              <span className="px-2.5 py-0.5 rounded-xs bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                ⚡ 10-30 MIN CAMPUS DISPATCH
              </span>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#ff6a00] hover:text-[#ea580c] hover:underline flex items-center gap-1"
            >
              <span>See all deals</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">
              Featured components will display here.
            </div>
          )}
        </div>
      </div>

      {/* 4. AMAZON SHELF: CAPSTONE & MINI PROJECT KITS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 w-full">
        <div className="bg-white p-5 sm:p-6 rounded-sm shadow-xs border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-5 gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Turnkey Engineering Capstone Kits
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete pre-tested hardware + full source code + circuit schematics + viva defense PPT
              </p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-[#ff6a00] hover:text-[#ea580c] hover:underline flex items-center gap-1"
            >
              <span>See all project kits</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {featuredKits.map((kit) => (
              <div
                key={kit.id}
                className="rounded-sm bg-white border border-slate-200 hover:border-orange-400 transition-all flex flex-col justify-between overflow-hidden group shadow-2xs hover:shadow-md"
              >
                <div>
                  <div className="relative aspect-video w-full bg-slate-50 overflow-hidden border-b border-slate-100">
                    <Image
                      src={kit.images[0] || "/banners/banner-kits.jpg"}
                      alt={kit.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-xs bg-white text-[10px] font-bold text-[#ff6a00] border border-orange-200 shadow-2xs">
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
                        <span>Full verified source code & schematics</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Zero-DOA bench tested on campus</span>
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
                    <span className="text-xs font-bold text-emerald-700">Save ₹{kit.mrp - kit.price}</span>
                  </div>

                  <Link
                    href={`/projects/${kit.slug}`}
                    className="w-full py-2 px-3 rounded-sm bg-[#ff6a00] hover:bg-[#ea580c] active:bg-[#d95b00] text-white border border-[#ff6a00] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>View Kit Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. BOM SCANNER & DROPZONE IN CLEAN WHITE CARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 w-full">
        <div className="bg-white p-5 sm:p-8 rounded-sm shadow-xs border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6a00] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart BOM & Circuit Matcher</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Have a Circuit Diagram or Component BOM List?
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Upload your circuit schematic, parts list image, or Excel BOM. Our catalog engine cross-references live campus stock to build your 1-click cart.
            </p>
          </div>

          <ProjectDropzone />
        </div>
      </div>

      {/* 6. TRUST & QUALITY PILLARS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 w-full">
        <div className="bg-white p-6 rounded-sm shadow-xs border border-slate-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5 border border-emerald-200">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">10-30m Campus Delivery</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Direct to your hostel gate or lab</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-2.5 border border-blue-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">100% Tested Zero-DOA</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Every IC power tested before dispatch</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-2.5 border border-amber-200">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Code & Schematics</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Verified pinout guides & scripts</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-[#ff6a00] flex items-center justify-center mb-2.5 border border-orange-200">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">UPI & Campus Cash</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Zero payment friction for students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
