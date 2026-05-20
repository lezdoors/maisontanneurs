const PILLARS = [
  "Hand-stitched in Marrakech",
  "Ships in 3–5 days",
  "Free EU returns",
  "Full-grain leather · solid brass",
];

export default function TrustRibbon() {
  return (
    <section
      aria-label="Brand promise"
      className="border-y border-[var(--color-rule)] bg-[var(--color-bg-alt)]"
    >
      <div className="max-w-[1480px] mx-auto px-5 md:px-10 py-4 md:py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-14 gap-y-2 text-[var(--color-mineral)]">
          {PILLARS.map((p, i) => (
            <li
              key={p}
              className="ed-meta whitespace-nowrap flex items-center gap-x-8 md:gap-x-14"
            >
              {p}
              {i < PILLARS.length - 1 && (
                <span
                  aria-hidden
                  className="hidden md:inline-block h-3 w-px bg-[var(--color-rule)] -mr-8 md:-mr-14"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
