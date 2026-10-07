"use client";

import React, { useEffect, useRef, useState } from "react";
import { COMPONENTS_CATALOG, ComponentItem, filterProducts } from "@/data/componentsCatalog";
import { PCBQuoteCalculator } from "@/components/PCBQuoteCalculator";
import { Print3DCalculator } from "@/components/Print3DCalculator";
import { BOMSourcingTool } from "@/components/BOMSourcingTool";
import { SearchModal } from "@/components/SearchModal";
import { AccountModal } from "@/components/AccountModal";
import { FilterDrawer } from "@/components/FilterDrawer";

type Theme = "dark" | "light";
type MainTab = "catalog" | "pcb" | "print3d" | "bom";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specs: string;
  image: string;
}

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

export default function Home() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [activeTab, setActiveTab] = useState<MainTab>("catalog");

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ComponentItem | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "esp32-wroom-32d",
      name: "ESP32-WROOM-32D Wi-Fi + BT Module",
      price: 249,
      quantity: 2,
      specs: "4MB Flash, Dual Core 240MHz",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    },
  ]);

  // Checkout UTR state
  const [utrNumber, setUtrNumber] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"address" | "payment" | "success">("address");

  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
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

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const scrollOffers = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const amount = direction === "left" ? -300 : 300;
    carouselRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const categoriesList = [
    "All Categories",
    "Microcontrollers",
    "Development Boards",
    "Sensors",
    "Motors",
    "3D Printing",
    "Laptop Parts",
    "Power Supplies",
  ];

  const filteredProducts = filterProducts(
    COMPONENTS_CATALOG,
    searchQuery,
    selectedCategory,
    0,
    maxPrice,
    inStockOnly,
    0,
    sortBy
  );

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gstAmount = Math.round(subtotal * 0.18);
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const grandTotal = subtotal + gstAmount + shippingFee;

  return (
    <div className="app-shell">
      {/* Top Navbar */}
      <header className="top-nav">
        <div className="brand-strip cursor-pointer" onClick={() => setActiveTab("catalog")}>
          <Mark />
          <div>
            <div className="brand-name">PARTSLY</div>
            <div className="brand-subtitle">HARDWARE DISTRIBUTOR</div>
          </div>
        </div>

        {/* Global Search trigger */}
        <div className="search-bar cursor-pointer" onClick={() => setIsSearchOpen(true)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 21l-5.2-5.2M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
          </svg>
          <input
            type="text"
            readOnly
            placeholder="Search MPN, ICs, STM32, ESP32, 3D printing (Ctrl + K)..."
            className="cursor-pointer"
          />
          <kbd className="hidden sm:inline-block rounded border border-[var(--line)] bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted)]">
            Ctrl K
          </kbd>
        </div>

        <div className="nav-actions">
          <ThemeToggle theme={theme} onChange={toggleTheme} />
          
          <button
            onClick={() => setIsAccountOpen(true)}
            className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-xs font-bold text-[var(--text)] hover:border-[var(--muted)]"
          >
            👤 Account
          </button>

          <button onClick={() => setIsCartOpen(true)} className="cart-chip">
            🛒 Cart
            {cart.length > 0 && <span className="badge">{cart.reduce((a, c) => a + c.quantity, 0)}</span>}
          </button>
        </div>
      </header>

      {/* Main Tab Navigation Bar */}
      <nav className="mb-6 flex flex-wrap gap-2 border-b border-[var(--line)] pb-3 pt-2">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "catalog"
              ? "bg-[var(--accent)] text-white shadow-md"
              : "border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--line)]"
          }`}
        >
          🏬 Hardware Catalog ({filteredProducts.length})
        </button>
        <button
          onClick={() => setActiveTab("pcb")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "pcb"
              ? "bg-[var(--accent)] text-white shadow-md"
              : "border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--line)]"
          }`}
        >
          ⚡ PCB Instant Quote Engine
        </button>
        <button
          onClick={() => setActiveTab("print3d")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "print3d"
              ? "bg-[var(--accent)] text-white shadow-md"
              : "border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--line)]"
          }`}
        >
          🧊 3D Printing Quote Engine
        </button>
        <button
          onClick={() => setActiveTab("bom")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "bom"
              ? "bg-[var(--accent)] text-white shadow-md"
              : "border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--line)]"
          }`}
        >
          📋 BOM Sourcing & RFQ Uploader
        </button>
      </nav>

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
            <button onClick={() => setActiveTab("catalog")} className="btn-primary">
              Explore Hardware Catalog
            </button>
            <button onClick={() => setActiveTab("pcb")} className="btn-secondary">
              Calculate Instant PCB Quote
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <img src={heroImage} alt="Hardware Components" />
        </div>
      </section>

      {/* Main Tab Content Views */}
      <main className="mt-8">
        {/* TAB 1: HARDWARE CATALOG */}
        {activeTab === "catalog" && (
          <section className="space-y-6">
            {/* Catalog Header & Search Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Categories:</span>
                {categoriesList.slice(0, 6).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-[var(--accent)] text-white font-bold"
                        : "bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--line)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                  className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)]"
                >
                  ⚡ Filters & Sliders {showFilterDrawer ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {/* Filter Drawer collapsible */}
            {showFilterDrawer && (
              <FilterDrawer
                category={selectedCategory}
                setCategory={setSelectedCategory}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                sortBy={sortBy}
                setSortBy={setSortBy}
                categories={categoriesList}
              />
            )}

            {/* In-Stock Offers Carousel */}
            <section className="carousel-section rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <div className="carousel-header">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text)]">Popular Prototyping Modules</h2>
                  <p className="text-xs text-[var(--muted)]">Ready to dispatch from Bangalore & Mumbai hubs</p>
                </div>
                <div className="carousel-controls">
                  <button onClick={() => scrollOffers("left")} aria-label="Scroll left">‹</button>
                  <button onClick={() => scrollOffers("right")} aria-label="Scroll right">›</button>
                </div>
              </div>

              <div className="carousel-track" ref={carouselRef}>
                {offers.map((item, idx) => (
                  <div key={idx} className="offer-card group cursor-pointer" onClick={() => setActiveTab("catalog")}>
                    <img src={item.image} alt={item.brand} />
                    <div className="offer-body">
                      <div className="brand">{item.brand}</div>
                      <div className="discount">{item.discount}</div>
                      <div className="time">Dispatches in {item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-md"
                >
                  {product.badge && (
                    <span className="absolute left-4 top-4 z-10 rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {product.badge}
                    </span>
                  )}

                  <div
                    className="cursor-pointer space-y-3"
                    onClick={() => setSelectedProduct(product)}
                  >
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
                  </div>

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
                          handleAddToCart({
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
        )}

        {/* TAB 2: PCB INSTANT QUOTE */}
        {activeTab === "pcb" && (
          <section className="space-y-6">
            <PCBQuoteCalculator onAddToCart={handleAddToCart} />
          </section>
        )}

        {/* TAB 3: 3D PRINTING QUOTE */}
        {activeTab === "print3d" && (
          <section className="space-y-6">
            <Print3DCalculator onAddToCart={handleAddToCart} />
          </section>
        )}

        {/* TAB 4: BOM SOURCING */}
        {activeTab === "bom" && (
          <section className="space-y-6">
            <BOMSourcingTool />
          </section>
        )}
      </main>

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

            {/* Technical Specs Table */}
            <div className="mt-6 border-t border-[var(--line)] pt-4">
              <h4 className="mb-2 text-xs font-bold uppercase text-[var(--muted)]">Technical Parameters</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedProduct.techSpecs).map(([key, val]) => (
                  <div key={key} className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2">
                    <span className="font-semibold text-[var(--text)] capitalize">{key}: </span>
                    <span className="text-[var(--muted)]">{val}</span>
                  </div>
                ))}
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
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="h-6 w-6 rounded border border-[var(--line)] bg-[var(--surface)] text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="h-6 w-6 rounded border border-[var(--line)] bg-[var(--surface)] text-xs font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
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
                  UTR Reference <span className="font-mono font-bold text-[var(--accent)]">{utrNumber}</span> has been logged. Tracking details sent to your phone.
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

      {/* Auxiliary Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => {
          setSelectedProduct(prod);
          setIsSearchOpen(false);
        }}
      />

      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />

      {/* Footer */}
      <footer className="footer border-t border-[var(--line)] mt-12 pt-8 pb-6 text-xs text-[var(--muted)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Mark />
            <span className="font-bold text-[var(--text)]">PARTSLY HARDWARE DISTRIBUTOR</span>
          </div>
          <div>© 2026 Partsly TechBox Inc. All rights reserved. • ISO 9001 Certified Quality</div>
        </div>
      </footer>
    </div>
  );
}
