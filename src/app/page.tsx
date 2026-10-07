"use client";

import React, { useEffect, useRef, useState } from "react";
import { COMPONENTS_CATALOG, ComponentItem } from "@/data/componentsCatalog";
import { PCBQuoteCalculator } from "@/components/PCBQuoteCalculator";
import { Print3DCalculator } from "@/components/Print3DCalculator";
import { BOMSourcingTool } from "@/components/BOMSourcingTool";
import { SearchModal } from "@/components/SearchModal";
import { AccountModal } from "@/components/AccountModal";

type Theme = "dark" | "light";
type View = "home" | "login" | "signup" | "pcb" | "print3d" | "sourcing";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specs: string;
  image: string;
}

const heroImage =
  "https://images.unsplash.com/photo-1577962144759-8dec6b55c952?auto=format&fit=crop&w=1800&q=90";
const sourcingImage =
  "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1800&q=90";
const manufacturingImage =
  "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?auto=format&fit=crop&w=1800&q=90";

const categories = [
  { name: "Boards & MCUs", count: "ESP32, Arduino, Pi", icon: "board" },
  { name: "Sensors & Modules", count: "Motion, IMU, camera", icon: "sensor" },
  { name: "Components & ICs", count: "Power, logic, passives", icon: "chip" },
  { name: "Motors & Hardware", count: "Motion, tools, filament", icon: "tools" },
];

const offers = [
  {
    brand: "ESP32 DevKit V1",
    time: "24 hours",
    discount: "42 in stock",
    image:
      "https://images.unsplash.com/photo-1631378297854-185cff6b0986?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Raspberry Pi Boards",
    time: "24 hours",
    discount: "18 in stock",
    image:
      "https://images.unsplash.com/photo-1586920740199-47ce35183cfd?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "STM32 MCUs",
    time: "48 hours",
    discount: "31 in stock",
    image:
      "https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Camera Modules",
    time: "24 hours",
    discount: "26 in stock",
    image:
      "https://images.unsplash.com/photo-1649959168260-2eb9702d7b69?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Power & Regulators",
    time: "48 hours",
    discount: "100+ stock",
    image:
      "https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Sensors & IMUs",
    time: "24 hours",
    discount: "65 in stock",
    image:
      "https://images.unsplash.com/photo-1535136072409-ff0c7a947733?auto=format&fit=crop&w=700&q=85",
  },
];

const products = [
  {
    id: "esp32-wroom-32d",
    name: "ESP32-WROOM-32 Development Board",
    brand: "Espressif",
    price: 449,
    oldPrice: 599,
    image:
      "https://images.unsplash.com/photo-1631378297854-185cff6b0986?auto=format&fit=crop&w=900&q=85",
    specs: "Dual-core 240MHz, 4MB Flash, Wi-Fi & BLE",
  },
  {
    id: "raspberry-pi-pico-w",
    name: "Raspberry Pi Pico W Board",
    brand: "Raspberry Pi",
    price: 499,
    oldPrice: 599,
    image:
      "https://images.unsplash.com/photo-1586920740199-47ce35183cfd?auto=format&fit=crop&w=900&q=85",
    specs: "RP2040 Dual ARM Cortex M0+, Wi-Fi",
  },
  {
    id: "stm32f103c8t6-bluepill",
    name: "STM32F103C8T6 Blue Pill Board",
    brand: "STMicroelectronics",
    price: 299,
    oldPrice: 399,
    image:
      "https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?auto=format&fit=crop&w=900&q=85",
    specs: "ARM Cortex-M3 72MHz, 64KB Flash",
  },
  {
    id: "mpu6050-gyro-accelerometer",
    name: "MPU6050 6-Axis IMU Sensor",
    brand: "TDK InvenSense",
    price: 189,
    oldPrice: 249,
    image:
      "https://images.unsplash.com/photo-1535136072409-ff0c7a947733?auto=format&fit=crop&w=900&q=85",
    specs: "3-Axis Gyro + 3-Axis Accel I2C Module",
  },
  {
    id: "esp32-cam-ov2640",
    name: "OV2640 Camera Module with ESP32-CAM",
    brand: "OmniVision",
    price: 549,
    oldPrice: 699,
    image:
      "https://images.unsplash.com/photo-1649959168260-2eb9702d7b69?auto=format&fit=crop&w=900&q=85",
    specs: "2MP Vision Camera with MicroSD Slot",
  },
  {
    id: "l298n-motor-driver-module",
    name: "L298N Dual H-Bridge Motor Driver",
    brand: "Texas Instruments",
    price: 149,
    oldPrice: 199,
    image:
      "https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=900&q=85",
    specs: "2A Peak Dual DC / Stepper Controller",
  },
  {
    id: "nema17-stepper-motor",
    name: "NEMA 17 Bipolar Stepper Motor",
    brand: "MotionPro",
    price: 749,
    oldPrice: 899,
    image:
      "https://images.unsplash.com/photo-1577962144759-8dec6b55c952?auto=format&fit=crop&w=900&q=85",
    specs: "1.7A 45Ncm Holding Torque 42BYGH",
  },
  {
    id: "sg90-micro-servo-motor",
    name: "SG90 9g Micro Servo Motor",
    brand: "TowerPro",
    price: 199,
    oldPrice: 249,
    image:
      "https://images.unsplash.com/photo-1610878785620-3ab2d3a2ae7b?auto=format&fit=crop&w=900&q=85",
    specs: "1.8kg/cm Torque 180° Micro Servo",
  },
];

function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
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

function ThemeToggle({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: () => void;
}) {
  return (
    <button
      className="theme-toggle"
      onClick={onChange}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M20 15.2A8.2 8.2 0 0 1 8.8 4 8.2 8.2 0 1 0 20 15.2Z" />
        )}
      </svg>
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}

function AuthPage({
  mode,
  onNavigate,
}: {
  mode: Exclude<View, "home" | "pcb" | "print3d" | "sourcing">;
  onNavigate: (view: View) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const isSignup = mode === "signup";

  return (
    <section className="auth-page">
      <div className="auth-visual" aria-hidden="true">
        <img src={heroImage} alt="" />
        <div>
          <p className="eyebrow">Built for builders</p>
          <h2>
            Source parts.
            <br />
            Build faster.
          </h2>
          <p>Components, custom PCBs and prototypes—all in one place.</p>
        </div>
      </div>
      <div className="auth-content">
        <button className="auth-back" onClick={() => onNavigate("home")}>
          ← Back to shopping
        </button>
        <div className="auth-form-wrap">
          <p className="eyebrow">{isSignup ? "Join Partsly" : "Welcome back"}</p>
          <h1>{isSignup ? "Create your account" : "Log in"}</h1>
          <p className="auth-intro">
            {isSignup
              ? "Create an account to order parts, upload BOMs and track every build."
              : "Enter your details to access orders, quotes and sourcing requests."}
          </p>
          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            {isSignup && (
              <label>
                Full name
                <input type="text" name="name" placeholder="Your full name" required />
              </label>
            )}
            <label>
              Email address
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder={isSignup ? "At least 8 characters" : "Your password"}
                minLength={8}
                required
              />
            </label>
            {!isSignup && (
              <div className="form-options">
                <label className="check-label">
                  <input type="checkbox" name="remember" />
                  Remember me
                </label>
                <button type="button" className="text-button">
                  Forgot password?
                </button>
              </div>
            )}
            <button className="auth-submit" type="submit">
              {isSignup ? "Create free account" : "Log in"}
            </button>
            <button className="zalando-submit" type="button">
              <Mark />
              Continue with Google
            </button>
            {submitted && (
              <p className="form-success" role="status">
                {isSignup
                  ? "Your account is ready — welcome to Partsly."
                  : "Welcome back — your workspace is ready."}
              </p>
            )}
          </form>
          <p className="auth-switch">
            {isSignup ? "Already have an account?" : "New to Partsly?"}{" "}
            <button className="text-button" onClick={() => onNavigate(isSignup ? "login" : "signup")}>
              {isSignup ? "Log in" : "Sign up for free"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [audience, setAudience] = useState("Popular");
  const [view, setView] = useState<View>("home");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const offersRef = useRef<HTMLDivElement>(null);

  // Functional cart and modal state
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "esp32-wroom-32d",
      name: "ESP32-WROOM-32 Development Board",
      price: 449,
      quantity: 2,
      specs: "Dual-core 240MHz, 4MB Flash, Wi-Fi & BLE",
      image: "https://images.unsplash.com/photo-1631378297854-185cff6b0986?auto=format&fit=crop&w=900&q=85",
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ComponentItem | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"address" | "payment" | "success">("address");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const scrollOffers = (direction: number) => {
    offersRef.current?.scrollBy({ left: direction * 520, behavior: "smooth" });
  };

  const navigate = (nextView: View) => {
    setView(nextView);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const handleAddToCart = (item: { id: string; name: string; price: number; specs: string; image: string }) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gstAmount = Math.round(subtotal * 0.18);
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const grandTotal = subtotal + gstAmount + shippingFee;

  return (
    <div className="site-shell">
      {/* Topbar matching exact Pixel Perfect theme switcher */}
      <header className="topbar">
        <a
          className="logo cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            navigate("home");
          }}
        >
          <Mark />
          <span className="logo-copy">
            <strong>Partsly</strong>
            <small>hardware network</small>
          </span>
        </a>

        <div className="header-actions">
          {/* Quick Search Palette Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] transition-all"
          >
            🔍 Search parts (Ctrl + K)
          </button>

          <ThemeToggle
            theme={theme}
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          />

          <button
            onClick={() => setIsAccountOpen(true)}
            className="rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-bold text-[var(--text)] hover:border-[var(--text)]"
          >
            👤 Account
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white hover:opacity-90"
          >
            🛒 Cart ({cart.reduce((a, c) => a + c.quantity, 0)})
          </button>
        </div>
      </header>

      <main>
        {view === "login" || view === "signup" ? (
          <AuthPage mode={view} onNavigate={navigate} />
        ) : view === "pcb" ? (
          <div className="wrap py-8 space-y-6">
            <button onClick={() => navigate("home")} className="auth-back mb-4">← Back to shop</button>
            <PCBQuoteCalculator onAddToCart={handleAddToCart} />
          </div>
        ) : view === "print3d" ? (
          <div className="wrap py-8 space-y-6">
            <button onClick={() => navigate("home")} className="auth-back mb-4">← Back to shop</button>
            <Print3DCalculator onAddToCart={handleAddToCart} />
          </div>
        ) : view === "sourcing" ? (
          <div className="wrap py-8 space-y-6">
            <button onClick={() => navigate("home")} className="auth-back mb-4">← Back to shop</button>
            <BOMSourcingTool />
          </div>
        ) : (
          <>
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
                  <button
                    className="button button-primary"
                    onClick={() =>
                      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Shop components
                  </button>
                  <button
                    className="button button-outline"
                    onClick={() => navigate("sourcing")}
                  >
                    <Mark />
                    Source a part
                  </button>
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
                <button className="category-card" onClick={() => navigate("home")}>
                  <Icon name="board" />
                  <span>
                    <strong>Boards & MCUs</strong>
                    <small>ESP32, Arduino, Pi</small>
                  </span>
                  <span className="arrow">↗</span>
                </button>

                <button className="category-card" onClick={() => navigate("home")}>
                  <Icon name="sensor" />
                  <span>
                    <strong>Sensors & Modules</strong>
                    <small>Motion, IMU, camera</small>
                  </span>
                  <span className="arrow">↗</span>
                </button>

                <button className="category-card" onClick={() => navigate("pcb")}>
                  <Icon name="chip" />
                  <span>
                    <strong>Custom PCB Fab</strong>
                    <small>Instant 1-6 Layer Quote</small>
                  </span>
                  <span className="arrow">↗</span>
                </button>

                <button className="category-card" onClick={() => navigate("print3d")}>
                  <Icon name="tools" />
                  <span>
                    <strong>3D Printing</strong>
                    <small>PLA, PETG & Resin SLA</small>
                  </span>
                  <span className="arrow">↗</span>
                </button>
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
                  <article className="offer-card" key={offer.brand}>
                    <div className="offer-image">
                      <img src={offer.image} alt={offer.brand} />
                      <span className="try-on">Ready stock</span>
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
                  </article>
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
                {products
                  .slice(0, showAllProducts ? products.length : 8)
                  .map((product, index) => {
                    const isFavorite = favorites.includes(product.name);
                    return (
                      <article className="product-card" key={product.name}>
                        <div className="product-image">
                          <img src={product.image} alt={product.name} loading="lazy" />
                          <span className="product-discount">
                            {index % 3 === 0 ? "Bestseller" : index % 3 === 1 ? "In stock" : "Lab tested"}
                          </span>
                          <button
                            className={`favorite-button${isFavorite ? " active" : ""}`}
                            onClick={() =>
                              setFavorites((current) =>
                                isFavorite
                                  ? current.filter((name) => name !== product.name)
                                  : [...current, product.name]
                              )
                            }
                          >
                            {isFavorite ? "♥" : "♡"}
                          </button>
                        </div>
                        <div className="product-info">
                          <p>{product.brand}</p>
                          <h3 className="cursor-pointer" onClick={() => setSelectedProduct(COMPONENTS_CATALOG[0])}>
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <strong>₹{product.price}</strong>
                              <del className="ml-2">₹{product.oldPrice}</del>
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white hover:opacity-90"
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
                  <button onClick={() => navigate("sourcing")} className="text-button font-bold">
                    Upload your BOM →
                  </button>
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
                    <button onClick={() => navigate("pcb")} className="text-button font-bold">
                      Get PCB quote →
                    </button>
                    <button onClick={() => navigate("print3d")} className="text-button font-bold">
                      Get 3D quote →
                    </button>
                  </div>
                </div>
              </article>
            </section>
          </>
        )}
      </main>

      {/* Footer matching exact reference App.tsx */}
      <footer className="footer wrap">
        <a
          className="logo footer-logo cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            navigate("home");
          }}
        >
          <Mark />
          <span className="logo-copy">
            <strong>Partsly</strong>
            <small>hardware network</small>
          </span>
        </a>
        <p>Parts, sourcing and manufacturing for every hardware build.</p>
        <div>
          <button onClick={() => navigate("sourcing")} className="text-button">
            Source a part
          </button>
          <button onClick={() => navigate("home")} className="text-button">
            Shop
          </button>
          <button onClick={() => setIsAccountOpen(true)} className="text-button">
            Account & Orders
          </button>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => {
          setSelectedProduct(product);
          setIsSearchOpen(false);
        }}
      />

      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[var(--line)] pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-[var(--accent)]">
                  {selectedProduct.category} • SKU: {selectedProduct.sku}
                </span>
                <h2 className="text-xl font-bold text-[var(--text)]">{selectedProduct.name}</h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-lg p-2 text-xs font-bold text-[var(--muted)] hover:bg-[var(--surface-2)]"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="aspect-square rounded-xl border border-[var(--line)] bg-[var(--surface-2)] overflow-hidden">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-4">
                <p className="text-xs text-[var(--muted)]">{selectedProduct.description}</p>
                
                <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 space-y-1 text-xs">
                  <div className="font-bold text-[var(--text)]">Manufacturer: {selectedProduct.manufacturer}</div>
                  <div className="text-[var(--muted)]">Stock: {selectedProduct.stock} ({selectedProduct.inStockCount} available)</div>
                  <div className="text-[var(--muted)]">Rating: ⭐ {selectedProduct.rating} ({selectedProduct.reviewCount} reviews)</div>
                </div>

                <div className="text-2xl font-extrabold text-[var(--accent)]">₹{selectedProduct.price}</div>

                <button
                  onClick={() => {
                    handleAddToCart({
                      id: selectedProduct.id,
                      name: selectedProduct.name,
                      price: selectedProduct.price,
                      specs: selectedProduct.specs,
                      image: selectedProduct.image,
                    });
                    setSelectedProduct(null);
                  }}
                  className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white hover:opacity-90"
                >
                  Add to Cart (₹{selectedProduct.price})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--surface)] border-l border-[var(--line)] p-6 flex flex-col justify-between h-full shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 mb-4">
                <h3 className="text-lg font-bold text-[var(--text)]">🛒 Shopping Cart</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-lg p-2 text-xs font-bold text-[var(--muted)] hover:bg-[var(--surface-2)]"
                >
                  ✕ Close
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-sm text-[var(--muted)]">Your shopping cart is empty</div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3"
                    >
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                        <div>
                          <div className="text-xs font-bold text-[var(--text)] line-clamp-1">{item.name}</div>
                          <div className="text-[11px] text-[var(--accent)] font-bold">₹{item.price}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setCart((prev) =>
                              prev
                                .map((c) => (c.id === item.id ? { ...c, quantity: c.quantity - 1 } : c))
                                .filter((c) => c.quantity > 0)
                            )
                          }
                          className="h-6 w-6 rounded border border-[var(--line)] bg-[var(--surface)] text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() =>
                            setCart((prev) =>
                              prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
                            )
                          }
                          className="h-6 w-6 rounded border border-[var(--line)] bg-[var(--surface)] text-xs font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => setCart((prev) => prev.filter((c) => c.id !== item.id))}
                          className="ml-2 text-xs text-red-500 hover:underline"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[var(--line)] pt-4 space-y-3">
                <div className="space-y-1 text-xs text-[var(--muted)]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono text-[var(--text)]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span className="font-mono text-[var(--text)]">₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Shipping:</span>
                    <span className="font-mono text-[var(--text)]">
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[var(--text)] border-t border-[var(--line)] pt-2">
                    <span>Grand Total:</span>
                    <span className="font-mono text-[var(--accent)]">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white hover:opacity-90"
                >
                  Proceed to UTR Verification Checkout (₹{grandTotal.toLocaleString()})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3-Step UTR Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 mb-4">
              <h3 className="text-base font-bold text-[var(--text)]">💳 Indian UPI & UTR Payment Checkout</h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-xs font-bold text-[var(--muted)] hover:text-[var(--text)]"
              >
                ✕
              </button>
            </div>

            {checkoutStep === "address" && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-[var(--muted)] font-mono">Step 1 of 2: Delivery Address</h4>
                <input
                  type="text"
                  placeholder="Full Name / Engineering Org"
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text)]"
                />
                <input
                  type="text"
                  placeholder="Street Address / Lab Location"
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text)]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City (e.g. Bangalore)"
                    className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text)]"
                  />
                  <input
                    type="text"
                    placeholder="Pincode (e.g. 560001)"
                    className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text)]"
                  />
                </div>
                <button
                  onClick={() => setCheckoutStep("payment")}
                  className="w-full rounded-xl bg-[var(--accent)] py-3 text-xs font-bold text-white"
                >
                  Continue to UPI QR & UTR Entry →
                </button>
              </div>
            )}

            {checkoutStep === "payment" && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-[var(--muted)] font-mono">Step 2 of 2: Scan UPI QR & Submit 12-Digit UTR</h4>
                <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-center">
                  <div className="text-xs font-bold text-[var(--text)] mb-1">Scan & Pay ₹{grandTotal.toLocaleString()}</div>
                  <div className="text-[11px] text-[var(--muted)] mb-3">UPI ID: <span className="font-mono text-[var(--accent)]">partsly@icici</span></div>
                  <div className="inline-block border-4 border-white rounded-lg p-2 bg-white">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=partsly@icici&pn=Partsly%20Hardware&am=1000"
                      alt="UPI QR Code"
                      className="h-32 w-32"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--muted)] mb-1">
                    Enter 12-Digit UPI Transaction UTR Reference Number
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="e.g. 384910293847"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2.5 font-mono text-sm font-bold text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>

                <button
                  disabled={utrNumber.length < 10}
                  onClick={() => setCheckoutStep("success")}
                  className="w-full rounded-xl bg-[var(--accent)] py-3 text-xs font-bold text-white disabled:opacity-50"
                >
                  Verify UTR & Confirm Order (₹{grandTotal.toLocaleString()})
                </button>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="py-6 text-center space-y-3">
                <div className="text-4xl">🎉</div>
                <h4 className="text-lg font-bold text-[var(--text)]">Order Verified & Confirmed!</h4>
                <p className="text-xs text-[var(--muted)]">
                  UTR Reference <span className="font-mono font-bold text-[var(--accent)]">{utrNumber}</span> has been logged. Tracking details sent to your registered phone.
                </p>
                <button
                  onClick={() => {
                    setCart([]);
                    setIsCheckoutOpen(false);
                    setCheckoutStep("address");
                  }}
                  className="rounded-xl bg-[var(--surface-2)] border border-[var(--line)] px-6 py-2.5 text-xs font-bold text-[var(--text)]"
                >
                  Back to Partsly Store
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
