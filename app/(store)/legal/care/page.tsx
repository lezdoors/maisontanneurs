import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Care",
  description: "How to care for handcrafted brass, copper, cedar, leather, and silk pieces from Kechken.",
};

export default function CarePage() {
  return (
    <>
      <span className="eyebrow">Materials</span>
      <h1>Care</h1>
      <p className="updated">Last updated: 12 May 2026</p>

      <p>
        Our pieces are made to age, not to stay new. A patina that develops over years of use is part of how handcrafted brass, copper, and cedar tell their story. The notes below are about helping that aging happen well — not preventing it.
      </p>

      <h2>Brass and copper</h2>
      <ul>
        <li>Dust weekly with a soft dry microfibre cloth. Avoid feather dusters; they catch on pierce-work edges.</li>
        <li>If a fingerprint or smudge needs removing, use a barely-damp cotton cloth, then dry immediately. Avoid wet cleaning of pierce-work.</li>
        <li>Patina is intentional. If you want to slow it, a thin coat of museum-grade microcrystalline wax (Renaissance Wax) every 12 months will hold the finish where it is.</li>
        <li>If you want to brighten it: a small amount of Brasso or Wright's Brass Polish on a soft cloth, gentle circular motion, rinse residue with dry cloth. Do this at most once a year.</li>
        <li><strong>Never:</strong> dishwasher, scouring pad, abrasive paste, ammonia, vinegar in any quantity.</li>
      </ul>

      <h2>Cedar and carved wood</h2>
      <ul>
        <li>Dust weekly with a soft cloth.</li>
        <li>Avoid direct sunlight on flat surfaces — it darkens cedar unevenly over years.</li>
        <li>Avoid heaters and radiators directly under furniture; the wood will dry and crack.</li>
        <li>Twice a year, apply a thin coat of beeswax-and-linseed-oil furniture polish (we recommend Briwax Original or any traditional museum-grade wax). Buff with a soft cloth.</li>
        <li><strong>Never:</strong> silicone sprays (Pledge, Endust), water in any quantity, or commercial wood "feeding" sprays.</li>
      </ul>

      <h2>Mother-of-pearl inlay</h2>
      <ul>
        <li>Dust with a soft brush — a clean watercolour brush works well.</li>
        <li>Keep out of direct sunlight; UV slowly fades the iridescence over decades.</li>
        <li>Wipe rare spills with a barely-damp cloth, then dry. The cedar substrate around the inlay absorbs water; keep it minimal.</li>
        <li><strong>Never:</strong> ammonia-based glass cleaners, isopropyl alcohol, or anything containing acetone.</li>
      </ul>

      <h2>Leather (poufs, throne upholstery)</h2>
      <ul>
        <li>Dust weekly with a soft dry cloth.</li>
        <li>Twice a year, apply a small amount of saddle soap or pure neatsfoot oil to keep the leather supple. A circular motion, a small area at a time.</li>
        <li>For poufs that are sat on regularly: fluff and reshape every few weeks. The natural-fibre filling settles; rotation prevents one side from compressing.</li>
        <li><strong>Spot cleaning:</strong> a barely-damp cloth with a tiny drop of pH-neutral soap, dry immediately. Never soak the leather.</li>
        <li><strong>Never:</strong> standard furniture polishes, baby wipes, or anything labelled "leather cleaner" containing solvents.</li>
      </ul>

      <h2>Sabra silk (cactus-silk poufs)</h2>
      <ul>
        <li>Vacuum gently on a low setting through the soft brush attachment — once a month.</li>
        <li>Sabra is naturally water-resistant; small spills bead up and can be lifted off with a dry cloth.</li>
        <li>For deeper cleaning, professional dry-cleaning only.</li>
        <li><strong>Never:</strong> wet washing, bleach, harsh chemicals, or tumble drying.</li>
      </ul>

      <h2>Hanbel wool</h2>
      <ul>
        <li>Vacuum gently in the direction of the weave.</li>
        <li>Air outside in indirect sunlight twice a year — wool refreshes well from a few hours outdoors.</li>
        <li>Spot-clean small stains with cold water and a tiny amount of mild wool detergent; pat dry. Larger stains: professional rug cleaning.</li>
      </ul>

      <h2>Hand-pierced brass lighting</h2>
      <ul>
        <li>Use bulbs at the recommended wattage (we send a card with the piece). Over-wattage will heat the brass and discolour it locally.</li>
        <li>LED bulbs (E27, 7–9W warm white) give the warmest light and produce the least heat.</li>
        <li>Dust pendants every 2–3 months with a long-handled microfibre duster from above.</li>
        <li>If a pendant collects fingerprints during installation: clean with a barely-damp cotton cloth, dry immediately.</li>
      </ul>

      <h2>When in doubt</h2>
      <p>
        Write to <a href="mailto:hello@kechken.com">hello@kechken.com</a> with a photograph and we will tell you what to do. Most things can be repaired; almost nothing is ruined by patient handwork. We send replacement parts (pierce-work panels, leather seats, MOP tesserae) at cost.
      </p>
    </>
  );
}
