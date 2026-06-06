"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC_MP4 = "/videos/maison-train-window-traveler-cropped.mp4";
const VIDEO_SRC_WEBM = "/videos/atelier-loop.webm"; // legacy fallback only
const POSTER = "/videos/maison-train-window-traveler-poster.jpg";

export default function FieldLoop() {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    el.muted = true;
    el.playsInline = true;
    el.loop = true;
    const tryPlay = () => {
      if (mediaQuery.matches) return;
      el.play().catch(() => undefined);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) tryPlay();
          else el.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    const onMotionChange = () => {
      if (mediaQuery.matches) el.pause();
      else if (el.getBoundingClientRect().top < window.innerHeight) tryPlay();
    };
    mediaQuery.addEventListener("change", onMotionChange);
    return () => {
      io.disconnect();
      mediaQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <section
      aria-label="Field loop"
      className="w-full bg-[#0f0f0f] text-white border-y border-[#e5e5e5]"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/15 text-white/70">
        <span className="tech-meta">§05 — Field Loop</span>
        <span className="tech-meta hidden md:inline">
          PLATE 02 — MARRAKECH TRAIN · PRODUCT IN TRANSIT
        </span>
        <span className="tech-meta">MUTED · LOOPED</span>
      </div>

      {/* Constrained on large screens — the current cut crops awkwardly when
          stretched to ultrawide. Cap at 1100px and center; replace with a
          higher-resolution wide cut later to go full-bleed again. */}
      <div className="w-full bg-[#0f0f0f] py-10 lg:py-14">
        <div
          className="relative mx-auto bg-[#0f0f0f] overflow-hidden"
          style={{ aspectRatio: "16 / 9", maxWidth: "1100px" }}
        >
          <video
            ref={ref}
            className="absolute inset-0 w-full h-full object-cover"
            preload="none"
            poster={POSTER}
            aria-hidden
          >
            <source src={VIDEO_SRC_MP4} type="video/mp4" />
            <source src={VIDEO_SRC_WEBM} type="video/webm" />
          </video>
        </div>
      </div>

      <div className="grid grid-cols-12 px-6 py-5 border-t border-white/15 text-white/70 gap-y-2">
        <span className="col-span-12 md:col-span-6 tech-meta">
          Marrakech Train Window · Editorial Cut
        </span>
        <span className="col-span-12 md:col-span-3 tech-meta md:text-center">
          1080p · 24fps · No Audio
        </span>
        <span className="col-span-12 md:col-span-3 tech-meta md:text-right">
          Cropped clean · No watermark
        </span>
      </div>
    </section>
  );
}
