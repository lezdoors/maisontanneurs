import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to the Maison Tanneurs atelier. We answer within one working day.",
};

export default function ContactPage() {
  return (
    <main>
      <article className="max-w-[680px] mx-auto px-6 pt-[180px] pb-[120px]">
        <span className="eyebrow">Contact</span>
        <h1>Write to the atelier.</h1>
        <p className="font-serif italic text-[var(--color-ink-soft)] text-[19px] md:text-[21px] leading-[1.5] mt-6 max-w-[44ch]">
          Every email is read by a person in Marrakech. We reply within one
          working day, usually faster.
        </p>

        <div className="mt-14 flex flex-col gap-10">
          <div>
            <div className="ed-eyebrow text-[var(--color-mineral)] mb-3">
              General &amp; orders
            </div>
            <a
              href="mailto:hello@kechken.com"
              className="font-serif text-[28px] md:text-[34px] tracking-[-0.01em] text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              hello@kechken.com
            </a>
          </div>

          <div>
            <div className="ed-eyebrow text-[var(--color-mineral)] mb-3">
              Press &amp; partnerships
            </div>
            <a
              href="mailto:hello@kechken.com?subject=Press"
              className="font-serif text-[22px] md:text-[26px] tracking-[-0.01em] text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              hello@kechken.com
            </a>
            <p className="text-[14px] text-[var(--color-mineral)] mt-2">
              Mark the subject line &ldquo;Press&rdquo;.
            </p>
          </div>

          <div>
            <div className="ed-eyebrow text-[var(--color-mineral)] mb-3">
              The atelier
            </div>
            <p className="text-[15px] leading-[1.7] text-[var(--color-ink-soft)] max-w-[44ch]">
              We work out of a small leather atelier in Marrakech. Visits are
              by appointment only — write first.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-[var(--color-rule)] flex flex-col gap-3">
          <div className="ed-eyebrow text-[var(--color-mineral)] mb-2">
            Before you write
          </div>
          <p className="text-[14px] leading-[1.7] text-[var(--color-ink-soft)]">
            Most order questions are answered in the{" "}
            <Link
              href="/legal/faq"
              className="text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              FAQ
            </Link>{" "}
            or in the{" "}
            <Link
              href="/legal/shipping"
              className="text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              shipping
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/returns"
              className="text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              returns
            </Link>{" "}
            pages.
          </p>
        </div>
      </article>
    </main>
  );
}
