import Image from "next/image";
import Link from "next/link";

const ATELIER_IMAGE = "/brand/editorial/atelier-bench-leather-tools.webp";
const DETAIL_IMAGES = [
  {
    src: "/brand/editorial/atelier-cutting-table.webp",
    alt: "Cutting table at the Marrakech atelier: leather, tools, and an artisan's hand cutting a panel",
  },
  {
    src: "/brand/editorial/atelier-hands-stitching.webp",
    alt: "Weathered hands hand-finishing a cognac leather piece with a brass awl and waxed thread",
  },
];

export default function AtelierOrigin() {
  return (
    <section
      id="atelier-origin"
      aria-label="Maison Tanneurs bags in real travel settings"
      className="w-full bg-[var(--color-paper)] text-[var(--color-ink)]"
    >
      <div className="grid min-h-[92svh] grid-cols-1 lg:grid-cols-12">
        <div className="relative min-h-[52svh] overflow-hidden lg:col-span-7 lg:min-h-[92svh]">
          <Image
            src={ATELIER_IMAGE}
            alt="Patterns and cut panels of cognac leather spread across the Marrakech atelier bench with brass tools in raking window light"
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "center center" }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.00), rgba(255,255,255,0.18)), linear-gradient(to top, rgba(10,10,9,0.22), rgba(10,10,9,0.00) 55%)",
            }}
          />
          <div className="absolute bottom-5 left-5 hidden border border-white/45 bg-white/84 px-4 py-3 backdrop-blur-sm md:block">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              Field note
            </p>
            <p className="mt-1 font-display text-[22px] leading-none text-[var(--color-ink)]">
              Cutting bench, Marrakech
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between px-6 py-12 sm:px-10 lg:col-span-5 lg:px-12 lg:py-16">
          <div>
            <p className="tech-label text-[var(--color-bronze)]">
              Product Proof · Before the Road
            </p>
            <h2
              className="mt-8 max-w-[10ch]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(54px, 8vw, 116px)",
                fontWeight: 400,
                letterSpacing: 0,
                lineHeight: 0.92,
              }}
            >
              Made on
              <br />
              the bench.
              <br />
              Proven outside.
            </h2>
          </div>

          <div className="mt-14 max-w-[620px]">
            <p
              style={{
                color: "var(--color-ink-soft)",
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(20px, 2vw, 28px)",
                lineHeight: 1.45,
              }}
            >
              The first proof is not a campaign shot. It is the open mouth of the
              bag, the hardware under a hand, the way the leather keeps its shape
              before it ever leaves the room.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
              {DETAIL_IMAGES.map((image) => (
                <div
                  key={image.src}
                  className="relative overflow-hidden bg-[var(--color-paper-alt)]"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 18vw, 45vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/products"
                className="inline-flex items-center border-b border-[var(--color-ink)] pb-2 text-[11px] uppercase tracking-[0.22em] text-[var(--color-ink)] transition-opacity hover:opacity-65"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Shop the collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
