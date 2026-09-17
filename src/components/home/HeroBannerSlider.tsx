"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  image: string;
  title: string;
  href: string;
}

const SLIDES: Slide[] = [
  {
    id: "slide-deals",
    image: "/banners/banner-deals.jpg",
    title: "Innovate. Build. Create. — Up to 45% Off on Electronics & Maker Gear",
    href: "/shop?category=development-boards",
  },
  {
    id: "slide-campus",
    image: "/banners/banner-campus.jpg",
    title: "10-30 Min FastCampus Hostel Delivery for Engineering Students",
    href: "/shop",
  },
  {
    id: "slide-kits",
    image: "/banners/banner-kits.jpg",
    title: "Engineer The Future — Capstone Robotics & IoT Project Kits",
    href: "/projects",
  },
];

export function HeroBannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const current = SLIDES[currentIndex];

  return (
    <div className="w-full bg-slate-100 relative select-none overflow-hidden border-b border-slate-200">
      <div
        className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[25/9] lg:aspect-[28/9] max-h-[460px] overflow-hidden flex items-center group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (diff > 50) nextSlide();
          if (diff < -50) prevSlide();
        }}
      >
        {/* Full-width Clickable Slide Banners (Flipkart / Amazon Standard Edge-to-Edge) */}
        {SLIDES.map((slide, idx) => (
          <Link
            key={slide.id}
            href={slide.href}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${
              idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            title={slide.title}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center w-full h-full"
            />
          </Link>
        ))}

        {/* Left Arrow Button (Flipkart Style Circular Glass Button) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-3 sm:left-8 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center transition-all hover:scale-108 active:scale-95 cursor-pointer shadow-xl border border-slate-200"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
        </button>

        {/* Right Arrow Button (Flipkart Style Circular Glass Button) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-3 sm:right-8 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center transition-all hover:scale-108 active:scale-95 cursor-pointer shadow-xl border border-slate-200"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
        </button>

        {/* Bottom Pagination Dots */}
        <div className="absolute bottom-3 sm:bottom-5 inset-x-0 z-30 flex items-center justify-center gap-2">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? "w-7 sm:w-9 h-2.5 bg-[#ff6a00] shadow-sm"
                  : "w-2.5 h-2.5 bg-slate-400/80 hover:bg-slate-700"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroBannerSlider;
