import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping",
  description: "How Kechken ships handcrafted pieces from Marrakech to the world.",
};

export default function ShippingPage() {
  return (
    <>
      <span className="eyebrow">Logistics</span>
      <h1>Shipping</h1>
      <p className="updated">Last updated: 12 May 2026</p>

      <p>
        Every piece in our catalogue ships from Marrakech, Morocco. We handle export documentation, customs forms, and crate-building. The carrier and method depend on the size of the piece and your address.
      </p>

      <h2>Methods</h2>
      <h3>Smaller pieces — pendants, sconces, vessels, plates, poufs, cushions, beldi-cup sets</h3>
      <p>
        Shipped by air courier (DHL Express or FedEx International). Transit time 5 to 7 business days from dispatch to most destinations in the US, EU, UK, GCC, and Australia. Tracking is sent the day we hand the package to the carrier.
      </p>

      <h3>Furniture and statement lighting</h3>
      <p>
        Built into custom cedar crates in our workshop and shipped by sea-freight to the nearest port, then by white-glove last-mile carrier to your door. Transit time 6 to 10 weeks for the US, 4 to 6 weeks for the EU. We schedule the delivery appointment with you in advance.
      </p>

      <h2>Lead times</h2>
      <p>
        Lead times are honestly told and depend on whether the piece is in stock or made to order:
      </p>
      <ul>
        <li><strong>In stock</strong> (most poufs, smaller lighting): dispatched within 5 business days of order.</li>
        <li><strong>Made to order</strong> (furniture, statement lighting, custom dimensions): 8 to 16 weeks of crafting before dispatch.</li>
      </ul>
      <p>
        Your order confirmation will tell you the specific lead time for the piece you ordered. We update you when crafting begins and again when the piece ships.
      </p>

      <h2>Costs</h2>
      <p>
        Shipping is calculated at checkout based on weight, dimensions, and destination. Express delivery for smaller items typically ranges $25 to $85. Furniture and statement lighting are quoted individually at checkout — sea-freight + white-glove typically $300 to $1,200 depending on size and country.
      </p>

      <h2>Duties and taxes</h2>
      <p>
        Prices on the site are exclusive of import duties, VAT, and customs fees. These are your responsibility on arrival. The carrier will contact you to collect them before delivery.
      </p>
      <p>
        Typical figures for our most common destinations: <strong>US</strong> generally no import duty for personal-use shipments under $800 (de minimis); duty 0–6% above that. <strong>EU</strong> VAT 19–25% + duty 0–6% on declared value. <strong>UK</strong> VAT 20% + duty 0–4% above £135. We are happy to send a customs-value estimate before you order; just ask.
      </p>

      <h2>Tracking</h2>
      <p>
        You will receive a tracking number by email the day your package ships. For sea-freight orders, we also send a milestone update at each stage (left workshop, loaded onto vessel, arrived at port, cleared customs, out for white-glove delivery).
      </p>

      <h2>Damage in transit</h2>
      <p>
        Every piece is insured to its full value during transit. If anything arrives damaged, send us photographs of the damage and the packaging within 72 hours of delivery (hello@kechken.com). We will file the insurance claim with the carrier and replace, repair, or refund — your choice.
      </p>

      <h2>Where we do not ship</h2>
      <p>
        We ship globally with the exception of sanctioned destinations and a small number of countries where customs procedures make handmade-furniture imports impractical. If you are unsure, write to us before ordering.
      </p>

      <h2>Questions</h2>
      <p>
        Write to <a href="mailto:hello@kechken.com">hello@kechken.com</a>. We answer within one working day.
      </p>
    </>
  );
}
