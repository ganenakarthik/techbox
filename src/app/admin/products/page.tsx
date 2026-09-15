"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { Cpu, Plus, Search, Edit3, Trash2, ShieldCheck, Check, X, Loader2, RotateCcw } from "lucide-react";

export default function AdminProductsPage() {
  const { addToast, user } = useApp();
  const [productList, setProductList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products?limit=100");
      if (res.ok) {
        const data = await res.json();
        setProductList(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const filtered = productList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStock = async (variantId: string, newStock: number) => {
    try {
      const res = await fetch(`/api/admin/inventory/${variantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: newStock }),
      });

      if (res.ok) {
        addToast("Inventory stock updated in database & logged in AdminAuditLog!", "success");
        await fetchProducts();
        setEditingProduct(null);
      } else {
        const err = await res.json();
        addToast(err.error || "Failed to update stock", "error");
      }
    } catch {
      addToast("Network error updating stock", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f] mb-8">
        <div>
          <div className="text-xs text-neutral-400 mb-1">
            <Link href="/admin" className="hover:text-white">Admin</Link> / <span className="text-white">Products</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Product & SKU Management</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Maintain real-time inventory, pricing, variant SKUs, and featured catalog items in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SKU or component..."
              className="bg-[#141414] border border-[#262626] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6a00]"
            />
          </div>
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-[#1c1c1c] border border-[#262626] text-neutral-400 hover:text-white"
            title="Refresh"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-[#111111] border border-[#262626] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161616] border-b border-[#222222] text-neutral-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Component & SKU</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Base Price</th>
                <th className="px-5 py-3.5">Campus Stock</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500">
                    <Loader2 className="w-6 h-6 animate-spin text-[#ff6a00] mx-auto mb-2" />
                    <span>Loading products from PostgreSQL catalog...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500">
                    No components found matching &ldquo;{search}&rdquo;.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const variant = prod.variants?.[0] || { sku: "SKU", price: 0, mrp: 0, stock: 0 };
                  const isEditing = editingProduct?.id === prod.id;

                  return (
                    <tr key={prod.id} className="hover:bg-[#141414] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#262626] overflow-hidden shrink-0">
                            <Image src={prod.images?.[0] || "/placeholder.png"} alt={prod.name} fill className="object-cover" />
                          </div>
                          <div className="truncate max-w-xs">
                            <div className="font-bold text-white truncate">{prod.name}</div>
                            <div className="text-[11px] text-neutral-500 font-mono">{variant.sku}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-neutral-300">{prod.category}</td>

                      <td className="px-5 py-4">
                        <div className="font-bold text-white">₹{variant.price}</div>
                        {variant.mrp > variant.price && (
                          <div className="text-[10px] text-neutral-500 line-through">₹{variant.mrp}</div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              defaultValue={variant.stock}
                              id={`stock-${prod.id}`}
                              className="w-16 bg-[#1a1a1a] border border-[#ff6a00] rounded-lg px-2 py-1 text-white font-bold"
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById(`stock-${prod.id}`) as HTMLInputElement;
                                if (input && variant.id) handleUpdateStock(variant.id, Number(input.value));
                              }}
                              className="p-1 rounded bg-[#ff6a00] text-black"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProduct(null)}
                              className="p-1 rounded bg-[#222222] text-neutral-400"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono font-bold ${
                                variant.stock < 10 ? "text-[#ef4444]" : "text-[#22c55e]"
                              }`}
                            >
                              {variant.stock} units
                            </span>
                            {variant.stock < 10 && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#ef4444]/20 text-[#ef4444]">
                                LOW
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 text-neutral-300">
                        ★ {prod.rating} ({prod.reviewCount})
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] text-neutral-300 hover:text-white transition-colors"
                          title="Edit stock"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#ff6a00]" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
