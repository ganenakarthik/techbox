import React from "react";
import Link from "next/link";
import { XCircle, RotateCcw, Clock } from "lucide-react";

export default function CancellationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-bold mb-4">
          <XCircle className="w-3.5 h-3.5" />
          <span>Order Management</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Cancellation <span className="text-[#ff6a00]">Policy</span>
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-neutral-400">
          Last updated: September 2026. Cancellation windows and instant refund processing rules.
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-[#111111] border border-[#262626] text-xs text-neutral-300 space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">1.</span> Hardware Component Orders
          </h2>
          <p>
            You can cancel any component order directly from your <Link href="/account/orders" className="text-[#ff6a00] hover:underline">Order History</Link> dashboard as long as the status is <strong>PENDING</strong> or <strong>CONFIRMED</strong>. Once our campus runners pack and dispatch the order (<strong>SHIPPED</strong>), cancellation is no longer possible through the portal, but you can reject handover upon runner arrival at your campus gate.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">2.</span> Custom Engineering & Fabrication Services
          </h2>
          <p>
            For PCB manufacturing, 3D printing, and documentation services:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-400">
            <li><strong>Before Approval:</strong> 100% free cancellation at any time while the status is <code>REQUESTED</code> or <code>QUOTE_SENT</code>.</li>
            <li><strong>After Approval:</strong> Once a quote is accepted and production status advances to <code>IN_PRODUCTION</code>, material costs incurred cannot be reversed.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">3.</span> Refund Timelines on Cancellation
          </h2>
          <p>
            Refunds for cancelled prepaid orders (UPI / Card / Net Banking) are triggered immediately by our backend. Depending on your bank&rsquo;s clearance cycle, funds will reflect in your account within 24 to 72 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
