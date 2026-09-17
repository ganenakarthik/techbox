"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PARTSLY_TEAM, TeamMember } from "@/data/teamData";
import { GlassProfileCard } from "./GlassProfileCard";
import { ExpandedProfileModal } from "./ExpandedProfileModal";
import { CarouselControls } from "./CarouselControls";

export function ThreeDTeamCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);

  // Screen size & reduced motion detection
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", checkScreen);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + PARTSLY_TEAM.length) % PARTSLY_TEAM.length);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % PARTSLY_TEAM.length);
  }, []);

  const handleSelect = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMember) return; // Modal is open
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, selectedMember]);

  // Ambient mouse tracking for subtle 3D parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Pointer drag gestures for 3D rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest(".cursor-pointer")
    ) {
      dragStartX.current = null;
      return;
    }
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const deltaX = e.clientX - dragStartX.current;
    if (deltaX > 40) {
      handlePrev();
    } else if (deltaX < -40) {
      handleNext();
    }
    dragStartX.current = null;
  };

  // Card click behavior: if front card, expand; if side card, rotate to front
  const handleCardClick = (member: TeamMember, index: number) => {
    if (index === activeIndex) {
      setSelectedMember(member);
    } else {
      setActiveIndex(index);
    }
  };

  // Wheel horizontal navigation with throttle
  const lastWheelTime = useRef(0);
  const handleWheel = (e: React.WheelEvent) => {
    if (selectedMember) return;
    const now = Date.now();
    if (now - lastWheelTime.current < 260) return;
    if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 30) {
      if (e.deltaX > 20 || e.deltaY > 30) {
        handleNext();
        lastWheelTime.current = now;
      } else if (e.deltaX < -20 || e.deltaY < -30) {
        handlePrev();
        lastWheelTime.current = now;
      }
    }
  };

  // Calculate 3D positioning for each card on the circular arc
  const getCard3DStyles = (index: number) => {
    const total = PARTSLY_TEAM.length;
    let offset = (index - activeIndex) % total;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const angleDeg = offset * (360 / total); // 45 deg per card
    const angleRad = (angleDeg * Math.PI) / 180;

    // Radius of circular orbit in px
    const radius = isMobile ? 260 : 460;

    const x = Math.sin(angleRad) * radius;
    const z = Math.cos(angleRad) * radius - radius; // 0 for front, negative for background
    const rotateY = angleDeg * 0.85;

    const distance = Math.abs(offset);
    const isFront = distance === 0;

    // Visual degradation for depth
    const scale = isFront ? 1 : Math.max(0.72, 1 - distance * 0.09);
    const opacity = isFront ? 1 : Math.max(0.28, 1 - distance * 0.22);
    const blur = isFront ? 0 : Math.min(distance * 2, 5);
    const zIndex = 30 - distance * 3;

    return {
      x,
      z,
      rotateY,
      scale,
      opacity,
      blur,
      zIndex,
      distance,
      isFront,
    };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className="relative w-full py-12 md:py-16 flex flex-col items-center justify-center overflow-hidden touch-pan-y"
    >
      {/* High-Tech Perspective Stage */}
      <div
        className="relative w-full max-w-6xl h-[520px] sm:h-[560px] md:h-[600px] flex items-center justify-center"
        style={{
          perspective: isMobile ? "900px" : "1400px",
          perspectiveOrigin: "50% 48%",
        }}
      >
        {/* Parallax Container tilting with mouse */}
        <motion.div
          animate={
            reducedMotion
              ? {}
              : {
                  rotateX: -mouseOffset.y * 5,
                  rotateY: mouseOffset.x * 7,
                }
          }
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 24,
            mass: 0.5,
          }}
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Subtle 3D Ambient Floor Ring */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[850px] h-[600px] md:h-[850px] rounded-full border border-white/[0.04] pointer-events-none"
            style={{
              transform: "rotateX(75deg) translateZ(-160px)",
              background:
                "radial-gradient(circle, rgba(255,106,0,0.06) 0%, transparent 70%)",
            }}
          />

          {/* 8 Glass Cards Placed in 3D Space */}
          {PARTSLY_TEAM.map((member, index) => {
            const styles = getCard3DStyles(index);

            return (
              <motion.div
                key={member.id}
                animate={{
                  x: styles.x,
                  z: styles.z,
                  rotateY: styles.rotateY,
                  scale: styles.scale,
                  opacity: styles.opacity,
                  filter: `blur(${styles.blur}px)`,
                  // Idle vertical float
                  y: reducedMotion ? 0 : [0, -6, 0],
                }}
                transition={{
                  x: { type: "spring", stiffness: 180, damping: 24 },
                  z: { type: "spring", stiffness: 180, damping: 24 },
                  rotateY: { type: "spring", stiffness: 180, damping: 24 },
                  scale: { type: "spring", stiffness: 220, damping: 26 },
                  opacity: { duration: 0.35 },
                  filter: { duration: 0.35 },
                  y: {
                    repeat: Infinity,
                    duration: 5.5 + (index % 3),
                    ease: "easeInOut",
                  },
                }}
                style={{
                  position: "absolute",
                  transformStyle: "preserve-3d",
                  zIndex: styles.zIndex,
                  pointerEvents: Math.abs(styles.distance) > 2 ? "none" : "auto",
                }}
              >
                <GlassProfileCard
                  member={member}
                  isActive={styles.isFront}
                  distance={styles.distance}
                  onClick={() => handleCardClick(member, index)}
                  onExpand={() => {
                    setActiveIndex(index);
                    setSelectedMember(member);
                  }}
                  reducedMotion={reducedMotion}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Interactive Controls & Trackers */}
      <CarouselControls
        members={PARTSLY_TEAM}
        activeIndex={activeIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelect={handleSelect}
      />

      {/* Expanded Profile Immersive Modal */}
      <ExpandedProfileModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
