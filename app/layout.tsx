import type { Metadata } from "next";
import Script from "next/script";
import {
  Cormorant_Garamond,
  Inter_Tight,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/store/CookieBanner";
import ConsentedClarity from "@/components/store/ConsentedClarity";
import MetaPixel from "@/components/store/MetaPixel";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nitra — Clothing rooted in the Maghreb",
    template: "%s | Nitra",
  },
  description:
    "Hand-painted figurative graphics on heavyweight cotton. A clothing label born of Moroccan visual tradition, made for now.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.nitra.com",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nitra",
    title: "Nitra — Clothing rooted in the Maghreb",
    description:
      "Hand-painted figurative graphics on heavyweight cotton. A clothing label born of Moroccan visual tradition, made for now.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nitra",
    description:
      "Hand-painted figurative graphics on heavyweight cotton. A clothing label born of Moroccan visual tradition, made for now.",
  },
  alternates: {
    canonical: "/",
  },
};

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nitra",
  url: "https://www.nitra.com",
  logo: "https://www.nitra.com/icon.svg",
  description:
    "A clothing label rooted in Moroccan visual tradition. Hand-painted figurative graphics on heavyweight cotton.",
  email: "hello@nitra.com",
};

const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "wrj9fbl8n9";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
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
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
