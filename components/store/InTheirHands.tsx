"use client";

import { useEffect, useRef } from "react";

const VIDEO_MP4 = "/videos/atelier-in-their-hands.mp4";
const VIDEO_WEBM = "/videos/atelier-in-their-hands.webm";
const POSTER = "/videos/atelier-in-their-hands-poster.jpg";

export default function InTheirHands() {
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
      id="in-their-hands"
      aria-label="In their hands"
      className="w-full bg-white text-[#0f0f0f] border-y border-[#e5e5e5]"
    >
      <div className="border-b border-[#e5e5e5]">
        <div className="px-6 py-5 flex flex-wrap items-end justify-between gap-y-4">
          <div className="flex items-end gap-6">
            <span className="tech-label opacity-60">§01.5</span>
            <h2
              className="leading-none font-medium"
              style={{
                fontSize: "clamp(28px, 3.6vw, 36px)",
                letterSpacing: "-0.03em",
              }}
            >
              In Their Hands
            </h2>
          </div>
          <span className="tech-meta opacity-70 hidden md:inline">
            PLATE 03 — UNCUT FOOTAGE · 11 SECONDS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* TEXT — left 6 cols */}
        <div className="md:col-span-6 px-6 py-12 md:py-20 md:border-r border-[#e5e5e5]">
          <span className="tech-label opacity-60">Documentary Record</span>
          <h3
            className="display-xxl mt-6"
            style={{ fontSize: "clamp(40px, 5vw, 84px)" }}
          >
            No models.
            <br />
            No b-roll<span className="opacity-40">.</span>
            <br />
            <span className="opacity-50">The bench.</span>
          </h3>
          <p
            className="mt-8 leading-relaxed text-[#0f0f0f]/75"
            style={{ fontSize: "15px", letterSpacing: "-0.01em", maxWidth: "50ch" }}
          >
            Eleven seconds, unscripted, filmed on a phone in the same Medina
            workshop that cuts and stitches every object we sell. The artisans
            on this clip are the artisans who hand-finish your bag. There is no
            second team, no production house, no contract factory waiting in
            the back.
          </p>

          <ul className="mt-10 divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
            <Row k="Filmed" v="Marrakech Medina · atelier record" />
            <Row k="Format" v="Phone · 9:16 · 60fps · No Audio" />
            <Row k="Subjects" v="3 of our 7 artisans" />
            <Row k="Edits" v="None" />
          </ul>

          <p
            className="mt-10 leading-relaxed text-[#0f0f0f]/55"
            style={{ fontSize: "13px", letterSpacing: "-0.01em", maxWidth: "50ch" }}
          >
            Want to visit? The atelier is closed to the public most of the year,
            but we host a small number of trade and press visits each season.
            Write to{" "}
            <a
              href="mailto:atelier@maisontanneurs.com"
              className="underline underline-offset-4"
            >
              atelier@maisontanneurs.com
            </a>
            .
          </p>
        </div>

        {/* VIDEO — right 6 cols, portrait container */}
        <div className="md:col-span-6 flex items-center justify-center p-6 md:p-10">
          <div
            className="relative w-full max-w-[420px] mx-auto overflow-hidden border border-[#e5e5e5]"
            style={{ aspectRatio: "9 / 16" }}
          >
            <video
              ref={ref}
              className="absolute inset-0 w-full h-full object-cover"
              preload="none"
              poster={POSTER}
              aria-hidden
            >
              <source src={VIDEO_WEBM} type="video/webm" />
              <source src={VIDEO_MP4} type="video/mp4" />
            </video>
            <span className="absolute left-3 top-3 tech-meta text-white/80">
              ● REC · LOOP
            </span>
            <span className="absolute right-3 top-3 tech-meta text-white/80">
              9:16 · 60FPS
            </span>
            <span className="absolute left-3 bottom-3 tech-meta text-white/80">
              MEDINA · ATELIER
            </span>
            <span className="absolute right-3 bottom-3 tech-meta text-white/80">
              00:11
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-baseline justify-between py-3.5">
      <span className="tech-label opacity-60">{k}</span>
      <span className="tech-meta">{v}</span>
    </li>
  );
}
