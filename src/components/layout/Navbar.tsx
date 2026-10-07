"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { SearchModal } from "@/components/SearchModal";

function Mark() {
  return (
    <span className="brand-mark shrink-0" aria-hidden="true">
      <img src="/logo.png" alt="Partsly" className="h-full w-full object-contain rounded-md" />
    </span>
  );
}

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { cart, wishlist, pincode, setPincode, setIsCartOpen, grandTotal } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [tempPincode, setTempPincode] = useState(pincode);
  const [selectedSearchCategory, setSelectedSearchCategory] = useState("All");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subNavLinks = [
    { href: "/catalog", label: "🏬 All Hardware Catalog" },
    { href: "/catalog?category=Microcontrollers", label: "⚡ Microcontrollers" },
    { href: "/catalog?category=Sensors", label: "📡 Sensors & Modules" },
    { href: "/catalog?category=Motors", label: "⚙️ Motors & Hardware" },
    { href: "/pcb", label: "⚡ PCB Instant Quote" },
    { href: "/3d-printing", label: "🧊 3D Printing Quote" },
    { href: "/sourcing", label: "📋 BOM Sourcing" },
  ];

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempPincode.length === 6) {
      setPincode(tempPincode);
      setIsPincodeModalOpen(false);
    }
  };

  return (
    <>
      <header className="border-b border-[var(--line)] bg-[var(--surface)] shadow-md">
        {/* Main Top Header Bar */}
        <div className="wrap flex items-center justify-between gap-4 py-3">
          {/* Logo Lockup */}
          <Link href="/" className="logo shrink-0">
            <Mark />
            <span className="logo-copy">
              <strong>Partsly</strong>
              <small>hardware network</small>
            </span>
          </Link>

          {/* Delivery Pincode Picker Button */}
          <button
            onClick={() => setIsPincodeModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--accent)] transition-all shrink-0"
          >
            <span className="text-base text-[var(--accent)]">📍</span>
            <div className="text-left line-height-1">
              <div className="text-[10px] text-[var(--muted)] font-normal">Deliver to</div>
              <div className="font-bold">{pincode} India</div>
            </div>
          </button>

          {/* Amazon / Flipkart Style Search Bar */}
          <div className="flex-1 max-w-2xl hidden sm:flex items-center rounded-xl border border-[var(--line)] bg-[var(--surface-2)] focus-within:border-[var(--accent)] transition-all overflow-hidden shadow-inner">
            <select
              value={selectedSearchCategory}
              onChange={(e) => setSelectedSearchCategory(e.target.value)}
              className="bg-[var(--surface-2)] border-r border-[var(--line)] px-3 py-2.5 text-xs font-bold text-[var(--muted)] focus:outline-none cursor-pointer"
            >
              <option value="All">All Parts</option>
              <option value="Microcontrollers">MCUs</option>
              <option value="Sensors">Sensors</option>
              <option value="Motors">Motors</option>
              <option value="3D Printing">3D Material</option>
            </select>

            <div
              onClick={() => setIsSearchOpen(true)}
              className="flex-1 flex items-center gap-2 px-3 py-2 text-xs text-[var(--muted)] cursor-pointer"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2 text-[var(--muted)]" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span className="flex-1 font-medium">Search ESP32, STM32, NEMA 17, PETG, ICs...</span>
              <kbd className="hidden lg:inline-block rounded border border-[var(--line)] bg-[var(--bg)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted)]">
                Ctrl K
              </kbd>
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="bg-[var(--accent)] px-4 py-2.5 text-xs font-bold text-white hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Wishlist Link */}
            <Link
              href="/account"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors"
            >
              <span>♡ Wishlist</span>
              {wishlist.length > 0 && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white font-black">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              className="flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)] transition-all"
            >
              <span>👤</span>
              <div className="text-left hidden md:block line-height-1">
                <div className="text-[10px] text-[var(--muted)] font-normal">Hello, Sign In</div>
                <div>Account & Orders</div>
              </div>
            </Link>

            {/* Theme Toggle */}
            <button
              className="theme-toggle shrink-0"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
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

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative shrink-0 flex items-center gap-2 rounded-xl bg-[var(--accent)] px-3.5 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition-opacity"
            >
              🛒 Cart
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white text-[11px] font-black text-[var(--accent)]">
                {totalItems}
              </span>
              <span className="hidden md:inline font-mono font-bold border-l border-white/30 pl-2">
                ₹{grandTotal.toLocaleString()}
              </span>
            </button>
          </div>
        </div>

        {/* Sub-Header Category Navigation Bar */}
        <nav className="bg-[var(--surface-2)] border-t border-[var(--line)]">
          <div className="wrap flex items-center gap-1 overflow-x-auto py-2 text-xs font-bold uppercase tracking-wider scrollbar-none">
            {subNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`shrink-0 rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-[var(--accent)] text-white font-bold"
                      : "text-[var(--text)] hover:bg-[var(--surface)] hover:text-[var(--accent)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Pincode Modal */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 mb-4">
              <h3 className="text-sm font-bold text-[var(--text)]">📍 Choose your Delivery Location</h3>
              <button
                onClick={() => setIsPincodeModalOpen(false)}
                className="text-xs font-bold text-[var(--muted)] hover:text-[var(--text)]"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4">
              Delivery options, express lead times, and dispatch availability will be updated for your location.
            </p>
            <form onSubmit={handlePincodeSubmit} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={tempPincode}
                onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit Indian Pincode (e.g. 560001)"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-center text-sm font-mono font-bold text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--accent)] py-2.5 text-xs font-bold text-white hover:opacity-90"
              >
                Apply Pincode Location
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Search Palette Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => {
          setIsSearchOpen(false);
          router.push(`/product/${product.id}`);
        }}
      />
    </>
  );
};
