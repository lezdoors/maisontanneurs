import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM_EMAIL = "Maison Tanneurs <orders@maisontanneurs.com>";
const SUPPORT_EMAIL = "hello@maisontanneurs.com";

function clean(value: unknown, max = 1000) {
  return String(value || "").trim().slice(0, max);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (clean(body.company, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 180).toLowerCase();
  const subject = clean(body.subject, 120);
  const message = clean(body.message, 4000);

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Please complete every field." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: "Please add a little more detail." }, { status: 400 });
  }

  const resend = getResend();
  if (!resend) {
    return NextResponse.json(
      { error: "Contact form is not available right now. Please email hello@maisontanneurs.com." },
      { status: 503 },
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      replyTo: email,
      to: SUPPORT_EMAIL,
      subject: `Maison Tanneurs contact: ${subject}`,
      html: `
        <div style="font-family:Georgia,serif;color:#1f1b16;line-height:1.7;max-width:640px;">
          <p style="font-family:monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#7a6f5c;">Website contact form</p>
          <h2 style="font-weight:normal;font-size:28px;margin:0 0 20px;">${safeSubject}</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <div style="border-top:1px solid #e4dcc8;margin-top:24px;padding-top:20px;">${safeMessage}</div>
        </div>
      `,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      replyTo: SUPPORT_EMAIL,
      to: email,
      subject: "We received your Maison Tanneurs message",
      html: `
        <div style="font-family:Georgia,serif;color:#1f1b16;line-height:1.7;max-width:560px;">
          <h2 style="font-weight:normal;font-size:28px;margin:0 0 20px;">Message received.</h2>
          <p>Thank you for writing to Maison Tanneurs. A person from the atelier will reply within one working day.</p>
          <p style="margin-top:28px;">The atelier<br />Marrakech</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Contact form email error:", err);
    return NextResponse.json(
      { error: "Message could not be sent. Please email hello@maisontanneurs.com." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
