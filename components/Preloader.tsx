"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Preloader — "Designer" cycling across languages and the four house fonts,
 * fast but each frame fully legible, with the signature still-water reflection
 * echoed beneath. A single luminous line morphs through the primitive shapes
 * (circle → triangle → star → oval) while slowly rotating, below the word.
 *
 * Dismisses once the window has loaded, the webfonts are ready, AND a short
 * minimum has elapsed (so the effect is seen), with a hard failsafe. Respects
 * reduced-motion by freezing on a single word + a still shape instead of motion.
 */

// Native font stacks for scripts the house fonts don't cover, so Korean,
// Arabic, etc. render in a real face on every OS instead of a tofu fallback.
const KR = '"Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", "Noto Sans CJK KR", sans-serif';
const AR = '"Geeza Pro", "Damascus", "Noto Naskh Arabic", "Noto Sans Arabic", "Segoe UI", Tahoma, sans-serif';
const DEVA = '"Kohinoor Devanagari", "Noto Sans Devanagari", Mangal, system-ui, sans-serif';
const THAI = '"Thonburi", "Leelawadee UI", "Noto Sans Thai", system-ui, sans-serif';
const SYS = "system-ui, -apple-system, Segoe UI, sans-serif"; // Cyrillic / Greek

// Each frame is a translation of "Designer" paired with a typeface. Latin words
// rotate across the house fonts (Fraunces / Hanken / Space Mono) to show the
// type; `ff` overrides with a native stack for non-Latin scripts.
type Frame = { t: string; f?: string; ff?: string; dir?: "rtl"; lang: string };

const WORDS: Frame[] = [
  { t: "Designer", f: "font-display", lang: "en" },
  { t: "デザイナー", f: "font-jp", lang: "ja" },
  { t: "Diseñador", f: "font-sans", lang: "es" },
  { t: "Concepteur", f: "font-mono", lang: "fr" },
  { t: "디자이너", ff: KR, lang: "ko" }, // Korean — compulsory, native stack
  { t: "Дизайнер", ff: SYS, lang: "ru" },
  { t: "Designer", f: "font-display italic", lang: "it" },
  { t: "设计师", f: "font-jp", lang: "zh" },
  { t: "مصمم", ff: AR, dir: "rtl", lang: "ar" }, // Arabic — compulsory, RTL
  { t: "Gestalter", f: "font-mono", lang: "de" },
  { t: "डिज़ाइनर", ff: DEVA, lang: "hi" }, // Hindi
  { t: "Nhà thiết kế", f: "font-sans", lang: "vi" }, // replaces Tamil
  { t: "Σχεδιαστής", ff: SYS, lang: "el" },
  { t: "นักออกแบบ", ff: THAI, lang: "th" },
  { t: "Projetista", f: "font-mono", lang: "pt" },
];

const SWAP_MS = 220; // ~4.5 swaps/sec — rapid, but each word stays fully opaque
const MIN_VISIBLE_MS = 2000; // ensure the effect is seen before exit
const MIN_VISIBLE_REDUCED_MS = 900;
const FAILSAFE_MS = 6000; // never trap the user behind the loader

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [i, setI] = useState(0);

  // Ready logic + scroll lock.
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReduced(prefersReduced);

    let minDone = false;
    let loaded = document.readyState === "complete";
    let fontsReady = false;

    const tryHide = () => {
      if (minDone && loaded && fontsReady) setVisible(false);
    };

    const minTimer = window.setTimeout(() => {
      minDone = true;
      tryHide();
    }, prefersReduced ? MIN_VISIBLE_REDUCED_MS : MIN_VISIBLE_MS);

    const onLoad = () => {
      loaded = true;
      tryHide();
    };
    if (!loaded) window.addEventListener("load", onLoad);

    // Wait for webfonts so the page paints cleanly (no font swap) on reveal.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
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

  // Word/font cycling — skipped under reduced motion (no flashing).
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setI((p) => (p + 1) % WORDS.length),
      SWAP_MS
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  const word = WORDS[i];

  return (
    <AnimatePresence onExitComplete={() => (document.body.style.overflow = "")}>
      {visible && (
        <motion.div
          key="preloader"
          aria-hidden
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-10 bg-abyss px-6"
        >
          {/* Word + its still-water reflection */}
          <div className="relative flex flex-col items-center">
            <span
              key={i}
              lang={word.lang}
              dir={word.dir}
              style={word.ff ? { fontFamily: word.ff } : undefined}
              className={`${word.f ?? ""} block text-center text-5xl font-light leading-none text-foam sm:text-6xl md:text-7xl`}
            >
              {word.t}
            </span>

            {/* Mirrored echo — the LULU "reflection in still water" motif */}
            <span
              aria-hidden
              dir={word.dir}
              className={`${word.f ?? ""} pointer-events-none mt-1 block select-none text-center text-5xl font-light leading-none text-mist sm:text-6xl md:text-7xl`}
              style={{
                ...(word.ff ? { fontFamily: word.ff } : {}),
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
          </div>

          {/* Custom morphing line loader */}
          <MorphLoader reduced={reduced} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* MorphLoader — one luminous line that morphs through the design
   primitives (circle → triangle → star → oval) while slowly rotating.
   Paths share identical command structure so Framer interpolates the
   `d` attribute smoothly. Static first shape under reduced motion.     */

const SHAPES = [
  "M94.00 60.00 C94.00 69.81 85.50 84.54 77.00 89.44 C68.50 94.35 51.50 94.35 43.00 89.44 C34.50 84.54 26.00 69.81 26.00 60.00 C26.00 50.19 34.50 35.46 43.00 30.56 C51.50 25.65 68.50 25.65 77.00 30.56 C85.50 35.46 94.00 50.19 94.00 60.00 Z",
  "M94.00 60.00 C94.00 64.91 77.00 69.81 68.50 74.72 C60.00 79.63 47.25 91.90 43.00 89.44 C38.75 86.99 43.00 69.81 43.00 60.00 C43.00 50.19 38.75 33.01 43.00 30.56 C47.25 28.10 60.00 40.37 68.50 45.28 C77.00 50.19 94.00 55.09 94.00 60.00 Z",
  "M100.12 60.00 C100.12 64.12 77.17 66.58 67.14 72.37 C57.11 78.16 43.51 96.81 39.94 94.74 C36.37 92.68 45.72 71.58 45.72 60.00 C45.72 48.42 36.37 27.32 39.94 25.26 C43.51 23.19 57.11 41.84 67.14 47.63 C77.17 53.42 100.12 55.88 100.12 60.00 Z",
  "M101.48 60.00 C101.48 69.03 85.16 82.57 75.64 87.09 C66.12 91.60 53.88 91.60 44.36 87.09 C34.84 82.57 18.52 69.03 18.52 60.00 C18.52 50.97 34.84 37.43 44.36 32.91 C53.88 28.40 66.12 28.40 75.64 32.91 C85.16 37.43 101.48 50.97 101.48 60.00 Z",
];

function MorphLoader({ reduced }: { reduced: boolean }) {
  const morph = [...SHAPES, SHAPES[0]]; // loop back to the circle

  return (
    <svg
      viewBox="0 0 120 120"
      className="h-20 w-20 md:h-24 md:w-24"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="ml-stroke" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B3CFE5" />
          <stop offset="55%" stopColor="#4A7FA7" />
          <stop offset="100%" stopColor="#F6FAFD" />
        </linearGradient>
        <filter id="ml-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={reduced ? undefined : { rotate: 360 }}
        transition={
          reduced ? undefined : { duration: 14, repeat: Infinity, ease: "linear" }
        }
      >
        {/* Soft glow underlay */}
        <motion.path
          d={SHAPES[0]}
          stroke="url(#ml-stroke)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ml-glow)"
          opacity={0.5}
          animate={reduced ? undefined : { d: morph }}
          transition={
            reduced
              ? undefined
              : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {/* Crisp line */}
        <motion.path
          d={SHAPES[0]}
          stroke="url(#ml-stroke)"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={reduced ? undefined : { d: morph }}
          transition={
            reduced
              ? undefined
              : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.g>
    </svg>
  );
}
