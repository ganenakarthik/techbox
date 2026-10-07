"use client";

import React, { useState, useEffect } from "react";
import { COMPONENTS_CATALOG, ComponentItem } from "../data/componentsCatalog";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: ComponentItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        // Toggle or open search modal
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = COMPONENTS_CATALOG.filter((item) =>
    query === ""
      ? true
      : item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
        item.sku.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-20 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl">
        {/* Search Header Input */}
        <div className="relative border-b border-[var(--line)] p-4">
          <input
            type="text"
            autoFocus
            placeholder="Search component name, MPN, SKU, category (e.g. ESP32, STM32, Servo, PETG)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3 text-base text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="absolute right-6 top-7 text-xs font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--text)]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 divide-y divide-[var(--line)]">
          {results.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--muted)]">
              No matching components found for &quot;{query}&quot;
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
                className="group flex cursor-pointer items-center justify-between py-3 transition-colors hover:bg-[var(--surface-2)] px-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-2)] text-xs font-bold text-[var(--accent)]">
                    {item.category.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                      {item.name}
                    </div>
                    <div className="text-xs text-[var(--muted)]">
                      {item.manufacturer} • SKU: {item.sku}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[var(--accent)]">₹{item.price}</div>
                  <div className="text-[11px] text-[var(--muted)]">{item.stock}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--surface-2)] px-4 py-2 text-xs text-[var(--muted)]">
          <span>⚡ Press <kbd className="rounded border border-[var(--line)] bg-[var(--surface)] px-1.5 py-0.5">Ctrl</kbd> + <kbd className="rounded border border-[var(--line)] bg-[var(--surface)] px-1.5 py-0.5">K</kbd> anywhere to search</span>
          <span>{results.length} Components Available</span>
        </div>
      </div>
    </div>
  );
};
