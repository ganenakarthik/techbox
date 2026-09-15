"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Wrench, ShieldCheck, CheckCircle2, ArrowRight, UploadCloud, Cpu, Sparkles } from "lucide-react";

export default function PrototypesPage() {
  const { user, setIsAuthModalOpen, addToast } = useApp();
  const [projectTitle, setProjectTitle] = useState("");
  const [department, setDepartment] = useState("Electronics & Communication (ECE)");
  const [details, setDetails] = useState("");
  const [timeline, setTimeline] = useState("Normal (5-7 Days)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProject, setSubmittedProject] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast("Please sign in or create an account to submit prototype requests", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectTitle,
          description: details,
          buildLevel: "WORKING_PROTOTYPE",
          notes: `Department: ${department} | Urgency: ${timeline}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmittedProject(data.project.projectCode);
        addToast(`Working prototype request ${data.project.projectCode} submitted!`, "success");
        setProjectTitle("");
        setDetails("");
      } else {
        addToast(data.error || "Failed to submit prototype request", "error");
      }
    } catch {
      addToast("Network error submitting prototype request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 text-[#ff6a00] text-xs font-bold mb-3">
          <Wrench className="w-4 h-4" />
          <span>Lab Assembly & Engineering Services</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Working Prototype Fabrication
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-400">
          Have a tight college review deadline? We design schematics, solder components, flash calibrated firmware, and bench-test your hardware prototype.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Workflow & Quality Process (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626] space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              The 6-Stage Prototype Milestone Process
            </h3>

            <div className="space-y-4 pt-2">
              {[
                { step: "01", title: "Technical Review & Feasibility", desc: "Our engineers inspect your circuit schematic, sensor voltages (3.3V vs 5V), and power budgets." },
                { step: "02", title: "Breadboard or Custom PCB Assembly", desc: "Rigid soldering with industrial flux, shielded wiring, and strain-relief connectors." },
                { step: "03", title: "Firmware Flash & Peripheral Calibration", desc: "We write clean, modular C++/MicroPython code with detailed comments for your viva defense." },
                { step: "04", title: "24-Hour Continuous Burn-in Bench Test", desc: "Full telemetry testing under continuous load to ensure zero crashes or thermal shutdowns." },
                { step: "05", title: "Video Demonstration & Walkthrough Call", desc: "We send you a video demo and walk you through every pin connection before packaging." },
                { step: "06", title: "Direct Campus Delivery to Lab / Gate", desc: "Hand-delivered with protective ESD packaging directly to your college." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4 items-start p-3 rounded-xl bg-[#161616] border border-[#222222]">
                  <span className="w-7 h-7 rounded-lg bg-[#ff6a00]/15 text-[#ff6a00] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{s.title}</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Request Prototype Quote Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626] shadow-2xl space-y-4">
            <div>
              <div className="text-xs font-mono text-[#ff6a00] uppercase tracking-wider">Fast Response</div>
              <h3 className="text-lg font-bold text-white mt-0.5">Request Working Prototype Quote</h3>
              <p className="text-xs text-neutral-400">Receive an itemized hardware + assembly quote today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Project Title / Concept:
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Smart ECG Patch with BLE Alert"
                  className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Engineering Department / Branch:
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
                >
                  <option>Electronics & Communication (ECE)</option>
                  <option>Computer Science & IoT (CSE)</option>
                  <option>Electrical & Electronics (EEE)</option>
                  <option>Mechanical & Mechatronics</option>
                  <option>Biomedical Engineering</option>
                  <option>Other Engineering Major</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Delivery Urgency:
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-[#161616] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
                >
                  <option>Normal (5-7 Days)</option>
                  <option>Urgent Viva Review (3-4 Days)</option>
                  <option>Emergency Flash Build (48 Hours)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Required Deliverables & Sensors:
                </label>
                <textarea
                  rows={4}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Mention components you want (e.g. ESP32, OLED, MQ-135) or specify if you have a circuit schematic."
                  className="w-full bg-[#161616] border border-[#262626] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
                />
              </div>

              {submittedProject && (
                <div className="p-3.5 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/30 text-xs text-[#22c55e] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Prototype project #{submittedProject} registered! An engineer will review your specs.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] disabled:opacity-50 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#ff6a00]/25 transition-all mt-2"
              >
                <span>{isSubmitting ? "Submitting Request..." : "Request Prototype Consultation"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>NDA & Confidentiality guaranteed for student patent/IP concepts.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
