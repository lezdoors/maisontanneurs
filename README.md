# Kechken Store

Year-round clothing brand with a Moroccan visual register, US-anchored launch. Drop 01 ships against the WC2026 opener.

Working name: **Kechken**. Final brand name TBD — config-driven so it's swappable.

Built on the Maison Izem Next.js commerce stack (Next 16 / React 19 / Tailwind 4 / Stripe Payment Element / Supabase / Resend).

## Quick start

```bash
pnpm install
pnpm dev
```

Site runs at http://localhost:3000.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 App Router, React 19, Tailwind 4 |
| Commerce | Stripe Payment Element (on-domain, no redirect) |
| Data | Supabase (Postgres + Storage) |
| Email | Resend (transactional) |
| Fulfillment | Printful POD (to be wired in Phase 1) |
| Hosting | Vercel |

## Brand identity layer

Inherits from the Roche-Bobois-inspired palette in `app/globals.css`:
- Cream/white base, ink primary, brass accent, terracotta stamp
- Inter Tight (sans, primary), Cormorant Garamond (serif, accent), JetBrains Mono (utility)
- Sparse type hierarchy, generous negative space
- `.rb-*` utility classes for editorial sections

## Repo conventions

- This is **Next.js 16** — read `node_modules/next/dist/docs/` before adding APIs (breaking changes from 14/15)
- No invented copy; nothing ships with TBDs in production
- Brand identity is config-driven — see `app/layout.tsx` metadata for the swap points

## Game plan

Master plan at `~/morocco-brand/GAME-PLAN.md`. Phases: 0 (this week, decisions) → 1 (Drop 01 build) → 2 (WC tailwind) → 3 (post-WC) → 4+ (seasonal rhythm).
