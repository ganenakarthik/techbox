"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  QrCode,
  DollarSign,
  FileText,
  User,
  ArrowRight,
  XCircle,
} from "lucide-react";

export default function AdminSourcingPage() {
  const { addToast } = useApp();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedReq, setSelectedReq] = useState<any | null>(null);

  // Quote form state
  const [unitPrice, setUnitPrice] = useState("");
  const [shippingFee, setShippingFee] = useState("0");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSavingQuote, setIsSavingQuote] = useState(false);

  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchSourcingRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sourcing");
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
      } else {
        addToast(data.error || "Failed to fetch sourcing requests", "error");
      }
    } catch {
      addToast("Network error fetching sourcing requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSourcingRequests();
  }, []);

  const handleGenerateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    if (!unitPrice || isNaN(parseFloat(unitPrice))) {
      addToast("Please enter a valid quoted unit price", "error");
      return;
    }

    setIsSavingQuote(true);
    try {
      const res = await fetch(`/api/admin/sourcing/${selectedReq.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotedUnitPrice: parseFloat(unitPrice),
          quotedShippingFee: parseFloat(shippingFee || "0"),
          adminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to save quote", "error");
        return;
      }

      addToast(`Quote generated for ${selectedReq.requestNumber}! Status updated to QUOTE_READY.`, "success");
      setSelectedReq(null);
      fetchSourcingRequests();
    } catch {
      addToast("Error saving quote", "error");
    } finally {
      setIsSavingQuote(false);
    }
  };

  const handleVerifyPayment = async (action: "APPROVE" | "REJECT") => {
    if (!selectedReq) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/admin/sourcing/${selectedReq.id}/verify-payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reason: action === "REJECT" ? rejectionReason : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to verify payment", "error");
        return;
      }

      addToast(
        action === "APPROVE"
          ? `Payment verified for ${selectedReq.requestNumber}! Status set to SOURCING.`
          : `Payment rejected for ${selectedReq.requestNumber}.`,
        action === "APPROVE" ? "success" : "warning"
      );
      setSelectedReq(null);
      fetchSourcingRequests();
    } catch {
      addToast("Error verifying payment", "error");
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredRequests = requests.filter((r) =>
    filterStatus === "ALL" ? true : r.status === filterStatus
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#ff6a00] border border-orange-200 text-xs font-bold mb-1">
            <Search className="w-3.5 h-3.5" />
            <span>Partsly Operations Desk</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Component Sourcing Requests</h1>
          <p className="text-xs text-slate-500">
            Review custom component sourcing submissions, generate quotes, and verify UTR payments.
          </p>
        </div>

        <button
          onClick={fetchSourcingRequests}
          className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
        {[
          "ALL",
          "SUBMITTED",
          "QUOTE_READY",
          "CUSTOMER_ACCEPTED",
          "PAYMENT_SUBMITTED",
          "PAYMENT_VERIFIED",
          "SOURCING",
          "REJECTED",
        ].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
              filterStatus === st
                ? "bg-[#ff6a00] text-black border-[#ff6a00]"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {st.replace(/_/g, " ")} ({requests.filter((r) => (st === "ALL" ? true : r.status === st)).length})
          </button>
        ))}
      </div>

      {/* Sourcing Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#ff6a00]" />
            <span>Loading sourcing requests from Neon DB...</span>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No component sourcing requests match the selected filter status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Request #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Component & MPN</th>
                  <th className="py-3.5 px-4">Qty</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Quoted Total</th>
                  <th className="py-3.5 px-4">Submitted UTR</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{req.requestNumber}</td>
                    <td className="py-3.5 px-4">
                      <div>{req.user?.name || "Customer"}</div>
                      <div className="text-[10px] text-slate-400">{req.user?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold truncate">{req.componentName}</div>
                      {req.mpn && <div className="text-[10px] font-mono text-slate-500">MPN: {req.mpn}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-bold">×{req.quantity}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          req.status === "PAYMENT_VERIFIED" || req.status === "SOURCING"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : req.status === "PAYMENT_SUBMITTED"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : req.status === "QUOTE_READY"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : req.status === "REJECTED"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {req.quotedTotalAmount ? `₹${req.quotedTotalAmount}` : "—"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {req.utrNumber ? <span className="text-[#ff6a00] font-bold">{req.utrNumber}</span> : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReq(req);
                          setUnitPrice(req.quotedUnitPrice ? String(req.quotedUnitPrice) : "");
                          setShippingFee(req.quotedShippingFee ? String(req.quotedShippingFee) : "0");
                          setAdminNotes(req.adminNotes || "");
                          setRejectionReason("");
                        }}
                        className="py-1.5 px-3 rounded-lg bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold text-[11px] cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Action Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono text-[#ff6a00] font-bold">Manage Sourcing Request</span>
                <h3 className="text-lg font-black text-slate-900">{selectedReq.requestNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Request Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Component:</span>
                <strong className="text-slate-900">{selectedReq.componentName}</strong>
              </div>
              {selectedReq.mpn && (
                <div className="flex justify-between">
                  <span className="text-slate-500">MPN:</span>
                  <span className="font-mono text-slate-800">{selectedReq.mpn}</span>
                </div>
              )}
              {selectedReq.manufacturer && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Manufacturer:</span>
                  <span className="text-slate-800">{selectedReq.manufacturer}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <strong className="text-slate-900">×{selectedReq.quantity}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-[#ff6a00]">{selectedReq.status}</span>
              </div>
              {selectedReq.specifications && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Specifications:</span>
                  <p className="text-slate-800 leading-relaxed">{selectedReq.specifications}</p>
                </div>
              )}
              {selectedReq.referenceFileName && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-500">Reference File:</span>
                  <a
                    href={selectedReq.referenceFileUrl || `/api/files/proxy?key=${encodeURIComponent(selectedReq.referenceFileName)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[#ff6a00] font-bold hover:bg-orange-100 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>📎 {selectedReq.referenceFileName}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Section 1: Generate / Edit Quote */}
            <form onSubmit={handleGenerateQuote} className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Generate / Update Quote
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Quoted Unit Price (₹):</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Shipping / Handling Fee (₹):</label>
                  <input
                    type="number"
                    step="any"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(e.target.value)}
                    placeholder="e.g. 40"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
              </div>

              {unitPrice && !isNaN(parseFloat(unitPrice)) && (
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs flex justify-between items-center font-bold">
                  <span>Calculated Total Amount:</span>
                  <span className="text-[#ff6a00] text-sm">
                    ₹{parseFloat(unitPrice) * selectedReq.quantity + parseFloat(shippingFee || "0")}
                  </span>
                </div>
              )}

              <div>
                <label className="text-slate-600 block mb-1 text-xs font-semibold">Admin Notes / Supplier Details:</label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Sourced from ST authorized distributor stock, estimated dispatch in 4 days."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingQuote}
                className="w-full py-3 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSavingQuote ? "Saving Quote..." : "Send / Update Sourcing Quote to Customer"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Section 2: UTR Payment Verification (if payment submitted) */}
            {selectedReq.status === "PAYMENT_SUBMITTED" && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#ff6a00]" />
                  <span>Verify Customer UTR Payment</span>
                </h4>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Submitted UTR:</span>
                    <span className="font-mono text-amber-900">{selectedReq.utrNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payable Total:</span>
                    <span className="font-bold text-slate-900">₹{selectedReq.quotedTotalAmount}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleVerifyPayment("APPROVE")}
                    disabled={isVerifying}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Payment & Start Sourcing</span>
                  </button>
                  <button
                    onClick={() => handleVerifyPayment("REJECT")}
                    disabled={isVerifying}
                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Payment</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
