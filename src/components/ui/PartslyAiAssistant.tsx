"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles, X, Send, Bot, PackageCheck, Search, ChevronRight,
  HelpCircle, Truck, Cpu, Layers, MessageSquare, ArrowRight,
  CheckCircle2, Wrench, RefreshCw, PhoneCall, ShoppingBag, ExternalLink,
  Zap, Code2, ShieldCheck
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
  recommendedComponent?: {
    name: string;
    price: number;
    variantId: string;
    sku: string;
  };
}

const AI_SUGGESTIONS = [
  {
    id: "mcu-compare",
    label: "⚡ Arduino vs ESP32",
    prompt: "Which microcontroller should I choose for my project?",
    icon: Cpu,
  },
  {
    id: "track-dispatch",
    label: "📦 Track Campus Runner",
    prompt: "Where is my order? Track status",
    icon: Truck,
  },
  {
    id: "pinout-help",
    label: "🔌 Pinout & Wiring Help",
    prompt: "How do I connect HC-SR04 sensor to ESP32?",
    icon: Wrench,
  },
  {
    id: "pcb-quote",
    label: "🛠️ Gerber & STL 3D Quote",
    prompt: "How to upload Gerber for PCB fabrication?",
    icon: Layers,
  },
];

export function PartslyAiAssistant() {
  const { isCartDrawerOpen, addToCart, setIsCartDrawerOpen } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: `👋 Hi! I'm **${BRAND.displayName} AI Lab Assistant**. I can help you select microcontrollers, check pinouts, track campus runner dispatches, or generate a custom BOM!`,
      timestamp: "Just now",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isThinking]);

  if (isCartDrawerOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
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
    setIsThinking(true);

    // AI Intelligence Response Engine
    setTimeout(() => {
      let botResponse = "";
      let actionUrl: string | undefined;
      let actionText: string | undefined;
      let recommendedComponent: Message["recommendedComponent"] = undefined;

      const lower = text.toLowerCase();

      if (lower.includes("track") || lower.includes("order") || lower.includes("status") || lower.includes("runner") || /\d{10}/.test(lower)) {
        botResponse = "📦 **Live Dispatch Tracker**: All orders are assigned to campus runners within 10 minutes of payment verification. You can check UTR approval & real-time delivery status under My Orders.";
        actionUrl = "/account/orders";
        actionText = "Track My Campus Orders";
      } else if (lower.includes("arduino") || lower.includes("esp32") || lower.includes("mcu") || lower.includes("pick") || lower.includes("choose")) {
        botResponse = "⚡ **Microcontroller Comparison**:\n\n• **Arduino Uno R3 (₹450)**: Ideal for robotics, motor control, PWM, and beginner C++ capstones.\n• **ESP32 Wi-Fi + BLE (₹320)**: Ideal for IoT, web dashboards, Bluetooth apps, and cloud telemetry.\n\nBoth items are stocked at campus hubs!";
        actionUrl = "/shop?category=development-boards";
        actionText = "Browse Microcontrollers";
        recommendedComponent = {
          name: "ESP32 CP2102 Wi-Fi + Bluetooth Board",
          price: 320,
          variantId: "esp32-node-mcu",
          sku: "ESP32-DEV-30P",
        };
      } else if (lower.includes("pinout") || lower.includes("wiring") || lower.includes("sensor") || lower.includes("connect") || lower.includes("hcsr04")) {
        botResponse = "🔌 **HC-SR04 Ultrasonic Sensor Pinout to ESP32**:\n• VCC ➔ 5V / VIN\n• GND ➔ GND\n• TRIG ➔ GPIO 5\n• ECHO ➔ GPIO 18 (Use 1kΩ resistor divider if needed)\n\nNeed sensors or headers?";
        actionUrl = "/shop?category=sensors";
        actionText = "View Lab Sensors Catalog";
      } else if (lower.includes("pcb") || lower.includes("gerber") || lower.includes("3d") || lower.includes("stl") || lower.includes("print")) {
        botResponse = "🛠️ **Custom PCB & 3D Fabrication**:\nUpload your Gerber `.zip` for FR-4 2-Layer PCB manufacturing or STL/OBJ for PLA sensor chassis. Quotes generated in 60s!";
        actionUrl = "/services/pcb";
        actionText = "Upload Gerber / STL File";
      } else if (lower.includes("sourcing") || lower.includes("rare") || lower.includes("ic")) {
        botResponse = "🔍 **Component Sourcing Hub**: If a specific IC or module isn't listed in our store, submit a sourcing request. Our procurement team sources it within 24–48 hours.";
        actionUrl = "/services/component-sourcing";
        actionText = "Submit Sourcing Request";
      } else {
        botResponse = `Thanks for asking! For custom lab projects, project BOM verification, or urgent runner requests, connect directly with our engineering team on WhatsApp.`;
        actionUrl = "https://wa.me/917032635858?text=Hi%20Partsly%20AI%20Team,%20I%20need%20help%20with%20my%20project";
        actionText = "Chat on WhatsApp (+91 70326 35858)";
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionUrl,
        actionText,
        recommendedComponent,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-2xl border border-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#ff6a00] to-[#ea580c] flex items-center justify-center text-white shadow-md shadow-[#ff6a00]/30 group-hover:rotate-12 transition-transform">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div className="text-left">
            <div className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
              <span>Partsly AI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400 font-normal">Component & Delivery Help</div>
          </div>
        </button>
      )}

      {/* Main Chat Panel Modal */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[550px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 text-white">
          
          {/* Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6a00] to-[#ea580c] flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <span>Partsly AI Hardware Copilot</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">v2.5 AI</span>
                </div>
                <div className="text-[10px] text-slate-400">Instant Pinout, BOM & Order Assistance</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick AI Suggestions Carousel */}
          <div className="p-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {AI_SUGGESTIONS.map((sug) => {
              const Icon = sug.icon;
              return (
                <button
                  key={sug.id}
                  onClick={() => handleSendMessage(sug.prompt)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-bold shrink-0 flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span>{sug.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-[#ff6a00] text-white font-semibold rounded-br-none shadow-md shadow-[#ff6a00]/20"
                      : "bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none shadow-xs"
                  }`}
                >
                  {msg.text}

                  {/* AI Component Recommendation Card */}
                  {msg.recommendedComponent && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-2 text-slate-100">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#ff6a00]">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" /> Recommended MCU
                        </span>
                        <span className="font-mono">₹{msg.recommendedComponent.price}</span>
                      </div>
                      <div className="text-xs font-bold text-white leading-snug">
                        {msg.recommendedComponent.name}
                      </div>
                      <button
                        onClick={() => {
                          addToCart({
                            variantId: msg.recommendedComponent!.variantId,
                            name: msg.recommendedComponent!.name,
                            price: msg.recommendedComponent!.price,
                            image: "/logo-icon.png",
                            quantity: 1,
                            openDrawer: true,
                          });
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-[#ff6a00] hover:bg-[#ea580c] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart (₹{msg.recommendedComponent.price})</span>
                      </button>
                    </div>
                  )}

                  {/* Action Link Button */}
                  {msg.actionUrl && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700">
                      <Link
                        href={msg.actionUrl}
                        target={msg.actionUrl.startsWith("http") ? "_blank" : "_self"}
                        onClick={() => {
                          if (!msg.actionUrl?.startsWith("http")) setIsOpen(false);
                        }}
                        className="inline-flex items-center gap-1.5 font-bold text-[#ff6a00] hover:underline text-[11px]"
                      >
                        <span>{msg.actionText || "View Details"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* AI Thinking Animation */}
            {isThinking && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 text-xs w-fit">
                <div className="w-4 h-4 rounded-full border-2 border-[#ff6a00] border-t-transparent animate-spin" />
                <span className="font-bold text-slate-300">Partsly AI Copilot is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask AI: pinouts, Arduino vs ESP32, order status..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6a00]"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className="p-2.5 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] disabled:opacity-40 text-white font-bold transition-all cursor-pointer shadow-md shadow-[#ff6a00]/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 text-[10px] text-slate-500 text-center font-medium flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Powered by Partsly Lab AI • 10-30 Min Campus Express</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
