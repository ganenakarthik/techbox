import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Truck, ShieldCheck, Cpu, Sparkles, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#262626] text-neutral-400 text-xs">
      {/* Top Value Badges */}
      <div className="border-b border-[#1c1c1c] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111111] border border-[#222222]">
              <div className="w-10 h-10 rounded-lg bg-[#ff6a00]/10 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#ff6a00]" />
              </div>
              <div>
                <div className="font-semibold text-white">Direct Campus Delivery</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Delivered to hostels, labs & main gate</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111111] border border-[#222222]">
              <div className="w-10 h-10 rounded-lg bg-[#ff6a00]/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#ff6a00]" />
              </div>
              <div>
                <div className="font-semibold text-white">BOM & Document Analyzer</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Upload project PDF → auto kit match</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111111] border border-[#222222]">
              <div className="w-10 h-10 rounded-lg bg-[#ff6a00]/10 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-[#ff6a00]" />
              </div>
              <div>
                <div className="font-semibold text-white">Lab-Tested Hardware</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">100% verified microcontrollers & sensors</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111111] border border-[#222222]">
              <div className="w-10 h-10 rounded-lg bg-[#ff6a00]/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#ff6a00]" />
              </div>
              <div>
                <div className="font-semibold text-white">Engineering Support</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Schematics, pinouts, code & viva prep</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info with Official Logo */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[#141414] border border-[#ff6a00]/40 shrink-0">
                <Image src="/logo-icon.png" alt="TechBox" fill className="object-contain p-0.5" />
              </div>
              <span className="font-extrabold text-base tracking-wider text-white">
                TECH<span className="text-[#ff6a00]">BOX</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Everything for your project. TechBox is the student project infrastructure platform for engineering and university students across India — from individual microcontrollers to custom PCB manufacturing, working prototypes, and presentation-ready documentation.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <MapPin className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Campus dispatch network active across engineering institutes nationwide</span>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Components</Link></li>
              <li><Link href="/shop?category=esp32-iot" className="hover:text-white transition-colors">ESP32 & IoT</Link></li>
              <li><Link href="/shop?category=development-boards" className="hover:text-white transition-colors">Arduino & MCUs</Link></li>
              <li><Link href="/shop?category=sensors-modules" className="hover:text-white transition-colors">Sensors & Modules</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Project Kits</Link></li>
              <li><Link href="/shop?category=motors-drivers" className="hover:text-white transition-colors">Robotics Motors</Link></li>
            </ul>
          </div>

          {/* Build Services Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Build Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/build" className="hover:text-white transition-colors text-[#ff6a00]">Build My Project</Link></li>
              <li><Link href="/services/prototypes" className="hover:text-white transition-colors">Working Prototypes</Link></li>
              <li><Link href="/services/pcb" className="hover:text-white transition-colors">PCB Manufacturing</Link></li>
              <li><Link href="/services/3d-printing" className="hover:text-white transition-colors">3D Print Enclosures</Link></li>
              <li><Link href="/services/documents" className="hover:text-white transition-colors">Project Reports & PPT</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company & Support</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-white transition-colors text-white font-semibold">About Founders & Story</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Campus Helpline & Desk</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/account/orders" className="hover:text-white transition-colors">Track Campus Order</Link></li>
              <li><Link href="/account/support" className="hover:text-white transition-colors">Help Desk / Tickets</Link></li>
              <li><Link href="/admin" className="hover:text-neutral-300 transition-colors text-neutral-500">Staff Console</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="mt-12 pt-8 border-t border-[#1f1f1f] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} TechBox Inc. Built by engineers for student builders.
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/shipping-policy" className="hover:text-neutral-300">Shipping Policy</Link>
            <span>•</span>
            <Link href="/returns" className="hover:text-neutral-300">Returns & Refunds</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-neutral-300">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-neutral-300">Terms</Link>
            <span>•</span>
            <Link href="/cancellation" className="hover:text-neutral-300">Cancellation</Link>
            <span>•</span>
            <Link href="/payment-info" className="hover:text-neutral-300">Payments</Link>
            <span>•</span>
            <a href="/?intro=true" className="hover:text-[#ff6a00] transition-colors">Replay Boot Sequence</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
