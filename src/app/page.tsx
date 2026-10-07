"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { COMPONENTS_CATALOG } from "@/data/componentsCatalog";
import { useCart } from "@/context/CartContext";

const heroSlides = [
  {
    eyebrow: "Factory Direct Hardware Supply",
    title: "Build without bottlenecks.",
    subtitle: "Over 50,000+ genuine microcontrollers, sensors, passive components & ICs in ready stock.",
    photo: "/hero-team.jpg",
    ctaText: "Shop Catalog",
    ctaLink: "/catalog",
  },
  {
    eyebrow: "Express Rapid Prototyping",
    title: "Custom PCB Fab in 24 Hours.",
    subtitle: "Upload Gerber files for instant 2-layer & 4-layer FR-4 circuit board quotes.",
    photo: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=90",
    ctaText: "Instant PCB Quote",
    ctaLink: "/pcb",
  },
  {
    eyebrow: "On-Demand Manufacturing",
    title: "3D Printing & Custom Parts.",
    subtitle: "High precision PLA, PETG, ABS & SLA Tough Resin enclosures for hardware startups.",
    photo: "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?auto=format&fit=crop&w=1800&q=90",
    ctaText: "Upload 3D STL Model",
    ctaLink: "/3d-printing",
  },
];

function Mark() {
  return (
    <span className="brand-mark inline-block h-6 w-6 align-middle" aria-hidden="true">
      <img src="/logo.png" alt="Partsly" className="h-full w-full object-contain rounded" />
    </span>
  );
}

export default function HomePage() {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [audience, setAudience] = useState("Popular");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const offersRef = useRef<HTMLDivElement>(null);

  // Flash Sale Ticking Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto Hero Slider
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, []);

  const scrollOffers = (direction: number) => {
    offersRef.current?.scrollBy({ left: direction * 520, behavior: "smooth" });
  };

  const activeSlideData = heroSlides[currentSlide];
  const featuredProducts = COMPONENTS_CATALOG.slice(0, showAllProducts ? COMPONENTS_CATALOG.length : 8);

  return (
    <div className="space-y-12">
      {/* 🚀 Amazon Style Flash Deal Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 py-2.5 px-4 text-black text-xs font-black shadow-md">
        <div className="wrap flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-black px-2 py-0.5 text-white font-mono uppercase text-[10px]">
              ⚡ Flash Deal
            </span>
            <span>ESP32 & Raspberry Pi Pico W Hardware Sale – Extra 15% OFF with coupon <strong className="underline">PARTSLY10</strong></span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>Ends in:</span>
            <span className="rounded bg-black/80 px-2 py-0.5 text-white font-bold">
              {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
            </span>
            <Link href="/catalog" className="hidden sm:inline-block underline hover:text-white font-bold">
              Shop Now →
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section Carousel */}
      <section className="hero wrap relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]" aria-labelledby="hero-title">
        <div className="hero-photo" aria-hidden="true">
          <img src={activeSlideData.photo} alt={activeSlideData.title} className="transition-all duration-700 object-cover" />
        </div>
        <div className="hero-panel space-y-4">
          <p className="eyebrow font-mono text-xs uppercase text-amber-500 font-bold tracking-wider">{activeSlideData.eyebrow}</p>
          <h1 id="hero-title" className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[var(--text)]">
            {activeSlideData.title}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] max-w-md">
            {activeSlideData.subtitle}
          </p>
          <div className="hero-actions pt-2 flex flex-wrap gap-3">
            <Link href={activeSlideData.ctaLink} className="button button-primary inline-flex items-center justify-center font-bold text-xs py-3 px-6 rounded-xl">
              {activeSlideData.ctaText} →
            </Link>
            <Link href="/pcb" className="button button-outline inline-flex items-center justify-center gap-2 font-bold text-xs py-3 px-6 rounded-xl border border-[var(--line)] bg-[var(--surface-2)]">
              <Mark />
              Instant PCB Quote
            </Link>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === idx ? "w-8 bg-[var(--accent)]" : "w-2.5 bg-[var(--line)] hover:bg-[var(--muted)]"
              }`}
            />
          ))}
          <span className="ml-2 font-mono text-xs text-[var(--muted)]">0{currentSlide + 1} / 0{heroSlides.length}</span>
        </div>
      </section>

      {/* Brand highlight strip */}
      <div className="brand-strip wrap flex flex-wrap justify-between items-center py-4 border-y border-[var(--line)] text-[11px] font-mono font-bold text-[var(--muted)] gap-4">
        {[
          "50,000+ COMPONENT SKUS",
          "AUTHORIZED ESPRESSIF & ST DISTRIBUTOR",
          "UPI / UTR INSTANT VERIFICATION",
          "SAME-DAY DISPATCH ACROSS INDIA",
          "2-LAYER / 4-LAYER PCB FAB",
          "3D PRINTING STL SERVICE",
          "100% GENUINE GUARANTEE",
          "GST TAX INVOICE",
        ].map((highlight) => (
          <span key={highlight} className="hover:text-[var(--accent)] cursor-pointer">✓ {highlight}</span>
        ))}
      </div>

      {/* Discover Section */}
      <section className="discover wrap space-y-6">
        <div>
          <p className="eyebrow text-xs uppercase font-bold text-[var(--muted)]">Everything for your next hardware build</p>
          <h2 className="text-2xl font-black text-[var(--text)]">Explore Engineering Categories</h2>
        </div>

        <div className="audience-tabs flex gap-2 overflow-x-auto pb-2 border-b border-[var(--line)]" role="tablist">
          {["Popular", "Boards", "Sensors", "Motors", "Passives"].map((item) => (
            <button
              key={item}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                audience === item ? "bg-[var(--accent)] text-white shadow-md" : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)]"
              }`}
              onClick={() => setAudience(item)}
              role="tab"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/catalog?category=Microcontrollers" className="category-card p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all space-y-2 block">
            <div className="text-3xl">⚡</div>
            <div>
              <strong className="text-sm font-bold text-[var(--text)] block">Microcontrollers & MCUs</strong>
              <small className="text-xs text-[var(--muted)]">ESP32, STM32, RP2040, Arduino</small>
            </div>
            <span className="text-xs text-[var(--accent)] font-bold">Browse 240+ Items →</span>
          </Link>

          <Link href="/catalog?category=Sensors" className="category-card p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all space-y-2 block">
            <div className="text-3xl">📡</div>
            <div>
              <strong className="text-sm font-bold text-[var(--text)] block">Sensors & IMU Modules</strong>
              <small className="text-xs text-[var(--muted)]">MPU6050, Temp, Motion, Cameras</small>
            </div>
            <span className="text-xs text-[var(--accent)] font-bold">Browse 180+ Items →</span>
          </Link>

          <Link href="/pcb" className="category-card p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all space-y-2 block">
            <div className="text-3xl">📟</div>
            <div>
              <strong className="text-sm font-bold text-[var(--text)] block">Custom PCB Fab Desk</strong>
              <small className="text-xs text-[var(--muted)]">1-6 Layer FR-4 Instant Quote</small>
            </div>
            <span className="text-xs text-[var(--accent)] font-bold">Calculate Instant Quote →</span>
          </Link>

          <Link href="/3d-printing" className="category-card p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all space-y-2 block">
            <div className="text-3xl">🧊</div>
            <div>
              <strong className="text-sm font-bold text-[var(--text)] block">3D Printing Prototyping</strong>
              <small className="text-xs text-[var(--muted)]">PLA, PETG, ABS & Tough Resin</small>
            </div>
            <span className="text-xs text-[var(--accent)] font-bold">Upload STL File →</span>
          </Link>
        </div>
      </section>

      {/* Offers Section */}
      <section className="offers-section wrap space-y-6" id="offers">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow text-xs uppercase font-bold text-[var(--muted)]">Fast-Moving Hardware Stock</p>
            <h2 className="text-2xl font-black text-[var(--text)]">Ready to Ship Components</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scrollOffers(-1)} className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)]">←</button>
            <button onClick={() => scrollOffers(1)} className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)]">→</button>
          </div>
        </div>

        <div className="offer-row flex gap-4 overflow-x-auto pb-4 scrollbar-none" ref={offersRef}>
          {COMPONENTS_CATALOG.map((item) => (
            <div key={item.id} className="offer-card min-w-[260px] rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 space-y-3 shrink-0 shadow-sm hover:border-[var(--accent)] transition-all">
              <div className="aspect-video overflow-hidden rounded-xl bg-[var(--surface-2)] relative">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                <span className="absolute top-2 left-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                  {item.stock}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-[var(--muted)] uppercase font-bold">{item.manufacturer}</p>
                <h4 className="text-xs font-bold text-[var(--text)] line-clamp-1">{item.name}</h4>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-sm font-extrabold text-[var(--accent)]">₹{item.price}</span>
                  <span className="text-[10px] text-[var(--muted)]">Stock: {item.inStockCount} Pcs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Amazon Style Product Grid */}
      <section className="products-section wrap space-y-6" id="products">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div>
            <p className="eyebrow text-xs uppercase font-bold text-[var(--muted)]">Top Rated Hardware</p>
            <h2 className="text-2xl font-black text-[var(--text)]">Components Engineers Trust</h2>
          </div>
          <p className="text-xs text-[var(--muted)]">Tested with flying probe electrical certification & guaranteed 100% genuine.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => {
            const isFav = wishlist.includes(product.id);
            return (
              <article key={product.id} className="product-card rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 space-y-3 shadow-sm hover:shadow-xl transition-all relative flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="aspect-square overflow-hidden rounded-xl bg-[var(--surface-2)] relative">
                    <Link href={`/product/${product.id}`}>
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform hover:scale-105" />
                    </Link>
                    {product.badge && (
                      <span className="absolute top-2 left-2 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow">
                        {product.badge}
                      </span>
                    )}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-2 right-2 h-8 w-8 rounded-full border border-[var(--line)] bg-[var(--surface)] text-xs flex items-center justify-center transition-all ${
                        isFav ? "text-red-500 font-bold bg-red-500/10 border-red-500/30" : "text-[var(--muted)] hover:text-red-500"
                      }`}
                    >
                      {isFav ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[var(--muted)]">
                      <span>{product.manufacturer}</span>
                      <span>⭐ {product.rating} ({product.reviewCount})</span>
                    </div>
                    <h3 className="text-xs font-bold text-[var(--text)] line-clamp-2 hover:text-[var(--accent)]">
                      <Link href={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <p className="text-[11px] text-[var(--muted)] line-clamp-1">{product.specs}</p>
                  </div>
                </div>

                <div className="border-t border-[var(--line)] pt-3 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-base font-extrabold text-[var(--accent)]">₹{product.price}</span>
                    {product.originalPrice && <del className="ml-2 text-xs text-[var(--muted)]">₹{product.originalPrice}</del>}
                  </div>
                  <button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        specs: product.specs,
                        image: product.image,
                      })
                    }
                    className="rounded-xl bg-[var(--accent)] px-3.5 py-2 text-xs font-bold text-white hover:opacity-90 transition-transform active:scale-95 shadow"
                  >
                    + Add to Cart
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => setShowAllProducts((prev) => !prev)}
            className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-6 py-3 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)]"
          >
            {showAllProducts ? "Show Fewer Products" : "Load Complete Catalog →"}
          </button>
        </div>
      </section>

      {/* Engineering Customer Testimonials */}
      <section className="wrap rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-bold text-[var(--accent)]">
            ⭐ Verified Engineering Reviews
          </span>
          <h2 className="text-2xl font-black text-[var(--text)]">Trusted by 2,500+ Hardware Innovators across India</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-5 space-y-3 text-xs">
            <div className="flex items-center gap-1 text-amber-400">⭐⭐⭐⭐⭐</div>
            <p className="text-[var(--text)] italic">
              &quot;Partsly sourced rare STM32 microcontrollers for our IoT EV charger prototype in 48 hours. The UTR payment verification was instant!&quot;
            </p>
            <div className="font-bold text-[var(--text)]">
              — Rajesh V., Hardware Lead @ Ather Electronics
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-5 space-y-3 text-xs">
            <div className="flex items-center gap-1 text-amber-400">⭐⭐⭐⭐⭐</div>
            <p className="text-[var(--text)] italic">
              &quot;The 2-layer custom PCB fab instant calculator is super smooth. Gerber files uploaded seamlessly and boards arrived in 3 days with electrical test report.&quot;
            </p>
            <div className="font-bold text-[var(--text)]">
              — Ananya Sharma, Robotics Researcher @ IISc Bangalore
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-5 space-y-3 text-xs">
            <div className="flex items-center gap-1 text-amber-400">⭐⭐⭐⭐⭐</div>
            <p className="text-[var(--text)] italic">
              &quot;BOM Sourcing tool saved us over ₹45,000 on bulk component orders. Official GST tax invoices provided directly for business accounting.&quot;
            </p>
            <div className="font-bold text-[var(--text)]">
              — Vikram Malhotra, Co-Founder @ DroneTech Labs
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
