"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { PRODUCTS, COLLEGES } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  FileText,
  Cpu,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, selectedCollege, setSelectedCollege, addToast } = useApp();

  const fallbackProduct = PRODUCTS.find((p) => p.slug === resolvedParams.slug);
  const [product, setProduct] = useState<any>(fallbackProduct || null);
  const [selectedVariant, setSelectedVariant] = useState<any>(fallbackProduct?.variants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"specs" | "pinout" | "documents" | "reviews">("specs");

  React.useEffect(() => {
    async function loadLiveProduct() {
      try {
        const res = await fetch(`/api/products/${resolvedParams.slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.product) {
            setProduct(data.product);
            if (data.product.variants && data.product.variants.length > 0) {
              setSelectedVariant(data.product.variants[0]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load live product details:", err);
      }
    }
    loadLiveProduct();
  }, [resolvedParams.slug]);

  if (!product) {
    notFound();
  }

  // Campus Delivery checker state
  const [deliveryQuery, setDeliveryQuery] = useState(selectedCollege.code);
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(
    `Direct dispatch available to ${selectedCollege.name}. Est. delivery: Tomorrow by 4:30 PM.`
  );

  const isWished = isInWishlist(product.id);

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryQuery.trim()) return;
    const match = COLLEGES.find(
      (c) =>
        c.code.toLowerCase().includes(deliveryQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(deliveryQuery.toLowerCase()) ||
        c.pincode.includes(deliveryQuery)
    );

    if (match) {
      setSelectedCollege(match);
      setDeliveryStatus(`Direct dispatch confirmed to ${match.name}. Est. delivery: Tomorrow by 4:30 PM (Evening Run).`);
      addToast(`Campus verified: ${match.code}`, "success");
    } else {
      setDeliveryStatus(`Standard express transit available to ${deliveryQuery}. Est. delivery: 2-3 business days.`);
      addToast("Standard shipping route selected", "info");
    }
  };

  const handleBuyNow = () => {
    addToCart({ product, variant: selectedVariant, quantity });
    router.push("/checkout");
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3 h-3 text-neutral-600" />
        <Link href="/shop" className="hover:text-white">Shop</Link>
        <ChevronRight className="w-3 h-3 text-neutral-600" />
        <span className="text-neutral-500">{product.category}</span>
        <ChevronRight className="w-3 h-3 text-neutral-600" />
        <span className="text-white truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Images Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-[#111111] border border-[#262626] overflow-hidden shadow-2xl">
            <Image
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {selectedVariant.discount > 0 && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[#ff6a00] text-black font-extrabold text-xs shadow-lg">
                {selectedVariant.discount}% DISCOUNT
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? "border-[#ff6a00] scale-105"
                      : "border-[#262626] opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Buy Box & Specs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#ff6a00] uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  SKU: {selectedVariant.sku}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1c1c1c] border border-[#2c2c2c] text-white">
                <Star className="w-3.5 h-3.5 text-[#ff6a00] fill-[#ff6a00]" />
                <span className="font-bold">{product.rating}</span>
              </div>
              <span className="text-neutral-400">
                Based on <strong>{product.reviewCount}</strong> college lab evaluations
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#111111] border border-[#262626] space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">
                  ₹{selectedVariant.price}
                </span>
                {selectedVariant.mrp > selectedVariant.price && (
                  <span className="text-base text-neutral-500 line-through">
                    ₹{selectedVariant.mrp}
                  </span>
                )}
                {selectedVariant.discount > 0 && (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#ff6a00]/20 text-[#ff6a00] border border-[#ff6a00]/40">
                    SAVE ₹{selectedVariant.mrp - selectedVariant.price}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-neutral-400">
                Inclusive of all taxes • Eligible for FREE campus delivery on orders above ₹499
              </div>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="text-[#22c55e] font-semibold">
                In Stock ({selectedVariant.stock} units in campus warehouse)
              </span>
            </div>

            {/* Variant Selector */}
            {product.variants.length > 1 && (
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2">
                  Select Package / Variant:
                </label>
                <div className="space-y-2">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        selectedVariant.id === v.id
                          ? "bg-[#ff6a00]/10 border-[#ff6a00] text-white font-semibold"
                          : "bg-[#141414] border-[#262626] text-neutral-400 hover:text-white"
                      }`}
                    >
                      <div>
                        <div>{v.name}</div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          {v.sku}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-white">₹{v.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-neutral-300">Quantity:</span>
              <div className="flex items-center bg-[#141414] border border-[#262626] rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white text-sm"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart({ product, variant: selectedVariant, quantity })}
                  className="py-3.5 px-4 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#333333] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-[#ff6a00]" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#ff6a00]/25 transition-all"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  isWished
                    ? "bg-[#ff6a00]/10 border-[#ff6a00]/40 text-[#ff6a00]"
                    : "bg-[#141414] border-[#262626] text-neutral-400 hover:text-white"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWished ? "fill-[#ff6a00]" : ""}`} />
                <span>{isWished ? "Saved in Wishlist" : "Add to Project Wishlist"}</span>
              </button>
            </div>

            {/* Campus Delivery Checker */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] space-y-3 mt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Truck className="w-4 h-4 text-[#ff6a00]" />
                <span>Campus Delivery Estimator</span>
              </div>

              <form onSubmit={handleCheckDelivery} className="flex gap-2">
                <input
                  type="text"
                  value={deliveryQuery}
                  onChange={(e) => setDeliveryQuery(e.target.value)}
                  placeholder="Enter college code or pincode (e.g. SRM-KTR)"
                  className="flex-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6a00]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#262626] hover:bg-[#333333] text-white text-xs font-semibold rounded-xl"
                >
                  Check
                </button>
              </form>

              {deliveryStatus && (
                <div className="flex items-start gap-2 text-[11px] text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                  <span>{deliveryStatus}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specs, Pinouts, Documents, Reviews */}
      <div className="mt-16 pt-8 border-t border-[#1f1f1f]">
        <div className="flex border-b border-[#262626] gap-6 text-xs font-bold">
          {[
            { id: "specs", label: "Technical Specifications" },
            { id: "pinout", label: "Pinout & Schematic" },
            { id: "documents", label: "Datasheets & Code" },
            { id: "reviews", label: `Reviews (${product.reviewCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 transition-colors relative ${
                activeTab === tab.id
                  ? "text-[#ff6a00] font-extrabold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#ff6a00]" />
              )}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "specs" && (
            <div className="max-w-3xl space-y-4">
              <p className="text-sm text-neutral-300 leading-relaxed">
                {product.details}
              </p>
              <div className="rounded-2xl bg-[#111111] border border-[#222222] overflow-hidden">
                <table className="w-full text-xs">
                  <tbody>
                    {Object.entries(product.specs).map(([param, value], idx) => (
                      <tr
                        key={param}
                        className={idx % 2 === 0 ? "bg-[#141414]" : "bg-[#111111]"}
                      >
                        <td className="px-4 py-3 font-semibold text-neutral-400 w-1/3 border-b border-[#1f1f1f]">
                          {param}
                        </td>
                        <td className="px-4 py-3 text-white border-b border-[#1f1f1f]">
                          {String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "pinout" && (
            <div className="max-w-3xl space-y-4">
              <h3 className="text-sm font-bold text-white">Board Architecture & Pin Mapping</h3>
              <p className="text-xs text-neutral-400">
                Verified pin configuration for 3.3V logic, I2C bus (SDA/SCL), SPI channels, and ADC analog inputs.
              </p>
              <div className="relative aspect-video w-full rounded-2xl bg-[#111111] border border-[#262626] overflow-hidden flex items-center justify-center">
                <Image
                  src={product.pinoutUrl || product.images[0]}
                  alt="Pinout Diagram"
                  fill
                  className="object-contain p-4"
                />
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="max-w-2xl space-y-3">
              <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#ff6a00]" />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Official Silicon Datasheet (PDF)
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Electrical characteristics, timing diagrams & pinouts
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => addToast("Downloading technical datasheet...", "info")}
                  className="px-3 py-1.5 rounded-lg bg-[#1c1c1c] text-white text-xs font-semibold hover:bg-[#252525]"
                >
                  Download PDF
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-[#ff6a00]" />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Arduino / MicroPython Starter Example Code
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Quickstart verification sketch with serial monitor telemetry
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => addToast("Opening example code...", "info")}
                  className="px-3 py-1.5 rounded-lg bg-[#1c1c1c] text-white text-xs font-semibold hover:bg-[#252525]"
                >
                  View Code
                </button>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
                <div>
                  <h3 className="text-sm font-bold text-white">Student Lab Reviews</h3>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Verified purchases tested in engineering college workshops
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-base font-bold text-white">
                  <Star className="w-4 h-4 text-[#ff6a00] fill-[#ff6a00]" />
                  <span>{product.rating} / 5.0</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: "Rahul Verma",
                    college: "SRM Kattankulathur (ECE Dept)",
                    rating: 5,
                    title: "Works flawlessly with PlatformIO and FreeRTOS",
                    date: "3 days ago",
                    comment:
                      "Used this for my 6th sem mini-project (Smart Hydroponics). Soldered pins are straight and firm. Delivery arrived at Gate 1 in under 24 hours.",
                  },
                  {
                    name: "Pooja Sundaram",
                    college: "VIT Vellore (CSE Dept)",
                    rating: 5,
                    title: "Clean CP2102 driver recognition on macOS",
                    date: "1 week ago",
                    comment:
                      "Flash memory verified at genuine 4MB. Both Wi-Fi telemetry and Bluetooth advertising worked straight out of the box with zero boot button issues.",
                  },
                ].map((rev, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-semibold text-white">{rev.name}</div>
                      <span className="text-neutral-500">{rev.date}</span>
                    </div>
                    <div className="text-[11px] text-[#ff6a00] font-mono">{rev.college}</div>
                    <div className="text-xs font-bold text-white">{rev.title}</div>
                    <p className="text-xs text-neutral-400">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-[#1f1f1f]">
          <h2 className="text-xl font-bold text-white mb-6">Frequently Bought Together</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
