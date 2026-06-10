import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lifetime Repair — Maison Tanneurs",
  description:
    "The Maison Tanneurs lifetime repair guarantee. Every piece can be re-stitched, edge-coated, and re-lined at our Marrakech atelier for as long as the object exists.",
  alternates: {
    canonical: "/legal/repair",
  },
};

export default function RepairPage() {
  return (
    <article>
      <span className="eyebrow">Lifetime Repair</span>
      <h1>For as long as the bag exists.</h1>
      <p className="updated">Last updated · 29 May 2026</p>

      <p>
        Every Maison Tanneurs bag is built to be carried for decades and to
        age the way only full-grain leather can. Stitches, edges, linings,
        and hardware are all designed to be repaired at the atelier that
        made them — not retired and replaced.
      </p>

      <h2>What is covered</h2>
      <p>
        Our atelier will repair any Maison Tanneurs bag, for the life of the
        bag, including:
      </p>
      <ul>
        <li>Re-stitching seams that have come loose with wear.</li>
        <li>Re-coating or re-burnishing edges that have softened.</li>
        <li>Re-lining a torn or worn interior with matching vegetable-tanned leather.</li>
        <li>Replacing solid-brass hardware (rivets, buckles, D-rings) with matching parts.</li>
        <li>Conditioning and reviving leather that has dried out from long use.</li>
      </ul>

      <h2>What is not covered</h2>
      <ul>
        <li>Damage caused by sharp objects, chemicals, fire, or accidents (insurance territory, not workmanship).</li>
        <li>Cosmetic patina, scratches, and natural ageing — full-grain leather is meant to record the life of the bag, and we will not erase that without your explicit instruction.</li>
        <li>Modifications made by another leatherworker. We can still repair the bag, but the warranty on that section is voided.</li>
      </ul>

      <h2>How it works</h2>
      <ol style={{ paddingLeft: "20px", marginBottom: "20px" }}>
        <li style={{ marginBottom: "8px" }}>
          Email{" "}
          <Link href="mailto:hello@maisontanneurs.com?subject=Repair%20Request">hello@maisontanneurs.com</Link>{" "}
          with photographs of the bag and a brief description of the repair.
        </li>
        <li style={{ marginBottom: "8px" }}>
          We confirm what the atelier can do, and send shipping
          instructions to our Marrakech atelier.
        </li>
        <li style={{ marginBottom: "8px" }}>
          You ship the bag to the atelier. <strong>Outbound shipping is
          paid by the customer.</strong>
        </li>
        <li style={{ marginBottom: "8px" }}>
          The atelier completes the repair — typically 2 to 4 weeks
          depending on the work involved.
        </li>
        <li style={{ marginBottom: "8px" }}>
          We ship the bag back to you. <strong>Return shipping is paid by
          the customer.</strong>
        </li>
      </ol>

      <h2>Cost</h2>
      <p>
        The repair labour itself — the workmanship that defines the lifetime
        guarantee — is free of charge. Replacement materials (hardware,
        lining leather, thread) are billed at atelier cost, with a quote
        sent for your approval before any work begins.
      </p>

      <h2>Round-trip shipping</h2>
      <p>
        Round-trip shipping to and from the Marrakech atelier is the
        responsibility of the customer. This keeps the lifetime guarantee
        sustainable across decades and across continents, and lets us cover
        the workmanship cost — the part that actually requires our atelier —
        for as long as the bag exists.
      </p>

      <h2>Questions</h2>
      <p>
        Write to{" "}
        <Link href="mailto:hello@maisontanneurs.com?subject=Repair%20Request">hello@maisontanneurs.com</Link>.
        We answer within one working day.
      </p>
    </article>
  );
}
