// Server-side price formatter that mirrors useCurrency().format() for client
// components. Resolves the request's currency + daily FX rates, returns a
// `format` function bound to them. Use once per server component render.
//
// Example:
//   const { format } = await getServerPriceFormatter();
//   <div>{format(product.price)}</div>

import { getRequestCurrency } from "@/lib/i18n-server";
import { getRates, convertUSDCents } from "@/lib/fx";
import { formatPrice } from "@/lib/utils";
import type { Currency } from "@/lib/currency";

export async function getServerPriceFormatter(): Promise<{
  currency: Currency;
  format: (usdCents: number) => string;
}> {
  const currency = await getRequestCurrency();
  const rates = await getRates();
  return {
    currency,
    format: (usdCents: number) =>
      formatPrice(convertUSDCents(usdCents, currency, rates), currency),
  };
}
