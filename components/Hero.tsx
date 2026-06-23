"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROFILE, STATS } from "@/lib/content";
import CountUp from "@/components/ui/CountUp";

// The WebGL surface is client-only and sits behind the hero text.
const LineWaves = dynamic(() => import("@/components/three/LineWaves"), {
  ssr: false,
});

// The first word of the headline cycles through the disciplines.
const ROTATING = ["Motion", "Visual", "Product", "Graphic", "Brand"];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  }),
};

function RotatingWord({ words, interval = 2200 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return; // respect reduced motion — hold on the first word
    let settle: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setI((p) => (p + 1) % words.length);
      setGlitch(true);
      settle = setTimeout(() => setGlitch(false), 420);
    }, interval);
    return () => {
      clearInterval(id);
      clearTimeout(settle);
    };
  }, [reduced, words.length, interval]);

  const word = words[i];

  return (
    <span className="lulu-rot relative inline-block">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          data-text={word}
          initial={{ opacity: 0, y: "0.5em", filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.5em", filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`lulu-word inline-block text-foam ${glitch ? "is-glitch" : ""}`}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-abyss">
      {/* glitch keyframes — tinted to the water palette, gated behind reduced-motion */}
      <style>{`
        .lulu-word::before,
        .lulu-word::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          text-shadow: none; /* don't inherit the .text-halo glow on glitch layers */
        }
        @media (prefers-reduced-motion: no-preference) {
          .lulu-word.is-glitch::before {
            color: #4A7FA7;
            animation: luluGlitchA 0.42s steps(2, end);
          }
          .lulu-word.is-glitch::after {
            color: #B3CFE5;
            animation: luluGlitchB 0.42s steps(2, end);
          }
        }
        @keyframes luluGlitchA {
          0%   { opacity: 0;   transform: translate(0, 0);    clip-path: inset(0 0 0 0); }
          25%  { opacity: .65; transform: translate(-2px, 1px); clip-path: inset(0 0 64% 0); }
          50%  { opacity: .45; transform: translate(2px, -1px); clip-path: inset(56% 0 0 0); }
          75%  { opacity: .55; transform: translate(-1px, 0);   clip-path: inset(28% 0 42% 0); }
          100% { opacity: 0;   transform: translate(0, 0);    clip-path: inset(0 0 0 0); }
        }
        @keyframes luluGlitchB {
          0%   { opacity: 0;   transform: translate(0, 0);    clip-path: inset(0 0 0 0); }
          25%  { opacity: .5;  transform: translate(2px, -1px); clip-path: inset(52% 0 0 0); }
          50%  { opacity: .6;  transform: translate(-2px, 1px); clip-path: inset(0 0 58% 0); }
          75%  { opacity: .4;  transform: translate(1px, 0);    clip-path: inset(40% 0 26% 0); }
          100% { opacity: 0;   transform: translate(0, 0);    clip-path: inset(0 0 0 0); }
        }
      `}</style>

      {/* Reflective line-waves — the signature motif */}
      <div className="absolute inset-0 z-0 opacity-[0.65]">
        <LineWaves
          color1="#B3CFE5"
          color2="#4A7FA7"
          color3="#F6FAFD"
          brightness={0.18}
          speed={0.3}
          rotation={-45}
          warp={1.0}
          mouseInfluence={1.5}
        />
      </div>
      {/* depth gradient so text stays legible over the surface */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-abyss/70 via-abyss/45 to-abyss" />
      {/* feathered scrim concentrated behind the text block (content is bottom-anchored).
          Fades to transparent upward, so it reads as depth — not a card/box. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[78%] bg-gradient-to-t from-abyss via-abyss/85 to-transparent" />
      {/* faint giant katakana watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[3vw] top-[14vh] z-[1] select-none font-jp text-[34vw] leading-none text-tide/[0.05]"
      >
        ル
      </div>

      <div className="relative z-[2] mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-end px-6 pb-20 pt-32 sm:px-10 lg:pb-28">
        {/* Eyebrow */}
        <motion.div
          custom={0}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mb-7 flex items-center gap-3"
        >
          {/* <span className="h-px w-8 bg-tide" /> */}
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-mist text-halo-soft">
            {PROFILE.roleLine}
          </span>
        </motion.div>

        {/* Headline — rotating discipline above the fixed role */}
        <motion.h1
          custom={1}
          variants={fade}
          initial="hidden"
          animate="show"
          className="font-display text-[clamp(58px,11vw,150px)] font-light leading-[0.86] tracking-tight text-foam text-halo"
        >
          <span className="block">
            <RotatingWord words={ROTATING} />
          </span>
          <em className="block italic text-mist">Designer.</em>
        </motion.h1>

        {/* Intro */}
        <motion.p
          custom={2}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-[460px] text-[15px] font-light leading-relaxed text-mist text-halo-soft"
        >
          {PROFILE.tagline}
        </motion.p>

        {/* Stats */}
        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-12 grid max-w-2xl grid-cols-3 gap-8 border-t border-foam/10 pt-7"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-[clamp(30px,4vw,46px)] font-light leading-none text-foam text-halo">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-tide text-halo-soft">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-[3] hidden -translate-x-1/2 flex-col items-center gap-2 text-mist/60 hover:text-mist sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest2">Scroll</span>
        <span className="h-10 w-px animate-floaty bg-gradient-to-b from-tide to-transparent" />
      </motion.a>
    </section>
  );
}
