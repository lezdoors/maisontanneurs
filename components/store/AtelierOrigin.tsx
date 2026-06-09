import Image from "next/image";
import Link from "next/link";

const ATELIER_IMAGE = "/brand/editorial/model-red-bg-hd.webp";
const DETAIL_IMAGES = [
  {
    src: "/brand/editorial/full-grain-leather-hd-01.webp",
    alt: "Close detail of full-grain cognac leather with the Maison Tanneurs mark pressed into the hide",
  },
  {
    src: "/brand/editorial/waxed-linen-thread-hd-03.webp",
    alt: "Close detail of waxed linen saddle stitching across cognac leather",
  },
];

export default function AtelierOrigin() {
  return (
    <section
      id="atelier-origin"
      aria-label="Maison Tanneurs bags carried in real light"
      className="w-full bg-[var(--color-paper)] text-[var(--color-ink)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:min-h-[72svh]">
        <div className="relative overflow-hidden bg-[var(--color-paper)] lg:col-span-5 px-6 py-10 sm:px-10 lg:px-10 lg:py-12">
          <div className="relative h-[42svh] sm:h-[52svh] lg:h-full lg:min-h-[58svh]">
            <Image
              src={ATELIER_IMAGE}
              alt="Model in a cream suit carrying a cognac Maison Tanneurs handbag against a red Marrakech wall"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "center center" }}
            />
          </div>
          <div className="absolute bottom-6 left-6 hidden border border-[var(--color-ink)]/15 bg-white px-4 py-3 md:block">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              Field proof
            </p>
            <p className="mt-1 font-display text-[18px] leading-none text-[var(--color-ink)]">
              Red wall, Marrakech
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between px-6 py-12 sm:px-10 lg:col-span-7 lg:px-16 lg:py-16">
          <div>
            <p className="tech-label text-[var(--color-bronze)]">
              Product Proof · Outside the Room
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
              Made to move.
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
              The first proof is not a sketch. It is the bag against real light,
              carried on a body, holding its line before it ever reaches the
              road.
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
