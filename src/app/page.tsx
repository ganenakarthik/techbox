"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { COMPONENTS_CATALOG } from "@/data/componentsCatalog";
import { useCart } from "@/context/CartContext";

const heroImage = "https://images.unsplash.com/photo-1577962144759-8dec6b55c952?auto=format&fit=crop&w=1800&q=90";
const sourcingImage = "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1800&q=90";
const manufacturingImage = "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?auto=format&fit=crop&w=1800&q=90";

const offers = [
  {
    brand: "ESP32 DevKit V1",
    time: "24 hours",
    discount: "42 in stock",
    image: "https://images.unsplash.com/photo-1631378297854-185cff6b0986?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Raspberry Pi Boards",
    time: "24 hours",
    discount: "18 in stock",
    image: "https://images.unsplash.com/photo-1586920740199-47ce35183cfd?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "STM32 MCUs",
    time: "48 hours",
    discount: "31 in stock",
    image: "https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Camera Modules",
    time: "24 hours",
    discount: "26 in stock",
    image: "https://images.unsplash.com/photo-1649959168260-2eb9702d7b69?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Power & Regulators",
    time: "48 hours",
    discount: "100+ stock",
    image: "https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Sensors & IMUs",
    time: "24 hours",
    discount: "65 in stock",
    image: "https://images.unsplash.com/photo-1535136072409-ff0c7a947733?auto=format&fit=crop&w=700&q=85",
  },
];

function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <img src="/logo.png" alt="Partsly" className="h-full w-full object-cover rounded-md" />
    </span>
  );
}

function Icon({ name }: { name: string }) {
  if (name === "board") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M9 8h6v5H9zM2 8h3m14 0h3M2 12h3m14 0h3M2 16h3m14 0h3" />
      </svg>
    );
  }

  if (name === "sensor") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M7.8 7.8a6 6 0 0 0 0 8.4m8.4-8.4a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2m14.2-14.2a10 10 0 0 1 0 14.2" />
      </svg>
    );
  }

  if (name === "chip") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M9 2v5m3-5v5m3-5v5M9 17v5m3-5v5m3-5v5M2 9h5m-5 3h5m-5 3h5m10-6h5m-5 3h5m-5 3h5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.5 5.5 4 4M13 7l4 4-8.5 8.5-4-4L13 7Z" />
      <path d="M5.5 14.5 3 17v4h4l2.5-2.5M15 3l6 6" />
    </svg>
  );
}

export default function HomePage() {
  const { addToCart } = useCart();
  const [audience, setAudience] = useState("Popular");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const offersRef = useRef<HTMLDivElement>(null);

  const scrollOffers = (direction: number) => {
    offersRef.current?.scrollBy({ left: direction * 520, behavior: "smooth" });
  };

  const featuredProducts = COMPONENTS_CATALOG.slice(0, showAllProducts ? COMPONENTS_CATALOG.length : 8);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
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
          <div className="hero-actions" id="join">
            <Link href="/catalog" className="button button-primary inline-flex items-center justify-center text-center">
              Shop components
            </Link>
            <Link href="/pcb" className="button button-outline inline-flex items-center justify-center">
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

      {/* Discover Section */}
      <section className="discover wrap">
        <p className="eyebrow">Everything for your next prototype</p>
        <h2>From breadboard to production</h2>
        <div className="audience-tabs" role="tablist" aria-label="Shop by category">
          {["Popular", "Boards", "Sensors", "ICs", "Motors"].map((item) => (
            <button
              key={item}
              className={audience === item ? "active" : ""}
              onClick={() => setAudience(item)}
              role="tab"
              aria-selected={audience === item}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="category-grid">
          <Link href="/catalog" className="category-card">
            <Icon name="board" />
            <span>
              <strong>Boards & MCUs</strong>
              <small>ESP32, Arduino, Pi</small>
            </span>
            <span className="arrow">↗</span>
          </Link>

          <Link href="/catalog?category=Sensors" className="category-card">
            <Icon name="sensor" />
            <span>
              <strong>Sensors & Modules</strong>
              <small>Motion, IMU, camera</small>
            </span>
            <span className="arrow">↗</span>
          </Link>

          <Link href="/pcb" className="category-card">
            <Icon name="chip" />
            <span>
              <strong>Custom PCB Fab</strong>
              <small>1-6 Layer FR4 Prototypes</small>
            </span>
            <span className="arrow">↗</span>
          </Link>

          <Link href="/3d-printing" className="category-card">
            <Icon name="tools" />
            <span>
              <strong>3D Printing</strong>
              <small>PLA, PETG, ABS & Resin</small>
            </span>
            <span className="arrow">↗</span>
          </Link>
        </div>
      </section>

      {/* Offers Section */}
      <section className="offers-section" id="offers">
        <div className="section-heading wrap">
          <div>
            <p className="eyebrow">{audience} components</p>
            <h2>Fast-moving parts, ready to ship</h2>
          </div>
          <div className="carousel-controls">
            <button onClick={() => scrollOffers(-1)} aria-label="Previous offers">←</button>
            <button onClick={() => scrollOffers(1)} aria-label="Next offers">→</button>
          </div>
        </div>
        <div className="offer-row wrap" ref={offersRef}>
          {offers.map((offer) => (
            <Link key={offer.brand} href="/catalog" className="offer-card group">
              <div className="offer-image">
                <img src={offer.image} alt={offer.brand} />
                <span className="try-on font-bold">Ready stock</span>
              </div>
              <div className="offer-copy">
                <strong>{offer.brand}</strong>
                <div>
                  <span>
                    dispatch
                    <b>{offer.time}</b>
                  </span>
                  <span>
                    live
                    <b>{offer.discount}</b>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section wrap" id="products">
        <div className="products-heading">
          <div>
            <p className="eyebrow">Popular hardware</p>
            <h2>Components engineers trust</h2>
          </div>
          <p>Boards, sensors, modules and motion hardware—tested and ready to ship.</p>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product, index) => {
            const isFavorite = favorites.includes(product.name);
            return (
              <article className="product-card group" key={product.id}>
                <div className="product-image">
                  <Link href={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} loading="lazy" />
                  </Link>
                  <span className="product-discount">
                    {index % 3 === 0 ? "Bestseller" : index % 3 === 1 ? "In stock" : "Lab tested"}
                  </span>
                  <button
                    className={`favorite-button${isFavorite ? " active" : ""}`}
                    onClick={() =>
                      setFavorites((current) =>
                        isFavorite ? current.filter((name) => name !== product.name) : [...current, product.name]
                      )
                    }
                  >
                    {isFavorite ? "♥" : "♡"}
                  </button>
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
            );
          })}
        </div>
        <button
          className="load-more"
          onClick={() => setShowAllProducts((current) => !current)}
        >
          {showAllProducts ? "Show fewer products" : "Load more products"}
        </button>
      </section>

      {/* Operations Section */}
      <section className="operations wrap">
        <article>
          <span>01</span>
          <div>
            <p className="eyebrow">Simple payments</p>
            <h3>Pay by UPI or UTR transfer</h3>
            <p>Direct, trackable payments for individual orders, labs and business procurement.</p>
          </div>
        </article>
        <article>
          <span>02</span>
          <div>
            <p className="eyebrow">Nationwide shipping</p>
            <h3>Express courier across India</h3>
            <p>Reliable doorstep delivery with order tracking from dispatch to arrival.</p>
          </div>
        </article>
        <article>
          <span>03</span>
          <div>
            <p className="eyebrow">Local express</p>
            <h3>10–30 minute campus runner</h3>
            <p>Urgent components delivered directly to participating campuses and engineering labs.</p>
          </div>
        </article>
      </section>

      {/* Editorial Section */}
      <section className="editorial wrap" id="sourcing">
        <article className="editorial-card">
          <div className="editorial-image">
            <img src={sourcingImage} alt="Electronic components prepared for sourcing" />
          </div>
          <div className="editorial-panel">
            <p className="eyebrow">Can&apos;t find your part?</p>
            <h2>Send the BOM. We&apos;ll source the rest.</h2>
            <p>
              Upload a part number, datasheet or BOM spreadsheet. Our network of 500+ verified suppliers across India and Asia finds rare, specialized and out-of-stock components and delivers them directly to you.
            </p>
            <Link href="/sourcing" className="font-bold underline text-[var(--text)]">
              Upload your BOM →
            </Link>
          </div>
        </article>

        <article className="editorial-card">
          <div className="editorial-image">
            <img src={manufacturingImage} alt="Circuit board ready for custom manufacturing" />
          </div>
          <div className="editorial-panel">
            <p className="eyebrow">Custom manufacturing</p>
            <h2>Turn your files into physical hardware.</h2>
            <p>
              Upload Gerber files for instant 2-layer or 4-layer PCB fabrication quotes, or send an STL model for strong PLA and PETG enclosures, fixtures and prototype parts.
            </p>

            <div className="flex gap-4">
              <Link href="/pcb" className="font-bold underline text-[var(--text)]">
                Get PCB quote →
              </Link>
              <Link href="/3d-printing" className="font-bold underline text-[var(--text)]">
                Get 3D quote →
              </Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
