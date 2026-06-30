"use client";

import { useEffect, useRef } from "react";

// Local matching alias for the shared ProductVM contract (do not import).
type ProductVM = {
  slug: string;
  title: string;
  priceCents: number;
  image: string;
  material: string;
};

// SECTION 3 — LESSONS IN CRAFT, FULL-BLEED CINEMA.
// Macro film of saddle-stitching. Plays only while in view for performance.
export default function CraftCinema() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const safePlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) safePlay();
          else video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Lessons in craft"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen min-h-[clamp(70svh,82vh,90svh)] overflow-hidden bg-[#1C1A17]"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/film/heritage-stitch.mp4"
        poster="/film/heritage-stitch-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Bottom scrim for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

      {/* Overlay — anchored bottom-left */}
      <div className="absolute bottom-[clamp(40px,8vw,96px)] left-[clamp(24px,6vw,96px)] max-w-[20ch]">
        <h2
          className="font-display font-light text-[#F5EFE6] leading-[1.0] tracking-[-0.01em]"
          style={{ fontSize: "clamp(34px,5.5vw,84px)" }}
        >
          Made at the speed of the hand.
        </h2>
        <p className="mt-6 text-[9px] tracking-[0.3em] font-sans uppercase text-[rgba(245,239,230,0.7)]">
          Full-grain · Hand-stitched · Saddle-finished
        </p>
      </div>
    </section>
  );
}
