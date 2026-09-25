"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  getProductBySlug,
  getProducts,
  Product,
  ProductVariant,
} from "@/lib/data";
import { useApp } from "@/context/AppContext";
import { CAMPUSES } from "@/lib/data/fixtures/campuses";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Star,
  Truck,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Cpu,
  Heart,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  Zap,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { Real3DComponentViewerModal } from "@/components/products/Real3DComponentViewerModal";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    selectedCollege,
    setSelectedCollege,
    addToast,
  } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "pinout" | "documents" | "reviews">("specs");
  const [deliveryQuery, setDeliveryQuery] = useState(selectedCollege?.code || "");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [show360Modal, setShow360Modal] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    getProductBySlug(resolvedParams.slug)
      .then((p) => {
        if (!isMounted) return;
        setProduct(p);
        if (p?.variants?.length) {
          setSelectedVariant(p.variants[0]);
        }
        setLoading(false);

        if (p) {
          getProducts({ category: p.category, limit: 4 }).then((all) => {
            if (isMounted) {
              setRelatedProducts(all.filter((item) => item.id !== p.id));
            }
          });
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product || !product.variants || product.variants.length === 0) {
    notFound();
  }

  const activeVariant = selectedVariant || product.variants[0];
  const isWished = isInWishlist(product.id);

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryQuery.trim()) return;
    const match = CAMPUSES.find(
      (c) =>
        c.code.toLowerCase().includes(deliveryQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(deliveryQuery.toLowerCase()) ||
        c.pincode.includes(deliveryQuery)
    );

    if (match) {
      setSelectedCollege(match);
      setDeliveryStatus(`Campus hub selected: ${match.name}. Estimated delivery schedule will be confirmed at checkout.`);
      addToast(`Campus selected: ${match.code}`, "success");
    } else {
      setDeliveryStatus(`Standard courier transit selected for ${deliveryQuery}. Delivery schedule will be confirmed at checkout.`);
      addToast("Standard delivery route selected", "info");
    }
  };

  const handleBuyNow = () => {
    addToCart({ product, variant: activeVariant, quantity });
    router.push("/checkout");
  };

  return (
    <div className="bg-white min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#ff6a00] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/shop" className="hover:text-[#ff6a00] transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-600">{product.category}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Images Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shadow-xs">
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-contain p-6"
              />
              {activeVariant.discount > 0 && (
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-[#ff6a00] text-white font-extrabold text-xs shadow-sm">
                  {activeVariant.discount}% DISCOUNT
                </div>
              )}

              <button
                onClick={() => setShow360Modal(true)}
                className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white font-extrabold text-xs shadow-lg backdrop-blur-xs border border-slate-700 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-[#ff6a00]" />
                <span>360° Hardware & Pinout Inspector</span>
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-slate-50 ${
                      activeImageIndex === idx
                        ? "border-[#ff6a00] scale-105 shadow-xs"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-contain p-2" />
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
                  <span className="text-xs font-mono text-slate-400">
                    SKU: {activeVariant.sku}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5 leading-snug">
                  {product.name}
                </h1>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-slate-500">
                  Based on <strong>{product.reviewCount}</strong> student evaluations
                </span>
              </div>

              {/* Price Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{activeVariant.price}
                  </span>
                  {activeVariant.mrp > activeVariant.price && (
                    <span className="text-base text-slate-400 line-through">
                      ₹{activeVariant.mrp}
                    </span>
                  )}
                  {activeVariant.discount > 0 && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-[#ff6a00] border border-orange-200">
                      SAVE ₹{activeVariant.mrp - activeVariant.price}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500">
                  Inclusive of all taxes • Campus Runner Delivery available
                </div>
              </div>

              {/* Stock indicator */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-700 font-semibold">
                  Available for Campus Dispatch
                </span>
              </div>

              {/* Variant Selector */}
              {product.variants.length > 1 && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-2">
                    Select Package / Variant:
                  </label>
                  <div className="space-y-2">
                    {product.variants.map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                          activeVariant.id === v.id
                            ? "bg-orange-50 border-[#ff6a00] text-slate-900 font-semibold shadow-2xs"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{v.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {v.sku}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-slate-900">₹{v.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 text-sm font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 text-sm font-bold transition-colors"
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
                    className="py-3.5 px-4 rounded-xl bg-white hover:bg-orange-50 border-2 border-[#ff6a00] text-[#ff6a00] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#ff6a00]" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#ff6a00]/20 transition-all cursor-pointer active:scale-98"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isWished
                      ? "bg-orange-50 border-orange-200 text-[#ff6a00]"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWished ? "fill-[#ff6a00] text-[#ff6a00]" : "text-slate-400"}`} />
                  <span>{isWished ? "Saved in Wishlist" : "Add to Wishlist"}</span>
                </button>
              </div>

              {/* Campus Delivery Checker */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 mt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Truck className="w-4 h-4 text-[#ff6a00]" />
                  <span>Campus Delivery Estimator</span>
                </div>

                <form onSubmit={handleCheckDelivery} className="flex gap-2">
                  <input
                    type="text"
                    value={deliveryQuery}
                    onChange={(e) => setDeliveryQuery(e.target.value)}
                    placeholder="Enter college code or pincode (e.g. SRM-KTR)"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Check
                  </button>
                </form>

                {deliveryStatus && (
                  <div className="flex items-start gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{deliveryStatus}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section: Specs, Pinouts, Documents, Reviews */}
        <div className="mt-14 pt-8 border-t border-slate-200">
          <div className="flex border-b border-slate-200 gap-6 text-xs font-bold overflow-x-auto no-scrollbar">
            {[
              { id: "specs", label: "Technical Specifications" },
              { id: "pinout", label: "Pinout & Schematic" },
              { id: "documents", label: "Datasheets & Code" },
              { id: "reviews", label: `Reviews (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 transition-colors relative whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "text-[#ff6a00] font-extrabold"
                    : "text-slate-500 hover:text-slate-900"
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
                <p className="text-sm text-slate-700 leading-relaxed">
                  {product.details}
                </p>
                <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
                  <table className="w-full text-xs">
                    <tbody>
                      {Object.entries(product.specs).map(([param, value], idx) => (
                        <tr
                          key={param}
                          className={idx % 2 === 0 ? "bg-slate-50/70" : "bg-white"}
                        >
                          <td className="px-4 py-3 font-semibold text-slate-500 w-1/3 border-b border-slate-100">
                            {param}
                          </td>
                          <td className="px-4 py-3 text-slate-900 font-medium border-b border-slate-100">
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
                <h3 className="text-sm font-bold text-slate-900">Board Architecture & Pin Mapping</h3>
                <p className="text-xs text-slate-600">
                  Verified pin configuration for 3.3V logic, I2C bus (SDA/SCL), SPI channels, and ADC analog inputs.
                </p>
                <div className="relative aspect-video w-full rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
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
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#ff6a00]" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        Silicon Datasheet (PDF)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Electrical characteristics, timing diagrams & pinouts
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToast("Downloading technical datasheet...", "info")}
                    className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    Download PDF
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-[#ff6a00]" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        Arduino / MicroPython Starter Example Code
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Quickstart verification sketch with serial monitor telemetry
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToast("Opening example code...", "info")}
                    className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    View Code
                  </button>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-3xl space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Student Feedback & Reviews</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Student reviews from engineering campuses
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-base font-bold text-slate-900">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
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
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-semibold text-slate-900">{rev.name}</div>
                        <span className="text-slate-400">{rev.date}</span>
                      </div>
                      <div className="text-[11px] text-[#ff6a00] font-mono font-semibold">{rev.college}</div>
                      <div className="text-xs font-bold text-slate-900">{rev.title}</div>
                      <p className="text-xs text-slate-600">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 pt-10 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Bought Together</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Real 3D WebGL Hardware & Pinout Spatial Inspector Modal */}
        {show360Modal && (
          <Real3DComponentViewerModal
            productName={product.name}
            productImage={product.images[activeImageIndex] || product.images[0]}
            price={activeVariant.price}
            variantId={activeVariant.id}
            category={product.category}
            onClose={() => setShow360Modal(false)}
          />
        )}
      </div>
    </div>
  );
}
