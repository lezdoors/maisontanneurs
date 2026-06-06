import * as dotenv from "dotenv";

import { listWebhooks } from "@/lib/revolut";

dotenv.config({ path: ".env.local" });

const TARGET_WEBHOOK_URL = "https://www.maisontanneurs.com/api/webhooks/revolut";
const REQUIRED_EVENTS = ["ORDER_COMPLETED"];

type Check = {
  name: string;
  ok: boolean;
  required: boolean;
  detail: string;
};

function value(name: string): string {
  return process.env[name] || "";
}

function mask(v: string): string {
  if (!v) return "missing";
  if (v.length <= 10) return `${v.slice(0, 2)}...${v.slice(-2)}`;
  return `${v.slice(0, 6)}...${v.slice(-4)}`;
}

function checkEnv(
  name: string,
  opts: { startsWith?: string; equals?: string; required?: boolean } = {},
): Check {
  const v = value(name);
  const required = opts.required ?? true;
  let ok = required ? v.length > 0 : true;
  if (ok && opts.startsWith) ok = v.startsWith(opts.startsWith);
  if (ok && opts.equals) ok = v === opts.equals;

  const requirements = [
    required ? "required" : "optional",
    opts.startsWith ? `prefix ${opts.startsWith}` : null,
    opts.equals ? `equals ${opts.equals}` : null,
  ].filter(Boolean);

  return {
    name,
    ok,
    required,
    detail: `${requirements.join(", ")}; value=${mask(v)}; length=${v.length}`,
  };
}

function printCheck(check: Check) {
  const status = check.ok ? "PASS" : check.required ? "FAIL" : "WARN";
  console.log(`${status} ${check.name}: ${check.detail}`);
}

async function main() {
  const checks: Check[] = [
    checkEnv("NEXT_PUBLIC_SITE_URL", { equals: "https://www.maisontanneurs.com" }),
    checkEnv("NEXT_PUBLIC_REVOLUT_PUBLIC_KEY", { startsWith: "pk_" }),
    checkEnv("REVOLUT_SECRET_KEY", { startsWith: "sk_" }),
    checkEnv("REVOLUT_API_BASE", { equals: "https://merchant.revolut.com/api" }),
    checkEnv("REVOLUT_WEBHOOK_SECRET", { required: false }),
    checkEnv("NEXT_PUBLIC_SUPABASE_URL", { startsWith: "https://" }),
    checkEnv("SUPABASE_SERVICE_ROLE_KEY"),
    checkEnv("META_PIXEL_ID", { equals: "26891834623830253" }),
    checkEnv("NEXT_PUBLIC_META_PIXEL_ID", { equals: "26891834623830253" }),
    checkEnv("META_CAPI_ACCESS_TOKEN"),
    checkEnv("RESEND_API_KEY", { startsWith: "re_", required: false }),
  ];

  for (const check of checks) printCheck(check);

  const canQueryWebhooks =
    checks.find((c) => c.name === "REVOLUT_SECRET_KEY")?.ok &&
    checks.find((c) => c.name === "REVOLUT_API_BASE")?.ok;

  if (!canQueryWebhooks) {
    printCheck({
      name: "REVOLUT_WEBHOOK_REGISTRATION",
      ok: true,
      required: false,
      detail: "skipped because REVOLUT_SECRET_KEY or REVOLUT_API_BASE is not available locally",
    });
    process.exit(checks.some((c) => c.required && !c.ok) ? 1 : 0);
  }

  try {
    const webhooks = await listWebhooks();
    const match = webhooks.find((w) => w.url === TARGET_WEBHOOK_URL);
    const eventsOk = Boolean(
      match && REQUIRED_EVENTS.every((event) => match.events.includes(event)),
    );
    const secretMatchesEnv = Boolean(
      match?.signing_secret && match.signing_secret === value("REVOLUT_WEBHOOK_SECRET"),
    );

    printCheck({
      name: "REVOLUT_WEBHOOK_REGISTRATION",
      ok: Boolean(match) && eventsOk && secretMatchesEnv,
      required: false,
      detail: match
        ? `id=${match.id}; url=${match.url}; events=${match.events.join(",")}; signing_secret=${mask(
            match.signing_secret,
          )}; matches_env=${secretMatchesEnv}`
        : `missing target webhook ${TARGET_WEBHOOK_URL}`,
    });

    if (checks.some((c) => c.required && !c.ok)) {
      process.exit(1);
    }
  } catch (err) {
    printCheck({
      name: "REVOLUT_WEBHOOK_REGISTRATION",
      ok: false,
      required: false,
      detail: err instanceof Error ? err.message : String(err),
    });
    process.exit(checks.some((c) => c.required && !c.ok) ? 1 : 0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
