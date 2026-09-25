"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Users, ShoppingBag, Share2, Copy, Check, ArrowRight, Loader2,
  Sparkles, CheckCircle2, ShieldCheck, AlertCircle, Wrench, RefreshCw,
  ExternalLink, Calculator
} from "lucide-react";
import { BRAND } from "@/config/brand";

export default function SharedCartPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const { addToCart, setIsCartDrawerOpen, addToast } = useApp();

  const [cartData, setCartData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [teamSize, setTeamSize] = useState<number>(4);
  const [importing, setImporting] = useState<boolean>(false);

  useEffect(() => {
    async function loadSharedCart() {
      setLoading(true);
      try {
        const res = await fetch(`/api/cart/share/${code}`);
        if (res.ok) {
          const json = await res.json();
          setCartData(json.cart);
          if (json.cart?.teamSize) setTeamSize(json.cart.teamSize);
        } else {
          const json = await res.json();
          setError(json.error || "Shared BOM link not found");
        }
      } catch {
        setError("Failed to connect to network");
      } finally {
        setLoading(false);
      }
    }
    loadSharedCart();
  }, [code]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast("Shared BOM link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    if (!cartData) return;
    const url = window.location.href;
    const itemsSummary = (cartData.items || [])
      .map((it: any) => `• ${it.name || it.title} (x${it.quantity || 1})`)
      .join("%0A");

    const total = (cartData.items || []).reduce(
      (sum: number, it: any) => sum + (it.price || 0) * (it.quantity || 1),
      0
    );
    const perMember = Math.ceil(total / Math.max(1, teamSize));

    const text = `🛠️ *${cartData.title || "Engineering Project BOM"}*%0A%0AShared by: ${cartData.creatorName || "Team Lead"}%0A%0A*Components List:*%0A${itemsSummary}%0A%0A💰 *Total Cost:* ₹${total} (approx ₹${perMember}/member for ${teamSize} members)%0A%0A🛒 *View & Import BOM to Cart:*%0A${url}`;

    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleImportToCart = () => {
    if (!cartData || !cartData.items) return;
    setImporting(true);

    let addedCount = 0;
    cartData.items.forEach((item: any) => {
      addToCart({
        variantId: item.variantId || item.id || `var-${Math.random()}`,
        name: item.name || item.title || "Component",
        price: item.price || 0,
        image: item.image || item.imageUrl || "/logo-icon.png",
        quantity: item.quantity || 1,
        openDrawer: false,
      });
      addedCount++;
    });

    addToast(`Successfully imported ${addedCount} items into your cart!`, "success");
    setImporting(false);
    setIsCartDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-[#ff6a00] animate-spin mb-4" />
        <h2 className="text-lg font-bold text-slate-900">Retrieving Team Project BOM...</h2>
        <p className="text-xs text-slate-500 mt-1">Connecting to Partsly Shared Cart Engine</p>
      </div>
    );
  }

  if (error || !cartData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">BOM Link Expired or Invalid</h2>
        <p className="text-xs text-slate-500 max-w-md mt-2">
          {error || "This shared cart BOM code does not exist or has been modified."}
        </p>
        <Link
          href="/shop"
          className="mt-6 px-5 py-2.5 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-bold text-xs shadow-md shadow-[#ff6a00]/20 transition-all"
        >
          Browse Components Catalog
        </Link>
      </div>
    );
  }

  const items = cartData.items || [];
  const grandTotal = items.reduce(
    (sum: number, it: any) => sum + (it.price || 0) * (it.quantity || 1),
    0
  );
  const perPersonCost = Math.ceil(grandTotal / Math.max(1, teamSize));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ff6a00] text-white uppercase tracking-wider">
                Shared Capstone BOM
              </span>
              <span className="text-xs text-slate-400 font-mono font-bold">Code: {cartData.shareCode}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {cartData.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Shared by <strong className="text-slate-800">{cartData.creatorName}</strong> • {items.length} items ready for instant campus delivery
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to WhatsApp Group</span>
            </button>
          </div>
        </div>

        {/* Team Cost Splitter & Summary Card (UX Highlight) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* Cost Splitter Card */}
          <div className="md:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#ff6a00] uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                <span>Team Cost Splitter</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">CapStone Equal Split</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Project Team Members:
                </label>
                <div className="flex items-center gap-1.5">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setTeamSize(num)}
                      className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${
                        teamSize === num
                          ? "bg-[#ff6a00] text-white shadow-md shadow-[#ff6a00]/30"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold">Cost Per Member:</div>
                <div className="text-2xl sm:text-3xl font-black text-[#ff6a00] font-mono">
                  ₹{perPersonCost}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Split across {teamSize} team members</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Total BOM Price: <strong>₹{grandTotal}</strong></span>
              </div>
              <span className="font-bold text-amber-700">10-30 Min Hostel Delivery Active</span>
            </div>
          </div>

          {/* Quick Import Action Card */}
          <div className="md:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#ff6a00] uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>1-Click Team Action</span>
              </div>
              <h3 className="text-xl font-black text-white">Import BOM to My Cart</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Loads all {items.length} component SKUs into your cart drawer. Ready for instant UPI payment or dispatch.
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <button
                disabled={importing}
                onClick={handleImportToCart}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-sm shadow-lg shadow-[#ff6a00]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {importing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Import All Items to Cart (₹{grandTotal})</span>
                  </>
                )}
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer sm:hidden"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Share to WhatsApp Group</span>
              </button>
            </div>
          </div>
        </div>

        {/* Itemized BOM Table */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#ff6a00]" />
              <span>Itemized Component List ({items.length})</span>
            </h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All In Stock at DarkStore
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-mono">
                  <th className="py-2.5">Component</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Price</th>
                  <th className="py-2.5 text-right">Line Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item: any, idx: number) => {
                  const qty = item.quantity || 1;
                  const price = item.price || 0;
                  const subtotal = price * qty;

                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            <Image
                              src={item.image || item.imageUrl || "/logo-icon.png"}
                              alt={item.name || item.title || "Component"}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              {item.name || item.title}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {item.brand || BRAND.displayName} • SKU: {item.sku || "SKU-BOM"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-center font-bold font-mono text-slate-900">
                        x{qty}
                      </td>
                      <td className="py-3.5 text-right font-mono text-slate-600">
                        ₹{price}
                      </td>
                      <td className="py-3.5 text-right font-black font-mono text-slate-900 text-sm">
                        ₹{subtotal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
