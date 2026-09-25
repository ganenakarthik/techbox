"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  X, RotateCw, ZoomIn, ZoomOut, Eye, Cpu, Zap, Info,
  ShoppingBag, Share2, Sparkles, Play, Pause, MoveHorizontal,
  Maximize2, ShieldCheck, CheckCircle2
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface PinoutHotspot {
  id: string;
  name: string;
  type: "POWER" | "GND" | "DIGITAL" | "COMM";
  voltage: string;
  description: string;
  xPercent: number;
  yPercent: number;
}

interface Flipkart360ViewerProps {
  productName: string;
  productImage: string;
  price: number;
  variantId: string;
  category?: string;
  onClose: () => void;
}

export function FlipkartStyle360ViewerModal({
  productName,
  productImage,
  price,
  variantId,
  category = "Development Boards",
  onClose,
}: Flipkart360ViewerProps) {
  const { addToCart, addToast } = useApp();

  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [selectedPin, setSelectedPin] = useState<PinoutHotspot | null>(null);

  // Loupe / Magnifier Glass state (Flipkart style)
  const [showMagnifier, setShowMagnifier] = useState<boolean>(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0, relX: 0, relY: 0 });

  const totalFrames = 36; // 36 angle frames = 10 degrees per frame
  const currentAngle = Math.round((currentFrame / totalFrames) * 360);

  // Auto Turmtable Rotation Loop (60 FPS smooth spin)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isDragging) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      }, 70); // ~14 frames per sec smooth studio spin
    }
    return () => clearInterval(interval);
  }, [isPlaying, isDragging]);

  // Drag Physics for 360° Scrubbing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsPlaying(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      if (Math.abs(deltaX) > 4) {
        const frameOffset = Math.floor(deltaX / 6);
        setCurrentFrame((prev) => (prev - frameOffset + totalFrames) % totalFrames);
        setStartX(e.clientX);
      }
    }

    // Magnifier glass calculation
    const target = e.currentTarget as HTMLElement;
    const { left, top, width, height } = target.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    setMagnifierPos({
      x,
      y,
      relX: (x / width) * 100,
      relY: (y / height) * 100,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag for Mobile Phones
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 4) {
      const frameOffset = Math.floor(deltaX / 6);
      setCurrentFrame((prev) => (prev - frameOffset + totalFrames) % totalFrames);
      setStartX(e.touches[0].clientX);
    }
  };

  const pinoutHotspots: PinoutHotspot[] = [
    {
      id: "pin-vcc",
      name: "VCC (5.0V / VIN)",
      type: "POWER",
      voltage: "5.0V DC Input",
      description: "Primary power rail input for system power regulation.",
      xPercent: 25,
      yPercent: 32,
    },
    {
      id: "pin-gnd",
      name: "GND (Common Ground)",
      type: "GND",
      voltage: "0V Reference",
      description: "Common ground reference pin for circuits & sensors.",
      xPercent: 35,
      yPercent: 32,
    },
    {
      id: "pin-[#ff6a00]",
      name: "GPIO 5 / PWM TRIG",
      type: "DIGITAL",
      voltage: "3.3V Logic",
      description: "High-speed PWM digital output pin.",
      xPercent: 65,
      yPercent: 38,
    },
    {
      id: "pin-echo",
      name: "GPIO 18 / ECHO",
      type: "DIGITAL",
      voltage: "3.3V Logic",
      description: "Digital timing input pin for ultrasonic echo detection.",
      xPercent: 75,
      yPercent: 38,
    },
    {
      id: "pin-sda",
      name: "I2C SDA (Data)",
      type: "COMM",
      voltage: "3.3V I2C Bus",
      description: "I2C Serial Data bus line for OLED display & IMU modules.",
      xPercent: 48,
      yPercent: 68,
    },
  ];

  const getPinBadgeStyle = (type: PinoutHotspot["type"]) => {
    switch (type) {
      case "POWER":
        return "bg-rose-500 text-white border-rose-400";
      case "GND":
        return "bg-slate-900 text-slate-100 border-slate-700";
      case "COMM":
        return "bg-purple-600 text-white border-purple-400";
      case "DIGITAL":
      default:
        return "bg-emerald-600 text-white border-emerald-400";
    }
  };

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto select-none">
      
      {/* Main Flipkart-Style 360° Studio Container */}
      <div className="w-full max-w-5xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff6a00] to-[#ea580c] flex items-center justify-center text-white shadow-lg shadow-[#ff6a00]/30">
              <RotateCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-[#ff6a00] text-white uppercase tracking-wider">
                  FLIPKART 360° STUDIO VIEW
                </span>
                <span className="text-[11px] text-slate-400 font-mono font-bold">HD Studio Turntable</span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight mt-0.5">
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

        {/* 360° Interactive Studio Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[460px] bg-slate-50">
          
          {/* Main 360 Image & Drag Area (8 Cols) */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              handleMouseUp();
              setShowMagnifier(false);
            }}
            onMouseEnter={() => setShowMagnifier(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="lg:col-span-8 relative flex items-center justify-center p-8 bg-gradient-to-b from-slate-100 to-white border-r border-slate-200 cursor-grab active:cursor-grabbing overflow-hidden"
          >
            {/* Background 360 Radial Studio Lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,106,0,0.06)_0%,transparent_70%)]" />

            {/* Drag Prompt Overlay */}
            <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 flex items-center gap-2 z-10 backdrop-blur-xs">
              <MoveHorizontal className="w-4 h-4 text-[#ff6a00] animate-pulse" />
              <span>Drag or Swipe to Rotate 360°</span>
            </div>

            {/* Angle & Frame Counter Dial */}
            <div className="absolute top-4 right-4 bg-white/90 border border-slate-200 text-slate-900 text-xs font-mono font-black px-3 py-1.5 rounded-full shadow-md z-10">
              {currentAngle}° • Frame {currentFrame + 1}/{totalFrames}
            </div>

            {/* Product Photographic 360 Image Frame */}
            <div
              className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center transition-transform duration-75"
              style={{
                transform: `rotateY(${currentAngle}deg) scale(${zoomScale})`,
              }}
            >
              <Image
                src={productImage || "/logo-icon.png"}
                alt={productName}
                width={380}
                height={380}
                priority
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] pointer-events-none"
              />

              {/* Pinout Hotspots */}
              {pinoutHotspots.map((pin) => (
                <button
                  key={pin.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin(pin);
                  }}
                  style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 font-mono font-black text-[10px] flex items-center justify-center shadow-lg transition-transform hover:scale-125 cursor-pointer animate-pulse z-20 ${getPinBadgeStyle(
                    pin.type
                  )} ${selectedPin?.id === pin.id ? "ring-4 ring-[#ff6a00]" : ""}`}
                  title={pin.name}
                >
                  •
                </button>
              ))}
            </div>

            {/* Flipkart-Style 4K HD Magnifier Glass (Zoom Lens) */}
            {showMagnifier && !isDragging && (
              <div
                className="absolute w-36 h-36 rounded-full border-4 border-slate-900 bg-white shadow-2xl pointer-events-none overflow-hidden z-30 hidden sm:block"
                style={{
                  left: `${magnifierPos.x - 72}px`,
                  top: `${magnifierPos.y - 72}px`,
                }}
              >
                <div
                  className="w-full h-full relative"
                  style={{
                    backgroundImage: `url(${productImage || "/logo-icon.png"})`,
                    backgroundPosition: `${magnifierPos.relX}% ${magnifierPos.relY}%`,
                    backgroundSize: "280%",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>
            )}

            {/* Bottom Flipkart-Style 360 Rotation Control Ring */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white p-2 px-4 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-3 text-xs z-10 backdrop-blur-md">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-xl bg-[#ff6a00] text-white hover:bg-[#ea580c] font-bold transition-all cursor-pointer shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">0°</span>
                <input
                  type="range"
                  min="0"
                  max={totalFrames - 1}
                  value={currentFrame}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentFrame(Number(e.target.value));
                  }}
                  className="w-36 sm:w-48 accent-[#ff6a00] cursor-pointer"
                />
                <span className="text-[10px] font-mono text-slate-400">360°</span>
              </div>

              <div className="h-4 w-px bg-slate-700" />

              <button
                onClick={() => setZoomScale((z) => (z === 1 ? 1.5 : z === 1.5 ? 2.0 : 1.0))}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-[11px] border border-slate-700 text-slate-200 cursor-pointer"
              >
                {zoomScale}x Zoom
              </button>
            </div>

          </div>

          {/* Right Panel: Spec Inspector & Purchase Box (4 Cols) */}
          <div className="lg:col-span-4 p-6 bg-slate-900 text-white flex flex-col justify-between space-y-4 border-t lg:border-t-0 border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#ff6a00] uppercase tracking-wider mb-3">
                <Cpu className="w-4 h-4" />
                <span>Component Pinout Inspector</span>
              </div>

              {selectedPin ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-sm text-white">{selectedPin.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getPinBadgeStyle(
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
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center py-10 text-xs text-slate-400 space-y-2">
                  <Info className="w-7 h-7 text-[#ff6a00] mx-auto opacity-80" />
                  <p className="font-bold text-slate-200">Click any Pin Hotspot on board</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Inspect VCC, GND, GPIO logic voltages, and I2C lines directly in 360° Studio view.
                  </p>
                </div>
              )}
            </div>

            {/* Purchase Footer */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Verified Price:</span>
                <span className="text-2xl font-black font-mono text-[#ff6a00]">₹{price}</span>
              </div>

              <button
                onClick={() => {
                  addToCart({
                    variantId,
                    name: productName,
                    price,
                    image: productImage || "/logo-icon.png",
                    quantity: 1,
                    openDrawer: true,
                  });
                  addToast(`Added ${productName} to cart!`, "success");
                  onClose();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-extrabold text-xs shadow-lg shadow-[#ff6a00]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Inspected Component to Cart</span>
              </button>

              <button
                onClick={() => {
                  const text = `🔌 *${productName} (Flipkart 360° HD Studio View)*%0A%0AInspect specs, pinout & buy on Partsly:%0A${window.location.href}`;
                  window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share 360° View on WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
