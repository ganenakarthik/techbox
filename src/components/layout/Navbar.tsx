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
  const { cart, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: "/catalog", label: "🏬 Hardware Store" },
    { href: "/pcb", label: "⚡ PCB Fab Quote" },
    { href: "/3d-printing", label: "🧊 3D Printing Quote" },
    { href: "/sourcing", label: "📋 BOM Sourcing" },
    { href: "/account", label: "👤 Account & Orders" },
  ];

  return (
    <>
      <header className="topbar">
        {/* Brand Logo & Emblem Badge */}
        <Link href="/" className="logo shrink-0">
          <Mark />
          <span className="logo-copy">
            <strong>Partsly</strong>
            <small>hardware network</small>
          </span>
        </Link>

        {/* Global Search Palette Input Bar */}
        <div
          onClick={() => setIsSearchOpen(true)}
          className="cursor-pointer hidden xl:flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-4 py-2 text-xs font-semibold text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)] transition-all shadow-sm shrink-0 min-w-[280px]"
        >
          <svg className="w-4 h-4 fill-none stroke-current stroke-2 text-[var(--muted)]" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <span className="flex-1">Search MPN, ICs, STM32, ESP32...</span>
          <kbd className="rounded-md border border-[var(--line)] bg-[var(--bg)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted)]">
            Ctrl K
          </kbd>
        </div>

        {/* Header Actions & Navigation Links */}
        <div className="header-actions">
          {/* Multi-page Nav Links */}
          <div className="hidden lg:flex items-center gap-5 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors whitespace-nowrap ${
                    isActive ? "text-[var(--accent)] font-extrabold underline underline-offset-4" : "text-[var(--text)] hover:text-[var(--accent)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Theme Switcher Toggle */}
          <button
            className="theme-toggle shrink-0"
            onClick={toggleTheme}
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

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative shrink-0 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-4 py-2 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)] transition-all shadow-sm"
          >
            🛒 Cart
            {totalItems > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[11px] font-black text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile / Tablet Sub-Navigation Bar */}
      <div className="flex lg:hidden overflow-x-auto gap-2 border-b border-[var(--line)] pb-2 mb-4 px-4 text-xs font-bold uppercase tracking-wider scrollbar-none">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors ${
                isActive ? "bg-[var(--accent)] text-white font-bold shadow-sm" : "bg-[var(--surface-2)] text-[var(--text)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

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
