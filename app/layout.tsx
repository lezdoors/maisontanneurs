import type { Metadata } from "next";
import Script from "next/script";
import { JetBrains_Mono, Noto_Naskh_Arabic, Playfair_Display } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/store/CookieBanner";
import ConsentedClarity from "@/components/store/ConsentedClarity";
import MetaPixel from "@/components/store/MetaPixel";
import GA4 from "@/components/store/GA4";
import { getRequestCurrency, getRequestDir, getRequestLocale } from "@/lib/i18n-server";
import { getRates } from "@/lib/fx";
import { CurrencyProvider } from "@/components/store/CurrencyProvider";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Kept for selective display use (section headings, Volume/Dossier framing)
// even though the /luxury preview is gone — see Hero / ObjectOfTheEdition.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500"],
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Maison Tanneurs — Hand-stitched leather from Marrakech",
    template: "%s | Maison Tanneurs",
  },
  description:
    "Hand-stitched leather goods, sourced direct from a Marrakech atelier. Full-grain leather, editorial silhouettes. Free worldwide shipping in 3–5 days — duty-free to the US and EU under the Morocco-US and EU-Morocco free trade agreements.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.maisontanneurs.com",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Maison Tanneurs",
    title: "Maison Tanneurs — Hand-stitched leather from Marrakech",
    description:
      "Hand-stitched leather goods, sourced direct from a Marrakech atelier. Full-grain leather, editorial silhouettes. Free worldwide shipping in 3–5 days — duty-free to the US and EU under the Morocco-US and EU-Morocco free trade agreements.",
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
      "Hand-stitched leather goods, sourced direct from a Marrakech atelier. Full-grain leather, editorial silhouettes. Free worldwide shipping in 3–5 days — duty-free to the US and EU under the Morocco-US and EU-Morocco free trade agreements.",
    images: ["/hero/hero-leather-campaign.webp"],
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      fr: "/fr",
      ar: "/ar",
      "x-default": "/",
    },
  },
  other: {
    "facebook-domain-verification": "l5rwxlj1ubuvwihf4omg2hpxip51ck",
  },
};

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Maison Tanneurs",
  url: "https://www.maisontanneurs.com",
  logo: "https://www.maisontanneurs.com/brand/logos/mt-arched-badge.png",
  description:
    "Hand-stitched leather goods sourced direct from a Marrakech atelier. Full-grain leather, editorial silhouettes.",
  email: "hello@maisontanneurs.com",
};

const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "wrj9fbl8n9";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const dir = await getRequestDir();
  const currency = await getRequestCurrency();
  const rates = await getRates();
  return (
    <html lang={locale} dir={dir} className={`${mono.variable} ${playfair.variable} ${arabic.variable}`}>
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
        <CurrencyProvider initialCurrency={currency} rates={rates}>
          {children}
        </CurrencyProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
