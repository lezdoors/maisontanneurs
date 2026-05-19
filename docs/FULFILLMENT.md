# Kechken · Fulfillment Architecture

## Model: Print-to-Order

Every Kechken piece is printed **when** the order arrives. No advance inventory. No overstock destroyed. The dropshipper (Printful, locked) holds:

- The blank garments (Bella+Canvas 3001 heavyweight tee, Lane Seven LS14001 hoodie, AS Colour 1124 cap)
- Our brand assets (wordmark for packing slip + care label)
- Our artwork files (each Drop 01 SKU's painterly graphic, print-ready)
- Our product descriptions, care instructions, returns address
- Our packing slip template + thank-you card

When a customer places an order on kechken.com:
1. Stripe captures payment via the on-domain Payment Element
2. The Stripe webhook fires `payment_intent.succeeded`
3. Webhook handler calls Printful API to create the order with the customer's shipping address + SKU + variant
4. Printful prints, finishes, and ships within 3–5 business days
5. Tracking link emails to the customer automatically (Resend)

## Brand promise on the storefront

| Where shown | Copy |
|---|---|
| Homepage hero subtitle | "Print-to-order · Ships in 3–5 days · No overstock" |
| Products page meta | "Hand-painted figurative graphics on heavyweight cotton. Each drop is a small run, printed when you order." |
| PDP next to price | "Made when you order. Ships in 3–5 days." |
| Footer hairline strip | "Rooted in the Maghreb · Made for now · Print-to-order" |
| Cart drawer / checkout | "Your piece is printed when you order. Ships in 3–5 business days." |
| Post-purchase email | "Your piece enters production today. Tracking arrives by email in 3–5 business days." |

## What the dropshipper handles vs what we hold

| Held by Printful | Held by us |
|---|---|
| Garment blanks (inventory of un-printed cotton) | Customer relationships |
| Print equipment + ink + labor | Brand identity + artwork |
| Shipping warehouses (US + EU) | Storefront + payments |
| Returns intake address | Returns approval + customer service |
| Generic packing materials | Custom packing slip template (rendered with our wordmark) |

## Printful setup checklist (Phase 1, when account opens)

- [ ] Account created under Akal Ltd entity (or whichever entity locks)
- [ ] Brand logo uploaded — render from `/brand/wordmark?w=600&h=200&subtitle=true` or upload PNG
- [ ] Custom packing slip template configured with Kechken wordmark + thank-you message
- [ ] Returns address registered (current placeholder: needs decision in Phase 0)
- [ ] Drop 01 artwork files uploaded as print-ready 300 DPI PNGs:
  - `atlas-caravan-tee` graphic (chest, full-front)
  - `onyx-caravan-hoodie` graphic (back panel, full-bleed)
  - `atlas-lion-cap` embroidery (front panel, brass-gold thread)
- [ ] SKU variants configured (size S–XXL for tee + hoodie, one-size cap)
- [ ] Pricing set with our margin baked in (target: 40% gross margin after Printful fulfillment + shipping)
- [ ] US warehouse selected as primary (closest fulfillment to NY/NJ/MA diaspora cluster)
- [ ] Stripe webhook → Printful API integration wired in `app/api/webhooks/stripe/route.ts`
- [ ] Customer email templates synced (Resend ↔ Printful tracking events)

## Returns policy (drafted)

- Standard 30-day returns for unworn pieces
- Customer pays return shipping (industry standard)
- Refund processed when Printful confirms receipt
- Custom-graphic SKUs are still returnable (every Drop 01 piece is the same standard SKU regardless of who ordered it — not a one-off bespoke)

## What this means for the storefront copy

**No more atelier theater.** Kechken is not a Marrakech workshop with maâlems. Kechken is a US-anchored brand whose visual register is rooted in Morocco, printed on-demand by Printful's US/EU warehouses. The legal pages, About page, and PDPs need rewrites to reflect this reality — drafted in Phase 1 by Ryan.
