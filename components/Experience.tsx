"use client";

import { EXPERIENCE } from "@/lib/content";
import { Eyebrow, Heading } from "@/components/ui/Section";
import { useReveal } from "@/hooks/useReveal";

export default function Experience() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.12 });
  return (
    <section
      id="experience"
      ref={ref}
      className="relative border-t border-foam/10 bg-abyss px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-[1280px]">
        <Eyebrow>Experience</Eyebrow>
        <Heading className="mt-4">
          Where I&apos;ve made
          <br />
          an <em className="italic text-tide">impact.</em>
        </Heading>

        <div className="mt-14">
          {EXPERIENCE.map((job) => (
            <article
              key={job.company + job.date}
              data-reveal
              className="group grid gap-6 border-t border-foam/10 py-10 transition-[padding] duration-500 ease-smooth last:border-b hover:pl-4 md:grid-cols-[210px_1fr] md:gap-12"
            >
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-mist/55">
                  {job.date}
                </div>
                <div className="mt-2 font-sans text-[13px] font-medium text-tide">
                  {job.company}
                </div>
                <span className="mt-3 inline-flex rounded-full border border-tide/25 bg-tide/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-tide">
                  {job.type}
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl font-medium text-foam">
                  {job.role}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {job.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-[15px] font-light leading-relaxed text-mist/70">
                      <span className="mt-1 text-tide">→</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {job.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-foam/10 bg-deep/30 px-3 py-1 font-mono text-[11px] tracking-wide text-mist/65"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
