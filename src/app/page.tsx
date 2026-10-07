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

function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
    </span>
  );
}

export default function HomePage() {
  const { addToCart } = useCart();
  const offersRef = useRef<HTMLDivElement>(null);

  const scrollOffers = (direction: number) => {
    offersRef.current?.scrollBy({ left: direction * 520, behavior: "smooth" });
  };

  const featuredProducts = COMPONENTS_CATALOG.slice(0, 8);

  return (
    <div className="space-y-12">
      {/* Exact Pixel Perfect Hero Section */}
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-photo" aria-hidden="true">
          <img src={heroImage} alt="" />
        </div>
        <div className="hero-panel">
          <p className="eyebrow">Build without bottlenecks</p>
          <h1 id="hero-title">
            Parts for every build.
            <br />
            Sourced fast.
          </h1>
          <div className="hero-actions">
            <Link href="/catalog" className="button button-primary flex items-center justify-center">
              Shop components
            </Link>
            <Link href="/pcb" className="button button-outline flex items-center justify-center">
              <Mark />
              Instant PCB Quote
            </Link>
          </div>
        </div>
        <span className="hero-index">01 / 03</span>
      </section>

      {/* Brand highlight strip */}
      <div className="brand-strip wrap" aria-label="Partsly service highlights">
        {[
          "500+ SUPPLIERS",
          "INDIA + ASIA",
          "UPI / UTR",
          "EXPRESS COURIER",
          "BOM SOURCING",
          "PCB FAB",
          "3D PRINTING",
          "LAB RUNNER",
        ].map((highlight) => (
          <span key={highlight}>{highlight}</span>
        ))}
      </div>

      {/* Discover Services Section */}
      <section className="discover wrap">
        <p className="eyebrow">Everything for your next prototype</p>
        <h2>From breadboard to production</h2>
        <div className="category-grid">
          <Link href="/catalog" className="category-card">
            <span className="text-2xl">🏬</span>
            <span>
              <strong>Hardware Catalog</strong>
              <small>MCs, ICs, Sensors & Motors</small>
            </span>
            <span className="arrow">→</span>
          </Link>

          <Link href="/pcb" className="category-card">
            <span className="text-2xl">⚡</span>
            <span>
              <strong>PCB Fabrication</strong>
              <small>1-6 Layer FR4 Prototypes</small>
            </span>
            <span className="arrow">→</span>
          </Link>

          <Link href="/3d-printing" className="category-card">
            <span className="text-2xl">🧊</span>
            <span>
              <strong>3D Printing</strong>
              <small>PLA, PETG, ABS & Resin</small>
            </span>
            <span className="arrow">→</span>
          </Link>

          <Link href="/sourcing" className="category-card">
            <span className="text-2xl">📋</span>
            <span>
              <strong>BOM Sourcing</strong>
              <small>Bulk RFQ & Part Import</small>
            </span>
            <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Offers Carousel Section */}
      <section className="offers-section rounded-2xl">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Ready for 24h dispatch</p>
              <h2>Prototyping modules in stock</h2>
            </div>
            <div className="carousel-controls">
              <button onClick={() => scrollOffers(-1)} aria-label="Previous offer">‹</button>
              <button onClick={() => scrollOffers(1)} aria-label="Next offer">›</button>
            </div>
          </div>

          <div className="offer-row" ref={offersRef}>
            {offers.map((item, idx) => (
              <Link key={idx} href="/catalog" className="offer-card group">
                <div className="offer-image">
                  <img src={item.image} alt={item.brand} />
                  <span className="try-on font-bold">Fast Dispatch</span>
                </div>
                <div className="offer-copy">
                  <strong>{item.brand}</strong>
                  <div>
                    <span>
                      <span>In stock count</span>
                      <b>{item.discount}</b>
                    </span>
                    <span>
                      <span>Lead time</span>
                      <b>{item.time}</b>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section wrap">
        <div className="products-heading">
          <div>
            <p className="eyebrow">Curated component inventory</p>
            <h2>Popular hardware items</h2>
          </div>
          <Link href="/catalog" className="button button-outline inline-flex items-center justify-center">
            View full catalog ({COMPONENTS_CATALOG.length}) →
          </Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <article key={product.id} className="product-card group">
              <div className="product-image">
                <Link href={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                {product.badge && <span className="product-discount">{product.badge}</span>}
              </div>
              <div className="product-info">
                <p>{product.manufacturer} • {product.category}</p>
                <h3>
                  <Link href={`/product/${product.id}`} className="hover:text-[var(--accent)]">
                    {product.name}
                  </Link>
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <strong>₹{product.price}</strong>
                    {product.originalPrice && <del className="ml-2">₹{product.originalPrice}</del>}
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
                    className="rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-bold text-white transition-transform hover:scale-105"
                  >
                    + Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Operations Strip */}
      <section className="operations wrap">
        <article>
          <span>01</span>
          <div>
            <p className="eyebrow">100% Genuine</p>
            <h3>Authorized Components</h3>
            <p>Direct supply chain from TI, ST, Espressif, and Raspberry Pi.</p>
          </div>
        </article>

        <article>
          <span>02</span>
          <div>
            <p className="eyebrow">48h Delivery</p>
            <h3>Express Courier</h3>
            <p>BlueDart express air freight from Bangalore and Mumbai hubs.</p>
          </div>
        </article>

        <article>
          <span>03</span>
          <div>
            <p className="eyebrow">Seamless Tax</p>
            <h3>GST & UTR Payments</h3>
            <p>Instant UPI QR scanner with 12-digit UTR log & GSTIN invoices.</p>
          </div>
        </article>
      </section>
    </div>
  );
}
