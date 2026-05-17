// Server-side PNG renderer for the Nitra wordmark.
// Uses Next.js 16's built-in ImageResponse (zero new deps, loads Google Fonts
// at request time).
//
// Why this exists: the site renders "nitra MAGHREB" via CSS every page
// load. To get the wordmark as a PNG (for FB Page profile, email signature,
// favicon, packaging, etc.) we don't need AI generation or Canva — we just
// render the same React/CSS to PNG server-side, pixel-perfect, at any size.
//
// Usage:
//   /brand/wordmark?w=1080&h=1080                  → square FB profile
//   /brand/wordmark?w=1200&h=400&subtitle=true     → horizontal lockup
//   /brand/wordmark?w=1080&h=1080&theme=dark       → dark variant
//   /brand/wordmark?w=512&h=512&mark=true          → favicon mark (just "m")

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Subset of characters we actually render — keeps fetched font file tiny.
const FONT_TEXT = "nitraMAGHREBb"; // covers both wordmark + subtitle

async function loadInterTight(weight: 400 | 600 | 800): Promise<ArrayBuffer> {
  // Vercel's documented pattern: fetch with no User-Agent so Google's CSS
  // endpoint serves .ttf (which ImageResponse requires) instead of .woff2.
  // The &text=... param subsets the font to only the glyphs we render.
  const cssUrl = `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@${weight}&text=${encodeURIComponent(FONT_TEXT)}`;
  const cssRes = await fetch(cssUrl);
  if (!cssRes.ok) {
    throw new Error(`Inter Tight ${weight} CSS fetch failed: ${cssRes.status}`);
  }
  const css = await cssRes.text();
  // Match any format() — opentype, truetype, or fall-through
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('?([^')]+)'?\)/);
  if (!match) {
    throw new Error(`Inter Tight ${weight} url not in CSS: ${css.slice(0, 200)}`);
  }
  const fontUrl = match[1];
  const fontRes = await fetch(fontUrl);
  if (!fontRes.ok) {
    throw new Error(`Inter Tight ${weight} font fetch failed: ${fontRes.status}`);
  }
  return await fontRes.arrayBuffer();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const w = parseInt(searchParams.get("w") || "1080", 10);
  const h = parseInt(searchParams.get("h") || "1080", 10);
  const theme = searchParams.get("theme") === "dark" ? "dark" : "light";
  const showSubtitle = searchParams.get("subtitle") === "true";
  const markOnly = searchParams.get("mark") === "true";

  const bg = theme === "dark" ? "#1a1a1a" : "#FAF8F5";
  const fg = theme === "dark" ? "#FAF8F5" : "#2C2C2C";
  const subFg = theme === "dark" ? "rgba(250,248,245,0.6)" : "rgba(44,44,44,0.6)";

  // Load both weights we need (and 600 for the subtitle)
  const [w400, w600, w800] = await Promise.all([
    loadInterTight(400),
    loadInterTight(600),
    loadInterTight(800),
  ]);

  // Wordmark "nitra" at Inter Tight 800/400 is ~5.5x wider than its
  // font-size. Cap by both width and height so it never bleeds the canvas,
  // leaving ~10% margin on each side.
  const wordmarkSize = markOnly
    ? Math.floor(Math.min(w, h) * 0.7)
    : Math.floor(Math.min(h * 0.32, (w * 0.82) / 5.5));
  const subtitleSize = Math.floor(wordmarkSize * 0.16);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
        }}
      >
        {markOnly ? (
          <div
            style={{
              display: "flex",
              fontFamily: "Inter Tight",
              fontWeight: 800,
              fontSize: wordmarkSize,
              color: fg,
              lineHeight: 1,
            }}
          >
            m
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Inter Tight",
                fontSize: wordmarkSize,
                color: fg,
                lineHeight: 1,
              }}
            >
              <span style={{ fontWeight: 800 }}>nitra</span>
            </div>
            {showSubtitle && (
              <div
                style={{
                  display: "flex",
                  fontFamily: "Inter Tight",
                  fontWeight: 600,
                  fontSize: subtitleSize,
                  color: subFg,
                  textTransform: "uppercase",
                  letterSpacing: `${subtitleSize * 0.55}px`,
                  marginTop: Math.floor(wordmarkSize * 0.18),
                  // Tracked text shifts optically right — pad-left to recenter
                  paddingLeft: `${subtitleSize * 0.55}px`,
                }}
              >
                Maghreb
              </div>
            )}
          </div>
        )}
      </div>
    ),
    {
      width: w,
      height: h,
      fonts: [
        { name: "Inter Tight", data: w400, weight: 400 },
        { name: "Inter Tight", data: w600, weight: 600 },
        { name: "Inter Tight", data: w800, weight: 800 },
      ],
    },
  );
}
