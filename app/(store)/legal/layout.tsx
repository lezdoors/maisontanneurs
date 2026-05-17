export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-[var(--color-bone)] min-h-screen">
      <div className="max-w-[760px] mx-auto px-6 md:px-10 pt-[140px] pb-24 prose-legal">
        {children}
      </div>
      <style>{`
        .prose-legal { font-family: var(--font-sans); color: var(--color-charcoal); }
        .prose-legal h1 { font-family: var(--font-serif); font-weight: 300; font-size: clamp(40px,6vw,72px); line-height: 1; letter-spacing: -0.02em; color: var(--color-ink); margin-bottom: 8px; }
        .prose-legal .eyebrow { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.45em; text-transform: uppercase; color: var(--color-cedar); margin-bottom: 16px; display: block; }
        .prose-legal .updated { font-size: 12px; color: var(--color-muted); margin-bottom: 56px; }
        .prose-legal h2 { font-family: var(--font-serif); font-weight: 400; font-size: 26px; line-height: 1.2; color: var(--color-ink); margin: 48px 0 16px; }
        .prose-legal h3 { font-family: var(--font-sans); font-weight: 600; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--color-ink); margin: 32px 0 12px; }
        .prose-legal p { font-size: 15px; line-height: 1.75; margin-bottom: 16px; font-weight: 300; }
        .prose-legal ul { padding-left: 20px; margin-bottom: 20px; }
        .prose-legal li { font-size: 15px; line-height: 1.7; margin-bottom: 8px; font-weight: 300; }
        .prose-legal a { color: var(--color-cedar); text-decoration: underline; text-underline-offset: 3px; }
        .prose-legal a:hover { color: var(--color-ink); }
        .prose-legal strong { font-weight: 600; color: var(--color-ink); }
      `}</style>
    </main>
  );
}
