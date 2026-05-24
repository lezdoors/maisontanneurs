"use client";

import { motion } from "framer-motion";

const PHRASE =
  "HANDCRAFTED IN MARRAKECH • FULL GRAIN LEATHER • LIFETIME GUARANTEE • EXPRESS SHIPPING TO FRANCE & THE UK • ";

export default function Marquee() {
  return (
    <section
      aria-label="House promises"
      className="w-full bg-white border-y border-[#e5e5e5] overflow-hidden"
    >
      <motion.div
        className="flex whitespace-nowrap py-4 will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 48,
          ease: "linear",
          repeat: Infinity,
        }}
        aria-hidden
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="tech-label text-[#0f0f0f] mr-12"
            style={{ fontSize: "12px", letterSpacing: "0.22em" }}
          >
            {PHRASE}
          </span>
        ))}
      </motion.div>
      <span className="sr-only">
        Handcrafted in Marrakech. Full-grain leather. Lifetime guarantee.
        Express shipping to France and the UK.
      </span>
    </section>
  );
}
