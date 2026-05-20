// Server-side PNG renderer for the Maison Tanneurs wordmark.
// Uses Next.js 16's built-in ImageResponse (zero new deps, loads Google Fonts
// at request time).
//
// Why this exists: the site renders "maison tanneurs" via CSS every page
// load. To get the wordmark as a PNG (for FB Page profile, email signature,
// favicon, packaging, etc.) we don't need AI generation or Canva — we just
// render the same React/CSS to PNG server-side, pixel-perfect, at any size.
//
// Usage:
//   /brand/wordmark?w=1080&h=1080                  → square FB profile (stacked)
//   /brand/wordmark?w=1600&h=400&subtitle=true     → horizontal lockup
//   /brand/wordmark?w=1080&h=1080&theme=dark       → dark variant
//   /brand/wordmark?w=512&h=512&mark=true          → favicon mark (just "m")

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Subset of characters we actually render — keeps fetched font file tiny.
// Covers "maison tanneurs" + "MARRAKECH" subtitle + the bare "m" mark.
const FONT_TEXT = "maison tanneursMARKECH";

async function loadInterTight(weight: 400 | 600 | 800): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@${weight}&text=${encodeURIComponent(FONT_TEXT)}`;
  const cssRes = await fetch(cssUrl);
  if (!cssRes.ok) {
    throw new Error(`Inter Tight ${weight} CSS fetch failed: ${cssRes.status}`);
  }
  const css = await cssRes.text();
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
  const layout = searchParams.get("layout") === "single" ? "single" : "stacked";

  const bg = theme === "dark" ? "#1a1a1a" : "#FAF8F5";
  const fg = theme === "dark" ? "#FAF8F5" : "#2C2C2C";
  const subFg = theme === "dark" ? "rgba(250,248,245,0.6)" : "rgba(44,44,44,0.6)";

  const [w400, w600, w800] = await Promise.all([
    loadInterTight(400),
    loadInterTight(600),
    loadInterTight(800),
  ]);

  // "maison" is 6 chars (~4.0x font-size at Inter Tight 800).
  // "tanneurs" is 8 chars (~5.3x font-size at Inter Tight 800).
  // Single-line "maison tanneurs" is 15 chars w/ space (~9.4x font-size).
  const longestWordRatio = 5.3;
  const singleLineRatio = 9.4;
  const ratio = layout === "single" ? singleLineRatio : longestWordRatio;
  const lineCount = layout === "single" ? 1 : 2;

  const wordmarkSize = markOnly
    ? Math.floor(Math.min(w, h) * 0.7)
    : Math.floor(
        Math.min(
          (h * 0.6) / lineCount,
          (w * 0.82) / ratio,
        ),
      );
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
            {layout === "single" ? (
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
                maison tanneurs
              </div>
            ) : (
              <>
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
                  maison
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Inter Tight",
                    fontWeight: 800,
                    fontSize: wordmarkSize,
                    color: fg,
                    lineHeight: 1,
                    marginTop: Math.floor(wordmarkSize * 0.08),
                  }}
                >
                  tanneurs
                </div>
              </>
            )}
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
                  marginTop: Math.floor(wordmarkSize * 0.22),
                  paddingLeft: `${subtitleSize * 0.55}px`,
                }}
              >
                Marrakech
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
