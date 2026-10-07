"use client";

import React from "react";

interface Order {
  id: string;
  date: string;
  itemsCount: number;
  total: number;
  status: string;
  utr: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export function AccountModal({ isOpen, onClose, orders }: AccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="liquid-modal w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#ff6a00] uppercase tracking-wider">
              PARTSLY ACCOUNT & ORDERS DASHBOARD
            </span>
            <h2 className="text-lg font-black text-slate-900">Your Engineering Orders</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            ✕
          </button>
        </div>

        {/* User Badge Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff6a00] text-white flex items-center justify-center font-bold text-sm">
              RA
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Verified Hardware Innovator</div>
              <div className="text-[11px] text-slate-500">Connected via Phone / UPI UTR Portal</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
            ● Active Member
          </span>
        </div>

        {/* Orders Tracking List */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Order & UTR Verification History ({orders.length})
          </h3>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-1">
              <p className="font-semibold text-slate-600">No orders placed yet</p>
              <p>Items purchased via UPI UTR payment will appear here in real-time.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                  <span className="text-slate-400">{ord.date}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-slate-600 font-medium">
                      {ord.itemsCount} Items • Total ₹{ord.total}
                    </span>
                    <div className="text-[10px] font-mono text-slate-400">
                      UTR Ref: <span className="font-bold text-slate-700">{ord.utr}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700">
                    ● {ord.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
