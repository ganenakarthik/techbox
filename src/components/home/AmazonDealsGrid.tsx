"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, UploadCloud, Zap, ShieldCheck, MapPin } from "lucide-react";

interface AmazonDealsGridProps {
  onUploadClick?: () => void;
}

export function AmazonDealsGrid({ onUploadClick }: AmazonDealsGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-12 lg:-mt-16 relative z-30 mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Microcontrollers */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 flex flex-col justify-between hover:shadow-xl transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                Dev Boards & MCUs
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                From ₹349
              </span>
            </div>

            {/* 2x2 Image Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <Link
                href="/products/arduino-uno-r3-atmega328p"
                className="group p-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src="/products/arduino-uno.jpg"
                    alt="Arduino Uno R3"
                    fill
                    sizes="120px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">Arduino Uno R3</span>
                <span className="text-[10px] font-extrabold text-[#ff6a00]">₹449</span>
              </Link>

              <Link
                href="/products/esp32-devkit-v1-30pin"
                className="group p-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src="/products/esp32-devkit.jpg"
                    alt="ESP32 DevKit V1"
                    fill
                    sizes="120px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">ESP32 DevKit</span>
                <span className="text-[10px] font-extrabold text-[#ff6a00]">₹389</span>
              </Link>

              <Link
                href="/products/raspberry-pi-pico-w-wifi"
                className="group p-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src="/products/rpi-pico-w.jpg"
                    alt="Raspberry Pi Pico W"
                    fill
                    sizes="120px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">RPi Pico W</span>
                <span className="text-[10px] font-extrabold text-[#ff6a00]">₹649</span>
              </Link>

              <Link
                href="/shop?category=development-boards"
                className="group p-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src="/products/esp32-devkit.jpg"
                    alt="ESP32 WiFi Modules"
                    fill
                    sizes="120px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">More Boards</span>
                <span className="text-[10px] font-extrabold text-[#ff6a00]">18+ Models</span>
              </Link>
            </div>
          </div>

          <Link
            href="/shop?category=development-boards"
            className="text-xs font-bold text-[#ff6a00] hover:text-[#ea580c] flex items-center gap-1 group"
          >
            <span>See all development boards</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Card 2: Sensors & Modules */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 flex flex-col justify-between hover:shadow-xl transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                Essential Sensors
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                From ₹79
              </span>
            </div>

            {/* 2x2 Image Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <Link
                href="/products/hc-sr04-ultrasonic-sensor-module"
                className="group p-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src="/products/hc-sr04.jpg"
                    alt="HC-SR04 Sonar"
                    fill
                    sizes="120px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">HC-SR04 Sonar</span>
                <span className="text-[10px] font-extrabold text-[#ff6a00]">₹79</span>
              </Link>

              <Link
                href="/products/0-96-oled-display-module-i2c-ssd1306"
                className="group p-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src="/products/oled-display.jpg"
                    alt="OLED Display"
                    fill
                    sizes="120px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">0.96" OLED I2C</span>
                <span className="text-[10px] font-extrabold text-[#ff6a00]">₹219</span>
              </Link>

              <Link
                href="/products/dht11-digital-temperature-humidity-sensor"
                className="group p-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src="/products/hc-sr04.jpg"
                    alt="DHT11 Temp Sensor"
                    fill
                    sizes="120px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">DHT11 Sensor</span>
                <span className="text-[10px] font-extrabold text-[#ff6a00]">₹89</span>
              </Link>

              <Link
                href="/products/mpu-6050-6dof-gyro-accelerometer-module"
                className="group p-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src="/products/oled-display.jpg"
                    alt="MPU6050 Gyro"
                    fill
                    sizes="120px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">MPU-6050 IMU</span>
                <span className="text-[10px] font-extrabold text-[#ff6a00]">₹145</span>
              </Link>
            </div>
          </div>

          <Link
            href="/shop?category=sensors-modules"
            className="text-xs font-bold text-[#ff6a00] hover:text-[#ea580c] flex items-center gap-1 group"
          >
            <span>Explore all sensors & displays</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Card 3: Motors, Servos & Drivers */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 flex flex-col justify-between hover:shadow-xl transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                Robotics & Power
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                From ₹85
              </span>
            </div>

            {/* 2x2 Image Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <Link
                href="/products/towerpro-sg90-micro-servo-motor-9g"
                className="group p-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src="/products/sg90-servo.jpg"
                    alt="SG90 Servo"
                    fill
                    sizes="120px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">SG90 Servo 9g</span>
                <span className="text-[10px] font-extrabold text-[#ff6a00]">₹85</span>
              </Link>

              <Link
                href="/products/l298n-dual-h-bridge-motor-driver"
                className="group p-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src="/products/l298n-driver.jpg"
                    alt="L298N Motor Driver"
                    fill
                    sizes="120px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">L298N Driver</span>
                <span className="text-[10px] font-extrabold text-[#ff6a00]">₹139</span>
              </Link>

              <Link
                href="/products/2-channel-5v-relay-module-optocoupler"
                className="group p-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src="/products/relay-module.jpg"
                    alt="5V Relay Module"
                    fill
                    sizes="120px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">2-Ch 5V Relay</span>
                <span className="text-[10px] font-extrabold text-[#ff6a00]">₹115</span>
              </Link>

              <Link
                href="/shop?category=motors-drivers"
                className="group p-2 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-center flex flex-col items-center"
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src="/products/l298n-driver.jpg"
                    alt="DC Motors & Chassis"
                    fill
                    sizes="120px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1">Robotics Parts</span>
                <span className="text-[10px] font-extrabold text-[#ff6a00]">Explore</span>
              </Link>
            </div>
          </div>

          <Link
            href="/shop?category=motors-drivers"
            className="text-xs font-bold text-[#ff6a00] hover:text-[#ea580c] flex items-center gap-1 group"
          >
            <span>Shop robotics & actuators</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Card 4: 10-30 Min Campus Dispatch & BOM Upload */}
        <div className="bg-gradient-to-br from-orange-50/70 via-white to-orange-50/30 rounded-2xl p-4 sm:p-5 shadow-lg border border-orange-200/80 flex flex-col justify-between hover:shadow-xl transition-shadow">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff6a00] mb-2 uppercase tracking-wider">
              <Zap className="w-4 h-4 fill-[#ff6a00]" />
              <span>Campus Quick Dispatch</span>
            </div>

            <h3 className="font-black text-slate-900 text-base sm:text-lg mb-2">
              Need Parts Today?
            </h3>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Order directly to your hostel gate, lab desk, or security post in 10-30 minutes.
            </p>

            {/* Campus Highlights */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-[11px] text-slate-700 bg-white/80 p-2 rounded-lg border border-orange-100 shadow-2xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#ff6a00] shrink-0" />
                <span>SRM, VIT, BITS, IITM & 40+ Hubs</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-700 bg-white/80 p-2 rounded-lg border border-orange-100 shadow-2xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Tested • Zero-DOA Guarantee</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={onUploadClick}
              className="w-full py-2.5 px-3 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] active:scale-98 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#ff6a00]/25 transition-all cursor-pointer mb-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload BOM / Circuit</span>
            </button>
            <p className="text-[10px] text-center text-slate-500 font-medium">
              Match CSV, KiCad, or circuit photo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AmazonDealsGrid;