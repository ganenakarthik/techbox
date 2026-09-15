import React from "react";
import { CreditCard, QrCode, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PaymentInfoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-bold mb-4">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Billing & Gateway Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Payment <span className="text-[#ff6a00]">Information</span>
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-neutral-400">
          Last updated: September 2026. Secure, student-friendly payment options across campuses.
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-[#111111] border border-[#262626] text-xs text-neutral-300 space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">1.</span> Supported Payment Modes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#161616] border border-[#262626]">
              <div className="flex items-center gap-2 text-white font-bold mb-1">
                <QrCode className="w-4 h-4 text-[#ff6a00]" />
                <span>UPI & QR Codes</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Instant zero-fee payments via Google Pay, PhonePe, Paytm, BHIM, and bank VPAs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#161616] border border-[#262626]">
              <div className="flex items-center gap-2 text-white font-bold mb-1">
                <CreditCard className="w-4 h-4 text-[#ff6a00]" />
                <span>Cards & Net Banking</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Visa, Mastercard, RuPay, and Net Banking across 50+ nationalized and private Indian banks.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">2.</span> Cash on Delivery (COD)
          </h2>
          <p>
            Available for standard campus runner deliveries. You may pay with cash or scan the runner&rsquo;s dynamic UPI QR code upon arrival at your college gate or hostel reception.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">3.</span> Invoices & GST Billing
          </h2>
          <p>
            Every order generates an itemized digital GST-compliant tax invoice accessible immediately on your Order Details page. Invoices include SKU numbers, component specifications, and date snapshots for college project reimbursement or hackathon expense submission.
          </p>
        </section>
      </div>
    </div>
  );
}
