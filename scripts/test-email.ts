// One-shot test that fires a real Resend send through the production config.
// Verifies: RESEND_API_KEY env is set, FROM domain is verified, message reaches nitra@outlook.com.
// Run: pnpm tsx scripts/test-email.ts

import { Resend } from "resend";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error("RESEND_API_KEY not set. Add to .env.local for local run, or to Vercel env for production.");
  process.exit(1);
}

const resend = new Resend(key);

async function main() {
  const { data, error } = await resend.emails.send({
    from: "Nitra <orders@nitra.com>",
    to: "nitra@outlook.com",
    subject: "Resend sanity test — production config live",
    html: `
      <div style="font-family:Georgia,serif;padding:24px;max-width:560px;color:#1f1b16;">
        <h2 style="font-weight:normal;">Resend setup complete</h2>
        <p>If you're reading this in <code>nitra@outlook.com</code>, the production email pipeline is verified:</p>
        <ul style="line-height:1.8;">
          <li>Domain <code>nitra.com</code> verified on Resend (DKIM + SPF)</li>
          <li>FROM <code>orders@nitra.com</code> resolving</li>
          <li>API key <code>RESEND_API_KEY</code> active</li>
          <li>Inbound to <code>nitra@outlook.com</code> reaching your read inbox</li>
        </ul>
        <p style="font-size:11px;color:#7a6f5c;margin-top:24px;">Fired from <code>scripts/test-email.ts</code> · ${new Date().toISOString()}</p>
      </div>
    `,
  });
  if (error) {
    console.error("Resend rejected:", error);
    process.exit(1);
  }
  console.log("Sent. Resend message id:", data?.id);
}

main().catch((e) => {
  console.error("Crashed:", e);
  process.exit(2);
});
