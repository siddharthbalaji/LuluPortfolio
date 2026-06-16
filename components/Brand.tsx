"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/lib/content";
import { Eyebrow, Heading } from "@/components/ui/Section";
import { useReveal } from "@/hooks/useReveal";
import LogoMark from "@/components/LogoMark";

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
          {/* The reflection construction — now built on the real mark */}
          <div data-reveal className="relative grid place-items-center">
            <div className="relative grid place-items-center overflow-hidden rounded-3xl border border-foam/10 bg-abyss/50 px-10 py-16">
              {/* soft tide swell behind the mark */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tide/15 blur-3xl" />

              <div className="relative z-[1] flex flex-col items-center">
                {/* the finished mark, gently floating */}
                <LogoMark
                  variant="gradient"
                  className="h-40 w-40 animate-floaty drop-shadow-[0_0_28px_rgba(74,127,167,0.4)]"
                />
                {/* still-water line */}
                <span className="my-2 h-px w-44 bg-gradient-to-r from-transparent via-tide/50 to-transparent" />
                {/* the mirrored, fading echo beneath — the signature reflection */}
                <motion.div
                  initial={{ opacity: 0, y: -24 }}
                  whileInView={{ opacity: 0.22, y: 0 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-40 w-40 origin-top -scale-y-100 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),transparent_72%)] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),transparent_72%)]"
                >
                  <LogoMark variant="gradient" className="h-full w-full" />
                </motion.div>
              </div>

              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest2 text-tide">
                ルル · the finished mark
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
