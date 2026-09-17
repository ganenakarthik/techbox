import React from "react";
import { ShieldCheck, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-bold mb-4">
          <Lock className="w-3.5 h-3.5" />
          <span>Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Privacy <span className="text-[#ff6a00]">Policy</span>
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-slate-500">
          Last updated: September 2026. How Partsly handles your student data, project schematics, and payment details.
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 text-xs text-slate-600 space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="text-[#ff6a00]">1.</span> Confidentiality of Student Project Files & Intellectual Property
          </h2>
          <p>
            When you upload BOM files, Gerber archives, schematic PDFs, or 3D STL models to our &ldquo;Build My Project&rdquo; or Engineering Services pipeline, your files are treated as strictly confidential intellectual property. We do NOT share, distribute, or make public your design files. Uploaded design files are accessed solely by our assigned fabrication technicians to analyze BOM and manufacture prototypes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="text-[#ff6a00]">2.</span> Information We Collect
          </h2>
          <p>
            To fulfill orders and deliver to college campuses, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-500">
            <li>Name, college email address, and mobile contact number.</li>
            <li>College name, campus gate, department, and hostel block details for delivery routing.</li>
            <li>Purchase history, transaction reference IDs, and support ticket correspondence.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="text-[#ff6a00]">3.</span> Security of Banking & Payment Details
          </h2>
          <p>
            Partsly does NOT store full debit/credit card numbers or UPI PINs on its servers. All payments are processed through PCI-DSS Level 1 compliant gateway infrastructure via encrypted TLS connections.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="text-[#ff6a00]">4.</span> Cookies & Session Authentication
          </h2>
          <p>
            We use secure, HTTP-only cookies (<code>partsly_session</code>) to maintain authenticated sessions and protect your cart and order history against cross-site scripting (XSS).
          </p>
        </section>
      </div>
    </div>
  );
}
