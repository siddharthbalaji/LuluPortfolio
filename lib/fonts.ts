import { Fraunces, Hanken_Grotesk, Space_Mono, Noto_Sans_JP } from "next/font/google";

// Display — Fraunces: an editorial soft-serif with optical sizing and real
// personality at large sizes. Used with restraint for headlines only.
export const display = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Body / UI — Hanken Grotesk: clean, warm, highly legible grotesque.
export const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// Utility / data — Space Mono: a designer-engineer signal for labels & captions.
export const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Japanese — for the ルル brand glyphs.
export const jp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--font-jp",
  display: "swap",
});
