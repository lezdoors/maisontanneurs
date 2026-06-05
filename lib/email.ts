import { Resend } from "resend";
import { formatPrice } from "./utils";
import { isCurrency, type Currency } from "./currency";

function asCurrency(value: string | undefined): Currency {
  return isCurrency(value) ? value : "USD";
}

// Lazy-init: don't instantiate Resend at module load (would crash builds when RESEND_API_KEY isn't set,
// e.g. during Vercel page-data collection). Only construct it when actually sending.
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set — emails cannot be sent. Configure in Vercel env vars.");
  }
  return new Resend(key);
}

const FROM_EMAIL = "Maison Tanneurs <orders@maisontanneurs.com>";
const REPLY_TO = "hello@maisontanneurs.com";
const ADMIN_EMAIL = "haddaoui.ops@outlook.com";

interface OrderEmailData {
  to: string;
  orderNumber: string;
  customerName: string;
  items: { title: string; price: number; quantity: number }[];
  total: number;
  currency?: string;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const cur = asCurrency(data.currency);
  const itemsHtml = data.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e4dcc8;font-family:Georgia,serif;">${i.title}</td><td style="padding:8px 0;border-bottom:1px solid #e4dcc8;text-align:center;font-family:monospace;font-size:12px;">${i.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #e4dcc8;text-align:right;font-family:Georgia,serif;font-style:italic;">${formatPrice(i.price * i.quantity, cur)}</td></tr>`,
    )
    .join("");

  await getResend().emails.send({
    from: FROM_EMAIL,
    replyTo: REPLY_TO,
    to: data.to,
    subject: `Order Confirmed — ${data.orderNumber}`,
    html: `
      <div style="max-width:600px;margin:0 auto;background:#f5efe3;padding:48px 32px;font-family:'Inter Tight',Helvetica,Arial,sans-serif;color:#1f1b16;">
        <div style="text-align:center;margin-bottom:40px;">
          <div style="font-family:monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#7a6f5c;margin-bottom:8px;">Order Confirmed</div>
          <div style="font-family:Georgia,serif;font-size:36px;letter-spacing:-0.01em;line-height:1.1;">MAISON TANNEURS</div>
        </div>
        <p style="font-family:Georgia,serif;font-style:italic;font-size:18px;line-height:1.5;color:#3a332a;">Dear ${data.customerName},</p>
        <p style="font-family:Georgia,serif;font-style:italic;font-size:16px;line-height:1.6;color:#3a332a;">Thank you for your order. Each piece is handcrafted by our master artisans in Marrakech and will be carefully prepared for shipping.</p>
        <div style="margin:32px 0;padding:24px 0;border-top:1px solid #d9cfbb;">
          <div style="font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7a6f5c;margin-bottom:16px;">Order ${data.orderNumber}</div>
          <table style="width:100%;border-collapse:collapse;">
            <thead><tr><th style="text-align:left;font-family:monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#7a6f5c;padding-bottom:8px;">Item</th><th style="text-align:center;font-family:monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#7a6f5c;padding-bottom:8px;">Qty</th><th style="text-align:right;font-family:monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#7a6f5c;padding-bottom:8px;">Total</th></tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="display:flex;justify-content:space-between;margin-top:16px;padding-top:16px;">
            <span style="font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7a6f5c;">Total</span>
            <span style="font-family:Georgia,serif;font-size:22px;font-style:italic;">${formatPrice(data.total, cur)}</span>
          </div>
        </div>
        <div style="background:#ebe3d1;padding:24px;margin:32px 0;">
          <div style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#7a6f5c;margin-bottom:8px;">Shipping</div>
          <p style="font-family:Georgia,serif;font-style:italic;font-size:14px;color:#3a332a;margin:0;line-height:1.6;">Your pieces are finished and prepared in Marrakech, then shipped worldwide via DHL Express. Most orders arrive in 5 to 10 business days. You will receive a tracking number once your parcel leaves the atelier.</p>
        </div>
        <div style="text-align:center;margin-top:40px;padding-top:24px;border-top:1px solid #d9cfbb;">
          <div style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#7a6f5c;">Maison Tanneurs · Marrakech</div>
        </div>
      </div>
    `,
  });
}

interface AdminNotificationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: {
    title: string;
    price: number;
    quantity: number;
    product_id?: string;
  }[];
  total: number;
  currency?: string;
  shippingAddress: Record<string, any>;
}

export async function sendAdminNotification(data: AdminNotificationData) {
  const cur = asCurrency(data.currency);
  const itemsList = data.items
    .map(
      (i) =>
        `- ${i.title} (${i.quantity}x) — ${formatPrice(i.price * i.quantity, cur)}`,
    )
    .join("\n");
  const addr = data.shippingAddress;
  const addressStr = [
    addr.line1,
    addr.line2,
    `${addr.city}, ${addr.state} ${addr.postal_code}`,
    addr.country,
  ]
    .filter(Boolean)
    .join("\n");

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Maison Tanneurs Order · ${data.orderNumber} · ${formatPrice(data.total, cur)}`,
    html: `
      <div style="font-family:monospace;font-size:13px;line-height:1.8;color:#1f1b16;max-width:600px;">
        <h2 style="font-family:Georgia,serif;font-size:24px;font-weight:normal;">New Order: ${data.orderNumber}</h2>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Total:</strong> ${formatPrice(data.total, cur)}</p>
        <p><strong>Items:</strong></p>
        <pre style="background:#f5efe3;padding:16px;white-space:pre-wrap;">${itemsList}</pre>
        <p><strong>Ship to:</strong></p>
        <pre style="background:#f5efe3;padding:16px;white-space:pre-wrap;">${addressStr}</pre>
        <p style="color:#7a6f5c;font-size:11px;margin-top:24px;">Coordinate with craftsmen for fulfillment.</p>
      </div>
    `,
  });
}

interface ShippingNotificationData {
  to: string;
  orderNumber: string;
  customerName: string;
  trackingNumber: string;
  carrier?: string;
}

export async function sendShippingNotification(data: ShippingNotificationData) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    replyTo: REPLY_TO,
    to: data.to,
    subject: `Your Maison Tanneurs Order Has Shipped · ${data.orderNumber}`,
    html: `
      <div style="max-width:600px;margin:0 auto;background:#f5efe3;padding:48px 32px;font-family:'Inter Tight',Helvetica,Arial,sans-serif;color:#1f1b16;">
        <div style="text-align:center;margin-bottom:40px;">
          <div style="font-family:Georgia,serif;font-size:36px;letter-spacing:-0.01em;">MAISON TANNEURS</div>
        </div>
        <p style="font-family:Georgia,serif;font-style:italic;font-size:18px;color:#3a332a;">Dear ${data.customerName},</p>
        <p style="font-size:15px;line-height:1.7;color:#3a332a;">Your order ${data.orderNumber} has been shipped from Marrakech.</p>
        <div style="background:#ebe3d1;padding:24px;margin:24px 0;">
          <div style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#7a6f5c;margin-bottom:8px;">Tracking</div>
          <p style="font-family:monospace;font-size:16px;margin:0;">${data.trackingNumber}</p>
          ${data.carrier ? `<p style="font-family:monospace;font-size:12px;color:#7a6f5c;margin:4px 0 0;">via ${data.carrier}</p>` : ""}
        </div>
        <div style="text-align:center;margin-top:40px;padding-top:24px;border-top:1px solid #d9cfbb;">
          <div style="font-family:monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#7a6f5c;">Maison Tanneurs · Marrakech</div>
        </div>
      </div>
    `,
  });
}
