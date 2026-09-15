import React from "react";
import Link from "next/link";
import { Truck, Clock, ShieldCheck, MapPin } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-bold mb-4">
          <Truck className="w-3.5 h-3.5" />
          <span>Fulfillment & Logistics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Campus Shipping & <span className="text-[#ff6a00]">Delivery Policy</span>
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-neutral-400">
          Last updated: September 2026. Official delivery guidelines for colleges and universities across India.
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-[#111111] border border-[#262626] text-xs text-neutral-300 space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">1.</span> Dedicated Campus Runner Network
          </h2>
          <p>
            TechBox operates an exclusive student courier network stationed near major engineering colleges. Because traditional delivery couriers are frequently barred from entering university gates or hostel premises, our dedicated campus runners coordinate delivery directly to your college main gate, hostel security reception, or department innovation lab.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">2.</span> Daily Campus Dispatch Slots
          </h2>
          <p>
            Orders placed on TechBox are dispatched in two regular daily batches:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-400">
            <li><strong>Morning Run (10:30 AM – 1:00 PM):</strong> For orders placed before 8:00 AM.</li>
            <li><strong>Evening Run (4:30 PM – 7:30 PM):</strong> For orders placed before 2:00 PM, coordinated with post-class student hostel returns.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">3.</span> Emergency Viva & Competition Priority
          </h2>
          <p>
            For urgent project submissions, hackathons, or project vivas, students can choose <strong>Emergency Viva Priority (+₹99)</strong>. Orders with priority status are flagged on the packing bench, packed in antistatic bubble-shield pouches, and dispatched by dedicated courier runner within 60 minutes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">4.</span> Shipping Charges & Free Thresholds
          </h2>
          <p>
            Orders valued at <strong>₹499 and above</strong> qualify for <strong>100% FREE Standard Campus Dispatch</strong>. For orders below ₹499, a nominal campus runner fee of ₹40 is applied at checkout to cover student delivery personnel stipends.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-[#ff6a00]">5.</span> Pickup Verification & ID Requirement
          </h2>
          <p>
            To prevent parcels from being misplaced or collected by unintended parties at busy campus gates, our runner will request you to present your Student College ID card or show the Order Reference Number / SMS confirmation code at the time of handover.
          </p>
        </section>
      </div>
    </div>
  );
}
