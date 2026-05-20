import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Care — Kechken",
  description:
    "How to care for your Kechken full-grain leather bag so it patinas well and lasts a decade.",
};

export default function CarePage() {
  return (
    <article>
      <span className="eyebrow">Care</span>
      <h1>How to keep it.</h1>
      <p className="updated">Last updated · 19 May 2026</p>

      <p>
        Every Kechken piece is full-grain leather, built to age well.
        Following the right care ritual is the difference between a bag
        that patinas beautifully over a decade and one that dries out in
        a season.
      </p>

      <h2>Full-grain leather (bags & small leather goods)</h2>
      <ul>
        <li>Wipe with a dry soft cloth after use. Leather develops its character through wear — small marks are part of the patina.</li>
        <li>Apply a neutral leather conditioner every 3–6 months, working with the grain.</li>
        <li>Store in the included dust bag, away from direct sunlight and heat sources.</li>
        <li>If the leather gets wet, blot dry with a soft towel and let it air dry at room temperature. Do not use a hairdryer.</li>
        <li>Avoid contact with oils, alcohol-based products, and dark denim (which can transfer dye onto lighter leather).</li>
      </ul>

      <h2>Solid brass hardware</h2>
      <ul>
        <li>Brass develops a soft natural patina over time — this is intentional. Don&apos;t polish it unless you want to reset.</li>
        <li>To reset the shine, use a soft cloth with a small amount of brass polish, then buff dry.</li>
        <li>Keep hardware dry. If exposed to saltwater or chlorine, rinse with fresh water and dry thoroughly.</li>
      </ul>

      <h2>Repairs</h2>
      <p>
        If a piece gets damaged through normal wear, write to{" "}
        <Link href="mailto:hello@kechken.com">hello@kechken.com</Link> with
        a photo. Minor repairs (loose stitching, broken chain) are usually
        free of charge in the first year. Beyond that, we will quote at
        cost.
      </p>

      <h2>End of life</h2>
      <p>
        When a bag is truly done, don&apos;t throw it away. Full-grain
        leather can be composted (with the brass hardware removed).
        Brass can be melted and reused indefinitely — bring it to any
        metalworker, or send it back to us and we will pass it to our
        partner&apos;s recycling stream.
      </p>

      <h2>Questions</h2>
      <p>
        Write to <Link href="mailto:hello@kechken.com">hello@kechken.com</Link>.
        We answer within one working day.
      </p>
    </article>
  );
}
