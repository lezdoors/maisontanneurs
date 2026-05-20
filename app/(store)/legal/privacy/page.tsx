import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — Kechken",
  description:
    "How Kechken collects, uses, and protects the personal information of customers.",
};

export default function PrivacyPage() {
  return (
    <article>
      <span className="eyebrow">Privacy</span>
      <h1>Privacy policy.</h1>
      <p className="updated">Last updated · 19 May 2026</p>

      <p>
        Kechken (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This policy
        explains what personal information we collect when you visit
        www.kechken.com, place an order, or write to us, and how we use,
        store, share, and protect that information.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Order details:</strong> name, billing and shipping address, email, phone number, and the items you ordered.</li>
        <li><strong>Payment information:</strong> handled exclusively by Stripe (our payment processor). We never see or store your card number.</li>
        <li><strong>Correspondence:</strong> messages you send to hello@kechken.com or via our contact forms.</li>
        <li><strong>Site analytics:</strong> anonymous information about how you use the site (pages visited, device type, time on page), collected via privacy-respecting analytics.</li>
        <li><strong>Marketing email:</strong> if you opt into the newsletter, we store your email and the date you subscribed.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To fulfill your order — passing your name and shipping address to our Marrakech atelier and the courier (DHL/FedEx).</li>
        <li>To send order confirmations, shipping updates, and post-delivery follow-ups.</li>
        <li>To respond to your questions and resolve any issues with your order.</li>
        <li>To improve the site and the product range based on aggregate analytics.</li>
        <li>To send marketing emails — only if you have explicitly opted in. You can unsubscribe at any time using the link in any email.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>
        We share the minimum information necessary with:
      </p>
      <ul>
        <li><strong>Stripe</strong> — for payment processing.</li>
        <li><strong>Our Marrakech atelier</strong> — for finishing and dispatch.</li>
        <li><strong>Our courier</strong> — for delivery.</li>
        <li><strong>Resend</strong> — for transactional and newsletter email delivery.</li>
      </ul>
      <p>
        We do not sell, rent, or share your personal information with any
        other third party for any other purpose.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Order records are retained for seven years to meet tax and accounting
        obligations. Newsletter records are kept until you unsubscribe.
        Correspondence is kept for two years for customer-service continuity,
        then deleted.
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right to access the personal information we hold about
        you, to correct it, to ask for it to be deleted, or to ask us to
        stop using it for marketing. Write to{" "}
        <Link href="mailto:hello@kechken.com">hello@kechken.com</Link> and
        we will respond within thirty days.
      </p>

      <h2>Cookies</h2>
      <p>
        We use a small number of cookies to keep your cart between visits,
        remember your country and currency preference, and measure
        site traffic in aggregate. You can manage cookies in your browser
        settings. Essential cookies (cart, checkout) are always on; non-essential
        cookies can be declined via the banner on first visit.
      </p>

      <h2>Security</h2>
      <p>
        All data is transmitted over HTTPS. Payment information never
        touches our servers — it goes directly from your browser to Stripe.
        Customer records are stored encrypted at rest by our database
        provider (Supabase, hosted in the EU).
      </p>

      <h2>Contact</h2>
      <p>
        For any privacy question, write to{" "}
        <Link href="mailto:hello@kechken.com">hello@kechken.com</Link>.
      </p>
    </article>
  );
}
