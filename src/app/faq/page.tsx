"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Sparkles, Truck, ShieldCheck, Cpu } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does direct campus delivery work?",
      a: "Partsly operates dedicated campus courier runners who deliver directly to university main gates, hostel security desks, or innovation labs twice daily: Morning batch (10:30 AM – 1:00 PM) and Evening batch (4:30 PM – 7:30 PM). When our runner arrives at your designated gate, you receive an automated SMS and call to collect your parcel with your student ID.",
    },
    {
      q: "Are the microcontrollers and electronic components tested before dispatch?",
      a: "Yes. Unlike generic marketplace vendors, every single development board (ESP32, Arduino, Raspberry Pi Picos, STM32) and sensitive sensor module undergoes functional electrical testing and firmware boot checks in our Bengaluru hardware lab prior to packaging in antistatic bags.",
    },
    {
      q: "How does the 'Build My Project' BOM Analyzer work?",
      a: "You can upload your project synopsis, schematic PDF, CSV, or BOM bill of materials. Our server extracts the engineering requirements, tokenizes component names and quantities, checks our live PostgreSQL inventory for exact SKUs, computes confidence ratings, and builds an itemized, ready-to-order project kit. If any ambiguous component is detected, our system flags it for your review before checkout.",
    },
    {
      q: "Can Partsly fabricate custom PCBs for student projects?",
      a: "Yes! Submit your Gerber zip files through our PCB Manufacturing service page. We support 1 to 4 layer boards, standard 1.6mm FR4 substrates, green/black/blue solder masks, and HASL or ENIG lead-free surface finish. We provide prototype panel turnaround within 4 to 6 working days.",
    },
    {
      q: "What if I have an urgent final year project or viva deadline?",
      a: "During checkout, select 'Emergency Viva Priority' (+₹99). This expedites bench picking to under 60 minutes and dispatches via dedicated express point-to-point courier directly to your college gate within the next delivery cycle.",
    },
    {
      q: "What is your replacement and return policy for DOA components?",
      a: "We offer a 7-day hassle-free replacement guarantee on all hardware. If an IC, sensor, or board is Dead on Arrival (DOA), notify our team via the Help Desk or WhatsApp with a short video/photo of your test circuit, and our campus runner will deliver a replacement free of charge.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit cards (Visa, Mastercard, RuPay), Net Banking across 50+ Indian banks, and Cash on Delivery at campus pickup points.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-bold mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base & Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Frequently Asked <span className="text-[#ff6a00]">Questions</span>
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-neutral-400">
          Everything you need to know about ordering components, campus delivery, custom fabrication, and return guarantees.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-2xl bg-[#111111] border border-[#262626] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#161616] transition-colors"
              >
                <span className="font-bold text-sm text-white">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#ff6a00] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-neutral-400 leading-relaxed border-t border-[#1c1c1c] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#141414] to-[#1a1a1a] border border-[#262626] text-center space-y-3">
        <h3 className="text-base font-bold text-white">Still have questions?</h3>
        <p className="text-xs text-neutral-400">
          Our engineering support team is available Mon-Sat to help with circuit schematics, pinouts, and custom orders.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs transition-colors"
          >
            Contact Campus Support
          </Link>
        </div>
      </div>
    </div>
  );
}
