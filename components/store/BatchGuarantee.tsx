"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0 },
};

export default function BatchGuarantee() {
  return (
    <section
      aria-label="The batch and the guarantee"
      className="w-full bg-[var(--color-paper)] text-[var(--color-ink)] border-y border-[var(--color-rule)] py-[clamp(64px,10vw,140px)]"
    >
      <motion.div
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-2"
      >
        {/* THE BATCH */}
        <article className="md:border-r border-[#e5e5e5] border-b md:border-b-0 px-6 py-14 md:py-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="tech-label opacity-50">§07.A</span>
            <span className="h-px w-10 bg-[#0f0f0f]/30" />
            <span className="tech-label">The Batch</span>
          </div>
          <h3
            className="display-xxl"
            style={{ fontSize: "clamp(36px, 4.4vw, 72px)" }}
          >
            07 hands.
            <br />
            14 days.
            <br />
            <span className="opacity-50">No exceptions.</span>
          </h3>
          <p
            className="mt-8 leading-relaxed text-[#0f0f0f]/75"
            style={{ fontSize: "14px", letterSpacing: "-0.01em", maxWidth: "52ch" }}
          >
            The Atelier runs on a single closed circuit of seven master artisans
            in Marrakech — cutter, skiver, two stitchers, edge-coater, finisher,
            dispatcher. Every object is hand-assembled, edge-burnished and
            saddle-stitched at the same workbench, in the same fourteen-day
            cycle. We do not subcontract the finish. We do not inflate the run.
          </p>
          <ul className="mt-10 divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
            <Row k="Run Size" v="≤ 200 / Edition" />
            <Row k="Cadence" v="04 Editions / Year" />
            <Row k="Ceiling" v="560 Objects" />
          </ul>
        </article>

        {/* THE GUARANTEE */}
        <article className="bg-[#0f0f0f] text-white px-6 py-14 md:py-20">
          <div className="flex items-center gap-4 mb-8 text-white/70">
            <span className="tech-label opacity-60">§07.B</span>
            <span className="h-px w-10 bg-white/30" />
            <span className="tech-label">The Guarantee</span>
          </div>
          <h3
            className="display-xxl text-white"
            style={{ fontSize: "clamp(36px, 4.4vw, 72px)" }}
          >
            Lifetime
            <br />
            Repair<span className="opacity-50">.</span>
          </h3>
          <p
            className="mt-8 leading-relaxed text-white/75"
            style={{ fontSize: "14px", letterSpacing: "-0.01em", maxWidth: "52ch" }}
          >
            Vegetable-tanned full-grain leather is engineered to age, not to wear
            out. Edges darken, surfaces soften, the grain takes on the imprint of
            its carrier. When time finally catches up — a worn shoulder strap,
            a thread that has paid its debt — we re-stitch, re-line and re-edge
            the object in our own atelier. For as long as the object exists,
            the warranty stands.
          </p>
          <ul className="mt-10 divide-y divide-white/15 border-y border-white/15">
            <Row k="Re-Stitch" v="Included" dark />
            <Row k="Edge-Coat" v="Included" dark />
            <Row k="Re-Line" v="Included" dark />
          </ul>
          <a
            href="mailto:repair@maisontanneurs.com?subject=Repair%20Request"
            className="mt-10 inline-flex h-12 items-center border border-white/40 px-7 text-white hover:opacity-70 transition-opacity"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            File a Repair Request
          </a>
        </article>
      </motion.div>
    </section>
  );
}

function Row({ k, v, dark = false }: { k: string; v: string; dark?: boolean }) {
  return (
    <li className="flex items-baseline justify-between py-3.5">
      <span
        className={`tech-label ${dark ? "text-white/55" : "opacity-60"}`}
      >
        {k}
      </span>
      <span className={`tech-meta ${dark ? "text-white/90" : ""}`}>{v}</span>
    </li>
  );
}
