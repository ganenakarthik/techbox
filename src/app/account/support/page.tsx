"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { MessageSquare, Plus, Send, Loader2, RefreshCw } from "lucide-react";

export default function SupportPage() {
  const { addToast, user } = useApp();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Component Pinout & Datasheet Help");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [sendingReply, setSendingReply] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/support/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTickets();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      addToast("Subject and message are required", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          category,
          message,
          orderId: orderId.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.ticket) {
        addToast("Support ticket created! Campus engineer notified.", "success");
        setTickets([data.ticket, ...tickets]);
        setIsCreating(false);
        setSubject("");
        setMessage("");
        setOrderId("");
      } else {
        addToast(data.error || "Failed to create ticket", "error");
      }
    } catch {
      addToast("Network error creating ticket", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (ticketId: string) => {
    const text = replyText[ticketId]?.trim();
    if (!text) return;

    setSendingReply(ticketId);
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      if (res.ok && data.ticket) {
        addToast("Reply sent to Partsly support team!", "success");
        setTickets(tickets.map((t) => (t.id === ticketId ? data.ticket : t)));
        setReplyText((prev) => ({ ...prev, [ticketId]: "" }));
      } else {
        addToast(data.error || "Failed to send reply", "error");
      }
    } catch {
      addToast("Network error sending reply", "error");
    } finally {
      setSendingReply(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            <Link href="/account" className="hover:text-slate-900">Account</Link> / <span className="text-slate-900">Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Student Lab Helpdesk</h1>
          <p className="text-xs text-slate-500 mt-1">
            Get prompt assistance with circuit schematics, delivery coordinates, or hardware troubleshooting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTickets}
            className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900"
            title="Refresh tickets"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="py-2.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Support Ticket</span>
          </button>
        </div>
      </div>

      {/* New Ticket Form Modal/Drawer */}
      {isCreating && (
        <div className="p-6 rounded-3xl bg-white border border-[#ff6a00]/40 shadow-2xl mb-8 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Open a New Support Ticket</h2>

          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Subject:</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Ultrasonic sensor reading zero in lab"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Related Order # (optional):</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. TB-849201"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
              >
                <option>Component Pinout & Datasheet Help</option>
                <option>Campus Delivery / Courier Runner Coordination</option>
                <option>BOM Analysis & Quote Revision</option>
                <option>Firmware / Code Debugging Support</option>
                <option>Replacement / Damaged Pin Return</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Describe the issue:</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include baud rate, operating voltage, or pickup gate instructions."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="py-2.5 px-5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold shadow-lg shadow-[#ff6a00]/20 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{submitting ? "Submitting..." : "Submit Ticket"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 rounded-3xl bg-white border border-slate-200">
            <Loader2 className="w-6 h-6 animate-spin text-[#ff6a00] mx-auto mb-2" />
            <span>Loading support tickets...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-slate-500 rounded-3xl bg-white border border-slate-200">
            No support tickets open yet. Click &quot;New Support Ticket&quot; if you need engineering or delivery help.
          </div>
        ) : (
          tickets.map((tkt) => {
            const isResolved = tkt.status === "RESOLVED" || tkt.status === "CLOSED";
            const messagesList = Array.isArray(tkt.messages) ? tkt.messages : [];
            const isExpanded = expandedId === tkt.id;

            return (
              <div
                key={tkt.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 hover:border-[#333] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#ff6a00]">{tkt.ticketNumber || tkt.id}</span>
                    <h3 className="text-sm font-bold text-slate-900">{tkt.subject}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isResolved
                          ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/50"
                          : tkt.status === "IN_PROGRESS"
                          ? "bg-amber-950/70 text-amber-400 border border-amber-800/50"
                          : "bg-blue-950/70 text-blue-400 border border-blue-800/50"
                      }`}
                    >
                      {tkt.status}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(tkt.createdAt || Date.now()).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[11px]">
                    {tkt.category}
                  </span>
                  {tkt.order?.orderNumber && (
                    <span className="text-slate-500">
                      Order: <span className="text-slate-900 font-mono">{tkt.order.orderNumber}</span>
                    </span>
                  )}
                </div>

                {/* Conversation Thread */}
                <div className="space-y-2 pt-2">
                  {(isExpanded ? messagesList : messagesList.slice(-1)).map((msg: any, idx: number) => {
                    const isStaff = msg.role === "ADMIN" || msg.role === "STAFF";
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl text-xs flex items-start gap-2.5 ${
                          isStaff
                            ? "bg-[#181512] border border-[#ff6a00]/30 text-slate-700"
                            : "bg-slate-50 border border-slate-200 text-slate-600"
                        }`}
                      >
                        <MessageSquare className={`w-4 h-4 shrink-0 mt-0.5 ${isStaff ? "text-[#ff6a00]" : "text-slate-500"}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                            <span className={isStaff ? "text-[#ff6a00]" : "text-slate-900"}>{msg.sender}</span>
                            {msg.timestamp && (
                              <span className="text-[10px] text-slate-500">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            )}
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Expand / Collapse and Reply Bar */}
                <div className="pt-2 flex flex-col gap-3">
                  {messagesList.length > 1 && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : tkt.id)}
                      className="text-xs text-[#ff6a00] hover:underline self-start font-medium"
                    >
                      {isExpanded ? "Show latest message only" : `View all ${messagesList.length} messages in conversation`}
                    </button>
                  )}

                  {!isResolved && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={replyText[tkt.id] || ""}
                        onChange={(e) => setReplyText({ ...replyText, [tkt.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSendReply(tkt.id);
                        }}
                        placeholder="Type a follow-up reply for the engineering team..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-neutral-500 focus:outline-none focus:border-[#ff6a00]"
                      />
                      <button
                        onClick={() => handleSendReply(tkt.id)}
                        disabled={sendingReply === tkt.id}
                        className="p-2 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-bold disabled:opacity-50"
                        title="Send Reply"
                      >
                        {sendingReply === tkt.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
