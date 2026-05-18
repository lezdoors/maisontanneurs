import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Sale",
  description: "The terms under which Nitra sells handcrafted objects from Marrakech.",
};

export default function TermsPage() {
  return (
    <>
      <span className="eyebrow">Legal</span>
      <h1>Terms of Sale</h1>
      <p className="updated">Last updated: 12 May 2026</p>

      <p>
        These terms apply to every order placed on www.nitra.com. By completing your purchase, you confirm you have read and agreed to them. If anything here is unclear, write to <a href="mailto:hello@nitra.com">hello@nitra.com</a> before you order.
      </p>

      <h2>1. About us</h2>
      <p>
        Nitra is a small atelier of makers based in Marrakech, Morocco. We design and handcraft furniture, lighting, vessels, and textile objects on Derb el Ferran. We sell direct to clients worldwide.
      </p>

      <h2>2. About the work</h2>
      <p>
        Every piece in our catalogue is handcrafted, signed by the maâlem, and unique. The piece you receive will resemble the photograph but will differ in subtle, natural ways — variations in grain, hand-stitch placement, pierce alignment, and patina. These are not defects. They are how handwork looks.
      </p>
      <p>
        Photographs are made from representative pieces in the workshop. Dimensions are nominal and may vary by ±2 cm.
      </p>

      <h2>3. Orders and acceptance</h2>
      <p>
        Your order is an offer to purchase. We confirm by email once we accept it — usually within 24 hours. Until that confirmation, no contract is formed.
      </p>
      <p>
        For larger pieces (furniture, statement lighting), some items are made to order. We will tell you the lead time in your order confirmation: typically 2 to 6 weeks for in-stock pieces, 8 to 16 weeks for furniture made to order.
      </p>

      <h2>4. Pricing and currency</h2>
      <p>
        Prices are shown in US dollars (USD). Currency conversion is handled at checkout if you pay in another currency. Prices are exclusive of import duties and taxes, which are your responsibility on arrival (see <a href="/legal/shipping">Shipping</a>).
      </p>
      <p>
        We reserve the right to correct pricing errors before shipping. If the price you paid is materially different from the correct price, we will contact you with the option to confirm or cancel.
      </p>

      <h2>5. Payment</h2>
      <p>
        Payment is taken at checkout through Stripe. We accept Visa, Mastercard, American Express, Apple Pay, and Google Pay. Your card is charged at order confirmation, not at delivery.
      </p>

      <h2>6. Shipping</h2>
      <p>
        We ship worldwide from Marrakech. Full details — methods, lead times, duties, white-glove delivery — are in our <a href="/legal/shipping">Shipping policy</a>.
      </p>

      <h2>7. Returns</h2>
      <p>
        Because pieces are handmade and many are made to order, return policies vary by category. Full details are in our <a href="/legal/returns">Returns policy</a>.
      </p>

      <h2>8. Warranty</h2>
      <p>
        We warrant every piece to be free of manufacturing defects for twelve months from delivery. The warranty does not cover wear from use, exposure to direct sunlight or moisture beyond ordinary indoor conditions, or modifications by anyone outside our workshop.
      </p>

      <h2>9. Force majeure</h2>
      <p>
        Lead times may be affected by events beyond our control — customs delays, strikes, weather, public-health closures. We will keep you informed and refund in full if delivery becomes impossible within a reasonable time.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These terms are governed by the laws of Morocco. Any dispute that we cannot resolve directly will go to the courts of Marrakech, save where mandatory consumer-protection law in your country provides otherwise.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these terms occasionally. The version that applies to your order is the one displayed on this page when you placed it.
      </p>

      <h2>12. Contact</h2>
      <p>
        For any question about your order, write to <a href="mailto:hello@nitra.com">hello@nitra.com</a>. We answer within one working day.
      </p>
    </>
  );
}
