const ITEMS = [
  "Hand-cut in Fes",
  "Full-grain leather only",
  "Hand-stitched in Marrakech",
  "Solid brass hardware",
  "5-day shipping worldwide",
  "Free EU returns",
];

export default function Marquee() {
  // Duplicate the items so the -50% translate loop reads seamlessly.
  const loop = [...ITEMS, ...ITEMS];
  return (
    <section
      aria-label="Brand promise"
      className="mt-marquee"
    >
      <div className="mt-marquee__track">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="mt-marquee__item">
            <span className="mt-marquee__dot" aria-hidden />
            <span>{item}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
