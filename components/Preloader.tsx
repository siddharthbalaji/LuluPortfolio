"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Preloader — "Designer" cycling across languages and the four house fonts,
 * fast but each frame fully legible, with the signature still-water reflection
 * echoed beneath. The Cube SVG self-animates below.
 *
 * Dismisses once the window has loaded AND a short minimum has elapsed (so the
 * effect is actually seen), with a hard failsafe. Respects reduced-motion by
 * freezing on a single word instead of flashing.
 */

const CUBE_SVG =
  "https://res.cloudinary.com/dxqucwyyo/image/upload/q_auto/f_auto/v1781865963/Cube_Preloader_kdrjpg.svg";

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

          {/* Self-animating cube */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CUBE_SVG}
            alt=""
            draggable={false}
            className="h-20 w-20 select-none opacity-90 md:h-24 md:w-24"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
