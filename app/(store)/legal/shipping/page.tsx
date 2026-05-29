import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping — Maison Tanneurs",
  description:
    "How Maison Tanneurs ships leather goods worldwide. Free worldwide shipping in three to five days by tracked express courier. Duty-free to the US and EU.",
  alternates: {
    canonical: "/legal/shipping",
  },
};

export default function ShippingPage() {
  return (
    <article>
      <span className="eyebrow">Shipping</span>
      <h1>How it gets to you.</h1>
      <p className="updated">Last updated · 19 May 2026</p>

      <p>
        Every Maison Tanneurs bag is finished by hand in our Marrakech atelier.
        When you place an order, the artisan checks the piece, packs it,
        and hands it to a tracked express courier — typically within 24 hours.
      </p>

      <h2>Free worldwide shipping</h2>
      <p>
        Shipping is free on every order, to every destination. There is no
        threshold and no surcharge for express service. You will see no
        shipping line item at checkout because there is no shipping cost
        to pay.
      </p>

      <h2>Delivery times</h2>
      <ul>
        <li><strong>European Union, UK · 2–4 business days</strong> · tracked express courier direct from Marrakech.</li>
        <li><strong>United States, Canada · 3–5 business days</strong> · tracked express courier, international priority service.</li>
        <li><strong>Australia, Japan, Singapore · 4–6 business days</strong> · tracked express courier.</li>
        <li><strong>Rest of world · 5–10 business days</strong> · tracked express service where available.</li>
      </ul>
      <p>
        If a bag is part of a limited edition or made-to-order custom run,
        a production window will be stated on the product page in addition
        to the delivery time above.
      </p>

      <h2>Tracking</h2>
      <p>
        You will receive a tracking link by email as soon as the courier
        collects the order. If your tracking has not updated within five
        business days of dispatch, write to <Link href="mailto:hello@maisontanneurs.com">hello@maisontanneurs.com</Link> and we will follow it
        up with the carrier on your behalf.
      </p>

      <h2>Customs and duties</h2>
      <p>
        Orders to the <strong>United States</strong> enter duty-free under
        the United States–Morocco Free Trade Agreement (in force since
        2006), which removed tariffs on Moroccan-origin leather goods.
      </p>
      <p>
        Orders to the <strong>European Union and the United Kingdom</strong>{" "}
        enter duty-free under the EU–Morocco Association Agreement and the
        UK–Morocco Association Agreement respectively. EU import VAT is
        already collected at checkout where applicable, so there is
        nothing for the carrier to bill on arrival.
      </p>
      <p>
        For other destinations, any local import duty or tax is the
        responsibility of the recipient. We declare the actual order
        value on the customs form — we do not under-declare.
      </p>

      <h2>Lost or damaged packages</h2>
      <p>
        Every order is insured to its full value during transit. If your
        package arrives damaged, send us photographs of the damage and the
        packaging within 72 hours of delivery (<Link href="mailto:hello@maisontanneurs.com">hello@maisontanneurs.com</Link>). We will file the
        insurance claim with the carrier and replace, repair, or refund at
        your option.
      </p>
      <p>
        If your tracking shows delivered but the package has not arrived,
        please check with neighbours and your building&apos;s mail room first.
        If still missing after 24 hours, contact us and we will open an
        investigation with the carrier.
      </p>

      <h2>Address changes</h2>
      <p>
        We can change a shipping address up until the order is dispatched
        from the warehouse — usually within 4 hours of you placing the
        order. After dispatch, the address is locked. Email us as soon as
        you spot an error.
      </p>

      <h2>Questions</h2>
      <p>
        Write to <Link href="mailto:hello@maisontanneurs.com">hello@maisontanneurs.com</Link>. We
        answer within one working day.
      </p>
    </article>
  );
}
