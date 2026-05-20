import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Sale — Kechken",
  description:
    "The terms under which Kechken sells hand-stitched leather goods, shipped direct from a Marrakech atelier.",
};

export default function TermsPage() {
  return (
    <article>
      <span className="eyebrow">Terms of Sale</span>
      <h1>The terms.</h1>
      <p className="updated">Last updated · 19 May 2026</p>

      <p>
        These terms apply to every order placed on www.kechken.com. By
        completing your purchase, you confirm you have read and agreed to
        them. If anything here is unclear, write to <Link href="mailto:hello@kechken.com">hello@kechken.com</Link> before
        you order.
      </p>

      <h2>About Kechken</h2>
      <p>
        Kechken is a small leather house working out of a Marrakech
        atelier. We design and make bags and small leather goods by hand —
        full-grain leather, solid brass hardware, contrast saddle-stitch —
        and ship direct to customers worldwide via this website.
      </p>

      <h2>Placing an order</h2>
      <p>
        When you place an order, you make an offer to buy. We accept that
        offer when we charge your payment method and dispatch a confirmation
        email. Prices are listed in USD and converted to your local currency
        at checkout where applicable.
      </p>
      <p>
        We reserve the right to refuse or cancel an order in cases of pricing
        errors, suspected fraud, or stock issues with the production partner.
        If we cancel, we refund in full immediately.
      </p>

      <h2>Pricing and payment</h2>
      <p>
        All prices are shown including any applicable EU VAT for orders
        shipped within the EU. US orders are shown without sales tax;
        tax is added at checkout where required by state law. Payment is
        taken at the point of order via Stripe — we accept all major credit
        cards, Apple Pay, and Google Pay.
      </p>

      <h2>Production and shipping</h2>
      <p>
        Each piece is hand-stitched in our Marrakech atelier and shipped
        direct to you via DHL or FedEx. See the{" "}
        <Link href="/legal/shipping">Shipping page</Link> for delivery
        times and costs.
      </p>

      <h2>Returns and refunds</h2>
      <p>
        Standard returns are accepted within 30 days of delivery for unworn,
        unwashed items with tags attached. See the{" "}
        <Link href="/legal/returns">Returns page</Link> for the full process.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All designs, prints, photographs, and copy on this site are the
        property of Kechken. You may not reproduce them for commercial use.
        Personal use (sharing a photo of you wearing the piece) is welcomed
        and encouraged.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, our liability to you is limited to
        the value of the order. We are not liable for indirect or consequential
        losses, including lost income or third-party claims.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the jurisdiction in which
        Kechken is registered (the United Kingdom). Any dispute that cannot
        be resolved by friendly discussion will be referred to the courts
        of that jurisdiction.
      </p>

      <h2>Contact</h2>
      <p>
        For any question about your order, write to{" "}
        <Link href="mailto:hello@kechken.com">hello@kechken.com</Link>. We
        answer within one working day.
      </p>
    </article>
  );
}
