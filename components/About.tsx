"use client";

import { PROFILE, TRAITS } from "@/lib/content";
import { Eyebrow, Heading } from "@/components/ui/Section";
import { useReveal } from "@/hooks/useReveal";

export default function About() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section
      id="about"
      ref={ref}
      className="relative border-t border-foam/10 bg-deep/15 px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-[1280px]">
        <Eyebrow>About</Eyebrow>
        <Heading className="mt-4 max-w-3xl">
          Visual storytelling meets{" "}
          <em className="italic text-tide">purposeful</em> design.
        </Heading>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <blockquote
              data-reveal
              className="border-l-2 border-tide pl-6 font-display text-[24px] font-light italic leading-snug text-mist"
            >
              “{PROFILE.quote}”
            </blockquote>
            {PROFILE.bio.map((p, i) => (
              <p
                key={i}
                data-reveal
                className="mt-6 text-[15px] font-light leading-relaxed text-mist/70"
              >
                {p}
              </p>
            ))}

            <div className="mt-9 flex flex-col gap-3" data-reveal>
              <a href={`mailto:${PROFILE.email}`} className="group flex items-center gap-3 text-sm text-mist/80 transition-colors hover:text-foam">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-foam/12 bg-abyss/40 text-tide">✉</span>
                {PROFILE.email}
              </a>
              <a href={`tel:${PROFILE.phoneHref}`} className="group flex items-center gap-3 text-sm text-mist/80 transition-colors hover:text-foam">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-foam/12 bg-abyss/40 text-tide">☏</span>
                {PROFILE.phone}
              </a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-sm text-mist/80 transition-colors hover:text-foam">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-foam/12 bg-abyss/40 text-tide">
                  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
                </span>
                {PROFILE.linkedinLabel}
              </a>
            </div>
          </div>

          <div className="flex flex-col">
            {TRAITS.map((t, i) => (
              <div
                key={t.name}
                data-reveal
                className="group flex items-start gap-5 border-t border-foam/10 py-6 last:border-b"
              >
                <span className="pt-1 font-mono text-[11px] tracking-widest text-tide transition-colors group-hover:text-mist">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium text-foam">{t.name}</h3>
                  <p className="mt-1.5 text-[14px] font-light leading-relaxed text-mist/65">
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
