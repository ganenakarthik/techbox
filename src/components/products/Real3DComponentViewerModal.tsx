"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  X, RotateCw, ZoomIn, ZoomOut, Layers, Eye, Cpu, Zap, Info,
  CheckCircle2, ShoppingBag, Share2, Sparkles, Wrench, Play, Pause,
  Box, Sun, Compass
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface PinoutHotspot {
  id: string;
  name: string;
  type: "POWER" | "GND" | "DIGITAL" | "ANALOG" | "COMM";
  voltage: string;
  description: string;
  position3D: [number, number, number];
}

interface Real3DComponentViewerProps {
  productName: string;
  productImage?: string;
  price: number;
  variantId: string;
  category?: string;
  onClose: () => void;
}

export function Real3DComponentViewerModal({
  productName,
  productImage,
  price,
  variantId,
  category = "Development Boards",
  onClose,
}: Real3DComponentViewerProps) {
  const { addToCart, addToast } = useApp();

  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [selectedPin, setSelectedPin] = useState<PinoutHotspot | null>(null);
  const [activeBoardColor, setActiveBoardColor] = useState<string>("#0f766e"); // Teal / Blue / Black PCB

  // Default 3D Pinout Hotspots anchored in 3D coordinate space
  const pinoutHotspots: PinoutHotspot[] = [
    {
      id: "pin-vcc",
      name: "VCC (5V / VIN)",
      type: "POWER",
      voltage: "5.0V DC",
      description: "Main power supply input pin. Powers onboard LDO regulator and MCU core.",
      position3D: [-2.2, 0.25, 1.3],
    },
    {
      id: "pin-gnd",
      name: "GND (Ground)",
      type: "GND",
      voltage: "0V Reference",
      description: "System common ground. Must be tied to power source ground.",
      position3D: [-1.6, 0.25, 1.3],
    },
    {
      id: "pin-gpio5",
      name: "GPIO 5 / TRIG",
      type: "DIGITAL",
      voltage: "3.3V - 5.0V Logic",
      description: "Digital output pin with hardware PWM timer for ultrasonic trigger pulse.",
      position3D: [1.5, 0.25, 1.3],
    },
    {
      id: "pin-gpio18",
      name: "GPIO 18 / ECHO",
      type: "DIGITAL",
      voltage: "3.3V Logic",
      description: "Digital interrupt input pin for receiving ultrasonic pulse return.",
      position3D: [2.1, 0.25, 1.3],
    },
    {
      id: "pin-sda",
      name: "I2C SDA (Data)",
      type: "COMM",
      voltage: "3.3V I2C Bus",
      description: "I2C Serial Data line for OLED displays & IMU sensors.",
      position3D: [0.5, 0.25, -1.3],
    },
    {
      id: "pin-scl",
      name: "I2C SCL (Clock)",
      type: "COMM",
      voltage: "3.3V I2C Bus",
      description: "I2C Serial Clock synchronization line.",
      position3D: [1.1, 0.25, -1.3],
    },
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Create WebGL Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080c14);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // 2. Add Lighting (Sun Directional + Ambient + LED Point Lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(5, 10, 7);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const orangeLedLight = new THREE.PointLight(0xff6a00, 3, 10);
    orangeLedLight.position.set(-1.0, 0.5, 0);
    scene.add(orangeLedLight);

    // 3. Build Real 3D Hardware PCB Board Mesh Group
    const boardGroup = new THREE.Group();

    // A. Main FR-4 PCB Substrate Box
    const pcbGeo = new THREE.BoxGeometry(5.2, 0.18, 3.0);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeBoardColor),
      roughness: 0.4,
      metalness: 0.1,
      wireframe: wireframeMode,
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    pcbMesh.receiveShadow = true;
    pcbMesh.castShadow = true;
    boardGroup.add(pcbMesh);

    // B. Main Microcontroller IC Chip (ATmega328P / ESP32 SOC)
    const icGeo = new THREE.BoxGeometry(1.8, 0.25, 1.8);
    const icMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: wireframeMode,
    });
    const icMesh = new THREE.Mesh(icGeo, icMat);
    icMesh.position.set(-0.5, 0.2, 0);
    icMesh.castShadow = true;
    boardGroup.add(icMesh);

    // IC Metallic Brand Badge
    const badgeGeo = new THREE.BoxGeometry(1.2, 0.02, 1.2);
    const badgeMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.1 });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(-0.5, 0.33, 0);
    boardGroup.add(badgeMesh);

    // C. USB Port Connector
    const usbGeo = new THREE.BoxGeometry(0.9, 0.4, 0.8);
    const usbMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.95, roughness: 0.1 });
    const usbMesh = new THREE.Mesh(usbGeo, usbMat);
    usbMesh.position.set(-2.2, 0.28, 0);
    usbMesh.castShadow = true;
    boardGroup.add(usbMesh);

    // D. Male & Female Pin Header Strips
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.1 });
    const plasticHeaderMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

    // Front Pin Strip
    for (let x = -2.2; x <= 2.2; x += 0.3) {
      // Black plastic base
      const plasticGeo = new THREE.BoxGeometry(0.24, 0.15, 0.24);
      const plasticMesh = new THREE.Mesh(plasticGeo, plasticHeaderMat);
      plasticMesh.position.set(x, 0.16, 1.3);
      boardGroup.add(plasticMesh);

      // Gold pin
      const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8);
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(x, 0.35, 1.3);
      boardGroup.add(pinMesh);
    }

    // Back Pin Strip
    for (let x = -2.2; x <= 2.2; x += 0.3) {
      const plasticGeo = new THREE.BoxGeometry(0.24, 0.15, 0.24);
      const plasticMesh = new THREE.Mesh(plasticGeo, plasticHeaderMat);
      plasticMesh.position.set(x, 0.16, -1.3);
      boardGroup.add(plasticMesh);

      const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8);
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(x, 0.35, -1.3);
      boardGroup.add(pinMesh);
    }

    // E. Onboard Glowing LED Indicators
    const ledGeo = new THREE.BoxGeometry(0.15, 0.1, 0.15);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0xff6a00,
      emissive: 0xff6a00,
      emissiveIntensity: 2.0,
    });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(-1.0, 0.18, 0.8);
    boardGroup.add(ledMesh);

    scene.add(boardGroup);

    // 4. Mouse Orbiting Controls (Drag to rotate X & Y in 3D)
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };

    const domElement = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };

      boardGroup.rotation.y += deltaMove.x * 0.012;
      boardGroup.rotation.x += deltaMove.y * 0.012;

      // Restrict rotation.x to prevent flipping upside down
      boardGroup.rotation.x = Math.max(-1.2, Math.min(1.2, boardGroup.rotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch Event Orbiting for Mobile Phones
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isMouseDown = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isMouseDown || e.touches.length !== 1) return;

      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y,
      };

      boardGroup.rotation.y += deltaMove.x * 0.012;
      boardGroup.rotation.x += deltaMove.y * 0.012;
      boardGroup.rotation.x = Math.max(-1.2, Math.min(1.2, boardGroup.rotation.x));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    domElement.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onMouseUp);

    // 5. 60 FPS Render Loop with Auto Turmtable Rotation
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (autoRotate && !isMouseDown) {
        boardGroup.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
      renderer.dispose();
    };
  }, [autoRotate, wireframeMode, activeBoardColor]);

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
    <div className="fixed inset-0 z-[170] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto select-none">
      
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6a00] to-[#ea580c] flex items-center justify-center text-white shadow-md shadow-[#ff6a00]/30">
              <Box className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-[#ff6a00] text-white uppercase tracking-wider">
                  REAL WEBGL 3D HARDWARE VIEW
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold">Three.js Spatial Engine</span>
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

        {/* 3D WebGL Toolbar */}
        <div className="px-4 py-3 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Board Color Customizer */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-bold">PCB Finish:</span>
            {[
              { color: "#0f766e", label: "Teal Green" },
              { color: "#1e3a8a", label: "Navy Blue" },
              { color: "#0f172a", label: "Matte Black" },
              { color: "#b91c1c", label: "SRM Red" },
            ].map((b) => (
              <button
                key={b.color}
                onClick={() => setActiveBoardColor(b.color)}
                style={{ backgroundColor: b.color }}
                className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                  activeBoardColor === b.color ? "scale-125 border-white shadow-lg" : "border-slate-700 hover:scale-110"
                }`}
                title={b.label}
              />
            ))}
          </div>

          {/* 3D Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                autoRotate
                  ? "bg-[#ff6a00] text-white border-[#ff6a00] shadow-md shadow-[#ff6a00]/20"
                  : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoRotate ? "Auto Spin On" : "Auto Spin Off"}</span>
            </button>

            <button
              onClick={() => setWireframeMode(!wireframeMode)}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                wireframeMode
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{wireframeMode ? "X-Ray Wireframe" : "Solid Mesh"}</span>
            </button>
          </div>

        </div>

        {/* Real 3D Canvas Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 min-h-[420px] bg-slate-950">
          
          {/* WebGL 3D Canvas Container */}
          <div className="lg:col-span-8 relative flex items-center justify-center border-r border-slate-800 overflow-hidden">
            
            <div ref={mountRef} className="w-full h-full min-h-[420px]" />

            {/* Instruction Badge */}
            <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 text-slate-300 text-[10px] px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-2 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Click & Drag anywhere to orbit 360° in 3D Space</span>
            </div>

            {/* 3D Pin Selector Bar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-3 py-2 rounded-2xl backdrop-blur-xs flex items-center gap-1.5 overflow-x-auto max-w-[92%] shadow-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">3D Pins:</span>
              {pinoutHotspots.map((pin) => (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${getPinTypeBadge(
                    pin.type
                  )} ${selectedPin?.id === pin.id ? "ring-2 ring-white scale-105" : "opacity-80 hover:opacity-100"}`}
                >
                  {pin.name.split(" ")[0]}
                </button>
              ))}
            </div>

          </div>

          {/* Side Pinout & Component Specs Inspector */}
          <div className="lg:col-span-4 p-5 bg-slate-900 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#ff6a00]" />
                <span>3D Hardware Pinout Inspector</span>
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
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center py-10 text-xs text-slate-400 space-y-2">
                  <Info className="w-7 h-7 text-[#ff6a00] mx-auto opacity-80" />
                  <p className="font-bold text-slate-200">Select any 3D Pin from the bottom bar</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Orbit the 3D board geometry to inspect VCC, GND, GPIO logic voltages, and I2C lines.
                  </p>
                </div>
              )}
            </div>

            {/* Purchase & WhatsApp Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 font-semibold">Verified Component Price:</span>
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
                <span>Add Inspected 3D Board to Cart</span>
              </button>

              <button
                onClick={() => {
                  const text = `🔌 *${productName} (Real 3D WebGL Spatial Inspector)*%0A%0AOrbit & inspect 3D pinouts on Partsly:%0A${window.location.href}`;
                  window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share 3D Model to WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
