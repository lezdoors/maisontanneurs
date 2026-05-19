import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden bg-[#0e0d0c]"
      style={{ minHeight: "100svh" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0 2px, rgba(255,255,255,0.5) 2px 3px)",
        }}
      />

      <div className="relative w-full flex flex-col items-center text-center px-6 md:px-10 pt-[110px] md:pt-[140px] pb-16">
        <div
          className="text-[10px] md:text-[11px] tracking-[0.32em] uppercase mb-10 md:mb-14"
          style={{ color: "rgba(245,244,241,0.55)" }}
        >
          Drop 01 · June 2026
        </div>

        <Image
          src="/brand/kechken-mark-full.png"
          alt="Kechken"
          width={1536}
          height={1024}
          priority
          className="w-[min(720px,86vw)] h-auto"
        />

        <p
          className="mt-10 md:mt-14 font-sans uppercase"
          style={{
            color: "rgba(245,244,241,0.65)",
            fontSize: "clamp(11px, 1vw, 13px)",
            letterSpacing: "0.32em",
          }}
        >
          Modern Moroccan Identity
        </p>

        <Link
          href="#drop"
          className="mt-12 md:mt-16 inline-flex items-center text-[#0e0d0c] bg-[#f5f4f1] px-8 py-4 text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-white transition-colors"
        >
          Shop the Drop
        </Link>
      </div>
    </section>
  );
}
