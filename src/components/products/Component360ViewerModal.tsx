"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  X, RotateCw, ZoomIn, ZoomOut, Layers, Eye, Cpu, Zap, Info,
  CheckCircle2, ShoppingBag, Share2, Sparkles, Wrench, AlertTriangle
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface PinoutHotspot {
  id: string;
  name: string;
  type: "POWER" | "GND" | "DIGITAL" | "ANALOG" | "COMM";
  voltage: string;
  description: string;
  xPercent: number; // Position on image
  yPercent: number;
}

interface Component360ViewerModalProps {
  productName: string;
  productImage: string;
  price: number;
  variantId: string;
  category?: string;
  onClose: () => void;
}

export function Component360ViewerModal({
  productName,
  productImage,
  price,
  variantId,
  category = "Development Boards",
  onClose,
}: Component360ViewerModalProps) {
  const { addToCart, setIsCartDrawerOpen, addToast } = useApp();

  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewLayer, setViewLayer] = useState<"SILKSCREEN" | "COPPER_TRACES" | "XRAY">("SILKSCREEN");
  const [selectedPin, setSelectedPin] = useState<PinoutHotspot | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);

  // Default Pinout Hotspots for hardware components (Arduino, ESP32, Sensors, etc.)
  const pinoutHotspots: PinoutHotspot[] = [
    {
      id: "pin-vcc",
      name: "VCC (5V / VIN)",
      type: "POWER",
      voltage: "5.0V DC",
      description: "Main power input pin. Connect to 5V power supply or USB power rail.",
      xPercent: 22,
      yPercent: 28,
    },
    {
      id: "pin-gnd",
      name: "GND (Ground)",
      type: "GND",
      voltage: "0V Reference",
      description: "Common ground reference pin. Must be connected to common circuit ground.",
      xPercent: 32,
      yPercent: 28,
    },
    {
      id: "pin-gpio5",
      name: "GPIO 5 / TRIG",
      type: "DIGITAL",
      voltage: "3.3V - 5.0V Logic",
      description: "Digital Trigger I/O pin with PWM hardware timer support.",
      xPercent: 68,
      yPercent: 35,
    },
    {
      id: "pin-gpio18",
      name: "GPIO 18 / ECHO",
      type: "DIGITAL",
      voltage: "3.3V Logic",
      description: "Digital Echo Pulse input pin. Measures ultrasonic return pulse timing.",
      xPercent: 78,
      yPercent: 35,
    },
    {
      id: "pin-sda",
      name: "I2C SDA (Data)",
      type: "COMM",
      voltage: "3.3V I2C Bus",
      description: "I2C Serial Data line with built-in pull-up resistor support.",
      xPercent: 45,
      yPercent: 72,
    },
    {
      id: "pin-scl",
      name: "I2C SCL (Clock)",
      type: "COMM",
      voltage: "3.3V I2C Bus",
      description: "I2C Serial Clock line for synchronizing I2C sensor communications.",
      xPercent: 55,
      yPercent: 72,
    },
  ];

  // Mouse Drag to Rotate 360° logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    if (Math.abs(deltaX) > 5) {
      setRotationAngle((prev) => (prev + deltaX * 0.8 + 360) % 360);
      setDragStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getPinTypeBadge = (type: PinoutHotspot["type"]) => {
    switch (type) {
      case "POWER":
        return "bg-rose-500 text-white border-rose-400";
      case "GND":
        return "bg-slate-900 text-slate-100 border-slate-700";
      case "COMM":
        return "bg-purple-600 text-white border-purple-400";
      case "ANALOG":
        return "bg-amber-500 text-slate-950 border-amber-300";
      case "DIGITAL":
      default:
        return "bg-emerald-600 text-white border-emerald-400";
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto select-none">
      
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6a00] to-[#ea580c] flex items-center justify-center text-white shadow-md shadow-[#ff6a00]/30">
              <RotateCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-[#ff6a00] text-white uppercase tracking-wider">
                  360° HARDWARE INSPECTOR
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold">Interactive Pinout Hotspots</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                {productName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Layer Mode Toggle */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-bold mr-1">Layer:</span>
            {[
              { key: "SILKSCREEN", label: "Silkscreen (Top)" },
              { key: "COPPER_TRACES", label: "Copper Traces" },
              { key: "XRAY", label: "PCB X-Ray" },
            ].map((layer) => (
              <button
                key={layer.key}
                onClick={() => setViewLayer(layer.key as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  viewLayer === layer.key
                    ? "bg-[#ff6a00] text-white shadow-md shadow-[#ff6a00]/20"
                    : "bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>

          {/* Zoom & Rotation Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-1 font-mono font-bold text-[11px] text-slate-200">{zoomLevel}x</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.5))}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setRotationAngle((a) => (a + 90) % 360)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Rotate ({Math.round(rotationAngle)}°)</span>
            </button>
          </div>

        </div>

        {/* 360° Interactive Canvas Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 min-h-[380px] bg-slate-950">
          
          {/* Main 360° Interactive Image Container */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="lg:col-span-8 relative flex items-center justify-center p-8 overflow-hidden cursor-grab active:cursor-grabbing border-r border-slate-800"
          >
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Instruction Overlay */}
            <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 text-slate-300 text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#ff6a00]" />
              <span>Drag horizontally to spin component 360°</span>
            </div>

            {/* Component Image with 3D Rotation & Layer Filters */}
            <div
              className="relative transition-transform duration-100 ease-out"
              style={{
                transform: `rotateY(${rotationAngle}deg) scale(${zoomLevel})`,
                filter:
                  viewLayer === "COPPER_TRACES"
                    ? "hue-rotate(90deg) contrast(150%) brightness(90%)"
                    : viewLayer === "XRAY"
                    ? "invert(100%) hue-rotate(180deg) opacity(85%)"
                    : "none",
              }}
            >
              <Image
                src={productImage || "/logo-icon.png"}
                alt={productName}
                width={320}
                height={320}
                className="object-contain drop-shadow-[0_20px_50px_rgba(255,106,0,0.2)] pointer-events-none"
              />

              {/* Pinout Hotspot Overlays */}
              {viewLayer === "SILKSCREEN" &&
                pinoutHotspots.map((pin) => (
                  <button
                    key={pin.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPin(pin);
                    }}
                    style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 font-mono font-black text-[9px] flex items-center justify-center shadow-lg transition-transform hover:scale-125 cursor-pointer animate-pulse ${getPinTypeBadge(
                      pin.type
                    )} ${selectedPin?.id === pin.id ? "ring-4 ring-[#ff6a00]" : ""}`}
                    title={pin.name}
                  >
                    •
                  </button>
                ))}
            </div>
          </div>

          {/* Side Inspector Info Panel */}
          <div className="lg:col-span-4 p-5 bg-slate-900 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#ff6a00]" />
                <span>Pinout & Specs Inspector</span>
              </div>

              {selectedPin ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-sm text-white">{selectedPin.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getPinTypeBadge(
                        selectedPin.type
                      )}`}
                    >
                      {selectedPin.type}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Logic Voltage:</span>
                      <span className="font-mono font-bold text-[#ff6a00]">{selectedPin.voltage}</span>
                    </div>
                    <p className="text-slate-400 leading-snug pt-1">{selectedPin.description}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center py-8 text-xs text-slate-400 space-y-2">
                  <Info className="w-6 h-6 text-[#ff6a00] mx-auto opacity-80" />
                  <p className="font-bold text-slate-300">Click any Pin Hotspot on board</p>
                  <p className="text-[11px] text-slate-500">
                    Inspect VCC, GND, GPIO logic voltages, I2C bus lines, and PWM channels.
                  </p>
                </div>
              )}
            </div>

            {/* Purchase & Share Action Footer */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 font-semibold">Verified Price:</span>
                <span className="text-xl font-black font-mono text-[#ff6a00]">₹{price}</span>
              </div>

              <button
                onClick={() => {
                  addToCart({
                    variantId,
                    name: productName,
                    price,
                    image: productImage,
                    quantity: 1,
                    openDrawer: true,
                  });
                  addToast(`Added ${productName} to cart!`, "success");
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-xs shadow-lg shadow-[#ff6a00]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Inspected Component to Cart</span>
              </button>

              <button
                onClick={() => {
                  const text = `🔌 *${productName} (360° Hardware View)*%0A%0AInspect specs, pinout & buy on Partsly:%0A${window.location.href}`;
                  window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share 360° Pinout to WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
