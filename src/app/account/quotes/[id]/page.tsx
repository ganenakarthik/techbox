"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  QrCode,
  Send,
  Loader2,
  Info,
  Check,
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
  adminNotes?: string;
  utrNumber?: string;
  utrSubmittedAt?: string;
  paymentVerifiedAt?: string;
  createdAt: string;
  items: QuoteItem[];
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export default function AccountQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, setIsAuthModalOpen, addToast } = useApp();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const [isDeclining, setIsDeclining] = useState<boolean>(false);
  const [declineReason, setDeclineReason] = useState<string>("");
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);

  const [utrNumber, setUtrNumber] = useState<string>("");
  const [isSubmittingUtr, setIsSubmittingUtr] = useState<boolean>(false);

  const fetchQuoteDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotes/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load quote details");
        return;
      }
      setQuote(data.quote);
      if (data.quote.utrNumber) {
        setUtrNumber(data.quote.utrNumber);
      }
    } catch (err: any) {
      setError(err.message || "Network error loading quote");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchQuoteDetail();
    } else {
      setLoading(false);
    }
  }, [id, user]);

  const handleAcceptQuote = async () => {
    if (!quote) return;
    setIsAccepting(true);
    try {
      const res = await fetch(`/api/quotes/${quote.id}/accept`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to accept quote", "error");
        return;
      }
      addToast("Quote accepted successfully! Please submit payment.", "success");
      setQuote(data.quote);
    } catch (err: any) {
      addToast(err.message || "Error accepting quote", "error");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineQuote = async () => {
    if (!quote) return;
    setIsDeclining(true);
    try {
      const res = await fetch(`/api/quotes/${quote.id}/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: declineReason }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to decline quote", "error");
        return;
      }
      addToast("Quote declined", "info");
      setShowDeclineModal(false);
      setQuote(data.quote);
    } catch (err: any) {
      addToast(err.message || "Error declining quote", "error");
    } finally {
      setIsDeclining(false);
    }
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote) return;
    if (!utrNumber.trim()) {
      addToast("Please enter a valid UTR number", "error");
      return;
    }

    setIsSubmittingUtr(true);
    try {
      const res = await fetch(`/api/quotes/${quote.id}/utr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utrNumber: utrNumber.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to submit UTR", "error");
        return;
      }
      addToast("UTR submitted successfully! Operations team will verify.", "success");
      setQuote(data.quote);
    } catch (err: any) {
      addToast(err.message || "Error submitting UTR", "error");
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-lg">
          <FileText className="w-12 h-12 text-[#ff6a00] mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-xs text-slate-500 mb-6">
            Please log in to your Partsly account to view this engineering quote.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading quote details...</p>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-lg space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Unable to View Quote</h2>
          <p className="text-xs text-slate-500">{error || "Quote not found or access denied."}</p>
          <Link
            href="/account/quotes"
            className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Return to Quotes List
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = quote.validUntil && new Date(quote.validUntil) < new Date();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/account/quotes"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#ff6a00] mb-6 font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Quotes</span>
        </Link>

        {/* Main Quote Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden mb-6">
          {/* Top Banner Header */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#ff6a00] text-black">
                  {quote.serviceType.replace("_", " ")}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Quote #{quote.quoteNumber}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black">{quote.title}</h1>
              {quote.description && (
                <p className="text-xs text-slate-400 mt-1">{quote.description}</p>
              )}
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Total Amount
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#ff6a00]">
                ₹{Number(quote.totalAmount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Status Alert Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Status:</span>
              <span className="font-extrabold uppercase text-slate-900 px-2.5 py-0.5 rounded bg-white border border-slate-200">
                {quote.status}
              </span>
            </div>

            <div className="text-slate-500 text-[11px]">
              {quote.validUntil && (
                <span>
                  Valid until: <strong>{new Date(quote.validUntil).toLocaleDateString("en-IN")}</strong>
                  {isExpired && <span className="text-rose-600 font-bold ml-1.5">(EXPIRED)</span>}
                </span>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider text-[11px]">
              Itemized Quote Breakdown
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quote.items && quote.items.length > 0 ? (
                    quote.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-medium text-slate-900">{item.description}</td>
                        <td className="p-3 text-center font-mono text-slate-600">{item.quantity}</td>
                        <td className="p-3 text-right font-mono text-slate-600">₹{Number(item.unitPrice).toLocaleString("en-IN")}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">₹{Number(item.totalPrice).toLocaleString("en-IN")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400 italic">
                        Standard custom quote package total
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-xs ml-auto space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono">₹{Number(quote.subtotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping & Handling</span>
                <span className="font-mono">₹{Number(quote.shippingFee).toLocaleString("en-IN")}</span>
              </div>
              {Number(quote.tax) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>GST Tax</span>
                  <span className="font-mono">₹{Number(quote.tax).toLocaleString("en-IN")}</span>
                </div>
              )}
              {Number(quote.discount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">-₹{Number(quote.discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>Authoritative Total</span>
                <span className="text-[#ff6a00] font-mono">₹{Number(quote.totalAmount).toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Admin Notes / Remarks */}
            {quote.notes && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <span className="font-bold block flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span>Engineer Notes & Specifications:</span>
                </span>
                <p className="text-amber-800 leading-relaxed">{quote.notes}</p>
              </div>
            )}

            {/* Action Bar based on Quote State */}
            {(quote.status === "SENT" || quote.status === "DRAFT" || quote.status === "VIEWED") && !isExpired && (
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  By accepting, this quote will move to <strong>PAYMENT_PENDING</strong> so you can pay via Scan & Pay UPI.
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowDeclineModal(true)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Decline Quote
                  </button>
                  <button
                    onClick={handleAcceptQuote}
                    disabled={isAccepting}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isAccepting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Accept Quote</span>
                  </button>
                </div>
              </div>
            )}

            {/* Scan & Pay UPI Payment Section */}
            {(quote.status === "ACCEPTED" || quote.status === "PAYMENT_PENDING" || quote.status === "PAYMENT_SUBMITTED" || quote.status === "PAYMENT_VERIFIED") && (
              <div className="pt-6 border-t border-slate-200 space-y-6">
                <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#ff6a00] text-black uppercase tracking-wider">
                        Partsly Scan & Pay UPI
                      </span>
                      <h3 className="text-lg font-black mt-1">UPI Payment Verification</h3>
                    </div>
                    {quote.status === "PAYMENT_VERIFIED" && (
                      <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-xs font-black flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  {quote.status === "PAYMENT_VERIFIED" ? (
                    <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs space-y-1">
                      <p className="font-bold">✓ Payment verified by Partsly Operations Team.</p>
                      <p className="text-emerald-300/80">
                        Verified At: {quote.paymentVerifiedAt ? new Date(quote.paymentVerifiedAt).toLocaleString("en-IN") : "N/A"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Left: QR Code & UPI details */}
                      <div className="bg-white text-slate-900 p-4 rounded-2xl space-y-3 text-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                          Scan with Google Pay, PhonePe, Paytm, BHIM
                        </span>
                        <div className="relative w-40 h-40 mx-auto border-2 border-slate-900 rounded-xl overflow-hidden p-2 bg-white">
                          <Image
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=partsly@upi%26pn=Partsly%26am=${quote.totalAmount}%26cu=INR`}
                            alt="Scan & Pay UPI QR Code"
                            width={160}
                            height={160}
                            className="object-contain"
                          />
                        </div>
                        <div className="text-xs font-mono font-bold text-slate-800 bg-slate-100 p-2 rounded-xl">
                          UPI ID: <span className="text-[#ff6a00]">partsly@upi</span>
                        </div>
                      </div>

                      {/* Right: Submit UTR Form */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                          Submit Transaction UTR / Ref Number
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          After making the UPI payment of <strong className="text-white">₹{Number(quote.totalAmount)}</strong>, enter the 12-digit UTR number below:
                        </p>

                        <form onSubmit={handleSubmitUtr} className="space-y-3">
                          <input
                            type="text"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            placeholder="Enter 12-digit UTR / Ref Number"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6a00]"
                          />

                          <button
                            type="submit"
                            disabled={isSubmittingUtr}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {isSubmittingUtr ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            <span>{quote.status === "PAYMENT_SUBMITTED" ? "Update UTR Number" : "Submit UTR for Verification"}</span>
                          </button>
                        </form>

                        {quote.utrNumber && (
                          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs">
                            Current UTR: <strong className="font-mono">{quote.utrNumber}</strong> (Awaiting Admin Confirmation)
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Decline Engineering Quote</h3>
            <p className="text-xs text-slate-500">
              Please tell us why you are declining quote #{quote.quoteNumber} so we can assist you better:
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Budget exceeded, modified requirements, alternative part found..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineQuote}
                disabled={isDeclining}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
              >
                {isDeclining && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Decline</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
