import React from "react";
import Link from "next/link";
import { RotateCcw, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-bold mb-4">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Customer Assurance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Returns & <span className="text-[#ff6a00]">Replacements Guarantee</span>
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-neutral-400">
          Last updated: September 2026. Hardware testing protocol and hassle-free student replacement guarantee.
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-[#111111] border border-[#262626] text-xs text-neutral-300 space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">1.</span> 7-Day Dead on Arrival (DOA) Replacement Policy
          </h2>
          <p>
            We know how critical deadlines are. If any microcontroller, sensor, display, motor driver, or IC received from Partsly fails to boot or is found defective upon arrival, we provide an immediate <strong>1-to-1 replacement within 7 calendar days</strong> of delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">2.</span> Fast Replacement Procedure
          </h2>
          <ol className="list-decimal pl-5 space-y-1.5 text-neutral-400">
            <li>Open a ticket via your <Link href="/account/support" className="text-[#ff6a00] hover:underline">Student Account Support Desk</Link> or message our WhatsApp Helpline (+91 98450 12345).</li>
            <li>Provide your Order Reference Number (e.g. <code>TB-102941</code>) and a brief photo or 10-second video of your circuit wiring or serial monitor output.</li>
            <li>Once our lab technician verifies the hardware issue, our campus runner will deliver the replacement during the very next delivery run.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">3.</span> Conditions for Return & Exchange
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-neutral-400">
            <li>Product must include all original headers, terminal blocks, packaging, and antistatic bags.</li>
            <li>Components showing visible physical burn marks from reverse polarity overvoltage or short circuits caused by incorrect wiring are subject to engineering inspection.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">4.</span> Refunds
          </h2>
          <p>
            If a replacement component is out of stock in our regional inventory, a 100% refund will be credited back to your original payment method (UPI, Card, or Net Banking) within 2 to 4 banking days.
          </p>
        </section>
      </div>
    </div>
  );
}
