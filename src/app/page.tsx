"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CategoryNav } from "@/components/catalog/CategoryNav";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductDetailModal } from "@/components/catalog/ProductDetailModal";
import { SearchWorkspaceModal } from "@/components/search/SearchWorkspaceModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { SourcingSection } from "@/components/sourcing/SourcingSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { AccountModal } from "@/components/account/AccountModal";
import { COMPONENTS_CATALOG, ComponentItem, filterProducts } from "@/data/componentsCatalog";
import { Search, ArrowRight, Sparkles, MessageSquare, CheckCircle2 } from "lucide-react";

const POPULAR_SEARCHES = [
  "ESP32",
  "Arduino",
  "Raspberry Pi",
  "Sensors",
  "Motors",
  "Connectors",
  "Laptop parts",
];

export default function Page() {
  // State Management
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("relevance");

  // Cart State
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({
    "esp32-devkit-v1": 2,
    "arduino-uno-r3": 1,
    "mpu6050-sensor": 1,
  });

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>(["esp32-devkit-v1", "raspberry-pi-4b-4gb"]);

  // Modal / Drawer States
  const [isSearchWorkspaceOpen, setIsSearchWorkspaceOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSourcingModalOpen, setIsSourcingModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountInitialTab, setAccountInitialTab] = useState<"account" | "wishlist">("account");
  const [quickViewProduct, setQuickViewProduct] = useState<ComponentItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter Catalog Items
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

  // Actions
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
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 font-sans selection:bg-[#ff6a00] selection:text-white flex flex-col justify-between">
      {/* 1. Header Navigation */}
      <Header
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
        wishlistCount={wishlistIds.length}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenSearch={() => setIsSearchWorkspaceOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          setAccountInitialTab("wishlist");
          setIsAccountModalOpen(true);
        }}
        onOpenAccount={() => {
          setAccountInitialTab("account");
          setIsAccountModalOpen(true);
        }}
        onOpenSourcing={() => setIsSourcingModalOpen(true)}
        onOpenServices={() => setIsServicesModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#ff6a00] text-xs font-bold font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#ff6a00]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Discovery & Catalog Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10 w-full">
        {/* Discovery Hero Section */}
        <section className="bg-gradient-to-r from-white via-orange-50/40 to-white rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-sm relative overflow-hidden">
          {/* Subtle Ambient Light Glow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100/80 text-[#ff6a00] text-[11px] font-mono font-bold uppercase tracking-wider border border-orange-200/60 shadow-2xs">
                ENGINEERING HARDWARE STORE
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-zinc-950 tracking-tight leading-[1.1]">
                Everything for your <span className="text-[#ff6a00]">project.</span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal max-w-xl">
                Find exact components, dev boards, sensors and hardware — or let Partsly source what you need. Fast campus gate dispatch & lab delivery.
              </p>

              {/* Functional Search Bar */}
              <div className="pt-2 max-w-xl">
                <div
                  onClick={() => setIsSearchWorkspaceOpen(true)}
                  className="w-full bg-white border border-zinc-300 hover:border-[#ff6a00] rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 text-xs sm:text-sm text-zinc-500 shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 text-zinc-400 flex-1 truncate">
                    <Search className="w-5 h-5 text-[#ff6a00] group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-zinc-700 truncate">
                      Search ESP32, Arduino, sensor, IC, connector...
                    </span>
                  </div>
                  <button className="px-5 py-2.5 rounded-xl bg-[#ff6a00] hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition-colors shrink-0">
                    Search Catalog
                  </button>
                </div>
              </div>

              {/* Popular Search Tags */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono pt-1">
                <span className="text-zinc-400 font-bold">Popular:</span>
                {POPULAR_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setIsSearchWorkspaceOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-orange-50 text-zinc-700 hover:text-[#ff6a00] border border-zinc-200 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware Component Visual Feature */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-zinc-200/90 shadow-xl space-y-4">
                <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-100 pb-2">
                  <span className="font-bold text-[#ff6a00]">LAB FEATURED COMPONENT</span>
                  <span className="text-zinc-400">SKU: ESP32-DEVKIT-V1</span>
                </div>
                <div className="h-56 bg-zinc-50 rounded-xl overflow-hidden flex items-center justify-center p-3 border border-zinc-100">
                  <img
                    src={COMPONENTS_CATALOG[0].image}
                    alt="ESP32 DevKit"
                    className="w-full h-full object-contain rounded"
                  />
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-sm text-zinc-950">{COMPONENTS_CATALOG[0].name}</div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-700 font-bold">● In Stock (42 units)</span>
                    <span className="text-xl font-black text-zinc-950">₹389</span>
                  </div>
                </div>
                <button
                  onClick={() => setQuickViewProduct(COMPONENTS_CATALOG[0])}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-[#ff6a00] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-mono"
                >
                  View Full Specs Sheet →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Category Navigation Grid */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 4. Product Catalog Grid & Filters */}
        <section id="catalog" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
            <div>
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6a00] uppercase">
                ENGINEERING HARDWARE CATALOG ({filteredProducts.length} ITEMS)
              </h2>
              <h3 className="text-2xl font-black text-zinc-950">Browse Lab-Tested Components</h3>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Sheet Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2 rounded-xl bg-white text-zinc-800 text-xs font-bold border border-zinc-300 shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Filter ({filteredProducts.length})</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Desktop Left Filter Sidebar */}
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

            {/* Product Cards Grid */}
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cartQuantity={cartItems[product.id] || 0}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200 space-y-3">
                  <Search className="w-10 h-10 mx-auto text-zinc-300" />
                  <p className="text-base font-bold text-zinc-900">No components match your filter criteria.</p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl bg-[#ff6a00] text-white text-xs font-bold shadow-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. Custom Sourcing Section */}
        <SourcingSection />

        {/* 6. Engineering Services Section */}
        <ServicesSection />
      </main>

      {/* 7. Modals & Drawers */}
      <SearchWorkspaceModal
        isOpen={isSearchWorkspaceOpen}
        onClose={() => setIsSearchWorkspaceOpen(false)}
        catalog={COMPONENTS_CATALOG}
        cartItems={cartItems}
        wishlistIds={wishlistIds}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onToggleWishlist={handleToggleWishlist}
        onQuickView={setQuickViewProduct}
        initialQuery={searchQuery}
      />

      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        cartQuantity={quickViewProduct ? cartItems[quickViewProduct.id] || 0 : 0}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        catalog={COMPONENTS_CATALOG}
        onUpdateQuantity={handleUpdateQuantity}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        catalog={COMPONENTS_CATALOG}
      />

      {isSourcingModalOpen && (
        <SourcingSection
          isOpenModal={true}
          onCloseModal={() => setIsSourcingModalOpen(false)}
        />
      )}

      {isServicesModalOpen && (
        <ServicesSection
          isOpenModal={true}
          onCloseModal={() => setIsServicesModalOpen(false)}
        />
      )}

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        initialTab={accountInitialTab}
        wishlistIds={wishlistIds}
        catalog={COMPONENTS_CATALOG}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onToggleWishlist={handleToggleWishlist}
        onQuickView={setQuickViewProduct}
      />

      {/* 8. Mobile Navigation */}
      <MobileNav
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
        onSelectCategory={setSelectedCategory}
        onOpenSearch={() => setIsSearchWorkspaceOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={() => {
          setAccountInitialTab("account");
          setIsAccountModalOpen(true);
        }}
        onOpenSourcing={() => setIsSourcingModalOpen(true)}
      />

      {/* 9. Footer */}
      <Footer
        onSelectCategory={setSelectedCategory}
        onOpenServices={() => setIsServicesModalOpen(true)}
        onOpenSourcing={() => setIsSourcingModalOpen(true)}
      />
    </div>
  );
}
