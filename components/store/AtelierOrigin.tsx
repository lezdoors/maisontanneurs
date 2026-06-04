import Image from "next/image";
import Link from "next/link";

const SMALL_PLATES = [
  {
    src: "/brand/section/atelier-bw-clean.webp",
    alt: "Artisan hand saddle-stitching full-grain leather in the Marrakech atelier",
    label: "Hand stitch",
  },
  {
    src: "/brand/section/bag-cinematic-still.webp",
    alt: "Cognac leather bag catching green atelier light",
    label: "Finished grain",
  },
];

export default function AtelierOrigin() {
  return (
    <section
      aria-label="Marrakech atelier origin"
      className="grid min-h-[82svh] grid-cols-1 border-b border-[var(--color-rule)] bg-[var(--color-warm-black)] text-white lg:grid-cols-12"
    >
      <div className="relative min-h-[58svh] overflow-hidden lg:col-span-7 lg:min-h-[82svh]">
        <Image
          src="/brand/hero/home-hero-2-couple-atelier.webp"
          alt="Sunlit Marrakech leather atelier with a cognac travel bag in the foreground"
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover"
          style={{ objectPosition: "center 48%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,18,16,.34), rgba(20,18,16,.04) 46%, rgba(20,18,16,0))",
          }}
        />
      </div>

      <div className="flex items-center px-6 py-16 lg:col-span-5 lg:px-12 xl:px-16">
        <div className="max-w-[620px]">
          <p className="tech-meta text-white/55">Marrakech atelier · origin</p>
          <h2
            className="mt-8 font-normal leading-[.94] tracking-[-.03em] text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(54px, 6.7vw, 118px)",
            }}
          >
            Cut by hand.
            <br />
            Finished slowly.
          </h2>
          <p
            className="mt-10 max-w-[42ch] text-white/72"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(18px, 1.55vw, 23px)",
              lineHeight: 1.55,
            }}
          >
            Seven artisans, one Marrakech room, and a fourteen-day rhythm for each object. The leather keeps the trace of that pace.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:max-w-[360px]">
            {SMALL_PLATES.map((plate) => (
              <figure key={plate.src}>
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <Image
                    src={plate.src}
                    alt={plate.alt}
                    fill
                    sizes="180px"
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-3 tech-meta text-white/45">{plate.label}</figcaption>
              </figure>
            ))}
          </div>

          <Link
            href="/about"
            className="mt-12 inline-flex pb-2 transition-opacity hover:opacity-70"
            style={{
              borderBottom: "1px solid rgba(255,255,255,.55)",
              color: "#fff",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: ".22em",
              textTransform: "uppercase",
            }}
          >
            Enter the atelier
          </Link>
        </div>
      </div>
    </section>
  );
}
