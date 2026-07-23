"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useLocalizedHref } from "@/lib/i18n-client";

type HeritageObject = {
  number: string;
  name: string;
  material: string;
  price: string;
  slug: string;
  poster: string;
  video: string;
  className: string;
};

const OBJECTS: HeritageObject[] = [
  {
    number: "N° 01",
    name: "Atlas Weekender",
    material: "Cognac full-grain leather",
    price: "$1,550",
    slug: "atlas-weekender-cognac",
    poster: "/products/hero/atlas-weekender-cognac.webp",
    video: "/heritage-edition/atlas-weekender-spin.mp4",
    className: "mt-heritage-object--atlas",
  },
  {
    number: "N° 02",
    name: "Oasis Duffle",
    material: "Oxblood full-grain leather",
    price: "$1,250",
    slug: "oasis-weekender-oxblood",
    poster: "/products/hero/oasis-weekender-oxblood.webp",
    video: "/heritage-edition/oasis-duffle-spin.mp4",
    className: "mt-heritage-object--oasis",
  },
  {
    number: "N° 03",
    name: "Marrakech Tote",
    material: "Cognac full-grain leather",
    price: "$980",
    slug: "marrakech-tote-cognac",
    poster: "/products/hero/marrakech-tote-cognac.webp",
    video: "/heritage-edition/marrakech-tote-spin.mp4",
    className: "mt-heritage-object--tote",
  },
];

function HeritageObjectCard({ object }: { object: HeritageObject }) {
  const href = useLocalizedHref();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const reset = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setPlaying(false);
  };

  return (
    <article
      className={`mt-heritage-object ${object.className}`}
      onPointerEnter={play}
      onPointerLeave={reset}
      onFocusCapture={play}
      onBlurCapture={reset}
      data-video-playing={playing ? "true" : "false"}
    >
      <span className="mt-heritage-object-number">{object.number}</span>
      <Link
        href={href(`/products/${object.slug}`)}
        className="mt-heritage-object-media"
        aria-label={`Inspect ${object.name}`}
      >
        <Image
          src={object.poster}
          alt={object.name}
          fill
          sizes="(max-width: 767px) 100vw, 42vw"
          className="mt-heritage-object-poster"
        />
        <video
          ref={videoRef}
          className="mt-heritage-object-video"
          muted
          loop
          playsInline
          preload="metadata"
          poster={object.poster}
          data-testid={`heritage-spin-${object.slug}`}
          aria-hidden="true"
        >
          <source src={object.video} type="video/mp4" />
        </video>
        <span className="mt-heritage-motion-label">
          {playing ? "In motion" : "Hover to rotate"}
        </span>
      </Link>

      <div className="mt-heritage-object-meta">
        <div>
          <h3>{object.name}</h3>
          <p>{object.material}</p>
        </div>
        <div className="mt-heritage-object-buy">
          <span>{object.price}</span>
          <Link href={href(`/products/${object.slug}`)}>Inspect object</Link>
        </div>
      </div>
    </article>
  );
}

function HeritageNotify() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || state === "sending") return;
    setState("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });
      setState(response.ok ? "sent" : "error");
      if (response.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="heritage-notify" className="mt-heritage-notify">
      <div>
        <span className="mt-heritage-micro">Private allocation / Edition 001</span>
        <h2>Request first access.</h2>
      </div>
      <form onSubmit={submit}>
        <label htmlFor="heritage-email">Email address</label>
        <div>
          <input
            id="heritage-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            disabled={state === "sending" || state === "sent"}
          />
          <button type="submit" disabled={state === "sending" || state === "sent"}>
            {state === "sending" ? "Sending" : state === "sent" ? "Filed" : "Notify me"}
          </button>
        </div>
        <p>
          {state === "error"
            ? "The request could not be filed. Please try again."
            : state === "sent"
              ? "Your request has been added to the private allocation list."
              : "Edition notes and allocation access only. Unsubscribe in one click."}
        </p>
      </form>
    </section>
  );
}

export default function HeritageEdition() {
  const href = useLocalizedHref();
  const marquee = "Atlas Weekender / Oasis Duffle / Marrakech Tote / Heritage Edition / ";

  return (
    <div className="mt-heritage-page">
      <section className="mt-heritage-prologue">
        <div className="mt-heritage-prologue-index">
          <span>Edition 001</span>
          <span>Marrakech / Paris</span>
        </div>
        <h2>
          Three objects.
          <br />
          <em>One inheritance.</em>
        </h2>
        <div className="mt-heritage-prologue-copy">
          <p>
            Built slowly by hand, each form is reduced to what travel asks of it:
            balance, endurance, and a surface that records a life.
          </p>
          <Link href={href("/atelier")}>Read the atelier dossier</Link>
        </div>
      </section>

      <div className="mt-heritage-marquee" aria-label="Heritage Edition objects">
        <div>
          <span>{marquee}</span>
          <span aria-hidden>{marquee}</span>
          <span aria-hidden>{marquee}</span>
        </div>
      </div>

      <section id="heritage-objects" className="mt-heritage-objects" aria-labelledby="heritage-objects-title">
        <header>
          <span className="mt-heritage-micro">The Heritage Edition / Three objects</span>
          <h2 id="heritage-objects-title">Objects for the long way home.</h2>
        </header>
        <div className="mt-heritage-object-grid">
          {OBJECTS.map((object) => (
            <HeritageObjectCard key={object.slug} object={object} />
          ))}
        </div>
      </section>

      <section className="mt-heritage-material" aria-labelledby="heritage-material-title">
        <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="/heritage-edition/leather-macro.mp4" type="video/mp4" />
        </video>
        <div className="mt-heritage-material-panel">
          <span className="mt-heritage-micro">Material study / Full-grain leather</span>
          <h2 id="heritage-material-title">
            French in form.
            <br />
            <em>Moroccan in hand.</em>
          </h2>
          <p>
            No two hides receive light in the same way. Full-grain leather keeps its
            natural surface intact, then deepens through touch, travel, and time.
          </p>
          <dl>
            <div><dt>Thread</dt><dd>Waxed linen</dd></div>
            <div><dt>Hardware</dt><dd>Antique brass</dd></div>
            <div><dt>Construction</dt><dd>Saddle stitched</dd></div>
          </dl>
        </div>
      </section>

      <section className="mt-heritage-coda">
        <p>
          Made in a working Marrakech atelier.
          <br />
          Carried from Paris to anywhere.
        </p>
        <Link href={href("/products")}>Enter the full collection</Link>
      </section>

      <HeritageNotify />
    </div>
  );
}
