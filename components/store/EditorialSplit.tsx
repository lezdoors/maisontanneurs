import Image from "next/image";
import Link from "next/link";

type Side = "left" | "right";

interface EditorialSplitProps {
  eyebrow?: string;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image: string;
  imageAlt: string;
  /** Which side the photo sits on at lg+. Default "right". */
  photoSide?: Side;
  /** Tint the text panel with the limestone plate? Default false (paper). */
  plateBackground?: boolean;
}

export default function EditorialSplit({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
  image,
  imageAlt,
  photoSide = "right",
  plateBackground = false,
}: EditorialSplitProps) {
  const photoOrder = photoSide === "right" ? "lg:order-2" : "lg:order-1";
  const textOrder = photoSide === "right" ? "lg:order-1" : "lg:order-2";
  const frameSide = photoSide === "right" ? "mt-frame--right" : "mt-frame--left";

  return (
    <section
      className={`relative mt-frame ${frameSide}`}
      style={{ background: "var(--color-paper)" }}
    >
      <div className="relative grid grid-cols-1 lg:grid-cols-2">
        <div
          className={`relative ${textOrder} flex flex-col justify-center`}
          style={{
            background: plateBackground
              ? "var(--color-plate)"
              : "var(--color-paper)",
            paddingLeft: "clamp(24px, 5vw, 88px)",
            paddingRight: "clamp(24px, 4vw, 64px)",
            paddingTop: "clamp(56px, 7vw, 120px)",
            paddingBottom: "clamp(56px, 7vw, 120px)",
          }}
        >
          {eyebrow && (
            <div
              className="mb-5 uppercase"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.22em",
                fontWeight: 500,
                color: "var(--color-bronze)",
              }}
            >
              {eyebrow}
            </div>
          )}
          <h2
            className="max-w-[18ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "clamp(32px, 3.8vw, 56px)",
              letterSpacing: "-0.015em",
              lineHeight: 1.05,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            {headline}
          </h2>
          <p
            className="mt-6 max-w-[44ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.65,
              color: "var(--color-ink-soft)",
            }}
          >
            {body}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
            <Link href={ctaHref} className="mt-cta mt-cta--ghost-dark">
              {ctaLabel}
            </Link>
            {secondaryLabel && secondaryHref && (
              <Link href={secondaryHref} className="mt-cta mt-cta--ghost-dark">
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>

        <div
          className={`relative ${photoOrder} overflow-hidden bg-[color:var(--color-plate)]`}
          style={{ aspectRatio: "4 / 5", minHeight: "clamp(360px, 50vh, 640px)" }}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <span
          aria-hidden
          className="hidden lg:block absolute top-0 bottom-0 mt-rule-v"
          style={{ left: "50%" }}
        />
      </div>
    </section>
  );
}
