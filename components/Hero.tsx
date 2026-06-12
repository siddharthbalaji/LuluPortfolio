"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { PROFILE, ROLES, STATS } from "@/lib/content";
import CountUp from "@/components/ui/CountUp";

// The WebGL surface is client-only and below the fold of the text content.
const WaterScene = dynamic(() => import("@/components/three/WaterScene"), {
  ssr: false,
});

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] overflow-hidden bg-abyss"
    >
      {/* Reflective water — the signature motif */}
      <div className="absolute inset-0 z-0 opacity-90">
        <WaterScene />
      </div>
      {/* depth gradient so text stays legible over the surface */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-abyss/85 via-abyss/35 to-abyss/95" />
      {/* faint giant katakana watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[3vw] top-[14vh] z-[1] select-none font-jp text-[34vw] leading-none text-tide/[0.05]"
      >
        ル
      </div>

      <div className="relative z-[2] mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-end px-6 pb-20 pt-32 sm:px-10 lg:pb-28">
        <motion.div
          custom={0}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mb-7 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-tide" />
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-mist">
            {PROFILE.roleLine}
          </span>
        </motion.div>

        {/* Mirrored title — the reflection made literal */}
        <div className="relative">
          <motion.h1
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="relative font-display text-[clamp(58px,11vw,150px)] font-light leading-[0.86] tracking-tight text-foam"
          >
            {PROFILE.titleLead}
            <span className="text-tide"> </span>
            <br />
            <em className="italic text-mist">{PROFILE.titleTail}</em>
          </motion.h1>
          {/* the echo */}
          <div
            aria-hidden
            className="absolute left-0 top-full -mt-2 hidden select-none font-display text-[clamp(58px,11vw,150px)] font-light leading-[0.86] tracking-tight text-foam/[0.08] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.8),transparent_55%)] [transform:scaleY(-1)] sm:block"
          >
            {PROFILE.titleLead}
            <br />
            <em className="italic">{PROFILE.titleTail}</em>
          </div>
        </div>

        <motion.p
          custom={2}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-[440px] text-[15px] font-light leading-relaxed text-mist/85"
        >
          {PROFILE.tagline}
        </motion.p>

        {/* role pills */}
        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-wrap gap-2.5"
        >
          {ROLES.map((r) => (
            <span
              key={r}
              className="rounded-full border border-tide/25 bg-deep/30 px-3.5 py-1.5 font-mono text-[12px] tracking-wide text-mist/80 backdrop-blur-sm"
            >
              {r}
            </span>
          ))}
        </motion.div>

        {/* stats */}
        <motion.div
          custom={4}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-12 grid max-w-2xl grid-cols-3 gap-8 border-t border-foam/10 pt-7"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-[clamp(30px,4vw,46px)] font-light leading-none text-foam">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-tide">
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
