type Pillar = { eyebrow: string; title: string; body: string };

const PILLARS: Pillar[] = [
  {
    eyebrow: "01",
    title: "Designed in-house",
    body: "Every Maison Tanneurs bag is patterned in our studio. No off-the-shelf shapes, no white-label catalogue.",
  },
  {
    eyebrow: "02",
    title: "Hand-stitched in Marrakech",
    body: "Each bag is cut, stitched, and finished by one artisan from start to end — full-grain leather, brass hardware, signed inside.",
  },
  {
    eyebrow: "03",
    title: "DHL Express worldwide",
    body: "Free worldwide shipping direct from the Marrakech atelier. Insured, with a tracking link in your inbox at every step.",
  },
  {
    eyebrow: "04",
    title: "Limited editions",
    body: "Tight runs, numbered and dated. When a piece sells out, it doesn't come back the same way.",
  },
];

export default function Fulfillment() {
  return (
    <section className="ed-section-tight bg-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-14 md:mb-20 reveal">
          <div className="ed-eyebrow mb-5">How we work</div>
          <h2 className="ed-h2 max-w-[24ch] mx-auto">
            Hand-stitched. Ready to ship from Marrakech.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-10">
          {PILLARS.map((p) => (
            <div key={p.eyebrow}>
              <div className="ed-meta text-[var(--color-bronze)] mb-5">
                {p.eyebrow}
              </div>
              <div className="ed-card-headline mb-4 max-w-[18ch]">
                {p.title}
              </div>
              <p className="ed-body max-w-[28ch]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
