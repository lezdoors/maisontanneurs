import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import CookieBanner from "@/components/store/CookieBanner";
import ConsentedClarity from "@/components/store/ConsentedClarity";
import MetaPixel from "@/components/store/MetaPixel";
import GA4 from "@/components/store/GA4";

// Switzer is the only typeface in the site. Variable file covers 100→900
// in both upright and italic. License: FFL (commercial OK) — see
// public/fonts/switzer/LICENSE.txt.
const switzer = localFont({
  src: [
    {
      path: "../public/fonts/switzer/Switzer-Variable.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../public/fonts/switzer/Switzer-VariableItalic.woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maison Tanneurs — Hand-stitched leather from Marrakech",
    template: "%s | Maison Tanneurs",
  },
  description:
    "Hand-stitched leather wearables, sourced direct from a Marrakech atelier. Full-grain leather, editorial silhouettes, shipped worldwide in 3–5 days.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.maisontanneurs.com",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Maison Tanneurs",
    title: "Maison Tanneurs — Hand-stitched leather from Marrakech",
    description:
      "Hand-stitched leather wearables, sourced direct from a Marrakech atelier. Full-grain leather, editorial silhouettes, shipped worldwide in 3–5 days.",
    images: [
      {
        url: "/hero/hero-leather-campaign.webp",
        width: 2400,
        height: 1350,
        alt: "Maison Tanneurs — cognac leather duffle in a Marrakech atelier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Tanneurs",
    description:
      "Hand-stitched leather wearables, sourced direct from a Marrakech atelier. Full-grain leather, editorial silhouettes, shipped worldwide in 3–5 days.",
    images: ["/hero/hero-leather-campaign.webp"],
  },
  alternates: {
    canonical: "/",
  },
};

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Maison Tanneurs",
  url: "https://www.maisontanneurs.com",
  logo: "https://www.maisontanneurs.com/icon.svg",
  description:
    "Hand-stitched leather wearables sourced direct from a Marrakech atelier. Full-grain leather, editorial silhouettes.",
  email: "hello@maisontanneurs.com",
};

const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "wrj9fbl8n9";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={switzer.variable}>
      <body>
        <Script
          id="organization-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(ORGANIZATION_LD)}
        </Script>
        {/* Tracking now gated behind cookie consent — Clarity + Meta Pixel only
            fire after the user accepts in CookieBanner. Replaces the previous
            unconditional Clarity script. */}
        <ConsentedClarity />
        <MetaPixel />
        <GA4 />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
