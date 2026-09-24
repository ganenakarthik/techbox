"use client";

import React, { useState } from "react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  PackageCheck,
  Search,
  ChevronRight,
  HelpCircle,
  Truck,
  Cpu,
  Layers,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { useApp } from "@/context/AppContext";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  actionUrl?: string;
  actionText?: string;
}

const QUICK_QUESTIONS = [
  {
    id: "track-order",
    question: "📦 Where is my campus order?",
    icon: PackageCheck,
    answer: "You can track your live campus runner order anytime under My Orders. Enter your 10-digit mobile number or Order # below to check your order status!",
    actionUrl: "/account/orders",
    actionText: "Open Order Tracker",
  },
  {
    id: "mcu-guide",
    question: "⚡ Which MCU should I pick: Arduino or ESP32?",
    icon: Cpu,
    answer: "• Choose *Arduino Uno R3* for basic robotics, sensors, motors, and beginner C++ projects.\n• Choose *ESP32 Wi-Fi + BLE* if your project needs Wi-Fi, Bluetooth, mobile apps, or cloud dashboard connectivity!\nBoth are stocked at campus hubs.",
    actionUrl: "/shop?category=development-boards",
    actionText: "Browse Microcontrollers",
  },
  {
    id: "pcb-3d",
    question: "🛠️ How does Custom PCB & 3D Printing work?",
    icon: Layers,
    answer: "Simply upload your Gerber file (.zip) for custom 1-4 layer FR-4 PCBs, or STL/OBJ for PLA/ABS 3D sensor cases on /services/pcb. Quotes are generated instantly!",
    actionUrl: "/services/pcb",
    actionText: "Upload Gerber / STL",
  },
  {
    id: "sourcing",
    question: "🔍 Can I request an unlisted component?",
    icon: Search,
    answer: "Yes! If an IC, sensor, or module isn't in our shop catalog, request it via Component Sourcing. Our lab engineers procure rare ICs in 24-48h.",
    actionUrl: "/services/component-sourcing",
    actionText: "Submit Sourcing Request",
  },
  {
    id: "delivery",
    question: "🚚 What are the campus delivery times?",
    icon: Truck,
    answer: "Partsly campus runners deliver directly to college hostels, main gate dropzones, and engineering labs in 10 to 30 minutes!",
    actionUrl: "/shipping-policy",
    actionText: "View Delivery Hubs",
  },
];

export function PartslyAiAssistant() {
  const { isCartDrawerOpen } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: `Hello! I'm the ${BRAND.displayName} AI Assistant. How can I help with your campus hardware project or order today?`,
      timestamp: "Just now",
    },
  ]);

  if (isCartDrawerOpen) return null;

  const handleSendCustom = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Simulate AI smart response
    setTimeout(() => {
      let botResponse = `Thanks for asking! For detailed component specs, schematics, or custom orders, you can reach our helpline on WhatsApp at +91 70326 35858 or open a support ticket.`;
      let actionUrl: string | undefined;
      let actionText: string | undefined;

      const lower = text.toLowerCase();
      if (lower.includes("order") || lower.includes("track") || lower.includes("status") || /\d{10}/.test(lower)) {
        botResponse = "You can view all your active campus runner dispatches and UTR verification status under My Orders.";
        actionUrl = "/account/orders";
        actionText = "Track My Campus Orders";
      } else if (lower.includes("pcb") || lower.includes("3d") || lower.includes("gerber") || lower.includes("stl")) {
        botResponse = "Our Fabrication Hub accepts custom Gerber zip files for PCBs and STL files for 3D enclosures with fast campus delivery.";
        actionUrl = "/services/pcb";
        actionText = "Go to Fabrication Hub";
      } else if (lower.includes("esp32") || lower.includes("arduino") || lower.includes("sensor")) {
        botResponse = "We stock 100% lab-tested Arduino Uno R3, ESP32 Wi-Fi modules, OLED displays, ultrasonic sensors, and robotics motors!";
        actionUrl = "/shop";
        actionText = "Explore Components";
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionUrl,
        actionText,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleQuickQuestionClick = (q: typeof QUICK_QUESTIONS[0]) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: q.question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      text: q.answer,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actionUrl: q.actionUrl,
      actionText: q.actionText,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-2xl border border-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#ff6a00] to-[#ea580c] flex items-center justify-center text-white shadow-md shadow-[#ff6a00]/30 group-hover:rotate-12 transition-transform">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="font-bold">Partsly AI Help</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Floating Chat Box Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6a00] to-[#ea580c] flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>Partsly AI Hardware Assistant</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">ONLINE</span>
                </div>
                <div className="text-[10px] text-slate-400">Campus Orders & Component Help</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-line leading-relaxed shadow-2xs ${
                    msg.sender === "user"
                      ? "bg-[#ff6a00] text-white rounded-br-xs font-medium"
                      : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs"
                  }`}
                >
                  {msg.text}
                  {msg.actionUrl && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <Link
                        href={msg.actionUrl}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#ff6a00] font-bold text-[11px] border border-orange-200 transition-colors"
                      >
                        <span>{msg.actionText || "Learn More"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Quick Pre-built Questions Bar */}
          <div className="p-2.5 bg-slate-100 border-t border-slate-200 overflow-x-auto no-scrollbar">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
              Frequent Help Questions:
            </div>
            <div className="flex items-center gap-1.5 min-w-max pb-1">
              {QUICK_QUESTIONS.map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.id}
                    onClick={() => handleQuickQuestionClick(q)}
                    className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-white hover:bg-orange-50 hover:text-[#ff6a00] border border-slate-200 text-slate-700 text-[11px] font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#ff6a00] shrink-0" />
                    <span>{q.question}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendCustom();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about orders, Arduino, ESP32, PCBs..."
                className="flex-1 h-9 px-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#ff6a00]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartslyAiAssistant;
