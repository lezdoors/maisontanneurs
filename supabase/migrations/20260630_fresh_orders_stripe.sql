-- Maison Tanneurs — orders persistence for the FRESH (clean) Supabase project.
-- Run this once in the new project's SQL editor (Dashboard → SQL → New query)
-- OR via `supabase db push` when the project is linked.
--
-- Aligned to lib/checkout/confirm-order.ts, which upserts into `orders` with
-- ON CONFLICT (stripe_payment_intent_id). The PaymentIntent id is the
-- idempotency key, so emails / CAPI / CRM / Slack fire exactly once per order.
--
-- Products stay on STATIC_PRODUCTS (lib/products.ts) for display until the
-- Airtable→Supabase sync is repointed at this project (phase 2); orders do NOT
-- depend on the products table existing.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                        uuid primary key default gen_random_uuid(),
  order_number              text not null,
  sales_channel             text default 'direct',
  stripe_payment_intent_id  text not null unique,
  customer_email            text,
  customer_name             text,
  shipping_address          jsonb,
  items                     jsonb not null default '[]'::jsonb,
  subtotal                  integer not null default 0,   -- minor units
  shipping_cost             integer not null default 0,
  total                     integer not null default 0,
  currency                  text not null default 'USD',
  status                    text not null default 'paid',
  created_at                timestamptz not null default now()
);

create index if not exists orders_pi_idx on public.orders (stripe_payment_intent_id);
create index if not exists orders_created_idx on public.orders (created_at desc);

-- Service-role writes bypass RLS; keep the table non-readable to anon/auth.
alter table public.orders enable row level security;
drop policy if exists "orders not publicly readable" on public.orders;
create policy "orders not publicly readable" on public.orders for select using (false);

-- ─────────────────────────────────────────────────────────────────────────────
-- Abandoned checkouts — written at PaymentIntent creation, flipped to
-- 'converted' by markAbandonedCheckoutConverted() on a paid order.
create table if not exists public.abandoned_checkouts (
  id                        uuid primary key default gen_random_uuid(),
  stripe_payment_intent_id  text unique,
  customer_email            text,
  items                     jsonb,
  subtotal                  integer,
  currency                  text default 'USD',
  status                    text default 'pending',  -- pending | converted
  created_at                timestamptz not null default now(),
  converted_at              timestamptz
);

create index if not exists abandoned_pi_idx
  on public.abandoned_checkouts (stripe_payment_intent_id);

alter table public.abandoned_checkouts enable row level security;
drop policy if exists "abandoned not publicly readable" on public.abandoned_checkouts;
create policy "abandoned not publicly readable"
  on public.abandoned_checkouts for select using (false);
