import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role for the insert so RLS bypass is clean (the anon-insert
// policy works too, but service role gives us upsert + clearer error messages).
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: { email?: string; consent?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const consent = body.consent === true;

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Please accept the newsletter terms to continue." },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;
  const userAgent = request.headers.get("user-agent") || null;

  // Upsert — re-subscription (after unsubscribe) clears the unsubscribed_at flag.
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      {
        email,
        source: "website-footer",
        ip_address: ip,
        user_agent: userAgent,
        consent_given: true,
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    );

  if (error) {
    console.error("Newsletter subscribe error:", error.message);
    return NextResponse.json({ error: "Could not subscribe right now. Please try again." }, { status: 500 });
  }

  // Best-effort Resend operations — both non-blocking on failure.
  try {
    const { Resend } = await import("resend");
    const key = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (key) {
      const resend = new Resend(key);

      // 1) Add to Resend Audience so they receive marketing Broadcasts.
      //    Skipped if RESEND_AUDIENCE_ID isn't set yet (no-op until configured).
      //    Uses Resend's LegacyCreateContactOptions (audienceId) — still active
      //    on the dashboard side even though the SDK marks it deprecated in
      //    favor of segments.
      if (audienceId) {
        try {
          await resend.contacts.create({
            email,
            audienceId: audienceId as string,
            unsubscribed: false,
          });
        } catch (contactErr) {
          // Resend returns 409 if the contact already exists in the audience —
          // that's a fine no-op for re-subscribers. Log other errors.
          console.warn("Resend audience add (non-blocking):", contactErr);
        }
      }

      // 2) Send the welcome email transactionally.
      //    Marketing FROM (newsletter@) — kept distinct from transactional
      //    orders@ so deliverability metrics for promo vs receipt don't mix.
      //    Replies land at atelier@ — the inbox a human actually monitors.
      await resend.emails.send({
        from: "Nitra <newsletter@nitra.com>",
        replyTo: "hello@nitra.com",
        to: email,
        subject: "Welcome to the Nitra newsletter",
        html: `
          <div style="font-family:Georgia,serif;padding:32px;max-width:560px;color:#1f1b16;line-height:1.7;">
            <h2 style="font-weight:normal;font-size:28px;letter-spacing:-0.01em;margin:0 0 24px;">Welcome.</h2>
            <p style="font-size:15px;">You'll receive our seasonal edits and atelier stories — never more than once or twice a month. Quietly.</p>
            <p style="font-size:15px;">Until then,<br/>The atelier · Marrakech</p>
            <p style="font-size:11px;color:#7a6f5c;margin-top:32px;letter-spacing:0.05em;">To unsubscribe at any time, simply reply with "unsubscribe".</p>
          </div>
        `,
      });
    }
  } catch (e) {
    console.warn("Resend newsletter ops failed (non-blocking):", e);
  }

  return NextResponse.json({ ok: true });
}
