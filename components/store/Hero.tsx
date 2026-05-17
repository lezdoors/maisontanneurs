import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[var(--color-bg)]">
      {/* Editorial gradient backdrop — placeholder until real campaign imagery lands */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #ecebe6 0%, #f5f4f1 38%, #ffffff 75%)",
        }}
      />
      {/* Brass hairline at top */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-[var(--color-brass)] opacity-60"
      />

      <div className="max-w-[920px] mx-auto px-6 md:px-10 text-center py-32 md:py-44">
        <div className="rb-eyebrow mb-8">Drop 01 · June 2026</div>

        <h1 className="font-sans font-light tracking-[-0.012em] leading-[1.02] text-[clamp(44px,7.5vw,96px)] text-[var(--color-ink)]">
          Clothing rooted
          <br />
          in the Maghreb.
        </h1>

        <p className="serif-body italic mt-9 max-w-[42ch] mx-auto text-[var(--color-ink-soft)]">
          Hand-painted figurative graphics on heavyweight cotton. A clothing
          label born of Moroccan visual tradition — made for now, made for the
          world.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link href="#drop" className="rb-cta">
            See Drop 01
          </Link>
          <Link
            href="mailto:hello@nitra.com?subject=Nitra%20list"
            className="rb-cta-outline"
          >
            Join the list
          </Link>
        </div>

        <div className="rb-meta mt-16 text-[var(--color-mineral)]">
          Ships from US · POD-fulfilled · Worldwide delivery
        </div>
      </div>
    </section>
  );
}
