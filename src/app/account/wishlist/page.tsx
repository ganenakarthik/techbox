"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { PRODUCTS } from "@/data/mockData";
import { ProductCard } from "@/components/products/ProductCard";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlist } = useApp();
  const [allProducts, setAllProducts] = React.useState<any[]>(PRODUCTS);

  React.useEffect(() => {
    fetch("/api/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setAllProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const wishedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-[#1f1f1f] mb-8">
        <div className="text-xs text-neutral-400 mb-1">
          <Link href="/account" className="hover:text-white">Account</Link> / <span className="text-white">Wishlist</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Project Hardware Wishlist</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Saved components and sensors earmarked for your upcoming capstone review.
        </p>
      </div>

      {wishedProducts.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[#111111] border border-[#222222]">
          <Heart className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h2 className="text-base font-bold text-white mb-1">Your wishlist is empty</h2>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
            Click the heart icon on any sensor, MCU, or project kit to save it here for quick group discussion.
          </p>
          <Link
            href="/shop"
            className="py-2.5 px-5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold text-xs inline-flex items-center gap-2"
          >
            <span>Browse Components</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
