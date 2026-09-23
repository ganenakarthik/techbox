"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FileText, Presentation, CheckCircle2, ShieldCheck, ArrowRight, BookOpen, Layers, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DocumentationPage() {
  const { user, setIsAuthModalOpen, addToast } = useApp();
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [formattingStyle, setFormattingStyle] = useState("IEEE Standard 2-Column");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const docServices = [
    {
      title: "Comprehensive College Project Report",
      subtitle: "Full IEEE format with literature review & test results",
      docType: "REPORT",
      price: 699,
      icon: BookOpen,
      deliverables: [
        "IEEE 2-column or standard university thesis template",
        "System architecture & methodology chapters",
        "Circuit schematics & sensor pinout documentation",
        "Empirical test results & timing analysis tables",
        "Turnitin similarity check within safe limits",
      ],
    },
    {
      title: "Final Viva Presentation Slide Deck (PPT)",
      subtitle: "20 modern, animated slides tailored for external examiners",
      docType: "PPT",
      price: 499,
      icon: Presentation,
      deliverables: [
        "16:9 widescreen dark tech presentation deck",
        "System block diagrams & algorithmic flowcharts",
        "Hardware demo videos & oscilloscope waveform slides",
        "Competitive analysis & future scope slides",
        "Editable .PPTX + printable PDF handouts",
      ],
    },
    {
      title: "Block Diagram & Circuit Schematics Pack",
      subtitle: "High-resolution vector schematics & architecture charts",
      docType: "CIRCUIT_DIAGRAM",
      price: 349,
      icon: Layers,
      deliverables: [
        "Functional hardware block diagram",
        "Power distribution & voltage level shifter diagram",
        "KiCad / EasyEDA exported high-res vector PDF",
        "Component pin mapping reference cheat sheet",
      ],
    },
    {
      title: "Examiner Viva-Voce Q&A Defense Pack",
      subtitle: "Top 50 expected technical questions answered",
      docType: "VIVA_PREP",
      price: 399,
      icon: FileText,
      deliverables: [
        "Microcontroller architecture & register questions",
        "Protocol explanations (I2C, SPI, UART, MQTT)",
        "Failure modes & debugging strategies",
        "Why you chose this specific sensor vs alternatives",
        "Confidence booster notes for project defense",
      ],
    },
  ];

  const handleSubmitDocs = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!user) {
      addToast("Please log in to submit a documentation request", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    if (!projectTitle.trim()) {
      addToast("Please enter a project title", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/services/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle: projectTitle.trim(),
          docType: selectedService.docType || "REPORT",
          formattingStyle,
          deadline: deadline || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Failed to submit document order. Please try again.";
        setSubmissionError(errorMsg);
        addToast(errorMsg, "error");
        return;
      }

      setOrderConfirmation(data.orderNumber);
      addToast(`Documentation request #${data.orderNumber} submitted successfully!`, "success");
    } catch (err: any) {
      const errorMsg = err.message || "Network error. Please try again.";
      setSubmissionError(errorMsg);
      addToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 text-[#ff6a00] text-xs font-bold mb-3">
          <FileText className="w-4 h-4" />
          <span>Professional Engineering Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Project Reports, PPTs & Viva Preparation
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Professional presentation and technical documentation formatting for college mini and capstone projects.
        </p>

        {/* Professional Ethics Callout */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 max-w-lg mx-auto">
          <strong className="text-slate-900">Academic Integrity Notice:</strong> Partsly documentation services provide structural formatting, vector schematics, and presentation design support to help students communicate their authentic engineering work clearly to examiners.
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docServices.map((service) => {
          const Icon = service.icon;

          return (
            <div
              key={service.title}
              className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#ff6a00]/40 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6a00] mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{service.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{service.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-slate-500">Starting at</div>
                    <div className="text-xl font-black text-slate-900">₹{service.price}</div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    Included Deliverables:
                  </div>
                  {service.deliverables.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                  <span>24-Hour Review Turnaround</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedService(service);
                    setOrderConfirmation(null);
                    setSubmissionError(null);
                  }}
                  className="py-2.5 px-5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#ff6a00]/20 transition-all cursor-pointer"
                >
                  <span>Configure & Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal / Overlay for Configuring Service */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div>
              <span className="text-xs font-mono text-[#ff6a00] uppercase">Selected Service</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedService.title}</h3>
            </div>

            {submissionError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            {orderConfirmation ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">
                  Documentation Order #{orderConfirmation} Queued
                </h4>
                <p className="text-xs text-slate-600">
                  Our academic writing & formatting team has queued your documentation order.
                </p>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setOrderConfirmation(null);
                    setProjectTitle("");
                  }}
                  className="mt-2 py-2 px-6 rounded-xl bg-[#ff6a00] text-black text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitDocs} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Your Project Title / Hardware Topic:
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. AI-Powered Autonomous Agricultural Drone"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Formatting Standard:
                    </label>
                    <select
                      value={formattingStyle}
                      onChange={(e) => setFormattingStyle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    >
                      <option>IEEE Standard 2-Column</option>
                      <option>University Standard Thesis</option>
                      <option>Springer / Elsevier Format</option>
                      <option>Modern Dark Tech Deck (PPT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Target Review / Viva Date:
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Total Price:</span>
                  <span className="text-base font-bold text-slate-900">₹{selectedService.price}</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] disabled:opacity-50 text-black font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isSubmitting ? "Submitting..." : "Confirm & Place Order"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
