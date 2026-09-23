"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Wrench,
  Layers,
  Printer,
  FileText,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Loader2,
  FileArchive,
  Cpu,
} from "lucide-react";

interface ServiceItem {
  id: string;
  requestNumber?: string;
  orderNumber?: string;
  type: "SOURCING" | "PCB" | "3D_PRINTING" | "PROJECT" | "DOCUMENT";
  title: string;
  status: string;
  createdAt: string;
  details: string;
  fileUrl?: string;
  fileName?: string;
  totalAmount?: number;
}

export default function AccountServicesPage() {
  const { user, setIsAuthModalOpen } = useApp();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadServiceRequests() {
      setLoading(true);
      try {
        const [overviewRes, sourcingRes] = await Promise.all([
          fetch("/api/account/overview"),
          fetch("/api/services/component-sourcing"),
        ]);

        const items: ServiceItem[] = [];

        if (overviewRes.ok) {
          const data = await overviewRes.json();

          // Custom Projects
          if (data.projects) {
            data.projects.forEach((p: any) => {
              items.push({
                id: p.id,
                requestNumber: p.projectCode,
                type: "PROJECT",
                title: p.title,
                status: p.status,
                createdAt: p.createdAt,
                details: `Build Level: ${p.buildLevel.replace("_", " ")}`,
                fileName: p.files?.[0]?.fileName,
                fileUrl: p.files?.[0]?.fileUrl,
              });
            });
          }

          // PCB Orders
          if (data.pcbOrders) {
            data.pcbOrders.forEach((pcb: any) => {
              items.push({
                id: pcb.id,
                orderNumber: pcb.orderNumber,
                type: "PCB",
                title: `${pcb.layers}-Layer PCB: ${pcb.projectName}`,
                status: pcb.status,
                createdAt: pcb.createdAt,
                details: `Dimensions: ${pcb.dimensions} | Qty: ${pcb.quantity} | Finish: ${pcb.surfaceFinish}`,
                fileName: pcb.gerberFileName,
                fileUrl: pcb.gerberFileUrl,
              });
            });
          }

          // 3D Print Orders
          if (data.printOrders) {
            data.printOrders.forEach((p: any) => {
              items.push({
                id: p.id,
                orderNumber: p.orderNumber,
                type: "3D_PRINTING",
                title: `3D Print (${p.material}): ${p.partName}`,
                status: p.status,
                createdAt: p.createdAt,
                details: `Material: ${p.material} | Infill: ${p.infillPercent}% | Color: ${p.color}`,
                fileName: p.stlFileName,
                fileUrl: p.stlFileUrl,
              });
            });
          }

          // Document Orders
          if (data.documentOrders) {
            data.documentOrders.forEach((doc: any) => {
              items.push({
                id: doc.id,
                orderNumber: doc.orderNumber,
                type: "DOCUMENT",
                title: `Document Service: ${doc.topic}`,
                status: doc.status,
                createdAt: doc.createdAt,
                details: `Type: ${doc.serviceType} | Pages: ${doc.pageCount}`,
              });
            });
          }
        }

        if (sourcingRes.ok) {
          const sData = await sourcingRes.json();
          if (sData.requests) {
            sData.requests.forEach((src: any) => {
              items.push({
                id: src.id,
                requestNumber: src.requestNumber,
                type: "SOURCING",
                title: `Component Sourcing: ${src.componentName}`,
                status: src.status,
                createdAt: src.createdAt,
                details: `MPN: ${src.mpn || "N/A"} | Qty: ${src.quantity} | Urgency: ${src.urgency}`,
                fileName: src.referenceFileName,
                fileUrl: src.referenceFileUrl,
                totalAmount: src.quotedTotalAmount ? Number(src.quotedTotalAmount) : undefined,
              });
            });
          }
        }

        // Sort by newest created date first
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setServices(items);
      } catch (err) {
        console.error("Failed to load customer services:", err);
      } finally {
        setLoading(false);
      }
    }

    loadServiceRequests();
  }, [user]);

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-lg">
          <Wrench className="w-12 h-12 text-[#ff6a00] mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-xs text-slate-500 mb-6">
            Please log in to your Partsly account to view your active engineering service requests.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  const filteredServices = services.filter((s) => {
    if (activeTab !== "ALL" && s.type !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const num = (s.requestNumber || s.orderNumber || "").toLowerCase();
      const title = s.title.toLowerCase();
      return num.includes(q) || title.includes(q);
    }
    return true;
  });

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "SUBMITTED":
      case "UPLOADED":
      case "REQUESTED":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "UNDER_REVIEW":
      case "ANALYZING":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "QUOTE_READY":
      case "QUOTE_SENT":
        return "bg-[#ff6a00]/15 text-[#ff6a00] border-[#ff6a00]/30 font-black";
      case "PAYMENT_PENDING":
      case "CUSTOMER_ACCEPTED":
      case "APPROVED":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "PAYMENT_SUBMITTED":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "PAYMENT_VERIFIED":
      case "IN_PRODUCTION":
      case "SOURCING":
      case "TESTING":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
      case "DELIVERED":
      case "READY_FOR_DISPATCH":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "SOURCING":
        return Cpu;
      case "PCB":
        return Layers;
      case "3D_PRINTING":
        return Printer;
      case "PROJECT":
        return Wrench;
      case "DOCUMENT":
        return FileText;
      default:
        return Wrench;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="text-xs text-slate-500 mb-1">
            <Link href="/account" className="hover:text-[#ff6a00]">Account</Link> / <span className="text-slate-900 font-semibold">Service Requests & Projects</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Projects & Service Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track custom PCB orders, 3D printing jobs, component sourcing, and engineering hardware builds.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                activeTab === "ALL" ? "bg-[#ff6a00] text-black shadow-xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              All Requests ({services.length})
            </button>
            <button
              onClick={() => setActiveTab("SOURCING")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                activeTab === "SOURCING" ? "bg-[#ff6a00] text-black shadow-xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Component Sourcing
            </button>
            <button
              onClick={() => setActiveTab("PCB")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                activeTab === "PCB" ? "bg-[#ff6a00] text-black shadow-xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              PCB Fabrication
            </button>
            <button
              onClick={() => setActiveTab("3D_PRINTING")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                activeTab === "3D_PRINTING" ? "bg-[#ff6a00] text-black shadow-xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              3D Printing
            </button>
            <button
              onClick={() => setActiveTab("PROJECT")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                activeTab === "PROJECT" ? "bg-[#ff6a00] text-black shadow-xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Custom Projects
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search request # or title..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff6a00]"
            />
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading engineering service requests...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4 shadow-xs">
            <Wrench className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Service Requests Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              You haven&apos;t submitted any requests in this category. Submit your Gerber files, 3D models, or component sourcing requests to get started.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/services/component-sourcing"
                className="px-4 py-2 bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs rounded-xl shadow-xs"
              >
                Source Component
              </Link>
              <Link
                href="/services/pcb"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl"
              >
                PCB Fabrication
              </Link>
              <Link
                href="/services/3d-printing"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl"
              >
                3D Printing
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((item) => {
              const Icon = getServiceIcon(item.type);
              const isSourcing = item.type === "SOURCING";
              return (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-[#ff6a00] transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-[#ff6a00] shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          #{item.requestNumber || item.orderNumber}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded bg-slate-50 border border-slate-100">
                          {item.type.replace("_", " ")}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getBadgeStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-500">{item.details}</p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span>Submitted: {new Date(item.createdAt).toLocaleDateString("en-IN")}</span>
                        {item.fileName && (
                          <a
                            href={item.fileUrl || `/api/files/proxy?key=${encodeURIComponent(item.fileName)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[#ff6a00] font-semibold hover:underline"
                          >
                            <FileArchive className="w-3 h-3" />
                            <span>📎 {item.fileName}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {item.totalAmount !== undefined && (
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium block">Quoted Price</span>
                        <span className="text-lg font-black text-slate-900">₹{item.totalAmount}</span>
                      </div>
                    )}

                    <Link
                      href={isSourcing ? "/services/component-sourcing" : "/account/quotes"}
                      className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#ff6a00] hover:text-black text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{item.status === "QUOTE_READY" ? "Review Quote" : "View Request Status"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
