"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface QuoteItem {
  id: string;
  description: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

interface Quote {
  id: string;
  quoteNumber: string;
  serviceType: string;
  title: string;
  description?: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  currency: string;
  validUntil?: string;
  notes?: string;
  utrNumber?: string;
  createdAt: string;
  items?: QuoteItem[];
}

export default function AccountQuotesPage() {
  const { user, setIsAuthModalOpen } = useApp();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchQuotes() {
      setLoading(true);
      try {
        const res = await fetch("/api/quotes");
        if (res.ok) {
          const data = await res.json();
          setQuotes(data.quotes || []);
        }
      } catch (err) {
        console.error("Failed to load quotes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, [user]);

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-lg">
          <FileText className="w-12 h-12 text-[#ff6a00] mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-xs text-slate-500 mb-6">
            Please log in to your Partsly account to view and manage your custom engineering quotes.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            Log In to Partsly
          </button>
        </div>
      </div>
    );
  }

  const filteredQuotes = quotes.filter((q) => {
    if (activeTab === "ACTION_REQUIRED") {
      if (q.status !== "SENT" && q.status !== "VIEWED" && q.status !== "PAYMENT_PENDING") return false;
    } else if (activeTab === "VERIFIED") {
      if (q.status !== "PAYMENT_VERIFIED") return false;
    } else if (activeTab === "DECLINED") {
      if (q.status !== "DECLINED" && q.status !== "REJECTED" && q.status !== "EXPIRED") return false;
    }

    if (searchQuery) {
      const qNum = q.quoteNumber.toLowerCase();
      const title = q.title.toLowerCase();
      const query = searchQuery.toLowerCase();
      return qNum.includes(query) || title.includes(query);
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
      case "VIEWED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Ready for Review</span>
          </span>
        );
      case "ACCEPTED":
      case "PAYMENT_PENDING":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-blue-600" />
            <span>Payment Pending</span>
          </span>
        );
      case "PAYMENT_SUBMITTED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-purple-600" />
            <span>UTR Submitted (Verifying)</span>
          </span>
        );
      case "PAYMENT_VERIFIED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Payment Verified ✓</span>
          </span>
        );
      case "DECLINED":
      case "REJECTED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Declined</span>
          </span>
        );
      case "EXPIRED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-slate-500" />
            <span>Expired</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="mb-6">
          <div className="text-xs text-slate-500 mb-1">
            <Link href="/account" className="hover:text-[#ff6a00]">Account</Link> / <span className="text-slate-900 font-semibold">Engineering Quotes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            My Engineering & Project Quotes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review custom component sourcing quotes, PCB fabrication costs, prototype specs, and UPI Scan & Pay receipts.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                activeTab === "ALL"
                  ? "bg-[#ff6a00] text-black shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              All Quotes ({quotes.length})
            </button>
            <button
              onClick={() => setActiveTab("ACTION_REQUIRED")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                activeTab === "ACTION_REQUIRED"
                  ? "bg-[#ff6a00] text-black shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Action Required
            </button>
            <button
              onClick={() => setActiveTab("VERIFIED")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                activeTab === "VERIFIED"
                  ? "bg-[#ff6a00] text-black shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Payment Verified
            </button>
            <button
              onClick={() => setActiveTab("DECLINED")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                activeTab === "DECLINED"
                  ? "bg-[#ff6a00] text-black shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Archived / Declined
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Quote # or Title..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00]"
            />
          </div>
        </div>

        {/* Quotes List Content */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Fetching quotes from Partsly database...</p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3 shadow-xs">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Quotes Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              You do not have any active quotes in this category. Submit a custom component sourcing or project build request to receive a formal quote.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/services/component-sourcing"
                className="px-4 py-2 bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs rounded-xl shadow-xs transition-colors"
              >
                Request Component Sourcing
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-[#ff6a00] transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-slate-900 px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                      #{quote.quoteNumber}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded bg-slate-50 border border-slate-100">
                      {quote.serviceType.replace("_", " ")}
                    </span>
                    {getStatusBadge(quote.status)}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#ff6a00] transition-colors">
                    {quote.title}
                  </h3>

                  {quote.description && (
                    <p className="text-xs text-slate-500 line-clamp-1">{quote.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>Requested: {new Date(quote.createdAt).toLocaleDateString("en-IN")}</span>
                    {quote.validUntil && (
                      <span>Valid until: {new Date(quote.validUntil).toLocaleDateString("en-IN")}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                      Authoritative Total
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      ₹{Number(quote.totalAmount).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Link
                    href={`/account/quotes/${quote.id}`}
                    className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#ff6a00] hover:text-black text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs shrink-0"
                  >
                    <span>View Quote Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
