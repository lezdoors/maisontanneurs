// Revolut Merchant API client — server-side only.
//
// Maison Tanneurs is greenfield on Revolut Acquiring (approved 2026-05-21
// under Akal Digital Services Ltd #17229387). No Stripe legacy.
//
// Env vars:
//   REVOLUT_SECRET_KEY        sk_m...           — Bearer auth for all calls
//   REVOLUT_API_BASE          https://merchant.revolut.com/api
//                            or sandbox endpoint for preview/test runs
//   REVOLUT_WEBHOOK_SECRET    populated post-registration via register-revolut-webhook.ts
//   NEXT_PUBLIC_REVOLUT_MODE  prod | sandbox — must match the API key/env used

import crypto from "node:crypto";

// Revolut's API path versioning is inconsistent across endpoints:
//   POST /api/orders             — versioned via `Revolut-Api-Version` header
//   GET  /api/orders/{id}        — same
//   POST /api/1.0/webhooks       — versioned in the path (no header)
//   GET  /api/1.0/webhooks       — same
//
// Each call passes its own absolute path here. Don't pre-pend a version.
function url(path: string): string {
  const root = process.env.REVOLUT_API_BASE || "https://merchant.revolut.com/api";
  return `${root.replace(/\/$/, "")}${path}`;
}

function authHeaders(): Record<string, string> {
  const key = process.env.REVOLUT_SECRET_KEY;
  if (!key) {
    throw new Error("REVOLUT_SECRET_KEY is not set");
  }
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    "Revolut-Api-Version": "2024-09-01",
    Accept: "application/json",
  };
}

export interface RevolutLineItem {
  name: string;
  type?: "physical" | "service";
  quantity?: { value: number; unit?: "piece" };
  unit_price_amount?: number; // minor units (e.g., cents)
  total_amount?: number;
  external_id?: string;
  image_urls?: string[];
}

export interface CreateOrderInput {
  amount: number; // minor units (cents/pence)
  currency: string; // ISO 4217, e.g., "USD"
  description?: string;
  customer_email?: string;
  customer_full_name?: string;
  external_id?: string;
  redirect_url?: string;
  metadata?: Record<string, string>;
  line_items?: RevolutLineItem[];
  capture_mode?: "automatic" | "manual";
}

export interface RevolutOrder {
  id: string;
  token: string;
  checkout_url: string;
  type: string;
  state:
    | "PENDING"
    | "PROCESSING"
    | "AUTHORISED"
    | "COMPLETED"
    | "CANCELLED"
    | "FAILED";
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  outstanding_amount?: number;
  metadata?: Record<string, string>;
  customer?: {
    email?: string;
    full_name?: string;
    phone?: string;
  };
  shipping_address?: {
    street_line_1?: string;
    street_line_2?: string;
    region?: string;
    city?: string;
    country_code?: string;
    postcode?: string;
  };
}

export async function createOrder(input: CreateOrderInput): Promise<RevolutOrder> {
  const res = await fetch(url("/orders"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      `Revolut createOrder ${res.status}: ${JSON.stringify(json)}`,
    );
  }
  return json as RevolutOrder;
}

export async function getOrder(orderId: string): Promise<RevolutOrder> {
  const res = await fetch(url(`/orders/${orderId}`), {
    method: "GET",
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Revolut getOrder ${res.status}: ${JSON.stringify(json)}`);
  }
  return json as RevolutOrder;
}

// === Webhook lifecycle (one-off, run after deploy via scripts/register-revolut-webhook.ts) ===

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  signing_secret: string;
}

export async function registerWebhook(
  webhookUrl: string,
  events: string[],
): Promise<WebhookSubscription> {
  const res = await fetch(url("/1.0/webhooks"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ url: webhookUrl, events }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      `Revolut registerWebhook ${res.status}: ${JSON.stringify(json)}`,
    );
  }
  return json as WebhookSubscription;
}

export async function listWebhooks(): Promise<WebhookSubscription[]> {
  const res = await fetch(url("/1.0/webhooks"), {
    method: "GET",
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      `Revolut listWebhooks ${res.status}: ${JSON.stringify(json)}`,
    );
  }
  return json as WebhookSubscription[];
}

// === Webhook signature verification ===
//
// Revolut signs each webhook with HMAC-SHA256 over the string
//   v1.{timestamp}.{raw_body}
// using the signing_secret returned at registration. The signature is sent
// as the Revolut-Signature header in the form `v1=<hex>` (may contain
// multiple comma-separated entries for key rotation).
//
// Tolerance window: 5 minutes — reject older deliveries (replay defence).

const REPLAY_TOLERANCE_SECONDS = 5 * 60;

export function verifyWebhookSignature(args: {
  rawBody: string;
  signatureHeader: string | null;
  timestampHeader: string | null;
  secret: string;
}): { valid: boolean; reason?: string } {
  const { rawBody, signatureHeader, timestampHeader, secret } = args;
  if (!signatureHeader) return { valid: false, reason: "missing signature header" };
  if (!timestampHeader) return { valid: false, reason: "missing timestamp header" };
  if (!secret) return { valid: false, reason: "missing webhook secret" };

  const tsMs = parseInt(timestampHeader, 10);
  if (!Number.isFinite(tsMs)) {
    return { valid: false, reason: "invalid timestamp" };
  }
  const ageSec = (Date.now() - tsMs) / 1000;
  if (Math.abs(ageSec) > REPLAY_TOLERANCE_SECONDS) {
    return { valid: false, reason: `timestamp outside ${REPLAY_TOLERANCE_SECONDS}s window` };
  }

  const payload = `v1.${timestampHeader}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Signature header may carry multiple `v1=<hex>` entries — accept any match
  const candidates = signatureHeader
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.startsWith("v1="))
    .map((s) => s.slice(3));

  if (candidates.length === 0) {
    return { valid: false, reason: "no v1 signature entries" };
  }

  const expectedBuf = Buffer.from(expected, "hex");
  const match = candidates.some((c) => {
    try {
      const cBuf = Buffer.from(c, "hex");
      return (
        cBuf.length === expectedBuf.length &&
        crypto.timingSafeEqual(cBuf, expectedBuf)
      );
    } catch {
      return false;
    }
  });

  return match ? { valid: true } : { valid: false, reason: "signature mismatch" };
}
