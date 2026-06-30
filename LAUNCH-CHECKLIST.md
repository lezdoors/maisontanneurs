# Maison Tanneurs — Launch Checklist (branch `launch/lemaire-stripe`)

Status 2026-06-30: code complete + Stripe test charge verified. Remaining steps
need your dashboards/credentials (an agent can't do these). ~15 minutes.

## What's DONE (committed)
- New 7-section Lemaire homepage; page-by-page audit ran (22 routes clean).
- Checkout migrated Revolut → **Stripe Elements** (was 100% broken). Verified a
  real Stripe **test** PaymentIntent → `succeeded` with a charge.
- `/api/webhooks/stripe` + order fan-out to **CRM + Slack** (`lib/checkout/ops-notify.ts`)
  alongside email + Meta CAPI — idempotent, first-persistence only.
- Fixed the audit blocker (product feed was invalid XML) + added home `<h1>`.
- `tsc` clean.

## TODO — you (fastest path in parens)

### 1. Supabase (pick one)
- **Fast:** point env at the canonical project that already works:
  `NEXT_PUBLIC_SUPABASE_URL=https://xbtabpurfavngwmwtawc.supabase.co` +
  its anon + service_role keys. It already has `orders.stripe_payment_intent_id`
  and 34 products — zero schema work.
- **Clean (preferred long-term):** in the fresh project `lsuyyzxskystwbpyhjyz`
  SQL editor, run `supabase/migrations/20260630_fresh_orders_stripe.sql`, then
  seed products (repoint the Airtable→Supabase sync). Send me the DB password /
  a Supabase access token and I'll do it.

### 2. Stripe (`.env.local` locally, Vercel for prod)
- Re-paste TEST keys locally: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…`,
  `STRIPE_SECRET_KEY=sk_test_…` (Dashboard → Developers → API keys → test mode).
  Account = `acct_1Tliw1EFLt1K0hH1`.
- Prod env in Vercel must use `pk_live_…` / `sk_live_…`.
- Dashboard → Webhooks → add endpoint `https://www.maisontanneurs.com/api/webhooks/stripe`,
  event `payment_intent.succeeded` → copy the signing secret to
  `STRIPE_WEBHOOK_SECRET`.
- Dashboard → Payment Method Domains → register `maisontanneurs.com` (Apple/Google Pay).

### 3. Give me these and I'll finish wiring + verify
- `CRM_INTAKE_URL` + `CRM_API_KEY` (crm.akalds.com order-intake endpoint)
- `SLACK_WEBHOOK_URL` (incoming webhook)
- `META_CAPI_ACCESS_TOKEN` (server Purchase event; pixel id 26891834623830253 already wired)
- `RESEND_API_KEY` is already present (recovered from Vercel).

### 4. Deploy + launch gate
- Set all env in the target Vercel project, deploy `launch/lemaire-stripe`.
- Place ONE real order (card + Apple/Google Pay) → confirm Stripe PI `succeeded`
  with non-null `latest_charge`, order row written, confirmation email, Slack +
  CRM received, Purchase event in Meta Events Manager.
- Only then unpause the two Meta campaigns.

## Env var reference (names)
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` `STRIPE_SECRET_KEY` `STRIPE_WEBHOOK_SECRET`
`NEXT_PUBLIC_SUPABASE_URL` `NEXT_PUBLIC_SUPABASE_ANON_KEY` `SUPABASE_SERVICE_ROLE_KEY`
`RESEND_API_KEY` `META_PIXEL_ID` `NEXT_PUBLIC_META_PIXEL_ID` `META_CAPI_ACCESS_TOKEN`
`CRM_INTAKE_URL` `CRM_API_KEY` `SLACK_WEBHOOK_URL` `NEXT_PUBLIC_SITE_URL`
