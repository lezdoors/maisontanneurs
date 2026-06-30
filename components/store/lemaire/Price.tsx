"use client";

import { useCurrency } from "@/components/store/CurrencyProvider";

export default function Price({
  cents,
  className,
}: {
  cents: number;
  className?: string;
}) {
  const { format } = useCurrency();
  return <span className={className}>{format(cents)}</span>;
}
