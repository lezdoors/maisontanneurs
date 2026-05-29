import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — Maison Tanneurs",
  description:
    "Common questions about ordering, shipping, and caring for Maison Tanneurs leather goods.",
  alternates: {
    canonical: "/legal/faq",
  },
};

const FAQ = [
  {
    q: "What is Maison Tanneurs?",
    a: "Maison Tanneurs is a small leather house working out of a Marrakech atelier. We make bags and small leather goods — full-grain leather, solid brass hardware, contrast saddle-stitch — cut and finished by hand, then shipped direct from Morocco.",
  },
  {
    q: "How is each piece produced?",
    a: "Every bag is cut, stitched, and finished by hand in a small Marrakech atelier. One artisan finishes a piece from start to end and signs the lining. No factory line, no warehouse — when you order, the bag ships direct from the atelier.",
  },
  {
    q: "How long does shipping take?",
    a: "Three to five business days from when you order, in most cases. Bags ship direct from Marrakech by tracked express courier with full tracking. International transit times vary by country (see Shipping).",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes — free worldwide shipping on every order, with no minimum and no surcharge for express service. Orders to the US enter duty-free under the Morocco-US Free Trade Agreement; orders to the EU and UK enter duty-free under the EU-Morocco and UK-Morocco association agreements.",
  },
  {
    q: "What sizes do you carry?",
    a: "Bags are one-size. Dimensions are listed on each product page.",
  },
  {
    q: "Can I return something?",
    a: "Yes — within thirty days of delivery, unused and unmarked, with original packaging. Full policy on the Returns page.",
  },
  {
    q: "Where can I get help with my order?",
    a: "Email hello@maisontanneurs.com — we reply within one working day, usually faster.",
  },
];

export default function FaqPage() {
  return (
    <article>
      <span className="eyebrow">Help</span>
      <h1>Frequently asked.</h1>
      <p className="updated">Last updated · 19 May 2026</p>

      {FAQ.map((item, i) => (
        <div key={i}>
          <h2>{item.q}</h2>
          <p>{item.a}</p>
        </div>
      ))}

      <h2>Still have a question?</h2>
      <p>
        Write to{" "}
        <Link href="mailto:hello@maisontanneurs.com">hello@maisontanneurs.com</Link>. We
        reply within one working day.
      </p>
    </article>
  );
}
