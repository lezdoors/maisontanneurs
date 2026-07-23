"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalizedHref } from "@/lib/i18n-client";

const DEFAULT_RELEASE_AT = "2026-09-18T08:00:00.000Z";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdown(target: number): Countdown {
  const remaining = Math.max(0, target - Date.now());
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function HeritageHero() {
  const href = useLocalizedHref();
  const shellRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const releaseAt = useMemo(
    () => Date.parse(process.env.NEXT_PUBLIC_HERITAGE_RELEASE_AT || DEFAULT_RELEASE_AT),
    [],
  );
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdown(releaseAt));
    const initial = window.setTimeout(updateCountdown, 0);
    const timer = window.setInterval(updateCountdown, 1_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [releaseAt]);

  useEffect(() => {
    const shell = shellRef.current;
    const video = videoRef.current;
    if (!shell || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const render = () => {
      frame = 0;
      if (!video.duration || reducedMotion) return;
      const rect = shell.getBoundingClientRect();
      const travel = Math.max(1, shell.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      video.currentTime = progress * Math.max(0, video.duration - 0.08);
    };

    const requestRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    video.pause();
    video.addEventListener("loadedmetadata", render);
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender, { passive: true });
    render();

    return () => {
      video.removeEventListener("loadedmetadata", render);
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const units = [
    [pad(countdown.days), "Days"],
    [pad(countdown.hours), "Hours"],
    [pad(countdown.minutes), "Minutes"],
    [pad(countdown.seconds), "Seconds"],
  ];

  return (
    <section
      ref={shellRef}
      data-nav-theme="dark"
      className="mt-heritage-hero-shell"
      aria-label="Maison Tanneurs Heritage Edition"
    >
      <div className="mt-heritage-hero-sticky">
        <video
          ref={videoRef}
          className="mt-heritage-hero-media"
          muted
          playsInline
          preload="auto"
          poster="/heritage-edition/lookbook-master.webp"
          aria-label="Model carrying the Atlas Weekender on a Mediterranean terrace"
        >
          <source src="/heritage-edition/hero-walk.mp4" type="video/mp4" />
        </video>
        <div className="mt-heritage-hero-wash" aria-hidden />

        <div className="mt-heritage-hero-copy">
          <div className="mt-heritage-hero-kicker">
            <span>Maison Tanneurs</span>
            <span>Heritage Edition / 001</span>
          </div>

          <div className="mt-heritage-hero-title-wrap">
            <h1 className="mt-heritage-hero-title">
              <span>Maison Tanneurs</span>
              <em>Heritage Edition</em>
            </h1>
            <p className="mt-heritage-hero-deck">
              French in form. Moroccan in hand. Three enduring objects cut, stitched,
              and finished in Marrakech.
            </p>
          </div>

          <div className="mt-heritage-hero-footer">
            <div className="mt-heritage-countdown" aria-label="Time until release">
              {units.map(([value, label]) => (
                <div key={label} className="mt-heritage-countdown-unit">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-heritage-hero-actions">
              <a href="#heritage-objects">View the objects</a>
              <Link href={href("/atelier")}>Inside the atelier</Link>
            </div>
          </div>
        </div>

        <div className="mt-heritage-scroll-cue" aria-hidden>
          <span>Scroll to enter</span>
          <i />
        </div>
      </div>
    </section>
  );
}
