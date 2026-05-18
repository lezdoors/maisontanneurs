type Pillar = { eyebrow: string; title: string; body: string };

const PILLARS: Pillar[] = [
  {
    eyebrow: "01",
    title: "Designed in-house",
    body: "Every Nitra piece is conceived and patterned in our studio. No off-the-shelf graphics, no white-label catalogue.",
  },
  {
    eyebrow: "02",
    title: "Printed when you order",
    body: "We hold no deadstock. Your piece enters production the moment you place the order, finished by a vetted partner.",
  },
  {
    eyebrow: "03",
    title: "Ships in 3 — 5 days",
    body: "From production to your door in under a week. Tracked, insured, with a tracking link in your inbox at every step.",
  },
  {
    eyebrow: "04",
    title: "Limited seasonal drops",
    body: "Four drops a year, numbered and dated. When a drop closes, it doesn't come back the same way.",
  },
];

export default function Fulfillment() {
  return (
    <section className="ed-section-tight bg-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-14 md:mb-20 reveal">
          <div className="ed-eyebrow mb-5">How we work</div>
          <h2 className="ed-h2 max-w-[24ch] mx-auto">
            Made-to-order. Built to last beyond the season.
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
