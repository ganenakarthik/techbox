"use client";

import React, { useState } from "react";
import { COMPONENTS_CATALOG, filterProducts, ComponentItem } from "@/data/componentsCatalog";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryNav } from "@/components/catalog/CategoryNav";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductDetailModal } from "@/components/catalog/ProductDetailModal";
import { SearchWorkspaceModal } from "@/components/search/SearchWorkspaceModal";
import { CartDrawer, CartItem } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { SourcingSection } from "@/components/sourcing/SourcingSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { AccountModal } from "@/components/account/AccountModal";

export default function Home() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"home" | "search" | "services" | "sourcing" | "account">("home");
  const [activeCategory, setActiveCategory] = useState("All Categories");

  // Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");

  // Selection & Modals State
  const [selectedProduct, setSelectedProduct] = useState<ComponentItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Cart & Wishlist State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: COMPONENTS_CATALOG[0], quantity: 1 },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(["esp32-devkit-v1"]);

  // Orders State
  const [orders, setOrders] = useState<
    Array<{
      id: string;
      date: string;
      itemsCount: number;
      total: number;
      status: string;
      utr: string;
    }>
  >([
    {
      id: "PRT-849201",
      date: "2026-10-06",
      itemsCount: 2,
      total: 778,
      status: "Under Review by Runner",
      utr: "428190382910",
    },
  ]);

  // Handler: Add to Cart
  const handleAddToCart = (product: ComponentItem, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  // Handler: Buy Now
  const handleBuyNow = (product: ComponentItem, quantity: number) => {
    handleAddToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  // Handler: Wishlist Toggle
  const handleToggleWishlist = (product: ComponentItem) => {
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  // Handler: Cart Quantity Update
  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
      );
    }
  };

  // Handler: Remove Item
  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Handler: Checkout Success
  const handleCheckoutSuccess = (orderId: string, utr: string) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const delivery = subtotal >= 999 ? 0 : 79;
    const total = subtotal + delivery;

    setOrders((prev) => [
      {
        id: orderId,
        date: new Date().toISOString().split("T")[0],
        itemsCount: cartItems.length,
        total,
        status: "Verification Pending (UTR Submitted)",
        utr,
      },
      ...prev,
    ]);

    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsAccountOpen(true);
  };

  // Filter Catalog Items
  const filteredProducts = filterProducts(
    COMPONENTS_CATALOG,
    searchQuery,
    activeCategory,
    priceRange[0],
    priceRange[1],
    inStockOnly,
    minRating,
    sortBy
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-[#ff6a00] selection:text-white">
      {/* Persistent Floating Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        openCart={() => setIsCartOpen(true)}
        openSearch={() => setIsSearchOpen(true)}
        openAccount={() => setIsAccountOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-8">
        {/* VIEW 1: HOME CATALOG WORKSPACE */}
        {activeTab === "home" && (
          <>
            {/* Header Banner */}
            <div className="liquid-card p-6 sm:p-8 space-y-4 relative overflow-hidden">
              <div className="max-w-2xl space-y-2 relative z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20">
                  ENGINEERING HARDWARE STORE
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                  Everything for your project.
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Find components, development boards, sensors, ICs, and hardware — or let Partsly source what you need.
                </p>
              </div>

              {/* Functional Search Field */}
              <div className="pt-2 max-w-xl">
                <div
                  onClick={() => setIsSearchOpen(true)}
                  className="liquid-input p-3.5 flex items-center gap-3 cursor-pointer group text-slate-400"
                >
                  <svg className="w-5 h-5 text-[#ff6a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-xs font-semibold text-slate-600 truncate flex-1">
                    Search ESP32, Arduino, sensor, IC, connector, motor, laptop parts...
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-400">
                    SEARCH
                  </span>
                </div>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Popular:</span>
                  {["ESP32", "Arduino UNO", "Raspberry Pi", "Sensors", "Motors", "Connectors", "Laptop Parts"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag);
                        setIsSearchOpen(true);
                      }}
                      className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/80 text-slate-700 hover:text-[#ff6a00] hover:border-[#ff6a00] border border-slate-200/80 transition-colors shadow-2xs"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Pill Navigation */}
            <CategoryNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

            {/* Catalog Layout Grid */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Filter Sidebar */}
              <FilterSidebar
                selectedCategory={activeCategory}
                setSelectedCategory={setActiveCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                minRating={minRating}
                setMinRating={setMinRating}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onReset={() => {
                  setActiveCategory("All Categories");
                  setSearchQuery("");
                  setPriceRange([0, 5000]);
                  setInStockOnly(false);
                  setMinRating(0);
                  setSortBy("relevance");
                }}
                resultCount={filteredProducts.length}
              />

              {/* Product Cards Grid */}
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    {activeCategory} ({filteredProducts.length} products)
                  </h2>
                  <span className="text-xs font-semibold text-slate-500">
                    Verified stock from Indian supplier network
                  </span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="liquid-card p-12 text-center text-slate-400 space-y-3">
                    <div className="text-3xl">🔍</div>
                    <h3 className="text-sm font-bold text-slate-800">No catalog products match your active filters</h3>
                    <p className="text-xs">Try clearing filters or requesting a custom component sourcing quote.</p>
                    <button
                      onClick={() => setActiveTab("sourcing")}
                      className="liquid-button-primary px-5 py-2 text-xs font-bold"
                    >
                      Request Sourcing Quote
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={setSelectedProduct}
                        onAddToCart={handleAddToCart}
                        isWishlisted={wishlistIds.includes(product.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: SOURCING PORTAL */}
        {activeTab === "sourcing" && <SourcingSection />}

        {/* VIEW 3: SERVICES PORTAL */}
        {activeTab === "services" && <ServicesSection />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <SearchWorkspaceModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        catalog={COMPONENTS_CATALOG}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectProduct={setSelectedProduct}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onSuccess={handleCheckoutSuccess}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orders={orders}
      />
    </div>
  );
}
