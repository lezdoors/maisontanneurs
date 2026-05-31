type Promise = {
  code: string;
  k: string;
  v: string;
  note: string;
};

const PROMISES: Promise[] = [
  {
    code: "P.01",
    k: "Express",
    v: "Free · 3–5 Days",
    note: "Free worldwide tracked dispatch from Marrakech. Duty-free entry to the US under the Morocco-US Free Trade Agreement, and to the EU under the EU-Morocco Association.",
  },
  {
    code: "P.02",
    k: "Returns",
    v: "14 Days · Unworn",
    note: "Free return label within EU + UK. International return at carrier rate.",
  },
  {
    code: "P.03",
    k: "Repair",
    v: "Lifetime · Atelier",
    note: "Re-stitch, edge-coat, re-line at our own atelier for as long as the object exists. Labour free; shipping at cost.",
  },
];

export default function HousePromises() {
  return (
    <section
      aria-label="House promises"
      className="w-full bg-white text-[#0f0f0f]"
    >
      <div className="border-y border-[#e5e5e5]">
        <div className="px-6 py-5 flex flex-wrap items-end justify-between gap-y-4">
          <div className="flex items-end gap-6">
            <span className="tech-label opacity-60">§08</span>
            <h2
              className="leading-none font-medium"
              style={{
                fontSize: "clamp(28px, 3.6vw, 36px)",
                letterSpacing: "-0.03em",
              }}
            >
              House Promises
            </h2>
          </div>
          <span className="tech-meta opacity-70 hidden md:inline">
            Filed — Atelier Standards 04 / 2026
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 border-l border-[#e5e5e5]">
        {PROMISES.map((p) => (
          <PromiseCell key={p.code} promise={p} />
        ))}
      </div>
    </section>
  );
}

function PromiseCell({ promise }: { promise: Promise }) {
  return (
    <article className="border-r border-b border-[#e5e5e5] bg-white px-6 py-12 md:py-16 flex flex-col min-h-[280px]">
      <div className="flex items-center justify-between">
        <span className="tech-meta opacity-50">{promise.code}</span>
        <span className="tech-label opacity-60">{promise.k}</span>
      </div>

      <h3
        className="display-xxl mt-10"
        style={{ fontSize: "clamp(32px, 3.4vw, 56px)" }}
      >
        {promise.v}
        <span className="opacity-40">.</span>
      </h3>

      <p
        className="mt-6 leading-relaxed text-[#0f0f0f]/70"
        style={{ fontSize: "13.5px", letterSpacing: "-0.01em" }}
      >
        {promise.note}
      </p>
    </article>
  );
}
