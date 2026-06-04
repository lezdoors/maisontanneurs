"use client";

import { useState } from "react";

type State = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(payload.error || "Message could not be sent.");
      form.reset();
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Message could not be sent.");
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-5">
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <label className="flex flex-col gap-2">
          <span className="ed-eyebrow text-[var(--color-mineral)]">Name</span>
          <input
            name="name"
            required
            autoComplete="name"
            className="min-h-12 border border-[var(--color-rule)] bg-transparent px-4 text-[15px] text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="ed-eyebrow text-[var(--color-mineral)]">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="min-h-12 border border-[var(--color-rule)] bg-transparent px-4 text-[15px] text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="ed-eyebrow text-[var(--color-mineral)]">Subject</span>
        <input
          name="subject"
          required
          maxLength={120}
          className="min-h-12 border border-[var(--color-rule)] bg-transparent px-4 text-[15px] text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="ed-eyebrow text-[var(--color-mineral)]">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={6}
          className="border border-[var(--color-rule)] bg-transparent px-4 py-3 text-[15px] leading-[1.6] text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
        />
      </label>
      <button
        type="submit"
        disabled={state === "sending" || state === "sent"}
        className="min-h-12 w-full md:w-fit px-8 bg-[var(--color-ink)] text-white tech-label disabled:opacity-50"
      >
        {state === "sending" ? "Sending" : state === "sent" ? "Sent" : "Send message"}
      </button>
      <p
        role="status"
        className="min-h-5 text-[13px] leading-[1.5] text-[var(--color-mineral)]"
      >
        {state === "sent"
          ? "Message received. We will reply within one working day."
          : state === "error"
            ? error
            : ""}
      </p>
    </form>
  );
}
