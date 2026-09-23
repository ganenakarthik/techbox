"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Search,
  UploadCloud,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ExternalLink,
  Cpu,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { validateClientFile } from "@/lib/validation";

export default function ComponentSourcingPage() {
  const { user, setIsAuthModalOpen, addToast } = useApp();

  const [componentName, setComponentName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [mpn, setMpn] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [packageType, setPackageType] = useState("");
  const [preferredBrand, setPreferredBrand] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [acceptableAlts, setAcceptableAlts] = useState("");
  const [targetUnitPrice, setTargetUnitPrice] = useState("");
  const [urgency, setUrgency] = useState("Standard (5-7 days)");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<{
    requestNumber: string;
    componentName: string;
    quantity: number;
    whatsappUrl: string;
  } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validation = validateClientFile(selectedFile, {
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".csv", ".txt", ".zip"],
        maxSizeBytes: 15 * 1024 * 1024,
      });
      if (!validation.isValid) {
        addToast(validation.error || "Invalid file format or size", "error");
        return;
      }
      setFile(selectedFile);
      addToast(`File "${selectedFile.name}" attached!`, "success");
    }
  };

  const handleSubmitSourcing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!user) {
      addToast("Please log in to submit a component sourcing request", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    if (!componentName.trim()) {
      addToast("Please enter a component name or description", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedFileUrl: string | undefined = undefined;
      let uploadedFileName: string | undefined = undefined;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "SOURCING_REFERENCE");

        const uploadRes = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          addToast(uploadData.error || "Failed to upload reference file", "error");
          setIsSubmitting(false);
          return;
        }

        uploadedFileUrl = uploadData.fileUrl;
        uploadedFileName = uploadData.originalName;
      }

      const res = await fetch("/api/services/component-sourcing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          componentName: componentName.trim(),
          manufacturer: manufacturer.trim() || undefined,
          mpn: mpn.trim() || undefined,
          quantity: Number(quantity) || 1,
          packageType: packageType.trim() || undefined,
          preferredBrand: preferredBrand.trim() || undefined,
          specifications: specifications.trim() || undefined,
          acceptableAlts: acceptableAlts.trim() || undefined,
          targetUnitPrice: targetUnitPrice ? Number(targetUnitPrice) : undefined,
          urgency,
          notes: notes.trim() || undefined,
          referenceFileUrl: uploadedFileUrl,
          referenceFileName: uploadedFileName || file?.name || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || "Failed to submit component sourcing request. Please try again.";
        setSubmissionError(errorMsg);
        addToast(errorMsg, "error");
        return;
      }

      const reqNum = data.requestNumber || "SRC-SUBMITTED";
      const waMsg = encodeURIComponent(
        `Hello Partsly Procurement Team,\nI just submitted a component sourcing request on Partsly.\n\nRequest ID: ${reqNum}\nComponent: ${componentName.trim()}\nQuantity: ${quantity}\n\nPlease check my request and assist with procurement/pricing.`
      );
      const whatsappUrl = `https://wa.me/917032635858?text=${waMsg}`;

      setSubmittedRequest({
        requestNumber: reqNum,
        componentName: componentName.trim(),
        quantity: Number(quantity),
        whatsappUrl,
      });

      addToast(`Sourcing request #${reqNum} submitted successfully!`, "success");
    } catch (err: any) {
      const errorMsg = err.message || "Network error. Please check your connection.";
      setSubmissionError(errorMsg);
      addToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff6a00]/10 text-[#ff6a00] text-xs font-bold mb-3">
          <Search className="w-4 h-4" />
          <span>Engineering Component Procurement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Can&apos;t Find a Component in Catalog?
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Submit your part numbers, IC specifications, or obsolete microcontroller requirements. Partsly sources genuine components directly from verified distributors and authorized vendors.
        </p>
      </div>

      {/* Submission Confirmation Card */}
      {submittedRequest && (
        <div className="max-w-2xl mx-auto mb-10 p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4 shadow-xl">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <span>Sourcing Request #{submittedRequest.requestNumber}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Request Logged in Procurement Queue
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Our engineering sourcing desk is verifying distributor stock, lead times, and unit pricing for <strong>{submittedRequest.componentName}</strong> (Qty: {submittedRequest.quantity}). You will receive a notification once your itemized quote is ready.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={submittedRequest.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquire via WhatsApp (Ref: {submittedRequest.requestNumber})</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-75" />
            </a>

            <button
              onClick={() => {
                setSubmittedRequest(null);
                setComponentName("");
                setManufacturer("");
                setMpn("");
                setSpecifications("");
              }}
              className="py-3 px-6 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-50 transition-all"
            >
              Submit Another Component Request
            </button>
          </div>
        </div>
      )}

      {submissionError && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <div className="font-bold">Submission Failed</div>
            <div>{submissionError}</div>
          </div>
        </div>
      )}

      {!submittedRequest && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Sourcing Request Form (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmitSourcing} className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">01. Component Specifications</h3>
                <p className="text-xs text-slate-500">Provide exact part details for accurate distributor lookup.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">
                    Component Name / Description: *
                  </label>
                  <input
                    type="text"
                    required
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                    placeholder="e.g. STM32F407VGT6 ARM Cortex-M4 MCU or INA219 Current Sensor IC"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 block mb-1 font-semibold">
                      MPN / Part Number:
                    </label>
                    <input
                      type="text"
                      value={mpn}
                      onChange={(e) => setMpn(e.target.value)}
                      placeholder="e.g. STM32F407VGT6"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1 font-semibold">
                      Manufacturer / Vendor:
                    </label>
                    <input
                      type="text"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder="e.g. STMicroelectronics / Texas Instruments"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-700 block mb-1 font-semibold">
                      Quantity Needed: *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1 font-semibold">
                      Package / Footprint:
                    </label>
                    <input
                      type="text"
                      value={packageType}
                      onChange={(e) => setPackageType(e.target.value)}
                      placeholder="e.g. LQFP-100 / SOIC-8 / SMD 0805"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1 font-semibold">
                      Target Price per Unit (₹):
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={targetUnitPrice}
                      onChange={(e) => setTargetUnitPrice(e.target.value)}
                      placeholder="e.g. 450 (optional)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">
                    Specifications & Pinout Details:
                  </label>
                  <textarea
                    rows={3}
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                    placeholder="Mention operating voltage (3.3V / 5V), speed grade, clock frequency, or pin pitch requirements..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">
                    Acceptable Equivalent Alternatives:
                  </label>
                  <input
                    type="text"
                    value={acceptableAlts}
                    onChange={(e) => setAcceptableAlts(e.target.value)}
                    placeholder="e.g. STM32F405 / GD32F407 (if original MPN is out of stock globally)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">
                    Required Procurement Timeline:
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  >
                    <option>Standard (5-7 days)</option>
                    <option>Urgent Project Deadline (3-4 days)</option>
                    <option>Emergency Lab Sourcing (48 hours)</option>
                  </select>
                </div>

                {/* File Attachment Box */}
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">
                    Attach Datasheet / Schematic / Image: (Optional)
                  </label>
                  <label className="border-2 border-dashed border-slate-300 hover:border-[#ff6a00] rounded-2xl p-4 text-center block cursor-pointer transition-colors bg-slate-50">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.csv,.txt,.zip"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <UploadCloud className="w-6 h-6 text-[#ff6a00] mx-auto mb-1" />
                    {file ? (
                      <div className="text-xs font-bold text-slate-900">{file.name}</div>
                    ) : (
                      <div className="text-xs text-slate-600">
                        Click to select datasheet PDF or component image
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] disabled:opacity-50 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all cursor-pointer"
              >
                <span>{isSubmitting ? "Submitting Sourcing Request..." : "Submit Component Sourcing Request"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: How Sourcing Works Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                The Partsly Sourcing Process
              </h3>

              <div className="space-y-4 text-xs">
                {[
                  { step: "01", title: "Submit Requirements", desc: "Enter your component MPN, specifications, and quantity needed." },
                  { step: "02", title: "Distributor & Vendor Verification", desc: "Our procurement team checks stock with authorized global & domestic distributors." },
                  { step: "03", title: "Itemized Sourcing Quote", desc: "You receive an official price quote with estimated delivery date." },
                  { step: "04", title: "Quote Acceptance & UPI Scan", desc: "Accept quote in your account dashboard and complete Scan & Pay UPI." },
                  { step: "05", title: "Verification & Campus Dispatch", desc: "Partsly verifies bank UTR reference and dispatches genuine parts directly to your campus hub." },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-[#ff6a00]/15 text-[#ff6a00] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {s.step}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">{s.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 text-xs text-slate-700 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#ff6a00] shrink-0 mt-0.5" />
                <span>
                  <strong>100% Genuine Component Guarantee:</strong> All sourced ICs and modules undergo anti-counterfeit pinout & functional batch testing before dispatch.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
