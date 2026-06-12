"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/lib/content";
import { Eyebrow, Heading } from "@/components/ui/Section";
import { useReveal } from "@/hooks/useReveal";

export default function Brand() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.12 });
  return (
    <section
      id="brand"
      ref={ref}
      className="relative overflow-hidden border-t border-foam/10 bg-deep/15 px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-[1280px]">
        <Eyebrow tone="mist">Personal Brand</Eyebrow>
        <Heading className="mt-4">
          The mark behind
          <br />
          the <em className="italic text-tide">name.</em>
        </Heading>
        <p className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-mist/70" data-reveal>
          {BRAND.intro}
        </p>

        <div className="mt-16 grid items-center gap-16 lg:grid-cols-[440px_1fr]">
          {/* The reflection construction */}
          <div data-reveal className="relative grid place-items-center">
            <div className="relative grid place-items-center rounded-3xl border border-foam/10 bg-abyss/50 px-10 py-16">
              <span className="font-jp text-[150px] leading-[0.8] text-foam">ル</span>
              {/* the 180° reflected echo that completes ルル */}
              <motion.span
                initial={{ opacity: 0, rotate: 0, y: -40 }}
                whileInView={{ opacity: 0.5, rotate: 180, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-jp text-[150px] leading-[0.8] text-tide"
              >
                ル
              </motion.span>
              {/* still-water line */}
              <span className="absolute left-8 right-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-tide/40 to-transparent" />
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest2 text-tide">
                180° reflection → ルル
              </span>
            </div>
          </div>

          {/* The three-step story */}
          <ol className="flex flex-col">
            {BRAND.steps.map((s) => (
              <li
                key={s.idx}
                data-reveal
                className="group grid grid-cols-[auto_1fr] gap-5 border-t border-foam/10 py-7 last:border-b"
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="font-mono text-[11px] tracking-widest text-tide">
                    {s.idx}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-mist/45">
                    {s.kicker}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-foam">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[14px] font-light leading-relaxed text-mist/65">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
