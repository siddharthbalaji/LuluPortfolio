"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Preloader — "Designer" cycling across languages, each frame in a wildly
 * different typeface, the word painted in a white→deep-blue gradient that
 * shifts angle on every swap, with the signature still-water reflection
 * echoed beneath. No spinner — the type IS the loader.
 *
 * Dismisses once the window has loaded, the webfonts are ready, AND a short
 * minimum has elapsed (so the effect is seen), with a hard failsafe. Respects
 * reduced-motion by freezing on a single word instead of cycling.
 */

/* ------------------------------------------------------------------ *
 * Typefaces
 *
 * Latin frames lead with a PREMIUM face you own (Ronthel Brush, Burn Out,
 * Palpiyo …). Those aren't web fonts, so each falls back to a distinctive
 * Google face that loads immediately — the effect looks great now and
 * auto-upgrades the instant you add the real @font-face files (see note at
 * the bottom of this file). Non-Latin scripts use native OS stacks so they
 * render in a real face on every platform instead of tofu.
 * ------------------------------------------------------------------ */

// Premium-first Latin stacks (premium → distinctive Google fallback → generic)
const RONTHEL = "'Ronthel Brush', 'Pacifico', cursive";
const BURNOUT = "'Burn Out', 'Monoton', cursive";
const PALPIYO = "'Palpiyo', 'Righteous', system-ui, sans-serif";
const LOBSTER = "'Lobster', cursive";
const ABRIL = "'Abril Fatface', Georgia, serif";
const BEBAS = "'Bebas Neue', 'Anton', sans-serif";

// Native script stacks
const JP = "var(--font-jp), serif";
const SC = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", var(--font-jp), sans-serif';
const KR = '"Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", "Noto Sans CJK KR", sans-serif';
const AR = '"Geeza Pro", "Damascus", "Noto Naskh Arabic", "Noto Sans Arabic", "Segoe UI", Tahoma, sans-serif';
const DEVA = '"Kohinoor Devanagari", "Noto Sans Devanagari", Mangal, system-ui, sans-serif';
const THAI = '"Thonburi", "Leelawadee UI", "Noto Sans Thai", system-ui, sans-serif';
const SYS = "system-ui, -apple-system, Segoe UI, sans-serif"; // Cyrillic / Greek / Vietnamese

// Google fallbacks to load at runtime so the cycle is crisp from frame one.
const GOOGLE_FAMILIES = [
  "Pacifico",
  "Monoton",
  "Righteous",
  "Lobster",
  "Abril Fatface",
  "Bebas Neue",
  "Anton",
];
const GOOGLE_HREF =
  "https://fonts.googleapis.com/css2?" +
  "family=Pacifico&family=Monoton&family=Righteous&family=Lobster&" +
  "family=Abril+Fatface&family=Bebas+Neue&family=Anton&display=swap";

// Each frame: a translation of "Designer" paired with a face. `ff` is the
// full font-family stack; the premium name leads where one applies.
type Frame = { t: string; ff: string; dir?: "rtl"; lang: string };

const WORDS: Frame[] = [
  { t: "Designer", ff: RONTHEL, lang: "en" }, // Ronthel Brush
  { t: "デザイナー", ff: JP, lang: "ja" },
  { t: "Diseñador", ff: ABRIL, lang: "es" },
  { t: "Concepteur", ff: PALPIYO, lang: "fr" }, // Palpiyo
  { t: "디자이너", ff: KR, lang: "ko" },
  { t: "Дизайнер", ff: SYS, lang: "ru" },
  { t: "Disegnatore", ff: LOBSTER, lang: "it" }, // was a 2nd "Designer" — fixed
  { t: "设计师", ff: SC, lang: "zh" },
  { t: "مصمم", ff: AR, dir: "rtl", lang: "ar" },
  { t: "Gestalter", ff: BURNOUT, lang: "de" }, // Burn Out
  { t: "डिज़ाइनर", ff: DEVA, lang: "hi" },
  { t: "Nhà thiết kế", ff: SYS, lang: "vi" }, // system stack → Vietnamese diacritics render
  { t: "Σχεδιαστής", ff: SYS, lang: "el" },
  { t: "นักออกแบบ", ff: THAI, lang: "th" },
  { t: "Projetista", ff: BEBAS, lang: "pt" },
];

// White → deep-blue gradient, angle varies per frame for variety.
const gradientFor = (i: number) =>
  `linear-gradient(${90 + i * 26}deg, #F6FAFD 0%, #B3CFE5 36%, #4A7FA7 70%, #1A3D63 100%)`;

const SWAP_MS = 230; // ~4.3 swaps/sec — rapid, each word fully opaque
const MIN_VISIBLE_MS = 1900; // ensure the effect is seen before exit
const MIN_VISIBLE_REDUCED_MS = 800;
const FAILSAFE_MS = 6000; // never trap the user behind the loader

const EASE = [0.22, 1, 0.36, 1] as const; // matches the site's "smooth"

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [i, setI] = useState(0);

  // Ready logic, font loading + scroll lock.
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReduced(prefersReduced);

    // Pull in the distinctive Google fallback faces.
    let link: HTMLLinkElement | null = null;
    if (!document.querySelector('link[data-preloader-fonts]')) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = GOOGLE_HREF;
      link.setAttribute("data-preloader-fonts", "");
      document.head.appendChild(link);
    }

    let minDone = false;
    let loaded = document.readyState === "complete";
    let fontsReady = false;

    const tryHide = () => {
      if (minDone && loaded && fontsReady) setVisible(false);
    };

    const minTimer = window.setTimeout(
      () => {
        minDone = true;
        tryHide();
      },
      prefersReduced ? MIN_VISIBLE_REDUCED_MS : MIN_VISIBLE_MS
    );

    const onLoad = () => {
      loaded = true;
      tryHide();
    };
    if (!loaded) window.addEventListener("load", onLoad);

    // Wait for the display faces (and house webfonts) so the cycle is crisp
    // and the page paints cleanly on reveal.
    if (document.fonts && document.fonts.ready) {
      const warm = GOOGLE_FAMILIES.map((f) =>
        document.fonts.load(`1em "${f}"`).catch(() => undefined)
      );
      Promise.allSettled([document.fonts.ready, ...warm]).then(() => {
        fontsReady = true;
        tryHide();
      });
    } else {
      fontsReady = true;
    }

    const failsafe = window.setTimeout(() => setVisible(false), FAILSAFE_MS);

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(failsafe);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, []);

  // Word/font cycling — skipped under reduced motion, and frozen once we
  // begin exiting so there's no mid-swap flicker during the dissolve.
  useEffect(() => {
    if (reduced || !visible) return;
    const id = window.setInterval(
      () => setI((p) => (p + 1) % WORDS.length),
      SWAP_MS
    );
    return () => window.clearInterval(id);
  }, [reduced, visible]);

  const word = WORDS[i];
  const grad = gradientFor(i);

  const fillStyle: React.CSSProperties = {
    fontFamily: word.ff,
    backgroundImage: grad,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  };

  return (
    <AnimatePresence onExitComplete={() => (document.body.style.overflow = "")}>
      {visible && (
        <motion.div
          key="preloader"
          aria-hidden
          initial={{ opacity: 1 }}
          // Panel fades a touch slower than the word so the word dissolves
          // INTO the (identically-abyss) page behind it — a soft handoff.
          exit={{ opacity: 0, transition: { duration: 0.95, ease: EASE } }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-abyss px-6"
        >
          {/* Word + its still-water reflection */}
          <motion.div
            className="relative flex flex-col items-center"
            exit={{
              scale: reduced ? 1 : 1.06,
              opacity: 0,
              filter: reduced ? "none" : "blur(7px)",
              transition: { duration: 0.7, ease: EASE },
            }}
          >
            <span
              key={i}
              lang={word.lang}
              dir={word.dir}
              style={fillStyle}
              className="block text-center text-5xl leading-none sm:text-6xl md:text-7xl"
            >
              {word.t}
            </span>

            {/* Mirrored echo — the LULU "reflection in still water" motif */}
            <span
              aria-hidden
              dir={word.dir}
              className="pointer-events-none mt-1 block select-none text-center text-5xl leading-none sm:text-6xl md:text-7xl"
              style={{
                ...fillStyle,
                transform: "scaleY(-1)",
                opacity: 0.16,
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 72%)",
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 72%)",
              }}
            >
              {word.t}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ *
 * Adding the real premium fonts (optional upgrade)
 *
 * Drop the font files into /public/fonts, then add to app/globals.css:
 *
 *   @font-face {
 *     font-family: "Ronthel Brush";
 *     src: url("/fonts/RonthelBrush.woff2") format("woff2");
 *     font-display: swap;
 *   }
 *   @font-face {
 *     font-family: "Burn Out";
 *     src: url("/fonts/BurnOut.woff2") format("woff2");
 *     font-display: swap;
 *   }
 *   @font-face {
 *     font-family: "Palpiyo";
 *     src: url("/fonts/Palpiyo.woff2") format("woff2");
 *     font-display: swap;
 *   }
 *
 * No change needed here — the stacks above already prefer them, and you can
 * add each new family to GOOGLE_FAMILIES-style warming if you want the gate
 * to wait on them too.
 * ------------------------------------------------------------------ */
