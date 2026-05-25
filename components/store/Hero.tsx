"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Two-clip cinematic hero (Marrakech dunes → leather macro → Paris cobblestones).
// S1 plays first (6s, ends on macro of leather grain), cross-fades into S2
// at the macro cut (5.0s), S2 loops back to S1 when it ends. Photo poster
// shows immediately for fast first paint.

const VIDEO_1 = "/videos/hero-cinematic-1-dunes.mp4";
const VIDEO_2 = "/videos/hero-cinematic-2-paris.mp4";
const POSTER = "/brand/hero/home-hero-1-arches.webp";
const CROSSFADE_AT = 5.0; // start fade ~1s before S1 ends
const SCENE_DURATION = 6.0;

export default function Hero() {
  const v1Ref = useRef<HTMLVideoElement | null>(null);
  const v2Ref = useRef<HTMLVideoElement | null>(null);
  const [activeScene, setActiveScene] = useState<1 | 2>(1);

  useEffect(() => {
    const v1 = v1Ref.current;
    const v2 = v2Ref.current;
    if (!v1 || !v2) return;
    v1.muted = v2.muted = true;
    v1.playsInline = v2.playsInline = true;

    const onTimeS1 = () => {
      if (!v1 || !v2) return;
      if (v1.currentTime >= CROSSFADE_AT && activeScene === 1) {
        v2.currentTime = 0;
        v2.play().catch(() => undefined);
        setActiveScene(2);
      }
    };
    const onTimeS2 = () => {
      if (!v2 || !v1) return;
      if (v2.currentTime >= CROSSFADE_AT && activeScene === 2) {
        v1.currentTime = 0;
        v1.play().catch(() => undefined);
        setActiveScene(1);
      }
    };

    v1.addEventListener("timeupdate", onTimeS1);
    v2.addEventListener("timeupdate", onTimeS2);
    v1.play().catch(() => undefined);

    return () => {
      v1.removeEventListener("timeupdate", onTimeS1);
      v2.removeEventListener("timeupdate", onTimeS2);
    };
  }, [activeScene]);

  return (
    <section
      id="top"
      className="relative w-full min-h-[100svh] overflow-hidden"
      style={{ background: "var(--color-warm-black)", color: "#ffffff" }}
      aria-label="Maison Tanneurs — hand-stitched leather, Marrakech to Paris"
    >
      {/* Video stack */}
      <div className="absolute inset-0">
        <video
          ref={v1Ref}
          className="absolute inset-0 w-full h-full object-cover transition-opacity"
          style={{
            opacity: activeScene === 1 ? 1 : 0,
            transitionDuration: "1100ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          src={VIDEO_1}
          poster={POSTER}
          preload="auto"
          aria-hidden
        />
        <video
          ref={v2Ref}
          className="absolute inset-0 w-full h-full object-cover transition-opacity"
          style={{
            opacity: activeScene === 2 ? 1 : 0,
            transitionDuration: "1100ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          src={VIDEO_2}
          preload="auto"
          aria-hidden
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(20,18,16,0.55) 0%, rgba(20,18,16,0.15) 38%, rgba(20,18,16,0) 65%)",
          }}
        />
      </div>

      {/* Headline block — bottom-left, no top meta strip, no border rules */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 md:px-12 pb-14 md:pb-20">
        <div className="max-w-[1400px]">
          <p
            className="mb-8"
            style={{
              color: "rgba(255,255,255,0.78)",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            Spring / Été · MMXXVI
          </p>

          <h1
            style={{
              color: "#ffffff",
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(56px, 10vw, 160px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              margin: 0,
              textWrap: "balance",
            }}
          >
            Maison Tanneurs<span style={{ opacity: 0.45 }}>.</span>
          </h1>

          <p
            className="mt-8"
            style={{
              color: "rgba(255,255,255,0.88)",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(16px, 1.4vw, 20px)",
              lineHeight: 1.5,
              letterSpacing: "0.005em",
              maxWidth: "56ch",
            }}
          >
            Hand-cut in a small Marrakech atelier. Carried from Paris to anywhere.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-85"
              style={{
                background: "#ffffff",
                color: "var(--color-ink)",
                borderRadius: "999px",
                padding: "16px 32px",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                letterSpacing: "0.02em",
              }}
            >
              Discover the Collection
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-70"
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                letterSpacing: "0.02em",
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.55)",
              }}
            >
              Inside the Atelier
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
