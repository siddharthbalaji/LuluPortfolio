"use client";

import { useState } from "react";
import { EDUCATION } from "@/lib/content";
import { Eyebrow, Heading } from "@/components/ui/Section";
import { useReveal } from "@/hooks/useReveal";

export default function Education() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.12 });
  const [active, setActive] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <section
      id="education"
      ref={ref}
      className="relative border-t border-foam/10 bg-abyss px-6 py-24 sm:px-10 lg:py-32"
    >
      {/* Cursor-following preview image */}
      <img
        src={active ?? ""}
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 h-52 w-40 rounded-2xl border border-foam/20 object-cover shadow-2xl transition-[opacity,transform] duration-200 ease-out will-change-transform"
        style={{
          opacity: active ? 1 : 0,
          transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${active ? 1 : 0.85})`,
        }}
      />

      <div className="mx-auto max-w-[1280px]">
        <Eyebrow>Education</Eyebrow>
        <Heading className="mt-4">
          The foundation of
          <br />
          my <em className="italic text-tide">craft.</em>
        </Heading>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {EDUCATION.map((e) => (
            <div
              key={e.school}
              data-reveal
              onMouseEnter={() => setActive(e.image)}
              onMouseLeave={() => setActive(null)}
              onMouseMove={(ev) => setPos({ x: ev.clientX, y: ev.clientY })}
              className="group relative cursor-none overflow-hidden rounded-2xl border border-foam/10 bg-deep/20 p-9 transition-all duration-500 hover:-translate-y-1 hover:border-tide/40"
            >
              <span className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-tide to-mist transition-transform duration-500 group-hover:scale-x-100" />
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-foam/12 bg-abyss/50 text-tide">
                {e.icon === "ma" ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="13" rx="1.5" /><path d="M8 21h8M12 17v4" />
                  </svg>
                )}
              </span>
              <h3 className="mt-6 font-display text-[22px] font-medium text-foam">
                {e.school}
              </h3>
              <p className="mt-1 text-sm font-light text-mist/70">{e.degree}</p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-tide">
                {e.date}
              </p>
              <p className="mt-5 border-t border-foam/10 pt-5 text-[13px] font-light leading-relaxed text-mist/60">
                {e.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
