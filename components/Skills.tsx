"use client";

import { SKILL_GROUPS } from "@/lib/content";
import { Eyebrow, Heading } from "@/components/ui/Section";
import { useReveal } from "@/hooks/useReveal";

const ICONS: Record<string, JSX.Element> = {
  design: (
    <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3z" />
  ),
  motion: <path d="M4 4l16 8-16 8V4z" />,
  ai: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
};

export default function Skills() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.1 });
  return (
    <section
      id="skills"
      ref={ref}
      className="relative border-t border-foam/10 bg-deep/15 px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-[1280px]">
        <Eyebrow tone="mist">Skills & Tools</Eyebrow>
        <Heading className="mt-4">
          My creative <em className="italic text-tide">arsenal.</em>
        </Heading>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-foam/10 bg-foam/5 md:grid-cols-3">
          {SKILL_GROUPS.map((g) => (
            <div
              key={g.title}
              data-reveal
              className="bg-abyss p-8 transition-colors duration-300 hover:bg-deep/30"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-tide/25 bg-tide/10 text-tide">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={g.icon === "motion" ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                >
                  {ICONS[g.icon]}
                </svg>
              </span>
              <h3 className="mt-5 font-display text-xl font-medium text-foam">
                {g.title}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span
                    key={it}
                    className="rounded-full border border-foam/10 bg-deep/30 px-3 py-1.5 font-mono text-[11px] tracking-wide text-mist/70 transition-colors hover:border-tide/40 hover:text-foam"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
