"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ContactPage() {
  const { addToast } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast("Support message dispatched to campus desk.", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-bold mb-4">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Campus Engineering Support</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Talk to the <span className="text-[#ff6a00]">Partsly</span> Team
        </h1>
        <p className="mt-4 text-sm text-slate-500 leading-relaxed">
          Questions about microcontroller compatibility, custom PCB panelization, urgent viva delivery slots, or project component kits? Our engineers and campus runners are ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Central Operations Hub</h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ff6a00]/10 border border-[#ff6a00]/30 flex items-center justify-center shrink-0 text-[#ff6a00]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Primary Dispatch Station</div>
                  <div className="text-slate-500 mt-0.5">
                    Partsly Hardware & Prototyping Works<br />
                    Outer Ring Road, Tech Corridor<br />
                    Bengaluru, Karnataka 560103, India
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ff6a00]/10 border border-[#ff6a00]/30 flex items-center justify-center shrink-0 text-[#ff6a00]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Direct Helpline & WhatsApp</div>
                  <div className="text-slate-500 mt-0.5">+91 98450 12345 / +91 94440 67890</div>
                  <div className="text-[10px] text-slate-500">Mon - Sat: 9:00 AM – 9:00 PM IST</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ff6a00]/10 border border-[#ff6a00]/30 flex items-center justify-center shrink-0 text-[#ff6a00]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Official Correspondence</div>
                  <div className="text-slate-500 mt-0.5">support@partsly.in | founders@partsly.in</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ff6a00]/10 border border-[#ff6a00]/30 flex items-center justify-center shrink-0 text-[#ff6a00]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Campus Runner Hours</div>
                  <div className="text-slate-500 mt-0.5">
                    Batch 1 (Morning): 10:30 AM – 1:00 PM<br />
                    Batch 2 (Evening): 4:30 PM – 7:30 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#161616] to-slate-50 border border-[#ff6a00]/20 flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-[#ff6a00] shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-slate-900">100% Tested Lab Silicon</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Every IC, sensor, and MCU undergoes functional power-on boot validation before dispatch.</div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center mx-auto text-[#22c55e]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Message Received</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Thank you, <strong>{name}</strong>. An engineering ticket has been opened. Our technical team will reply to <strong>{email}</strong> within 3 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 py-2.5 px-6 rounded-xl bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Submit a Direct Inquiry</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the form below and our hardware engineering support desk will get back to you promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-600 block mb-1.5 font-semibold">Your Name:</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aditi Rao"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1.5 font-semibold">Student / Work Email:</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aditi@college.edu"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1.5 font-semibold">Inquiry Category / Subject:</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Urgent Viva Kit Dispatch / ESP32 Pinout Clarification"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1.5 font-semibold">Detailed Message:</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your technical requirements, college campus gate, or order details..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#ff6a00] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7a1a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6a00]/25 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Engineering Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
