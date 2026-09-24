"use client";

import React from "react";
import { X, Printer, Download, ShieldCheck, CheckCircle2 } from "lucide-react";
import { BRAND } from "@/config/brand";

interface GSTInvoiceModalProps {
  order: any;
  onClose: () => void;
}

export default function GSTInvoiceModal({ order, onClose }: GSTInvoiceModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const subtotal = Number(order.subtotal || order.total || 0);
  const tax = Number(order.tax || 0);
  const shipping = Number(order.shipping || 0);
  const grandTotal = Number(order.total || subtotal + tax + shipping);

  // 18% GST split into 9% CGST and 9% SGST for intra-state (Telangana)
  const cgst = tax > 0 ? (tax / 2).toFixed(2) : ((subtotal * 0.09)).toFixed(2);
  const sgst = tax > 0 ? (tax / 2).toFixed(2) : ((subtotal * 0.09)).toFixed(2);
  const taxableValue = (subtotal - Number(cgst) - Number(sgst)).toFixed(2);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      {/* Top Action Bar (Hidden during window.print()) */}
      <div className="fixed top-4 right-4 z-[160] flex items-center gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF (A4)</span>
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* A4 Tax Invoice Document Container */}
      <div className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-10 my-8 border border-slate-200 print:shadow-none print:m-0 print:w-full print:max-w-none print:p-0 print:border-none">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2 text-[#ff6a00] font-black text-xl tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-[#ff6a00] text-white flex items-center justify-center font-extrabold text-sm">
                P
              </div>
              <span>{BRAND.displayName.toUpperCase()}</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">
              Partsly Technologies Private Limited
            </p>
            <p className="text-[10px] text-slate-500 leading-tight">
              Campus Logistics & DarkStore Network Hub 01<br />
              Hi-Tech City, Hyderabad, Telangana — 500081<br />
              <strong>GSTIN:</strong> 36AAACP0000A1Z5 | <strong>State Code:</strong> 36 (Telangana)
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              <strong>Support Email:</strong> support@partsly.in | <strong>Ops Helpline:</strong> +91 70326 35858
            </p>
          </div>

          <div className="text-right sm:text-right">
            <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-black tracking-widest uppercase rounded">
              TAX INVOICE
            </span>
            <div className="mt-3 text-xs space-y-0.5">
              <p className="text-slate-500">Invoice No: <span className="font-bold text-slate-900 font-mono">INV-{order.orderNumber}</span></p>
              <p className="text-slate-500">Order ID: <span className="font-bold text-slate-900 font-mono">#{order.orderNumber}</span></p>
              <p className="text-slate-500">Invoice Date: <span className="font-bold text-slate-900">{invoiceDate}</span></p>
              <p className="text-slate-500">Reverse Charge: <span className="font-bold text-slate-900">NO</span></p>
            </div>
          </div>
        </div>

        {/* Bill To & Ship To Details */}
        <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Billed To (Customer):</h4>
            <p className="font-black text-slate-900 text-sm">{order.recipientName || order.user?.name || "Student"}</p>
            <p className="text-slate-600 mt-0.5">{order.collegeName || order.user?.collegeName || "Engineering Campus"}</p>
            <p className="text-slate-600">Phone: {order.recipientPhone || order.user?.phone || "N/A"}</p>
            <p className="text-slate-600">Email: {order.user?.email || "N/A"}</p>
          </div>

          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Shipped To (Campus Dropzone):</h4>
            <p className="font-black text-slate-900 text-sm">{order.recipientName || "Student Dropzone"}</p>
            <p className="text-slate-600 mt-0.5">{order.shippingAddress || "Campus Main Gate / Lab"}</p>
            <p className="text-slate-600">Fulfillment: <span className="font-bold text-[#ff6a00]">10-Min DarkStore Express</span></p>
            <p className="text-slate-600">Payment Status: <span className="font-bold text-emerald-700">{order.paymentStatus || "PAID"}</span></p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase text-slate-500 font-mono">
                <th className="py-2">#</th>
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">HSN Code</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Rate (₹)</th>
                <th className="py-2 text-right">Taxable (₹)</th>
                <th className="py-2 text-right">GST (18%)</th>
                <th className="py-2 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(order.items || []).map((item: any, idx: number) => {
                const qty = item.quantity || 1;
                const unitPrice = item.price || 0;
                const itemTotal = unitPrice * qty;
                const itemTaxable = (itemTotal / 1.18).toFixed(2);
                const itemGst = (itemTotal - Number(itemTaxable)).toFixed(2);

                return (
                  <tr key={idx} className="text-slate-800">
                    <td className="py-2.5 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 font-bold">
                      {item.productName || item.title || "Electronic Component"}
                      {item.variantName && <span className="text-[10px] text-slate-500 font-normal block">{item.variantName}</span>}
                    </td>
                    <td className="py-2.5 text-center font-mono text-slate-500">85423100</td>
                    <td className="py-2.5 text-center font-bold">{qty}</td>
                    <td className="py-2.5 text-right font-mono">₹{unitPrice}</td>
                    <td className="py-2.5 text-right font-mono">₹{itemTaxable}</td>
                    <td className="py-2.5 text-right font-mono">₹{itemGst}</td>
                    <td className="py-2.5 text-right font-bold font-mono">₹{itemTotal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Calculations Box */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200 text-xs">
          <div className="max-w-xs space-y-1 text-[11px] text-slate-500">
            <p className="font-bold text-slate-800">Tax Breakdown:</p>
            <p>• CGST @ 9%: ₹{cgst}</p>
            <p>• SGST @ 9%: ₹{sgst}</p>
            <p className="mt-2 text-[10px] text-slate-400">
              * GST calculated under Intra-State Telangana CGST + SGST framework.
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between text-slate-600">
              <span>Taxable Value:</span>
              <span className="font-mono font-bold">₹{taxableValue}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total GST (18%):</span>
              <span className="font-mono font-bold">₹{(Number(cgst) + Number(sgst)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Campus Delivery Fee:</span>
              <span className="font-mono font-bold">₹{shipping}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-300">
              <span>Grand Total:</span>
              <span className="font-mono text-[#ff6a00]">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Footer & Signature */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
          <div>
            <p className="font-bold text-slate-700">Terms & Conditions:</p>
            <p>1. Computer generated Tax Invoice requires no physical signature.</p>
            <p>2. Components covered under 7-day campus replacement warranty.</p>
          </div>
          <div className="text-center sm:text-right">
            <div className="w-32 h-10 border-b border-slate-400 mx-auto sm:ml-auto mb-1 flex items-center justify-center font-serif text-slate-800 italic text-xs font-bold">
              Partsly Digital Auth
            </div>
            <p className="font-bold text-slate-800">Authorized Signatory</p>
            <p className="text-[9px] text-slate-400">Partsly Technologies Pvt Ltd</p>
          </div>
        </div>

      </div>
    </div>
  );
}
