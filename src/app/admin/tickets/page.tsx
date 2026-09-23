"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Send, ShieldCheck, Search, Filter, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AdminTicketsPage() {
  const { user, addToast } = useApp();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [sendingReply, setSendingReply] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error("Failed to load admin tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSendReply = async (ticketId: string) => {
    const text = replyText[ticketId]?.trim();
    if (!text) return;

    setSendingReply(ticketId);
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (res.ok && data.ticket) {
        addToast("Reply sent to student!", "success");
        setTickets(tickets.map((t) => (t.id === ticketId ? data.ticket : t)));
        setReplyText((prev) => ({ ...prev, [ticketId]: "" }));
      } else {
        addToast(data.error || "Failed to send reply", "error");
      }
    } catch {
      addToast("Error sending reply", "error");
    } finally {
      setSendingReply(null);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-slate-200 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#ff6a00] mb-2 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Operations</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#ff6a00]" />
            <span>Student Lab Helpdesk Desk</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reply to student hardware inquiries, pinout questions, and campus delivery coordination.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ticket # or student..."
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#ff6a00]"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 rounded-3xl bg-white border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-[#ff6a00] mx-auto mb-2" />
          <span>Fetching support tickets...</span>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="p-12 text-center text-slate-500 rounded-3xl bg-white border border-slate-200">
          No support tickets match your filter criteria.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTickets.map((tkt) => {
            const messagesList = Array.isArray(tkt.messages) ? tkt.messages : [];
            const isResolved = tkt.status === "RESOLVED" || tkt.status === "CLOSED";

            return (
              <div key={tkt.id} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#ff6a00] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {tkt.ticketNumber}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-bold text-slate-900">{tkt.user?.name || "Student"} ({tkt.user?.email})</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{tkt.subject}</h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold self-start sm:self-auto ${
                    isResolved
                      ? "bg-emerald-100 text-emerald-800"
                      : tkt.status === "IN_PROGRESS"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {tkt.status}
                  </span>
                </div>

                {/* Messages Thread */}
                <div className="space-y-2">
                  {messagesList.map((msg: any, idx: number) => {
                    const isStaff = msg.role === "ADMIN" || msg.role === "STAFF";
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl text-xs flex items-start gap-3 ${
                          isStaff
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 text-slate-800 border border-slate-200"
                        }`}
                      >
                        <MessageSquare className={`w-4 h-4 shrink-0 mt-0.5 ${isStaff ? "text-[#ff6a00]" : "text-slate-400"}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1 opacity-80">
                            <span>{msg.sender}</span>
                            {msg.timestamp && (
                              <span className="text-[10px] font-normal font-mono opacity-60">
                                {new Date(msg.timestamp).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                              </span>
                            )}
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Form */}
                {!isResolved && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={replyText[tkt.id] || ""}
                      onChange={(e) => setReplyText({ ...replyText, [tkt.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendReply(tkt.id);
                      }}
                      placeholder="Type official lab response..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                    <button
                      onClick={() => handleSendReply(tkt.id)}
                      disabled={sendingReply === tkt.id}
                      className="py-2.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center gap-1.5 shrink-0 transition-all shadow-md shadow-[#ff6a00]/20 cursor-pointer"
                    >
                      {sendingReply === tkt.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Send Official Reply</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
