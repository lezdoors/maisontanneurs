// Sales tax for checkout.
//   USA  → state base rate from the shipping address (matches the existing
//          ops-alert format, e.g. "CA 7.25%"). For full county/city/district
//          accuracy, swap computeUsTax for the Stripe Tax Calculation API.
//   Rest → flat 20% (VAT-style), per Ryan's rule (2026-06-29).
// Rate is a percentage, so it applies in whatever charge currency we use.

export type TaxResult = {
  taxMinor: number; // tax in charge-currency minor units (cents)
  ratePct: number; // e.g. 7.25 or 20
  label: string; // e.g. "CA 7.25%" or "FR 20%"
  region: "US" | "INTL";
};

// US state + DC base sales-tax rates (2026). No statewide sales tax: AK, DE, MT, NH, OR.
const US_STATE_RATE: Record<string, number> = {
  AL: 4, AK: 0, AZ: 5.6, AR: 6.5, CA: 7.25, CO: 2.9, CT: 6.35, DE: 0, DC: 6,
  FL: 6, GA: 4, HI: 4, ID: 6, IL: 6.25, IN: 7, IA: 6, KS: 6.5, KY: 6, LA: 4.45,
  ME: 5.5, MD: 6, MA: 6.25, MI: 6, MN: 6.875, MS: 7, MO: 4.225, MT: 0, NE: 5.5,
  NV: 6.85, NH: 0, NJ: 6.625, NM: 4.875, NY: 4, NC: 4.75, ND: 5, OH: 5.75,
  OK: 4.5, OR: 0, PA: 6, RI: 7, SC: 6, SD: 4.2, TN: 7, TX: 6.25, UT: 6.1,
  VT: 6, VA: 5.3, WA: 6.5, WV: 6, WI: 5, WY: 4,
};

const STATE_NAME_TO_ABBR: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", "district of columbia": "DC",
  florida: "FL", georgia: "GA", hawaii: "HI", idaho: "ID", illinois: "IL",
  indiana: "IN", iowa: "IA", kansas: "KS", kentucky: "KY", louisiana: "LA",
  maine: "ME", maryland: "MD", massachusetts: "MA", michigan: "MI",
  minnesota: "MN", mississippi: "MS", missouri: "MO", montana: "MT",
  nebraska: "NE", nevada: "NV", "new hampshire": "NH", "new jersey": "NJ",
  "new mexico": "NM", "new york": "NY", "north carolina": "NC",
  "north dakota": "ND", ohio: "OH", oklahoma: "OK", oregon: "OR",
  pennsylvania: "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT",
  virginia: "VA", washington: "WA", "west virginia": "WV", wisconsin: "WI",
  wyoming: "WY",
};

function normalizeState(raw?: string): string {
  const s = String(raw || "").trim();
  if (!s) return "";
  if (s.length === 2) return s.toUpperCase();
  return STATE_NAME_TO_ABBR[s.toLowerCase()] || s.toUpperCase();
}

function isUS(country?: string): boolean {
  const c = String(country || "").trim().toUpperCase();
  return c === "US" || c === "USA" || c === "UNITED STATES";
}

export function computeTax(
  addr: { country?: string; state?: string },
  taxableMinor: number,
): TaxResult {
  if (taxableMinor <= 0) {
    return { taxMinor: 0, ratePct: 0, label: "", region: isUS(addr.country) ? "US" : "INTL" };
  }
  if (isUS(addr.country)) {
    const st = normalizeState(addr.state);
    const ratePct = US_STATE_RATE[st] ?? 0;
    const taxMinor = Math.round((taxableMinor * ratePct) / 100);
    return { taxMinor, ratePct, label: st ? `${st} ${ratePct}%` : `US ${ratePct}%`, region: "US" };
  }
  const ratePct = 20;
  const cc = String(addr.country || "").trim().toUpperCase();
  const taxMinor = Math.round((taxableMinor * ratePct) / 100);
  return { taxMinor, ratePct, label: `${cc || "INTL"} ${ratePct}%`, region: "INTL" };
}
