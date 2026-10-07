"use client";

import React, { useEffect, useRef, useState } from "react";
import { COMPONENTS_CATALOG, ComponentItem } from "@/data/componentsCatalog";

type Theme = "dark" | "light";
type View = "home" | "login" | "signup" | "sourcing" | "services" | "account";

const heroImage =
  "https://images.unsplash.com/photo-1577962144759-8dec6b55c952?auto=format&fit=crop&w=1800&q=90";
const sourcingImage =
  "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1800&q=90";
const manufacturingImage =
  "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?auto=format&fit=crop&w=1800&q=90";

const categories = [
  { name: "Boards & MCUs", count: "ESP32, Arduino, Pi", icon: "board", catFilter: "Development Boards" },
  { name: "Sensors & Modules", count: "Motion, IMU, camera", icon: "sensor", catFilter: "Sensors" },
  { name: "Components & ICs", count: "Power, logic, passives", icon: "chip", catFilter: "ICs" },
  { name: "Motors & Hardware", count: "Motion, tools, filament", icon: "tools", catFilter: "Motors" },
];

const offers = [
  {
    brand: "ESP32 DevKit V1",
    time: "24 hours",
    discount: "42 in stock",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Raspberry Pi Boards",
    time: "24 hours",
    discount: "18 in stock",
    image:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "STM32 MCUs",
    time: "48 hours",
    discount: "31 in stock",
    image:
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Camera Modules",
    time: "24 hours",
    discount: "26 in stock",
    image:
      "https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Power & Regulators",
    time: "48 hours",
    discount: "100+ stock",
    image:
      "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=700&q=85",
  },
  {
    brand: "Sensors & IMUs",
    time: "24 hours",
    discount: "65 in stock",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=85",
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

function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: () => void }) {
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
  mode: Exclude<View, "home">;
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
                <input type="text" name="name" placeholder="Your full name" autoComplete="name" required />
              </label>
            )}
            <label>
              Email address
              <input type="email" name="email" placeholder="you@example.com" autoComplete="email" required />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder={isSignup ? "At least 8 characters" : "Your password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
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
            {isSignup && (
              <label className="check-label terms-check">
                <input type="checkbox" required />I agree to the Terms and Privacy Policy.
              </label>
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
  const [favorites, setFavorites] = useState<string[]>(["ESP32-WROOM-32 Development Board"]);
  const [cart, setCart] = useState<Array<{ product: ComponentItem; quantity: number }>>([
    { product: COMPONENTS_CATALOG[0], quantity: 1 },
  ]);
  const [selectedProduct, setSelectedProduct] = useState<ComponentItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);
  const offersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("partsly-theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    } else {
      document.documentElement.dataset.theme = "dark";
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("partsly-theme", next);
  };

  const scrollOffers = (direction: number) => {
    offersRef.current?.scrollBy({ left: direction * 520, behavior: "smooth" });
  };

  const navigate = (nextView: View) => {
    setView(nextView);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const addToCart = (product: ComponentItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const subtotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="site-shell">
      {/* Header */}
      <header className="topbar">
        <a
          className="logo"
          href="#"
          aria-label="Partsly home"
          onClick={(event) => {
            event.preventDefault();
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
          <ThemeToggle theme={theme} onChange={toggleTheme} />

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="theme-toggle"
            title="Shopping Cart"
          >
            <span>🛒 Cart ({totalItems})</span>
          </button>

          {view === "home" ? (
            <button className="login-link" onClick={() => navigate("login")}>
              Log in
            </button>
          ) : (
            <button className="login-link" onClick={() => navigate("home")}>
              Shop
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main>
        {view === "login" || view === "signup" ? (
          <AuthPage mode={view} onNavigate={navigate} />
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
                    onClick={() =>
                      document.getElementById("sourcing")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <Mark />
                    Source a part
                  </button>
                </div>
              </div>
              <span className="hero-index">01 / 03</span>
            </section>

            {/* Brand Highlight Strip */}
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

            {/* Category Discovery Grid */}
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
                {categories.map((item) => (
                  <button
                    className="category-card"
                    key={item.name}
                    onClick={() => {
                      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Icon name={item.icon} />
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.count}</small>
                    </span>
                    <span className="arrow">↗</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Offers Carousel */}
            <section className="offers-section" id="offers" aria-labelledby="offers-title">
              <div className="section-heading wrap">
                <div>
                  <p className="eyebrow">{audience} components</p>
                  <h2 id="offers-title">Fast-moving parts, ready to ship</h2>
                </div>
                <div className="carousel-controls">
                  <button onClick={() => scrollOffers(-1)} aria-label="Previous offers">
                    ←
                  </button>
                  <button onClick={() => scrollOffers(1)} aria-label="Next offers">
                    →
                  </button>
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

            {/* Hardware Products Catalog Grid */}
            <section className="products-section wrap" id="products" aria-labelledby="products-title">
              <div className="products-heading">
                <div>
                  <p className="eyebrow">Popular hardware</p>
                  <h2 id="products-title">Components engineers trust</h2>
                </div>
                <p>Boards, sensors, modules and motion hardware—tested and ready to ship.</p>
              </div>
              <div className="product-grid">
                {(showAllProducts ? COMPONENTS_CATALOG : COMPONENTS_CATALOG.slice(0, 8)).map(
                  (product, index) => {
                    const isFavorite = favorites.includes(product.name);
                    return (
                      <article className="product-card" key={product.id}>
                        <div
                          className="product-image cursor-pointer"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <img src={product.image} alt={product.name} loading="lazy" />
                          <span className="product-discount">
                            {index % 3 === 0 ? "Bestseller" : index % 3 === 1 ? "In stock" : "Lab tested"}
                          </span>
                          <button
                            className={`favorite-button${isFavorite ? " active" : ""}`}
                            aria-label={`${isFavorite ? "Remove" : "Add"} ${product.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFavorites((current) =>
                                isFavorite
                                  ? current.filter((name) => name !== product.name)
                                  : [...current, product.name]
                              );
                            }}
                          >
                            {isFavorite ? "♥" : "♡"}
                          </button>
                        </div>
                        <div className="product-info">
                          <p>{product.manufacturer}</p>
                          <h3
                            className="cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                          >
                            {product.name}
                          </h3>
                          <div>
                            <strong>₹{product.price}</strong>
                            <del>₹{product.originalPrice}</del>
                            <button
                              onClick={() => addToCart(product)}
                              className="login-link"
                              style={{ marginLeft: "auto", fontSize: "13px" }}
                            >
                              + Add to cart
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
              <button
                className="load-more"
                onClick={() => setShowAllProducts((current) => !current)}
              >
                {showAllProducts ? "Show fewer products" : "Load more products"}
              </button>
            </section>

            {/* Operations Summary */}
            <section className="operations wrap" aria-label="Payments and delivery">
              <article>
                <span>01</span>
                <div>
                  <p className="eyebrow">Simple payments</p>
                  <h3>Pay by UPI or UTR transfer</h3>
                  <p>
                    Direct, trackable payments for individual orders, labs and business procurement.
                  </p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <p className="eyebrow">Nationwide shipping</p>
                  <h3>Express courier across India</h3>
                  <p>
                    Reliable doorstep delivery with order tracking from dispatch to arrival.
                  </p>
                </div>
              </article>
              <article>
                <span>03</span>
                <div>
                  <p className="eyebrow">Local express</p>
                  <h3>10–30 minute campus runner</h3>
                  <p>
                    Urgent components delivered directly to participating campuses and engineering labs.
                  </p>
                </div>
              </article>
            </section>

            {/* Editorial Sourcing & Custom Manufacturing */}
            <section className="editorial wrap" id="sourcing">
              <article className="editorial-card">
                <div className="editorial-image">
                  <img src={sourcingImage} alt="Electronic components prepared for sourcing" />
                </div>
                <div className="editorial-panel">
                  <p className="eyebrow">Can&apos;t find your part?</p>
                  <h2>Send the BOM. We&apos;ll source the rest.</h2>
                  <p>
                    Upload a part number, datasheet or BOM spreadsheet. Our network of 500+ verified
                    suppliers across India and Asia finds rare, specialized and out-of-stock
                    components and delivers them directly to you.
                  </p>
                  <button
                    className="button button-outline"
                    onClick={() =>
                      alert("BOM Sourcing Upload Portal activated. Send BOM files to bom@partsly.in")
                    }
                  >
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
                    Upload Gerber files for instant 2-layer or 4-layer PCB fabrication quotes, or send
                    an STL model for strong PLA and PETG enclosures, fixtures and prototype parts.
                  </p>
                  <button
                    className="button button-outline"
                    onClick={() =>
                      alert("Manufacturing Quote Portal: Upload Gerber / STL files to fab@partsly.in")
                    }
                  >
                    Get an instant quote →
                  </button>
                </div>
              </article>
            </section>
          </>
        )}
      </main>

      {/* Cart Modal Drawer */}
      {isCartOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              height: "100%",
              background: "var(--surface)",
              color: "var(--text)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderLeft: "1px solid var(--line)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>Your Cart ({totalItems})</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{ background: "none", border: 0, color: "var(--text)", fontSize: "20px", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "60vh", overflowY: "auto" }}>
                {cart.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: "14px" }}>Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        background: "var(--bg)",
                        borderRadius: "8px",
                        border: "1px solid var(--line)",
                      }}
                    >
                      <img src={item.product.image} alt={item.product.name} style={{ width: "48px", height: "48px", objectFit: "contain" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.product.name}
                        </div>
                        <div style={{ color: "var(--muted)", fontSize: "12px" }}>
                          ₹{item.product.price} × {item.quantity}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setCart((prev) => prev.filter((i) => i.product.id !== item.product.id))
                        }
                        style={{ background: "none", border: 0, color: "var(--accent)", fontWeight: 700, cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontWeight: 700 }}>
                <span>Total Amount:</span>
                <span>₹{subtotal}</span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="button button-primary"
                style={{ width: "100%" }}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout UTR Modal */}
      {isCheckoutOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "var(--surface)",
              color: "var(--text)",
              padding: "32px",
              borderRadius: "16px",
              border: "1px solid var(--line)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setIsCheckoutOpen(false)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: 0, color: "var(--text)", fontSize: "18px", cursor: "pointer" }}
            >
              ✕
            </button>

            {orderConfirmed ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>Order Confirmed!</h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "8px" }}>
                  Order Reference: <strong>{orderConfirmed}</strong>
                </p>
                <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "24px" }}>
                  Your UTR payment reference has been submitted. Our team is dispatching your components.
                </p>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setOrderConfirmed(null);
                    setCart([]);
                  }}
                  className="button button-primary"
                >
                  Back to Shopping
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>Direct UPI & UTR Payment</h3>
                <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "20px" }}>
                  Pay ₹{subtotal} via UPI QR or transfer to <strong>partsly@upi</strong>, then enter your 12-digit UTR reference number below.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (utrNumber.trim().length >= 8) {
                      setOrderConfirmed("PRT-" + Math.floor(100000 + Math.random() * 900000));
                    }
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px", fontWeight: 700 }}>
                    12-Digit UPI UTR Reference Number *
                    <input
                      type="text"
                      required
                      placeholder="e.g. 428190382910"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      style={{
                        height: "46px",
                        padding: "0 14px",
                        borderRadius: "8px",
                        border: "1px solid var(--line)",
                        background: "var(--bg)",
                        color: "var(--text)",
                        fontFamily: "monospace",
                        letterSpacing: "1px",
                      }}
                    />
                  </label>

                  <button className="button button-primary" type="submit" style={{ width: "100%", marginTop: "8px" }}>
                    Submit UTR & Confirm Order →
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "680px",
              maxHeight: "85vh",
              overflowY: "auto",
              background: "var(--surface)",
              color: "var(--text)",
              padding: "32px",
              borderRadius: "16px",
              border: "1px solid var(--line)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: 0, color: "var(--text)", fontSize: "18px", cursor: "pointer" }}
            >
              ✕
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "center" }}>
              <div style={{ background: "#fff", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "center" }}>
                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ maxHeight: "200px", objectFit: "contain" }} />
              </div>
              <div>
                <p className="eyebrow" style={{ marginBottom: "4px" }}>{selectedProduct.manufacturer}</p>
                <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 12px" }}>{selectedProduct.name}</h2>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--accent)", marginBottom: "8px" }}>
                  ₹{selectedProduct.price} <del style={{ fontSize: "14px", color: "var(--muted)", marginLeft: "8px" }}>₹{selectedProduct.originalPrice}</del>
                </div>
                <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "16px" }}>{selectedProduct.description}</p>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="button button-primary"
                  style={{ width: "100%" }}
                >
                  + Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer wrap">
        <a
          className="logo footer-logo"
          href="#"
          aria-label="Partsly home"
          onClick={(event) => {
            event.preventDefault();
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
          <a href="#sourcing">Source a part</a>
          <a href="#products">Shop</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}
