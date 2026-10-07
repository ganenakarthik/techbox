"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { COMPONENTS_CATALOG } from "@/data/componentsCatalog";
import { useCart } from "@/context/CartContext";

const heroImage = "https://images.unsplash.com/photo-1577962144759-8dec6b55c952?auto=format&fit=crop&w=1800&q=90";

const offers = [
  {
    brand: "ESP32 DevKit V1",
    time: "24 hours",
    discount: "42 in stock",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Raspberry Pi Boards",
    time: "24 hours",
    discount: "18 in stock",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "STM32 MCUs",
    time: "48 hours",
    discount: "31 in stock",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Camera Modules",
    time: "24 hours",
    discount: "26 in stock",
    image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Power & Regulators",
    time: "48 hours",
    discount: "100+ stock",
    image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Sensors & IMUs",
    time: "24 hours",
    discount: "65 in stock",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=85",
  },
];

export default function HomePage() {
  const { addToCart } = useCart();
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollOffers = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const amount = direction === "left" ? -300 : 300;
    carouselRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const featuredProducts = COMPONENTS_CATALOG.slice(0, 8);

  return (
    <div className="space-y-12">
      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            🚀 100% Genuine Electronic Components & Custom Fab
          </div>
          <h1>
            India&apos;s Engineering Hardware & Manufacturing Procurement Desk
          </h1>
          <p>
            Factory-direct microcontrollers, ICs, sensors, custom 2/4-layer PCB fabrication, 3D printing STL quotes, and bulk BOM sourcing.
          </p>
          <div className="hero-buttons">
            <Link href="/catalog" className="btn-primary">
              Explore Hardware Catalog →
            </Link>
            <Link href="/pcb" className="btn-secondary">
              Calculate Instant PCB Quote →
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <img src={heroImage} alt="Hardware Components" />
        </div>
      </section>

      {/* Services Hub Strip */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/catalog"
          className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--accent)]"
        >
          <div className="text-3xl">🏬</div>
          <h3 className="mt-3 text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)]">
            Component Store
          </h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            ICs, MCUs, Sensors, Steppers, and Passives in stock with same-day dispatch.
          </p>
          <span className="mt-4 inline-block text-xs font-bold text-[var(--accent)]">Browse Catalog →</span>
        </Link>

        <Link
          href="/pcb"
          className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--accent)]"
        >
          <div className="text-3xl">⚡</div>
          <h3 className="mt-3 text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)]">
            PCB Fabrication
          </h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Industrial 1 to 6-layer custom PCB prototypes with 48h turn-around.
          </p>
          <span className="mt-4 inline-block text-xs font-bold text-[var(--accent)]">Instant PCB Quote →</span>
        </Link>

        <Link
          href="/3d-printing"
          className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--accent)]"
        >
          <div className="text-3xl">🧊</div>
          <h3 className="mt-3 text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)]">
            3D Printing On-Demand
          </h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            PLA, PETG, ABS & Resin SLA 3D printing with STL geometry slicing.
          </p>
          <span className="mt-4 inline-block text-xs font-bold text-[var(--accent)]">Instant 3D Quote →</span>
        </Link>

        <Link
          href="/sourcing"
          className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--accent)]"
        >
          <div className="text-3xl">📋</div>
          <h3 className="mt-3 text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)]">
            BOM Bulk Sourcing
          </h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Upload BOM spreadsheets for automated RFQ factory pricing within 2 hours.
          </p>
          <span className="mt-4 inline-block text-xs font-bold text-[var(--accent)]">Upload BOM File →</span>
        </Link>
      </section>

      {/* Prototyping Modules Carousel */}
      <section className="carousel-section rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
        <div className="carousel-header mb-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">⚡ Fast Dispatch Stock Categories</h2>
            <p className="text-xs text-[var(--muted)]">Direct from Bangalore & Mumbai distribution hubs</p>
          </div>
          <div className="carousel-controls">
            <button onClick={() => scrollOffers("left")} aria-label="Scroll left">‹</button>
            <button onClick={() => scrollOffers("right")} aria-label="Scroll right">›</button>
          </div>
        </div>

        <div className="carousel-track" ref={carouselRef}>
          {offers.map((item, idx) => (
            <Link key={idx} href="/catalog" className="offer-card group">
              <img src={item.image} alt={item.brand} />
              <div className="offer-body">
                <div className="brand">{item.brand}</div>
                <div className="discount">{item.discount}</div>
                <div className="time">Dispatches in {item.time}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Hardware Catalog Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">Featured Hardware Inventory</h2>
            <p className="text-xs text-[var(--muted)]">Authentic parts with datasheet specifications and manufacturer warranty</p>
          </div>
          <Link
            href="/catalog"
            className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-4 py-2 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)]"
          >
            View All Components ({COMPONENTS_CATALOG.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-md"
            >
              {product.badge && (
                <span className="absolute left-4 top-4 z-10 rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {product.badge}
                </span>
              )}

              <Link href={`/product/${product.id}`} className="space-y-3 block">
                <div className="aspect-square overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-2)]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                    {product.manufacturer} • {product.category}
                  </div>
                  <h3 className="line-clamp-2 text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)]">
                    {product.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{product.specs}</p>
                </div>
              </Link>

              <div className="mt-4 border-t border-[var(--line)] pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-extrabold text-[var(--accent)]">₹{product.price}</div>
                    {product.originalPrice && (
                      <div className="text-xs text-[var(--muted)] line-through">₹{product.originalPrice}</div>
                    )}
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
                    className="rounded-xl bg-[var(--surface-2)] border border-[var(--line)] px-3 py-2 text-xs font-bold text-[var(--text)] transition-all hover:bg-[var(--accent)] hover:text-white"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
