import Image from "next/image";
import Link from "next/link";

const HERO_SRC = "/brand/hero/home-hero-1-arches.webp";
const HERO_ALT =
  "Cognac full-grain leather duffle, Marrakech courtyard, late golden hour";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative w-full min-h-[100svh] bg-[#0f0f0f] text-white overflow-hidden"
      aria-label="Engineered in Marrakech"
    >
      <div className="absolute inset-0">
        <Image
          src={HERO_SRC}
          alt={HERO_ALT}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 46%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.20) 38%, rgba(0,0,0,0) 65%)",
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 pt-6 text-white/80">
        <span className="tech-meta">§01 — Cinematic</span>
        <span className="tech-meta hidden md:inline">
          N 31°37′ W 7°59′ · Marrakech
        </span>
        <span className="tech-meta">Edition 04 / 2026</span>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-6 border-l border-white/10" />
      <div className="pointer-events-none absolute inset-y-0 right-6 border-l border-white/10" />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-12">
        <div className="max-w-[1400px]">
          <div className="mb-6 flex items-center gap-4 text-white/70">
            <span className="h-px w-10 bg-white/40" />
            <span className="tech-meta">Spring Atelier — Vol. 04</span>
          </div>

          <h1
            className="display-xxl text-white"
            style={{ fontSize: "clamp(56px, 11.5vw, 200px)" }}
          >
            Engineered
            <br />
            in&nbsp;Marrakech<span className="text-white/40">.</span>
          </h1>

          <p
            className="mt-8 text-white/75 leading-relaxed"
            style={{ fontSize: "15px", letterSpacing: "-0.01em", maxWidth: "62ch" }}
          >
            Uncompromising leather architecture. Direct from the Medina artisans.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="#collection"
              className="inline-flex h-12 items-center justify-center bg-white px-7 text-[#0f0f0f] hover:opacity-80 transition-opacity"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              View the Collection
            </Link>
            <Link
              href="#atelier"
              className="inline-flex h-12 items-center justify-center border border-white/40 px-7 text-white hover:opacity-70 transition-opacity"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Inside the Atelier
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 border-t border-white/15 pt-5 text-white/70">
            <Ledger k="Material" v="Bovine, Vegetable-Tanned" />
            <Ledger k="Origin" v="Tannerie Chouara" />
            <Ledger k="Hands" v="07 Artisans" />
            <Ledger k="Cycle" v="14 Days / Object" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Ledger({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="tech-meta opacity-60">{k}</span>
      <span className="tech-meta">{v}</span>
    </div>
  );
}
