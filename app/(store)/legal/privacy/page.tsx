import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Nitra collects, uses, and protects the personal information of our customers.",
};

export default function PrivacyPage() {
  return (
    <>
      <span className="eyebrow">Legal</span>
      <h1>Privacy Policy</h1>
      <p className="updated">Last updated: 12 May 2026</p>

      <p>
        Nitra ("we", "us", "our") respects your privacy. This policy explains what personal information we collect when you visit www.nitra.com, place an order, or contact our atelier, and how we use, store, share, and protect that information.
      </p>

      <h2>1. Information we collect</h2>
      <p>We collect only what we need to fulfil your order and serve you well:</p>
      <ul>
        <li><strong>Order information:</strong> name, shipping and billing address, email, phone number, items ordered, payment confirmation (we do not store card numbers).</li>
        <li><strong>Account information:</strong> if you create an account, your email and any preferences you save.</li>
        <li><strong>Correspondence:</strong> messages you send to atelier@nitra.com or via our contact forms.</li>
        <li><strong>Usage data:</strong> standard web analytics — pages viewed, device type, anonymised IP, referrer. We use this to improve the site, never to identify individuals.</li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To process and ship your order, and update you on its progress.</li>
        <li>To respond to your inquiries.</li>
        <li>To send order confirmations and shipping notifications (transactional emails only — never marketing without your explicit opt-in).</li>
        <li>To detect and prevent fraud.</li>
        <li>To comply with legal obligations (tax, customs, accounting).</li>
      </ul>

      <h2>3. Who we share it with</h2>
      <p>We only share your information with parties strictly necessary to fulfil your order:</p>
      <ul>
        <li><strong>Stripe</strong> — payment processing. Stripe handles your card information directly; we never see it.</li>
        <li><strong>Resend</strong> — transactional email delivery.</li>
        <li><strong>Carriers</strong> (DHL, FedEx, sea-freight forwarders) — shipping fulfilment. They receive your shipping address only.</li>
        <li><strong>Supabase</strong> — our database and storage provider (EU-region servers).</li>
      </ul>
      <p>We do not sell, rent, or trade your personal information with anyone. Ever.</p>

      <h2>4. How long we keep it</h2>
      <p>Order records are retained for seven years for tax and accounting purposes, as required by French and US commercial law. Account information is retained until you ask us to delete it. Anonymised analytics are retained for thirteen months.</p>

      <h2>5. Your rights</h2>
      <p>You can ask us at any time to:</p>
      <ul>
        <li>Access the personal information we hold about you.</li>
        <li>Correct it if any of it is wrong.</li>
        <li>Delete it (subject to legal retention obligations).</li>
        <li>Export it in a portable format.</li>
        <li>Withdraw any consent you previously gave.</li>
      </ul>
      <p>Write to <a href="mailto:atelier@nitra.com">atelier@nitra.com</a> and we will respond within thirty days.</p>

      <h2>6. Cookies</h2>
      <p>We use a minimal set of cookies: a session cookie for your shopping cart, and anonymised analytics cookies to understand site traffic. We do not use advertising or tracking cookies. Your browser settings can refuse cookies at any time; the site will still function.</p>

      <h2>7. International transfers</h2>
      <p>Our atelier is in Morocco; our hosting infrastructure is in the European Union and United States. By placing an order, you consent to your information being transferred across these jurisdictions, all of which we believe provide adequate protection.</p>

      <h2>8. Changes to this policy</h2>
      <p>We will post any changes to this page and update the "last updated" date above. For material changes affecting how we use your information, we will notify you by email.</p>

      <h2>9. Contact</h2>
      <p>
        Questions about this policy or how we handle your information:
        <br />
        <a href="mailto:atelier@nitra.com">atelier@nitra.com</a>
      </p>
    </>
  );
}
