"use client";

/*
 * LA PROJECTION — a séance, not a page.
 * One fixed black room with its own scroll. Scroll is the projector crank:
 * it runs the countdown leader, scrubs four reels, drifts the stills,
 * and splices Majorelle-blue frames between acts.
 * All 60fps work happens via direct ref mutation — no React state in the hot path.
 */

import { useEffect, useRef, useState } from "react";
import s from "./projection.module.css";

type Still = { src: string; placard: string; tilt: number; shift: number };
type Act = {
  numeral: string;
  title: string;
  reel: string;
  poster: string;
  edge: string;
  stills: Still[];
};

const ACTS: Act[] = [
  {
    numeral: "I",
    title: "Le Départ",
    reel: "/projection/reel-01.mp4",
    poster: "/projection/reel-01-poster.jpg",
    edge: "BOBINE I · 16MM · MARRAKECH → PARIS",
    stills: [
      { src: "/brand/editorial/open-bag-passport.webp", placard: "N° 01 — Passeport, cuir pleine fleur", tilt: -1.2, shift: -7 },
      { src: "/brand/editorial/model-paris-night.webp", placard: "N° 02 — Paris, la nuit du départ", tilt: 0.8, shift: 8 },
      { src: "/brand/editorial/about-briefcase-corridor-arches.webp", placard: "N° 03 — Corridor aux arches", tilt: -0.6, shift: -6 },
      { src: "/lookbook/lookbook-medina-door.webp", placard: "N° 04 — La porte de la médina", tilt: 1.1, shift: 7 },
    ],
  },
  {
    numeral: "II",
    title: "La Matière",
    reel: "/projection/reel-02.mp4",
    poster: "/projection/reel-02-poster.jpg",
    edge: "BOBINE II · 16MM · TANNERIE, FÈS",
    stills: [
      { src: "/hero/material-leather-macro.webp", placard: "N° 05 — Fleur du cuir, macro", tilt: 0.9, shift: 6 },
      { src: "/brand/editorial/full-grain-leather-hd-01.webp", placard: "N° 06 — Pleine fleur, non corrigée", tilt: -1.0, shift: -8 },
      { src: "/brand/editorial/waxed-linen-thread-hd-03.webp", placard: "N° 07 — Fil de lin ciré", tilt: 0.7, shift: 7 },
      { src: "/brand/editorial/proof-brass-clasp.webp", placard: "N° 08 — Fermoir, laiton massif", tilt: -0.8, shift: -6 },
    ],
  },
  {
    numeral: "III",
    title: "Les Mains",
    reel: "/projection/reel-03.mp4",
    poster: "/projection/reel-03-poster.jpg",
    edge: "BOBINE III · 16MM · ATELIER, MARRAKECH",
    stills: [
      { src: "/brand/editorial/atelier-hands-stitching.webp", placard: "N° 09 — Point sellier, main droite", tilt: -0.9, shift: 7 },
      { src: "/brand/editorial/proof-artisan-cutting-arches.webp", placard: "N° 10 — La coupe, sous les arches", tilt: 1.0, shift: -7 },
      { src: "/atelier/atelier-wide-light-beams.webp", placard: "N° 11 — L'atelier, onze heures", tilt: -0.5, shift: 6 },
      { src: "/brand/editorial/sketch-satchel-handbag-pencil.webp", placard: "N° 12 — Dessin préparatoire, mine de plomb", tilt: 0.8, shift: -8 },
    ],
  },
  {
    numeral: "IV",
    title: "Le Voyage",
    reel: "/projection/reel-04.mp4",
    poster: "/projection/reel-04-poster.jpg",
    edge: "BOBINE IV · 16MM · SAHARA / ATLANTIQUE",
    stills: [
      { src: "/atelier/atelier-berber-dunes.webp", placard: "N° 13 — Dunes, heure dorée", tilt: 0.6, shift: -6 },
      { src: "/lookbook/lookbook-coast.webp", placard: "N° 14 — La côte atlantique", tilt: -1.1, shift: 8 },
      { src: "/brand/editorial/model-beach.webp", placard: "N° 15 — Sable et cuir cognac", tilt: 0.9, shift: -7 },
      { src: "/brand/editorial/hands-handover-cognac.webp", placard: "N° 16 — La remise. L'objet change de mains.", tilt: -0.7, shift: 6 },
    ],
  },
];

/* Block heights in viewport units — the scroll score of the film. */
const LEADER_VH = 260;
const ACT_VH = 420;
const SPLICE_VH = 50;
const FIN_VH = 160;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/* 0→1→0 bell around c with half-width w */
const bell = (p: number, c: number, w: number) =>
  clamp01(1 - Math.abs(p - c) / w);
/* fade in over [a,b], out over [c,d] */
const window01 = (p: number, a: number, b: number, c: number, d: number) =>
  clamp01((p - a) / (b - a)) * (1 - clamp01((p - c) / (d - c)));

export default function Projection() {
  const salleRef = useRef<HTMLDivElement>(null);
  const spliceOverlayRef = useRef<HTMLDivElement>(null);
  const spliceNumeralRef = useRef<HTMLSpanElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  // leader refs
  const presenteRef = useRef<HTMLDivElement>(null);
  const titreRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const countNumRef = useRef<HTMLSpanElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);

  // per-act refs
  const actRefs = useRef<(HTMLElement | null)[]>([]);
  const numeralRefs = useRef<(HTMLDivElement | null)[]>([]);
  const filmRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const frameCountRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stillRefs = useRef<(HTMLElement | null)[][]>(ACTS.map(() => []));
  const leaderRef = useRef<HTMLElement>(null);
  const spliceMarkRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finRef = useRef<HTMLElement>(null);
  const finWordRef = useRef<HTMLDivElement>(null);
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStaticMode(true);
    }
  }, []);

  useEffect(() => {
    const salle = salleRef.current;
    if (!salle || staticMode) return;

    const durations: number[] = ACTS.map(() => 0);
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      const onMeta = () => {
        durations[i] = v.duration || 0;
        if (v.videoWidth && v.videoHeight)
          v.style.aspectRatio = `${v.videoWidth} / ${v.videoHeight}`;
      };
      if (v.readyState >= 1) onMeta();
      else v.addEventListener("loadedmetadata", onMeta, { once: true });
    });

    // warm the reels on first touch so iOS allows seeking
    let warmed = false;
    const warm = () => {
      if (warmed) return;
      warmed = true;
      videoRefs.current.forEach((v) => v?.load());
    };
    salle.addEventListener("scroll", warm, { once: true, passive: true });

    const seekTargets: number[] = ACTS.map(() => 0);
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const vh = salle.clientHeight;
      const y = salle.scrollTop;

      // entrance cue
      if (cueRef.current)
        cueRef.current.style.opacity = String(clamp01(1 - y / (vh * 0.4)));

      // ---- LEADER ----
      const leader = leaderRef.current;
      if (leader) {
        const p = clamp01(y / (leader.offsetHeight - vh));
        if (presenteRef.current)
          presenteRef.current.style.opacity = String(window01(p, 0.04, 0.14, 0.24, 0.32));
        if (titreRef.current) {
          const o = window01(p, 0.26, 0.4, 0.5, 0.6);
          titreRef.current.style.opacity = String(o);
          titreRef.current.style.letterSpacing = `${0.42 - 0.18 * clamp01((p - 0.26) / 0.34)}em`;
        }
        if (countRef.current) {
          const cp = clamp01((p - 0.58) / 0.4);
          countRef.current.style.opacity = String(p > 0.58 && p < 0.99 ? 1 : 0);
          const n = Math.min(2, Math.floor(cp * 3));
          if (countNumRef.current)
            countNumRef.current.textContent = String(3 - n);
          if (sweepRef.current) {
            const angle = ((cp * 3) % 1) * 360;
            sweepRef.current.style.background = `conic-gradient(rgba(242,235,221,.16) ${angle}deg, transparent ${angle}deg)`;
          }
        }
      }

      // ---- ACTS ----
      let spliceMax = 0;
      let spliceNext = "";
      ACTS.forEach((act, i) => {
        const el = actRefs.current[i];
        if (!el) return;
        const top = el.offsetTop;
        const h = el.offsetHeight - vh;
        const p = clamp01((y - top) / h);
        const inView = y > top - vh && y < top + el.offsetHeight;

        // numeral punch
        const num = numeralRefs.current[i];
        if (num) {
          const o = window01(p, 0.0, 0.035, 0.1, 0.16);
          num.style.opacity = String(inView ? o : 0);
          num.style.transform = `scale(${1.06 - 0.06 * clamp01(p / 0.16)})`;
        }

        // film scrub
        const film = filmRefs.current[i];
        const video = videoRefs.current[i];
        if (film) {
          const o = window01(p, 0.12, 0.18, 0.58, 0.64);
          film.style.opacity = String(inView ? o : 0);
        }
        if (video && durations[i] > 0 && inView) {
          const fp = clamp01((p - 0.14) / 0.46);
          seekTargets[i] = fp * Math.max(0, durations[i] - 0.05);
          const cur = video.currentTime;
          const delta = seekTargets[i] - cur;
          if (Math.abs(delta) > 2) video.currentTime = seekTargets[i];
          else if (Math.abs(delta) > 0.02)
            video.currentTime = cur + delta * 0.24;
          const fc = frameCountRefs.current[i];
          if (fc)
            fc.textContent = `IMAGE ${String(Math.floor(video.currentTime * 24)).padStart(6, "0")}`;
        }

        // stills drift
        const n = act.stills.length;
        act.stills.forEach((_, k) => {
          const fig = stillRefs.current[i][k];
          if (!fig) return;
          const c = 0.66 + ((k + 0.5) * 0.33) / n;
          const w = (0.33 / n) * 0.55;
          const o = bell(p, c, w);
          const local = clamp01((p - (c - w)) / (2 * w)); // 0..1 across its window
          fig.style.opacity = String(inView ? o : 0);
          fig.style.transform = `translateY(${(0.5 - local) * 140}px) rotate(${act.stills[k].tilt}deg) scale(${1.03 - 0.03 * local})`;
        });

        // splice proximity (blue frame between this act and the next)
        const mark = spliceMarkRefs.current[i];
        if (mark && i < ACTS.length - 1) {
          const center = mark.offsetTop + mark.offsetHeight / 2 - vh / 2;
          const d = Math.abs(y - center) / (vh * 0.45);
          const o = clamp01(1 - d);
          if (o > spliceMax) {
            spliceMax = o;
            spliceNext = ACTS[i + 1].numeral;
          }
        }
      });

      if (spliceOverlayRef.current) {
        spliceOverlayRef.current.style.opacity = String(spliceMax * spliceMax);
        if (spliceNumeralRef.current && spliceNext)
          spliceNumeralRef.current.textContent = spliceNext;
      }

      // ---- FIN ----
      const fin = finRef.current;
      if (fin && finWordRef.current) {
        const p = clamp01((y - fin.offsetTop) / (fin.offsetHeight - vh));
        finWordRef.current.style.opacity = String(clamp01((p - 0.25) / 0.3));
        finWordRef.current.style.letterSpacing = `${0.2 + 0.3 * (1 - clamp01((p - 0.25) / 0.3))}em`;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      salle.removeEventListener("scroll", warm);
    };
  }, [staticMode]);

  /* Reduced motion: the projector runs itself — a quiet, static program. */
  if (staticMode) {
    return (
      <div className={s.salle} ref={salleRef} tabIndex={0}>
        <header className={s.chrome}>
          <span className={s.wordmark}>MAISON TANNEURS</span>
          <span className={s.chromeRight}>GALERIE — MMXXVI</span>
        </header>
        <div className={s.staticReel}>
          <div className={s.titre} style={{ opacity: 1, position: "static" }}>
            LA PROJECTION
          </div>
          {ACTS.map((act) => (
            <section key={act.numeral} className={s.staticAct}>
              <div className={s.actTitle}>
                {act.numeral} · {act.title}
              </div>
              <video
                className={s.film}
                src={act.reel}
                poster={act.poster}
                muted
                playsInline
                autoPlay
                loop
                preload="metadata"
              />
              {act.stills.map((still) => (
                <figure key={still.src} className={s.staticStill}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={still.src} alt={still.placard} loading="lazy" />
                  <figcaption className={s.placard}>{still.placard}</figcaption>
                </figure>
              ))}
            </section>
          ))}
          <section className={s.colophon}>
            <div className={s.brassRule} />
            <a
              className={s.acquire}
              href="https://www.maisontanneurs.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Acquérir les pièces
            </a>
            <span className={s.colophonNote}>
              MAISON TANNEURS · MARRAKECH — PROJETÉ EN MMXXVI
            </span>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={s.salle} ref={salleRef} tabIndex={0}>
      {/* room atmosphere — fixed within the salle */}
      <div className={s.grain} aria-hidden />
      <div className={s.vignette} aria-hidden />
      <div className={s.spliceOverlay} ref={spliceOverlayRef} aria-hidden>
        <span className={s.spliceNumeral} ref={spliceNumeralRef} />
      </div>

      <header className={s.chrome}>
        <span className={s.wordmark}>MAISON TANNEURS</span>
        <span className={s.chromeRight}>GALERIE — MMXXVI</span>
      </header>

      <div className={s.cue} ref={cueRef}>
        FAITES DÉFILER POUR PROJETER
        <span className={s.cueArrow}>▾</span>
      </div>

      <div className={s.reel}>
        {/* ———— LEADER ———— */}
        <section
          className={s.leader}
          ref={leaderRef}
          style={{ height: `${LEADER_VH}vh` }}
        >
          <div className={s.frame}>
            <div className={s.presente} ref={presenteRef}>
              MAISON TANNEURS PRÉSENTE
            </div>
            <div className={s.titre} ref={titreRef}>
              LA PROJECTION
            </div>
            <div className={s.count} ref={countRef}>
              <div className={s.countSweep} ref={sweepRef} />
              <div className={s.countCrossV} />
              <div className={s.countCrossH} />
              {/* SVG ring — immune to the repo's global border-radius reset */}
              <svg className={s.countRing} viewBox="0 0 100 100" aria-hidden>
                <circle cx="50" cy="50" r="49.5" fill="none" stroke="rgba(242,235,221,0.3)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(242,235,221,0.18)" strokeWidth="0.4" />
              </svg>
              <span className={s.countNum} ref={countNumRef}>
                3
              </span>
            </div>
          </div>
        </section>

        {/* ———— ACTS ———— */}
        {ACTS.map((act, i) => (
          <div key={act.numeral}>
            <section
              className={s.act}
              style={{ height: `${ACT_VH}vh` }}
              ref={(el) => {
                actRefs.current[i] = el;
              }}
            >
              <div className={s.frame}>
                {/* numeral punch */}
                <div
                  className={s.numeralLayer}
                  ref={(el) => {
                    numeralRefs.current[i] = el;
                  }}
                >
                  <span className={s.numeral}>{act.numeral}</span>
                  <span className={s.actTitle}>{act.title}</span>
                </div>

                {/* film */}
                <div
                  className={s.filmLayer}
                  ref={(el) => {
                    filmRefs.current[i] = el;
                  }}
                >
                  <span className={`${s.edgeCode} ${s.edgeLeft}`}>
                    MAISON TANNEURS — SALLE UNIQUE
                  </span>
                  <div className={s.filmFrame}>
                    <video
                      className={s.film}
                      src={act.reel}
                      poster={act.poster}
                      muted
                      playsInline
                      preload="auto"
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                    />
                  </div>
                  <span className={`${s.edgeCode} ${s.edgeRight}`}>
                    {act.edge}{" "}
                    <span
                      ref={(el) => {
                        frameCountRefs.current[i] = el;
                      }}
                    >
                      IMAGE 000000
                    </span>
                  </span>
                </div>

                {/* stills */}
                <div className={s.stillsLayer}>
                  {act.stills.map((still, k) => (
                    <figure
                      key={still.src}
                      className={s.still}
                      style={{ marginLeft: `${still.shift}vw` }}
                      ref={(el) => {
                        stillRefs.current[i][k] = el;
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={still.src}
                        alt={still.placard}
                        loading="lazy"
                        decoding="async"
                      />
                      <figcaption className={s.placard}>
                        {still.placard}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>

            {i < ACTS.length - 1 && (
              <div
                className={s.splice}
                style={{ height: `${SPLICE_VH}vh` }}
                ref={(el) => {
                  spliceMarkRefs.current[i] = el;
                }}
              />
            )}
          </div>
        ))}

        {/* ———— FIN ———— */}
        <section
          className={s.fin}
          ref={finRef}
          style={{ height: `${FIN_VH}vh` }}
        >
          <div className={s.frame}>
            <div className={s.finWord} ref={finWordRef}>
              FIN
            </div>
          </div>
        </section>

        <section className={s.colophon}>
          <div className={s.brassRule} />
          <a
            className={s.acquire}
            href="https://www.maisontanneurs.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acquérir les pièces
          </a>
          <span className={s.colophonNote}>
            MAISON TANNEURS · MARRAKECH — PROJETÉ EN MMXXVI
          </span>
        </section>
      </div>
    </div>
  );
}
