import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping — Maison Tanneurs",
  description:
    "How Maison Tanneurs ships leather goods worldwide. Three to five day delivery direct from Marrakech via DHL or FedEx.",
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
        and hands it to DHL or FedEx — typically within 24 hours.
      </p>

      <h2>Delivery times</h2>
      <ul>
        <li><strong>European Union, UK · 2–4 business days</strong> · DHL or FedEx Express direct from Marrakech.</li>
        <li><strong>United States, Canada · 3–5 business days</strong> · DHL or FedEx International Priority.</li>
        <li><strong>Australia, Japan, Singapore · 4–6 business days</strong> · DHL or FedEx International.</li>
        <li><strong>Rest of world · 5–10 business days</strong> · DHL Express where available, tracked international service elsewhere.</li>
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
        business days of dispatch, write to <Link href="mailto:hello@kechken.com">hello@kechken.com</Link> and we will follow it
        up with the carrier on your behalf.
      </p>

      <h2>Shipping cost</h2>
      <p>
        Shipping is included on orders over the threshold shown at
        checkout. Below that threshold, a flat shipping fee is displayed
        before you pay — varies by destination and bag weight.
      </p>
      <p>
        Customs duties and import VAT on international orders are the
        responsibility of the recipient. We declare the actual value of
        the order on the customs form — we do not under-declare.
      </p>

      <h2>Lost or damaged packages</h2>
      <p>
        Every order is insured to its full value during transit. If your
        package arrives damaged, send us photographs of the damage and the
        packaging within 72 hours of delivery (<Link href="mailto:hello@kechken.com">hello@kechken.com</Link>). We will file the
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
        Write to <Link href="mailto:hello@kechken.com">hello@kechken.com</Link>. We
        answer within one working day.
      </p>
    </article>
  );
}
