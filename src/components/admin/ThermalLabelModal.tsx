"use client";

import React from "react";
import { X, Printer, Package, Truck, QrCode } from "lucide-react";
import { BRAND } from "@/config/brand";

interface ThermalLabelModalProps {
  order: any;
  onClose: () => void;
}

export default function ThermalLabelModal({ order, onClose }: ThermalLabelModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const dispatchDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      {/* Top Action Bar (Hidden during print) */}
      <div className="fixed top-4 right-4 z-[160] flex items-center gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Thermal Label (4x6)</span>
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 4x6 Thermal Shipping Label Container */}
      <div className="w-[380px] bg-white text-slate-900 rounded-xl shadow-2xl p-5 border-2 border-slate-900 print:shadow-none print:m-0 print:w-[3.8in] print:h-[5.8in] print:p-2 print:border-2 print:border-black font-mono">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
          <div className="flex items-center gap-1.5 font-black text-sm tracking-tighter">
            <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded text-xs">PARTSLY</span>
            <span>EXPRESS</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded">
            DARKSTORE 10-MIN
          </span>
        </div>

        {/* Barcode & Order Number */}
        <div className="py-3 text-center border-b-2 border-slate-900 space-y-1">
          <div className="bg-slate-100 py-2 border border-slate-300 rounded flex flex-col items-center justify-center">
            {/* Simulated Barcode */}
            <div className="h-10 w-full px-4 flex items-center justify-between gap-1">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full ${i % 3 === 0 ? "w-1 bg-black" : i % 2 === 0 ? "w-0.5 bg-black" : "w-1.5 bg-black"}`}
                />
              ))}
            </div>
            <span className="text-xs font-black tracking-widest mt-1">*{order.orderNumber}*</span>
          </div>
        </div>

        {/* Destination Campus Address */}
        <div className="py-3 border-b-2 border-slate-900 text-xs">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">DELIVER TO:</span>
          <p className="font-black text-sm text-slate-900 uppercase leading-tight mt-0.5">
            {order.recipientName || order.user?.name || "STUDENT"}
          </p>
          <p className="font-bold text-xs text-slate-800 mt-0.5">
            {order.collegeName || "ENGINEERING CAMPUS"}
          </p>
          <p className="text-[11px] text-slate-700 leading-snug mt-1">
            {order.shippingAddress || "Campus Dropzone / Central Gate"}
          </p>
          <p className="font-black text-xs text-[#ff6a00] mt-1">
            PHONE: {order.recipientPhone || "N/A"}
          </p>
        </div>

        {/* Package Contents Summary */}
        <div className="py-3 border-b-2 border-slate-900 text-[11px] space-y-1">
          <div className="flex justify-between font-bold text-[10px] uppercase text-slate-500">
            <span>CONTENTS ({order.items?.length || 1} ITEMS):</span>
            <span>QTY</span>
          </div>
          {(order.items || []).slice(0, 4).map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between text-slate-800 font-sans text-[11px]">
              <span className="truncate max-w-[240px] font-semibold">{item.productName || item.title}</span>
              <span className="font-bold font-mono">x{item.quantity || 1}</span>
            </div>
          ))}
          {order.items?.length > 4 && (
            <p className="text-[10px] text-slate-500 font-sans italic">+ {order.items.length - 4} more items</p>
          )}
        </div>

        {/* Dispatch Hub & Runner */}
        <div className="pt-2 text-[10px] flex items-center justify-between">
          <div>
            <span className="text-slate-500 block">SHIP FROM:</span>
            <span className="font-bold">PARTSLY HUB #01</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">DISPATCH DATE:</span>
            <span className="font-bold">{dispatchDate}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
