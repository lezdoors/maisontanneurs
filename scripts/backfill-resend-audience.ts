// One-shot backfill: push existing Supabase newsletter_subscribers into a Resend Audience.
// Use after creating the Audience in Resend Dashboard and setting RESEND_AUDIENCE_ID env.
//
// Run: pnpm tsx scripts/backfill-resend-audience.ts
// Requires: RESEND_API_KEY, RESEND_AUDIENCE_ID, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!RESEND_API_KEY || !AUDIENCE_ID || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env. Required: RESEND_API_KEY, RESEND_AUDIENCE_ID, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const resend = new Resend(RESEND_API_KEY);

async function main() {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, consent_given, unsubscribed_at")
    .is("unsubscribed_at", null)
    .eq("consent_given", true);

  if (error) {
    console.error("Supabase error:", error.message);
    process.exit(1);
  }
  if (!data || data.length === 0) {
    console.log("No active subscribers to backfill.");
    return;
  }

  console.log(`Backfilling ${data.length} subscribers to Resend audience ${AUDIENCE_ID}…`);
  let added = 0;
  let skipped = 0;
  const audienceId: string = AUDIENCE_ID as string;
  for (const row of data) {
    try {
      await resend.contacts.create({
        email: row.email,
        audienceId,
        unsubscribed: false,
      });
      added++;
    } catch (e) {
      // 409 = already in audience — fine
      skipped++;
      const msg = e instanceof Error ? e.message : String(e);
      if (!msg.includes("already")) {
        console.warn(`  ${row.email}: ${msg.slice(0, 80)}`);
      }
    }
  }
  console.log(`Done. added=${added} skipped=${skipped}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
