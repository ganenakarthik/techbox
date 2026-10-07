"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { SearchModal } from "@/components/SearchModal";
import { useRouter } from "next/navigation";

function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
    </span>
  );
}

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { cart, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: "/catalog", label: "🏬 Hardware Catalog" },
    { href: "/pcb", label: "⚡ PCB Instant Quote" },
    { href: "/3d-printing", label: "🧊 3D Printing Quote" },
    { href: "/sourcing", label: "📋 BOM Sourcing & RFQ" },
    { href: "/account", label: "👤 Account & Orders" },
  ];

  return (
    <>
      <header className="top-nav">
        <Link href="/" className="brand-strip">
          <Mark />
          <div>
            <div className="brand-name">PARTSLY</div>
            <div className="brand-subtitle">HARDWARE DISTRIBUTOR</div>
          </div>
        </Link>

        {/* Global Search palette button */}
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
          {/* Theme Switcher Toggle */}
          <button
            className="theme-toggle"
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

          <Link
            href="/account"
            className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-xs font-bold text-[var(--text)] hover:border-[var(--muted)]"
          >
            Account
          </Link>

          <button onClick={() => setIsCartOpen(true)} className="cart-chip">
            🛒 Cart
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </button>
        </div>
      </header>

      {/* Main Pages Sub-Header */}
      <nav className="mb-6 flex flex-wrap gap-2 border-b border-[var(--line)] pb-3 pt-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-[var(--accent)] text-white shadow-md"
                  : "border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--line)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Search Modal Workspace */}
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
