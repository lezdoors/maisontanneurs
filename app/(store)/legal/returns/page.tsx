import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns",
  description: "How Kechken handles returns of handcrafted Moroccan objects.",
};

export default function ReturnsPage() {
  return (
    <>
      <span className="eyebrow">Returns</span>
      <h1>Returns</h1>
      <p className="updated">Last updated: 12 May 2026</p>

      <p>
        Most of what we sell is handcrafted to order. Because of that, return rules differ by piece. The shorter the catalogue line, the more flexible the return; the more custom the piece, the firmer it is. Read carefully before ordering.
      </p>

      <h2>30-day return — for in-stock smaller objects</h2>
      <p>
        Poufs, cushions, smaller lighting (sconces, table lamps), vessels, wall plates, and beldi glassware are returnable for any reason within 30 days of delivery, in their original condition.
      </p>
      <ul>
        <li>Write to <a href="mailto:hello@kechken.com">hello@kechken.com</a> within 30 days of delivery to start the return.</li>
        <li>We provide a prepaid return label (US, EU, UK).</li>
        <li>Refund issued to your original payment method within 7 business days of our receiving the piece back.</li>
        <li>Return shipping is deducted from the refund (~$25–$85 depending on origin and weight).</li>
      </ul>

      <h2>Made-to-order furniture and statement lighting</h2>
      <p>
        Larger furniture (consoles, side tables, bed frames, dressers, wall fountains) and statement pendants over 50 cm are made to order for you specifically. We start crafting once your order is confirmed.
      </p>
      <ul>
        <li>You may cancel within 48 hours of placing the order for a full refund.</li>
        <li>After 48 hours, the order moves into the workshop schedule. Cancellation after that is not possible; we can offer store credit at our discretion if the piece has not yet been started.</li>
        <li>Once delivered, made-to-order pieces are not returnable unless damaged in transit or materially different from the description.</li>
      </ul>

      <h2>Damage in transit</h2>
      <p>
        Every piece is insured. If damage occurs in transit:
      </p>
      <ul>
        <li>Send us photographs of the damage and packaging within 72 hours of delivery.</li>
        <li>We file the insurance claim with the carrier.</li>
        <li>We will repair, replace, or refund — your choice — within the timeframe quoted by the insurer (typically 2–4 weeks for repair, 8–12 weeks for replacement of made-to-order pieces).</li>
      </ul>

      <h2>What "original condition" means</h2>
      <p>
        Unused, with no marks of wear, in the same packaging it arrived in. We do not deduct restocking fees, but a piece returned in noticeably-used condition (scuffed leather, dented brass, removed silk piping) cannot be refunded at full value — we will contact you with options.
      </p>

      <h2>Custom commissions</h2>
      <p>
        Pieces commissioned with custom dimensions, alternative materials, or finish modifications are non-returnable. We send full mock-ups and material samples before crafting begins; once you approve, the order moves forward.
      </p>

      <h2>Refunds</h2>
      <p>
        Refunds are issued to your original payment method. Bank-processing times mean refunds usually appear in your account 5 to 10 business days after we issue them. We will email you when we initiate the refund.
      </p>

      <h2>Questions</h2>
      <p>
        Write to <a href="mailto:hello@kechken.com">hello@kechken.com</a>. We answer within one working day.
      </p>
    </>
  );
}
