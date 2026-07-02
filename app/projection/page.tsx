import type { Metadata } from "next";
import Projection from "@/components/projection/Projection";

export const metadata: Metadata = {
  title: "La Projection — Maison Tanneurs",
  description:
    "Quatre bobines. Une salle noire. Faites défiler pour projeter.",
  robots: { index: false, follow: false },
};

export default function ProjectionPage() {
  return <Projection />;
}
