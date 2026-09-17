import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Truck, ShieldCheck, Cpu, Sparkles, MapPin, Phone, Mail } from "lucide-react";
import { BRAND } from "@/config/brand";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-xs">
      {/* Top Value Badges (Robu.in Style) */}
      <div className="border-b border-slate-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#ff6a00]" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Direct Campus Delivery</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Delivered to hostels, labs & main gate</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#ff6a00]" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">BOM & Document Analyzer</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Upload project PDF → auto kit match</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-[#ff6a00]" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Lab-Tested Hardware</div>
                <div className="text-[11px] text-slate-500 mt-0.5">100% verified microcontrollers & sensors</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#ff6a00]" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Engineering Support</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Schematics, pinouts, code & viva prep</div>
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
            <Link href="/" className="inline-block">
              <Image
                src={BRAND.logo}
                alt={BRAND.displayName}
                width={140}
                height={38}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              Everything for your project. {BRAND.displayName} is the premier student project infrastructure platform for engineering and polytechnic students across India — from genuine Arduino & ESP32 silicon to custom PCB manufacturing, rapid 3D enclosures, and presentation-ready documentation.
            </p>
            <div className="space-y-1.5 pt-1 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#ff6a00] shrink-0" />
                <span>Campus dispatch network active across engineering colleges nationwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Helpline & WhatsApp Support: +91 70326 35858</span>
              </div>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Shop Components</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/shop" className="hover:text-[#ff6a00] transition-colors">All Components</Link></li>
              <li><Link href="/shop?category=development-boards" className="hover:text-[#ff6a00] transition-colors">Arduino & MCUs</Link></li>
              <li><Link href="/shop?category=sensors-modules" className="hover:text-[#ff6a00] transition-colors">Sensors & Modules</Link></li>
              <li><Link href="/shop?category=esp32-iot" className="hover:text-[#ff6a00] transition-colors">ESP32 & Wireless IoT</Link></li>
              <li><Link href="/shop?category=motors-drivers" className="hover:text-[#ff6a00] transition-colors">Robotics Motors</Link></li>
              <li><Link href="/projects" className="hover:text-[#ff6a00] transition-colors">Project Kits</Link></li>
            </ul>
          </div>

          {/* Build Services Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fabrication Hub</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/build" className="hover:text-[#ff6a00] transition-colors font-bold text-[#ff6a00]">Build My Project</Link></li>
              <li><Link href="/services/pcb" className="hover:text-[#ff6a00] transition-colors">PCB Manufacturing</Link></li>
              <li><Link href="/services/3d-printing" className="hover:text-[#ff6a00] transition-colors">3D Print Enclosures</Link></li>
              <li><Link href="/services/prototypes" className="hover:text-[#ff6a00] transition-colors">Working Prototypes</Link></li>
              <li><Link href="/services/documents" className="hover:text-[#ff6a00] transition-colors">IEEE Reports & Viva PPT</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Company & Support</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-[#ff6a00] transition-colors text-slate-900 font-semibold">About Founders & Team</Link></li>
              <li><Link href="/contact" className="hover:text-[#ff6a00] transition-colors">Campus Helpdesk</Link></li>
              <li><Link href="/faq" className="hover:text-[#ff6a00] transition-colors">FAQs & Viva Help</Link></li>
              <li><Link href="/account/orders" className="hover:text-[#ff6a00] transition-colors">Track Campus Order</Link></li>
              <li><Link href="/account/support" className="hover:text-[#ff6a00] transition-colors">Submit Support Ticket</Link></li>
              <li><Link href="/admin" className="hover:text-slate-900 transition-colors text-slate-400">Staff Console</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {BRAND.formalName}. Designed for engineering student builders across India.
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/shipping-policy" className="hover:text-slate-800">Shipping Policy</Link>
            <span>•</span>
            <Link href="/returns" className="hover:text-slate-800">Returns & Refunds</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-slate-800">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-800">Terms</Link>
            <span>•</span>
            <Link href="/payment-info" className="hover:text-slate-800">UPI / Payments</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
