import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Common questions about ordering, shipping, and caring for Nitra objects.",
};

const FAQ = [
  {
    q: "How long will my order take to arrive?",
    a: "It depends on the piece. In-stock smaller objects (poufs, sconces, smaller lighting, vessels, plates) ship within 5 business days and arrive in 5–7 days by air courier. Furniture and statement lighting are made to order: 8–16 weeks of crafting, then 4–10 weeks of sea-freight to the US (less for EU). Your order confirmation will give you the specific lead time.",
  },
  {
    q: "Why are pieces handcrafted to order?",
    a: "We are a small atelier on Derb el Ferran in Marrakech, not a factory. Six maâlems work on what is needed when it is ordered. We do not hold large inventory because we do not want to: it forces us to either rush the work or store unsold pieces. Made to order keeps us honest, and keeps the catalogue current.",
  },
  {
    q: "Will my piece look exactly like the photograph?",
    a: "It will resemble it but differ in subtle, natural ways. Every piece is hand-cut, hand-stitched, hand-hammered, hand-inlaid. Pattern alignment, patina, grain, stitch placement — these vary piece to piece. That variation is what makes it not a factory object. Dimensions are accurate to ±2 cm.",
  },
  {
    q: "Are duties and taxes included?",
    a: "No. The price you pay is for the object plus shipping. Import duties, VAT, and customs fees are your responsibility on arrival, collected by the carrier. For typical figures by country, see our Shipping page. We are happy to send an estimate before you order — just ask.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Visa, Mastercard, American Express, Apple Pay, and Google Pay. Payment is processed by Stripe at checkout. We never see or store your card information.",
  },
  {
    q: "Can I commission a custom piece?",
    a: "Yes. We work with interior designers and direct clients on custom dimensions, alternative materials, and finish modifications. Write to hello@nitra.com with what you have in mind and we will respond with a feasibility note, lead time, and quote. Most custom commissions take 12–20 weeks.",
  },
  {
    q: "Do you sell to the trade?",
    a: "Yes. Designers, architects, and hospitality buyers receive a trade discount and dedicated lead-time support. Write to hello@nitra.com from your firm's email to open a trade account.",
  },
  {
    q: "What if something arrives damaged?",
    a: "Every piece is fully insured during transit. Send us photographs of the damage and the packaging within 72 hours of delivery. We file the claim with the carrier and replace, repair, or refund — your choice. Details on the Returns page.",
  },
  {
    q: "Can I return a piece I no longer want?",
    a: "In-stock smaller pieces (poufs, smaller lighting, vessels, plates, glassware) — yes, within 30 days. Made-to-order furniture and statement lighting — no, except for damage or material misdescription. Full details on the Returns page.",
  },
  {
    q: "What bulb do I use in your pendants?",
    a: "An E27 LED bulb at 7–9W warm white (2700K) is what we recommend. It gives the warmest light, produces the least heat, and lasts longest. Avoid bulbs over the listed wattage — the brass will heat and discolour locally.",
  },
  {
    q: "How do I care for the brass / cedar / leather / silk?",
    a: "Full care notes on our Care page. The short version: dust regularly with a soft cloth, avoid direct sunlight on flat surfaces, beeswax-and-linseed-oil polish on cedar twice a year, saddle soap on leather twice a year, sabra silk gets vacuumed only. Patina is intentional.",
  },
  {
    q: "Do you ship to my country?",
    a: "Almost certainly yes. We ship worldwide except sanctioned destinations and a small number of countries with prohibitive customs procedures. If you are unsure, write to us before ordering.",
  },
  {
    q: "Can I visit the atelier?",
    a: "Yes, by appointment. The atelier is on Derb el Ferran in Marrakech medina. Write ahead — the workshop runs at the pace of the work. Tea will be offered; the maâlems will work.",
  },
  {
    q: "How do I contact you?",
    a: "hello@nitra.com — we answer within one working day, usually faster. For trade inquiries, write from your firm's email.",
  },
];

export default function FAQPage() {
  return (
    <>
      <span className="eyebrow">Help</span>
      <h1>Frequently Asked Questions</h1>
      <p className="updated">Last updated: 12 May 2026</p>

      {FAQ.map((item, i) => (
        <div key={i}>
          <h2>{item.q}</h2>
          <p>{item.a}</p>
        </div>
      ))}
    </>
  );
}
