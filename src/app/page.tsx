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
    <div className="min-h-screen flex flex-col ambient-bg text-slate-900 selection:bg-[#ff6a00] selection:text-white">
      {/* Header */}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-8">
        {/* VIEW 1: SHOP & HOME CATALOG */}
        {activeTab === "home" && (
          <>
            {/* Hero Section Matching Reference Layout */}
            <div className="hero-glass-card p-6 sm:p-10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-xl space-y-3 z-10">
                <span className="text-[10px] font-black tracking-widest text-[#ff6a00] uppercase">
                  ENGINEERING HARDWARE STORE
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Everything for your project<span className="text-[#ff6a00]">.</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Find the exact parts, components and hardware you need. Build, repair, innovate — with Partsly.
                </p>

                {/* Hero Search Box */}
                <div className="pt-2">
                  <div
                    onClick={() => setIsSearchOpen(true)}
                    className="liquid-input p-2.5 flex items-center gap-3 cursor-pointer group bg-white shadow-sm border border-slate-200"
                  >
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-[#ff6a00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-xs font-semibold text-slate-500 truncate flex-1">
                      Search components, modules, ICs, tools...
                    </span>
                    <button className="w-8 h-8 rounded-lg bg-[#ff6a00] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-[#e05d00]">
                      →
                    </button>
                  </div>
                </div>
              </div>

              {/* Hardware Render Graphic */}
              <div className="w-full lg:w-96 h-56 rounded-2xl bg-gradient-to-br from-white/90 to-orange-50/60 border border-white p-4 flex items-center justify-center relative overflow-hidden shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
                  alt="Hardware Components"
                  className="max-h-full max-w-full object-contain rounded-xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Category Navigation Cards Row */}
            <CategoryNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

            {/* Catalog Products & Filter Sidebar */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
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

              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    {activeCategory} ({filteredProducts.length} products)
                  </h2>
                  <span className="text-xs font-semibold text-slate-500">
                    Verified supplier inventory
                  </span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="liquid-card p-12 text-center text-slate-400 space-y-3">
                    <div className="text-3xl">🔍</div>
                    <h3 className="text-sm font-bold text-slate-800">No components match your search filters</h3>
                    <p className="text-xs">Clear your filters or request a custom part sourcing quote.</p>
                    <button
                      onClick={() => setActiveTab("sourcing")}
                      className="liquid-button-primary px-5 py-2 text-xs font-bold"
                    >
                      Request Part Sourcing
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
