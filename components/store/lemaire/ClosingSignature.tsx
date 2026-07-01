import Image from "next/image";
import Link from "next/link";

type ProductVM = {
  slug: string;
  title: string;
  priceCents: number;
  image: string;
  material: string;
};

export default function ClosingSignature() {
  return (
    <section className="relative w-full min-h-[clamp(72svh,84vh,92vh)] overflow-hidden flex items-center justify-center bg-white">
      {/* Background still — bright atelier plinth, washed for legibility */}
      <Image
        src="/brand/hero/home-hero-bright-atelier-plinth.webp"
        alt="A Maison Tanneurs leather bag on a plinth in a bright atelier"
        fill
        sizes="100vw"
        className="object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-white/35" aria-hidden="true" />

      {/* Centered wordmark + entry */}
      <div className="relative z-10 text-center px-[clamp(24px,6vw,96px)]">
        <h2
          style={{
            fontFamily: "var(--font-wordmark)",
            color: "#1C1A17",
            letterSpacing: "0.18em",
            fontSize: "clamp(28px,5vw,72px)",
            fontWeight: 400,
            lineHeight: 1,
            margin: 0,
          }}
        >
          MAISON TANNEURS
        </h2>
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-block p-4 -m-4 text-[10px] tracking-[0.3em] uppercase font-sans text-[#1C1A17] border-b border-[#1C1A17] pb-1"
          >
            Enter the Collection
          </Link>
        </div>
      </div>

      {/* Footer index row */}
      <div className="absolute bottom-[clamp(24px,5vw,48px)] left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 text-[9px] tracking-[0.3em] uppercase font-sans text-[#1C1A17]/60">
        <Link href="/atelier">Atelier</Link>
        <span aria-hidden="true">·</span>
        <Link href="/savoir-faire">Savoir-Faire</Link>
      </div>
    </section>
  );
}
