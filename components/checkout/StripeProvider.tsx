"use client";

import { useEffect, useState } from "react";
import { CheckoutElementsProvider } from "@stripe/react-stripe-js/checkout";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import type { ReactNode } from "react";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise: Promise<Stripe | null> = publishableKey
  ? loadStripe(publishableKey)
  : Promise.resolve(null);

export default function StripeProvider({
  clientSecret,
  children,
}: {
  clientSecret: string | null;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready || !clientSecret || !publishableKey) {
    return <>{children}</>;
  }

  return (
    <CheckoutElementsProvider
      stripe={stripePromise}
      options={{
        clientSecret,
        elementsOptions: {
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#2C2C2C",
              colorBackground: "#FFFFFF",
              colorText: "#2C2C2C",
              colorTextSecondary: "#8a857c",
              colorTextPlaceholder: "#a8a39a",
              colorDanger: "#9B2C2C",
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, "Inter Tight", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSizeBase: "16px",
              fontWeightNormal: "400",
              fontWeightMedium: "500",
              spacingUnit: "4px",
              borderRadius: "0px",
              focusBoxShadow: "0 0 0 1px #2C2C2C",
              focusOutline: "none",
            },
            rules: {
              ".Input": {
                border: "1px solid #d6d3cb",
                padding: "14px 14px",
                boxShadow: "none",
                transition: "border-color 120ms ease",
              },
              ".Input:focus": {
                border: "1px solid #2C2C2C",
                boxShadow: "none",
              },
              ".Input--invalid": {
                border: "1px solid #9B2C2C",
              },
              ".Label": {
                fontSize: "13px",
                fontWeight: "500",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#5a554c",
                marginBottom: "10px",
              },
              ".Tab": {
                border: "1px solid #d6d3cb",
                borderRadius: "0",
                padding: "12px 16px",
                boxShadow: "none",
              },
              ".Tab:hover": {
                border: "1px solid #2C2C2C",
              },
              ".Tab--selected": {
                border: "1px solid #2C2C2C",
                backgroundColor: "#FAF8F5",
              },
              ".TabIcon--selected": {
                fill: "#2C2C2C",
              },
              ".Error": {
                fontSize: "13px",
                fontFamily:
                  "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
                fontStyle: "italic",
                color: "#9B2C2C",
                marginTop: "6px",
              },
            },
          },
          fonts: [
            {
              cssSrc:
                "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap",
            },
          ],
        },
      }}
    >
      {children}
    </CheckoutElementsProvider>
  );
}
