"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CategoryNav } from "@/components/catalog/CategoryNav";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductDetailModal } from "@/components/catalog/ProductDetailModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { SourcingSection } from "@/components/sourcing/SourcingSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { AccountModal } from "@/components/account/AccountModal";
import { COMPONENTS_CATALOG, ComponentItem, filterProducts } from "@/data/componentsCatalog";
import { Search, ArrowRight, Star, Heart, CheckCircle2 } from "lucide-react";

export default function Page() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<string>("home");

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("relevance");

  // Cart & Wishlist States
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({
    "esp32-devkit-v1": 2,
    "arduino-uno-r3": 1,
    "mpu6050-sensor": 1,
  });
  const [wishlistIds, setWishlistIds] = useState<string[]>(["esp32-devkit-v1", "raspberry-pi-4b-4gb"]);

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ComponentItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter Catalog
  const filteredProducts = useMemo(() => {
    return filterProducts(
      COMPONENTS_CATALOG,
      searchQuery,
      selectedCategory,
      0,
      priceRange,
      inStockOnly,
      minRating,
      sortBy
    );
  }, [searchQuery, selectedCategory, priceRange, inStockOnly, minRating, sortBy]);

  // Cart Calculations
  const totalCartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  const totalCartPrice = Object.entries(cartItems).reduce((sum, [id, qty]) => {
    const item = COMPONENTS_CATALOG.find((c) => c.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleAddToCart = (id: string, name: string) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setToastMessage(`Added ${name} to cart!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleToggleWishlist = (id: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(id);
      if (exists) return prev.filter((i) => i !== id);
      return [...prev, id];
    });
  };

  const resetFilters = () => {
    setSelectedCategory("All Categories");
    setSearchQuery("");
    setPriceRange(5000);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy("relevance");
  };

  return (
    <div className="min-h-screen bg-[#fbfcfd] text-slate-900 font-sans selection:bg-[#ff6a00] selection:text-white flex flex-col justify-between">
      {/* 1. Header Navigation */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSearch={() => setCurrentView("search")}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#ff6a00] text-xs font-bold font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#ff6a00]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10 w-full">
        {/* VIEW 1: HOME PAGE (Screen 1 in image) */}
        {currentView === "home" && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-white via-orange-50/30 to-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 text-[#ff6a00] text-xs font-bold uppercase tracking-wider">
                    ENGINEERING HARDWARE STORE
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
                    Everything for <br />
                    <span className="text-slate-700">your project</span>
                    <span className="text-[#ff6a00]">.</span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl leading-relaxed">
                    Find the exact parts, components and hardware you need. Build, repair, innovate — with Partsly.
                  </p>

                  {/* Search Bar Input Pill */}
                  <div className="pt-2 max-w-xl">
                    <div className="w-full bg-white border border-slate-300 rounded-full p-2 flex items-center justify-between gap-3 shadow-sm hover:border-[#ff6a00] transition-colors">
                      <div className="flex items-center gap-2.5 px-3 text-slate-400 flex-1">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setCurrentView("search");
                          }}
                          placeholder="Search components, modules, ICs, tools..."
                          className="w-full bg-transparent text-xs text-slate-900 font-medium focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => setCurrentView("search")}
                        className="w-9 h-9 rounded-full bg-[#ff6a00] hover:bg-orange-600 text-white flex items-center justify-center font-bold cursor-pointer transition-colors shadow-sm"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Visual Floating Component */}
                <div className="lg:col-span-5 hidden lg:block">
                  <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/90 shadow-xl flex flex-col items-center text-center space-y-4">
                    <div className="h-52 w-full bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100">
                      <img
                        src={COMPONENTS_CATALOG[0].image}
                        alt="ESP32"
                        className="h-full object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="font-extrabold text-sm text-slate-950">{COMPONENTS_CATALOG[0].name}</div>
                      <div className="text-xs font-mono text-[#ff6a00] font-black">₹389 • In Stock</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Category Navigation Pills */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setCurrentView("search");
              }}
            />

            {/* Popular Components Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-950">Popular Components</h3>
                <button
                  onClick={() => setCurrentView("search")}
                  className="text-xs font-bold text-[#ff6a00] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {COMPONENTS_CATALOG.slice(0, 5).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cartQuantity={cartItems[product.id] || 0}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectProduct={setQuickViewProduct}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SEARCH & SHOP WORKSPACE (Screen 2 in image) */}
        {currentView === "search" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Query Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search components..."
                  className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span>{filteredProducts.length} results</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Filter Sidebar */}
              <FilterSidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                priceRange={priceRange}
                onSetPriceRange={setPriceRange}
                inStockOnly={inStockOnly}
                onSetInStockOnly={setInStockOnly}
                minRating={minRating}
                onSetMinRating={setMinRating}
                sortBy={sortBy}
                onSetSortBy={setSortBy}
                onResetFilters={resetFilters}
                isMobileDrawerOpen={isMobileFilterOpen}
                onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
              />

              {/* Product Grid */}
              <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      cartQuantity={cartItems[product.id] || 0}
                      isWishlisted={wishlistIds.includes(product.id)}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateQuantity}
                      onToggleWishlist={handleToggleWishlist}
                      onSelectProduct={setQuickViewProduct}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                    <p className="text-sm font-bold text-slate-900">No components match your search filter.</p>
                    <button onClick={resetFilters} className="px-4 py-2 rounded-xl bg-[#ff6a00] text-white text-xs font-bold">
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SERVICES PAGE (Screen 6 in image) */}
        {currentView === "services" && (
          <div className="animate-in fade-in duration-200">
            <ServicesSection />
          </div>
        )}

        {/* VIEW 4: SOURCING PAGE (Screen 7 in image) */}
        {currentView === "sourcing" && (
          <div className="animate-in fade-in duration-200">
            <SourcingSection />
          </div>
        )}

        {/* VIEW 5: ACCOUNT & ORDERS PAGE (Screen 8 in image) */}
        {currentView === "account" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-200 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-[#ff6a00] text-white font-black text-lg flex items-center justify-center">
                KG
              </div>
              <div>
                <div className="font-extrabold text-base text-slate-950">Karthik Ganena</div>
                <div className="text-xs text-slate-500 font-medium">Campus Gate Handoff Account</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-black text-sm text-slate-900">Orders & Active Dispatches</h3>
              <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs font-mono space-y-1">
                <div className="font-bold text-[#ff6a00]">Order #PTS-9812 — Gate Handoff Active</div>
                <div className="text-slate-600">Items: ESP32 DevKit V1 (x2), Arduino Uno R3 (x1)</div>
                <div className="font-black text-slate-950 pt-1">Total: ₹1,427</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        cartQuantity={quickViewProduct ? cartItems[quickViewProduct.id] || 0 : 0}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        catalog={COMPONENTS_CATALOG}
        onUpdateQuantity={handleUpdateQuantity}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        catalog={COMPONENTS_CATALOG}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentView("search");
        }}
        onOpenSearch={() => setCurrentView("search")}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={() => setCurrentView("account")}
        onOpenSourcing={() => setCurrentView("sourcing")}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentView("search");
        }}
        onOpenServices={() => setCurrentView("services")}
        onOpenSourcing={() => setCurrentView("sourcing")}
      />
    </div>
  );
}
