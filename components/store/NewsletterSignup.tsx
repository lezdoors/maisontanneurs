"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n-client";

export default function NewsletterSignup() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });
      setState(res.ok ? "sent" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  return (
    <section
      aria-label="Join the atelier list"
      className="w-full bg-white border-b border-[#e5e5e5]"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-14 md:py-20 gap-y-10">
        <div className="md:col-span-5">
          <span className="tech-label opacity-60">§09</span>
          <h3
            className="display-xxl mt-5"
            style={{ fontSize: "clamp(40px, 5vw, 80px)" }}
          >
            {t("newsletter.title").split("\n").map((line, index) => (
              <span key={line}>
                {line}
                {index === 0 && <br />}
              </span>
            ))}
          </h3>
          <p
            className="mt-6 leading-relaxed text-[#0f0f0f]/70"
            style={{ fontSize: "14px", letterSpacing: "-0.01em", maxWidth: "44ch" }}
          >
            {t("newsletter.copy")}
          </p>
        </div>

        <div className="md:col-span-7 md:pl-10 md:border-l md:border-[#e5e5e5] flex flex-col justify-center">
          <form
            onSubmit={onSubmit}
            className="flex items-stretch border-b border-[#0f0f0f]"
          >
            <input
              type="email"
              required
              placeholder={t("newsletter.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state === "sending" || state === "sent"}
              aria-label="Email address"
              className="flex-1 bg-transparent py-3.5 text-[15px] outline-none text-[#0f0f0f] placeholder:text-[#6b6b6b] disabled:opacity-50"
              style={{ letterSpacing: "-0.01em" }}
            />
            <button
              type="submit"
              disabled={state === "sending" || state === "sent"}
              className="tech-label px-5 text-[#0f0f0f] hover:opacity-60 disabled:opacity-40"
            >
              {state === "sending"
                ? t("newsletter.sending")
                : state === "sent"
                  ? t("newsletter.sent")
                  : t("newsletter.subscribe")}
            </button>
          </form>
          <div className="mt-4 tech-meta opacity-60">
            {state === "error"
              ? t("newsletter.error")
              : state === "sent"
                ? t("newsletter.success")
                : t("newsletter.legal")}
          </div>
        </div>
      </div>
    </section>
  );
}
