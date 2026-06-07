import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  EB_Garamond,
  Fraunces,
  Inter,
  Instrument_Serif,
  Montserrat,
  Newsreader,
  Noto_Naskh_Arabic,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import CookieBanner from "@/components/store/CookieBanner";
import ConsentedClarity from "@/components/store/ConsentedClarity";
import MetaPixel from "@/components/store/MetaPixel";
import GA4 from "@/components/store/GA4";
import { getRequestCurrency, getRequestDir, getRequestLocale } from "@/lib/i18n-server";
import { getRates } from "@/lib/fx";
import { CurrencyProvider } from "@/components/store/CurrencyProvider";

// === Type system — Ryan-selected 2026-05-31 ===
// 5 serifs (Parisian editorial headlines) + 2 sans (clean micro-text/buttons).
// Each gets its own CSS variable; pick the active pair in globals.css.

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Bodoni Moda SC — self-hosted variable font used as a restrained display
// accent for the centered MAISON TANNEURS wordmark only (Navbar header,
// mobile drawer header, navigation transition indicator). Body/UI/buttons
// stay on Inter; editorial headings stay on Instrument Serif.
const bodoniModaSC = localFont({
  src: [
    {
      path: "../public/fonts/BodoniModaSC-VariableFont.ttf",
      style: "normal",
    },
  ],
  variable: "--font-bodoni-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maison Tanneurs — Hand-stitched leather from Marrakech",
    template: "%s | Maison Tanneurs",
  },
  description:
    "Hand-stitched leather goods, sourced direct from a Marrakech atelier. Full-grain leather, editorial silhouettes. Free worldwide shipping via DHL Express, with most orders arriving in 5 to 10 business days.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.maisontanneurs.com",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Maison Tanneurs",
    title: "Maison Tanneurs — Hand-stitched leather from Marrakech",
    description:
      "Hand-stitched leather goods, sourced direct from a Marrakech atelier. Full-grain leather, editorial silhouettes. Free worldwide shipping via DHL Express, with most orders arriving in 5 to 10 business days.",
    images: [
      {
        url: "/brand/editorial/cinematic-bag-still.webp",
        width: 2400,
        height: 1350,
        alt: "Maison Tanneurs — cognac leather bag in cinematic evening light",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Tanneurs",
    description:
      "Hand-stitched leather goods, sourced direct from a Marrakech atelier. Full-grain leather, editorial silhouettes. Free worldwide shipping via DHL Express, with most orders arriving in 5 to 10 business days.",
    images: ["/brand/editorial/cinematic-bag-still.webp"],
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
    <html
      lang={locale}
      dir={dir}
      className={[
        instrumentSerif.variable,
        newsreader.variable,
        ebGaramond.variable,
        fraunces.variable,
        cormorant.variable,
        inter.variable,
        montserrat.variable,
        arabic.variable,
        bodoniModaSC.variable,
      ].join(" ")}
    >
      <body>
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
