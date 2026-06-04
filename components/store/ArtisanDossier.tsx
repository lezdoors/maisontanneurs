import Image from "next/image";

type Spec = { k: string; v: string; note?: string };

const SPECS: Spec[] = [
  { k: "07", v: "Dedicated Artisans", note: "Master tanners & stitchers" },
  { k: "Sourcing", v: "Morocco", note: "Fez tanning heritage · Marrakech atelier" },
  { k: "Method", v: "Vegetable-Tanned", note: "Mimosa & oak bark, 21-day vats" },
  { k: "Material", v: "100% Bovine", note: "Full-grain, single-origin hides" },
  { k: "Cycle", v: "14 Days / Object", note: "From hide to final stitch" },
  { k: "Output", v: "≤ 560 Objects / Year", note: "Numbered, never restocked" },
  { k: "Warranty", v: "Lifetime", note: "Re-stitching, edge-coat, re-line" },
];

const PLATE_SRC = "/brand/section/atelier-bw-portrait.webp";

export default function ArtisanDossier() {
  return (
    <section
      id="atelier"
      className="w-full bg-[var(--color-paper)] text-[var(--color-ink)] py-[clamp(64px,10vw,140px)]"
      aria-label="Production specifications"
    >
      <div className="border-y border-[#e5e5e5]">
        <div className="px-6 py-5 flex items-end justify-between">
          <div className="flex items-end gap-6">
            <span className="tech-label opacity-60">§06</span>
            <h2
              className="leading-none font-medium"
              style={{
                fontSize: "clamp(28px, 3.6vw, 36px)",
                letterSpacing: "-0.03em",
              }}
            >
              Production Specifications
            </h2>
          </div>
          <span className="tech-meta opacity-70 hidden md:inline">
            Dossier — Marrakech Atelier
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-5 border-r border-[#e5e5e5] px-6 py-10 md:py-14">
          <div className="md:sticky md:top-24">
            <span className="tech-label opacity-60">Production Footprint</span>
            <h3
              className="mt-6 display-xxl"
              style={{ fontSize: "clamp(40px, 5.5vw, 86px)" }}
            >
              Hide,
              <br />
              hand,
              <br />
              stitch<span className="opacity-40">.</span>
            </h3>
            <p
              className="mt-8 leading-relaxed text-[#0f0f0f]/75"
              style={{ fontSize: "14px", letterSpacing: "-0.01em", maxWidth: "62ch" }}
            >
              Every object is the cumulative record of fourteen days, seven hands,
              and one atelier. We do not scale the run. We do not outsource the
              finish. We file the dossier, then we build.
            </p>

            <div className="mt-10 border-t border-[#e5e5e5] pt-6">
              <div
                className="relative bg-black overflow-hidden"
                style={{ aspectRatio: "4 / 3" }}
              >
                <Image
                  src={PLATE_SRC}
                  alt="A master artisan saddle-stitching full-grain leather in the Marrakech atelier"
                  fill
                  loading="eager"
                  sizes="(min-width: 768px) 41vw, 100vw"
                  className="object-cover object-left"
                />
              </div>
              <p className="mt-3 tech-meta opacity-60">
                Plate 01 — Moroccan leatherwork, finished in Marrakech.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7">
          <ul className="divide-y divide-[#e5e5e5] border-b border-[#e5e5e5]">
            {SPECS.map((s, i) => (
              <li
                key={s.k + s.v}
                className="grid grid-cols-12 items-baseline gap-4 px-6 py-7 transition-colors hover:bg-[#f9f9f9]"
              >
                <span className="col-span-1 tech-meta opacity-50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-4">
                  <span className="tech-label opacity-60">{s.k}</span>
                </div>
                <div className="col-span-7">
                  <div
                    className="font-medium leading-[1.1]"
                    style={{
                      fontSize: "clamp(22px, 2.4vw, 28px)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {s.v}
                  </div>
                  {s.note && (
                    <div className="mt-1.5 tech-meta opacity-60">{s.note}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-12 gap-4 px-6 py-10">
            <div className="col-span-12 md:col-span-5">
              <span className="tech-label opacity-60">Filed By</span>
              <p
                className="mt-3"
                style={{ fontSize: "15px", letterSpacing: "-0.01em" }}
              >
                Y. Berrada — Atelier Director
                <br />
                <span className="opacity-60">Marrakech, Morocco</span>
              </p>
            </div>
            <div className="col-span-12 md:col-span-7 flex md:justify-end items-end">
              <a
                href="mailto:hello@maisontanneurs.com?subject=Dossier%20Request"
                className="inline-flex h-12 items-center bg-[#0f0f0f] px-7 text-white hover:opacity-80"
                style={{
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                Request Full Dossier
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
