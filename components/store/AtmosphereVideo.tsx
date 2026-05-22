"use client";

import { useRef, useState } from "react";
import Link from "next/link";

interface AtmosphereVideoProps {
  eyebrow?: string;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  videoSrc: string;
  poster?: string;
  /** Photo side at lg+. Default "left". */
  videoSide?: "left" | "right";
}

export default function AtmosphereVideo({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  videoSrc,
  poster,
  videoSide = "left",
}: AtmosphereVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  function toggleMute() {
    if (!ref.current) return;
    ref.current.muted = !ref.current.muted;
    setMuted(ref.current.muted);
  }
  function togglePlay() {
    if (!ref.current) return;
    if (ref.current.paused) {
      ref.current.play();
      setPlaying(true);
    } else {
      ref.current.pause();
      setPlaying(false);
    }
  }

  const videoOrder = videoSide === "right" ? "lg:order-2" : "lg:order-1";
  const textOrder = videoSide === "right" ? "lg:order-1" : "lg:order-2";
  const frameSide = videoSide === "right" ? "mt-frame--right" : "mt-frame--left";

  return (
    <section
      className={`relative mt-frame ${frameSide}`}
      style={{ background: "var(--color-paper)" }}
    >
      <div className="relative grid grid-cols-1 lg:grid-cols-2">
        <div
          className={`relative ${videoOrder} overflow-hidden bg-[color:var(--color-near-black)]`}
          style={{
            aspectRatio: "4 / 5",
            minHeight: "clamp(360px, 50vh, 640px)",
          }}
        >
          <video
            ref={ref}
            src={videoSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-[2]">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="w-9 h-9 rounded-full bg-[color:var(--color-paper)]/85 backdrop-blur-sm flex items-center justify-center text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper)] transition-colors"
            >
              {muted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause video" : "Play video"}
              className="w-9 h-9 rounded-full bg-[color:var(--color-paper)]/85 backdrop-blur-sm flex items-center justify-center text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper)] transition-colors"
            >
              {playing ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="0.5" />
                  <rect x="14" y="5" width="4" height="14" rx="0.5" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4l14 8-14 8V4z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div
          className={`relative ${textOrder} flex flex-col justify-center`}
          style={{
            background: "var(--color-paper)",
            paddingLeft: "clamp(24px, 5vw, 88px)",
            paddingRight: "clamp(24px, 4vw, 64px)",
            paddingTop: "clamp(56px, 7vw, 120px)",
            paddingBottom: "clamp(56px, 7vw, 120px)",
          }}
        >
          {eyebrow && (
            <div
              className="mb-5 uppercase"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.22em",
                fontWeight: 500,
                color: "var(--color-bronze)",
              }}
            >
              {eyebrow}
            </div>
          )}
          <h2
            className="max-w-[18ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "clamp(32px, 3.8vw, 56px)",
              letterSpacing: "-0.015em",
              lineHeight: 1.05,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            {headline}
          </h2>
          <p
            className="mt-6 max-w-[44ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.65,
              color: "var(--color-ink-soft)",
            }}
          >
            {body}
          </p>
          <div className="mt-8">
            <Link href={ctaHref} className="mt-cta mt-cta--ghost-dark">
              {ctaLabel}
            </Link>
          </div>
        </div>

        <span
          aria-hidden
          className="hidden lg:block absolute top-0 bottom-0 mt-rule-v"
          style={{ left: "50%" }}
        />
      </div>
    </section>
  );
}
