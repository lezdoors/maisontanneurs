"use client";

import { useEffect, useRef } from "react";

// Shared product view-model (declared locally per contract; do not import).
type ProductVM = {
  slug: string;
  title: string;
  priceCents: number;
  image: string;
  material: string;
};

/**
 * SECTION 4 — Material macro divider.
 * A quiet, breathing full-bleed interstitial: full-grain leather macro video,
 * no headline, a single tiny caption hung bottom-left. Almost empty on purpose.
 */
export default function MaterialDivider() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-label="La Matière — full-grain leather"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen min-h-[clamp(48svh,58vh,68svh)] overflow-hidden bg-[#1C1A17]"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/film/heritage-grain.mp4"
        poster="/film/heritage-grain-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      <div className="absolute bottom-[clamp(28px,5vw,56px)] left-[clamp(24px,6vw,96px)] z-10">
        <div className="mb-3 h-px w-10 bg-[#F5EFE6]/30" />
        <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-[rgba(245,239,230,0.8)]">
          La Matière — full-grain, nothing else.
        </p>
      </div>
    </section>
  );
}
