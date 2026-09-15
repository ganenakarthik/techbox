"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  FileText,
  Boxes,
  Cpu,
  Wrench,
  Layers,
  Printer,
  ShieldCheck,
  Send,
  Edit3,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  RotateCcw,
} from "lucide-react";

export default function AdminProjectsPage() {
  const { addToast, user } = useApp();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Quote Studio Inputs
  const [componentCost, setComponentCost] = useState<number>(1850);
  const [pcbCost, setPcbCost] = useState<number>(450);
  const [assemblyCost, setAssemblyCost] = useState<number>(650);
  const [printCost, setPrintCost] = useState<number>(549);
  const [docCost, setDocCost] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(200);
  const [adminRemarks, setAdminRemarks] = useState<string>("");
  const [isSendingQuote, setIsSendingQuote] = useState<boolean>(false);

  const totalCalculated = Math.max(0, componentCost + pcbCost + assemblyCost + printCost + docCost - discount);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        const list = data.projects || [];
        setProjects(list);
        if (list.length > 0 && !selectedProjectId) {
          setSelectedProjectId(list[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleSendQuote = async () => {
    if (!selectedProject) return;
    setIsSendingQuote(true);

    try {
      const res = await fetch(`/api/admin/projects/${selectedProject.id}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          componentCost,
          pcbCost,
          assemblyCost,
          printCost,
          documentationCost: docCost,
          discount,
          adminRemarks,
        }),
      });

      if (res.ok) {
        addToast(`Formal Quote dispatched for "${selectedProject.title}" (₹${totalCalculated})!`, "success");
        await fetchProjects();
      } else {
        const err = await res.json();
        addToast(err.error || "Failed to dispatch quote", "error");
      }
    } catch {
      addToast("Network error sending quote", "error");
    } finally {
      setIsSendingQuote(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f] mb-8">
        <div>
          <div className="text-xs text-neutral-400 mb-1">
            <Link href="/admin" className="hover:text-white">Admin</Link> / <span className="text-white">Project Quotes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Project BOM & Quote Studio</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Review student BOM uploads, inspect schematics, and issue itemized engineering quotes.
          </p>
        </div>

        <button
          onClick={fetchProjects}
          className="py-2 px-4 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-[#2e2e2e] text-xs font-semibold text-white flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#ff6a00]" />
          <span>Refresh Projects</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 rounded-3xl bg-[#111111] border border-[#222222]">
          <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-400">Loading project submissions...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[#111111] border border-[#222222] text-xs text-neutral-400">
          No project submissions yet. When students upload BOMs or circuit schematics on Build My Project, they will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Projects Queue (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Customer Submissions Queue ({projects.length})
            </h2>
            {projects.map((prj) => {
              const isSelected = selectedProject?.id === prj.id;
              return (
                <div
                  key={prj.id}
                  onClick={() => setSelectedProjectId(prj.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#ff6a00]/10 border-[#ff6a00] text-white"
                      : "bg-[#111111] border-[#222222] text-neutral-400 hover:border-[#333333]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#ff6a00]">{prj.projectCode}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1a1a1a] text-neutral-300 font-mono">
                      {prj.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white">{prj.title}</h3>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    Student: <strong className="text-neutral-200">{prj.customerName}</strong> ({prj.customerEmail})
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">
                    Files: {prj.filesCount} • Build Tier: {prj.buildLevel}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quote Studio Panel (7 cols) */}
          {selectedProject && (
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#111111] border border-[#262626] space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-[#222222]">
                <div>
                  <span className="text-xs text-[#ff6a00] font-mono font-bold">{selectedProject.projectCode}</span>
                  <h2 className="text-xl font-bold text-white mt-0.5">{selectedProject.title}</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Submitted by {selectedProject.customerName} ({selectedProject.customerPhone || "Phone N/A"})
                  </p>
                </div>

                {selectedProject.activeQuote && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30">
                    Quote v{selectedProject.activeQuote.version} Active (₹{selectedProject.activeQuote.totalCost})
                  </span>
                )}
              </div>

              {/* Uploaded Files */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Uploaded Project Attachments ({selectedProject.files?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedProject.files?.map((f: any) => (
                    <div key={f.id} className="p-3 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#ff6a00]" />
                        <span className="font-semibold text-white">{f.fileName}</span>
                      </div>
                      <a
                        href={f.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#ff6a00] hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Inspect File</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown Inputs */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  Itemized Cost Breakdown (INR)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1">Components (₹):</label>
                    <input
                      type="number"
                      value={componentCost}
                      onChange={(e) => setComponentCost(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Custom PCB (₹):</label>
                    <input
                      type="number"
                      value={pcbCost}
                      onChange={(e) => setPcbCost(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Assembly & Soldering (₹):</label>
                    <input
                      type="number"
                      value={assemblyCost}
                      onChange={(e) => setAssemblyCost(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">3D Enclosure Print (₹):</label>
                    <input
                      type="number"
                      value={printCost}
                      onChange={(e) => setPrintCost(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Documentation & PPT (₹):</label>
                    <input
                      type="number"
                      value={docCost}
                      onChange={(e) => setDocCost(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Student Discount (₹):</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl px-3 py-2 text-[#22c55e] font-mono"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-neutral-400 block mb-1 text-xs">Engineering / Admin Remarks:</label>
                  <input
                    type="text"
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="e.g. PCB fabrication turnaround: 4 working days with lead-free HASL finish."
                    className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              {/* Total & Dispatch Button */}
              <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">Total Quoted Amount:</div>
                  <div className="text-2xl font-black text-[#ff6a00]">₹{totalCalculated}</div>
                </div>

                <button
                  onClick={handleSendQuote}
                  disabled={isSendingQuote}
                  className="py-3 px-6 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingQuote ? "Generating Quote..." : "Dispatch Formal Quote"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
