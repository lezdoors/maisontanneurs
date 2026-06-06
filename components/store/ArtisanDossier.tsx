import Image from "next/image";

type Spec = { k: string; v: string; note?: string };

const SPECS: Spec[] = [
  { k: "Leather", v: "Full-Grain", note: "Selected for structure, grain, and patina" },
  { k: "Cut", v: "By Hand", note: "Panels are checked before assembly" },
  { k: "Stitch", v: "Saddle-Finished", note: "Stress points reinforced at the bench" },
  { k: "Hardware", v: "Solid Metal", note: "Buckles and closures inspected piece by piece" },
  { k: "Batch", v: "Small Runs", note: "Made in limited atelier quantities" },
  { k: "Proof", v: "Shape Test", note: "Packed, handled, and photographed before release" },
  { k: "Care", v: "Repairable", note: "Edges, stitches, and lining can be serviced" },
];

const PLATE_SRC = "/brand/section/atelier-bw-clean.webp";

export default function ArtisanDossier() {
  return (
    <section
      id="atelier"
      className="w-full bg-[var(--color-paper-alt)] text-[var(--color-ink)] py-[clamp(64px,10vw,140px)]"
      aria-label="Craftsmanship process"
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
              Craftsmanship Process
            </h2>
          </div>
          <span className="tech-meta opacity-70 hidden md:inline">
            Dossier — Material / Cut / Proof
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-5 border-r border-[#e5e5e5] px-6 py-10 md:py-14">
          <div className="md:sticky md:top-24">
            <span className="tech-label opacity-60">Object Footprint</span>
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
              Every object is the cumulative record of the hide, the cut line,
              and the final hand check. We keep product plates clean for the
              catalogue and use the film frames only where they add context.
              The result should feel like a working dossier, not a showroom prop.
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
                  sizes="(min-width: 768px) 41vw, 100vw"
                  className="object-cover object-left"
                />
              </div>
              <p className="mt-3 tech-meta opacity-60">
                Plate 01 — Hand work, grain inspection, bench evidence.
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
                Maison Tanneurs — Atelier Desk
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
