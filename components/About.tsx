"use client";

import { PROFILE, TRAITS, XCARD } from "@/lib/content";
import { Eyebrow, Heading } from "@/components/ui/Section";
import { useReveal } from "@/hooks/useReveal";

/* Inline SVG icons — kept local so the component adds no new dependencies,
   matching the existing inline-SVG approach already used in this file. */
type IconProps = { className?: string };

function IconVerified({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="m8 12 3 3 5-6" fill="none" stroke="#0A1931" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconX({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function IconMail({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  );
}

function IconPhone({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function IconLinkedIn({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function IconReply({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function IconRepost({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function IconHeart({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

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

        <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {/* LEFT — X-style post card (custom component, not a live tweet embed) */}
          <div data-reveal className="lg:col-span-2">
            <article className="rounded-2xl border border-foam/10 bg-deep p-6 sm:p-8">
              <header className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-[1.5px] border-tide bg-abyss font-display text-lg text-mist">
                  {PROFILE.aliasGlyph}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 font-medium text-foam">
                    {XCARD.displayName}
                    {XCARD.verified && <IconVerified className="h-[18px] w-[18px] text-tide" />}
                  </div>
                  <div className="text-sm text-mist/60">{XCARD.handle}</div>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-full bg-foam px-4 py-1.5 text-sm font-medium text-abyss transition-opacity hover:opacity-90"
                >
                  Follow
                </button>
              </header>

              <p className="mt-4 font-display text-[19px] font-light italic leading-snug text-foam">
                “{PROFILE.quote}”
              </p>

              {PROFILE.bio.map((p, i) => (
                <p
                  key={i}
                  className="mt-3 text-[14.5px] font-light leading-relaxed text-foam/85"
                >
                  {p}
                </p>
              ))}

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="flex items-center gap-2 rounded-full border border-foam/12 bg-abyss/40 px-3 py-1.5 text-[12.5px] text-mist/85 transition-colors hover:text-foam"
                >
                  <IconMail className="h-3.5 w-3.5 text-tide" />
                  {PROFILE.email}
                </a>
                <a
                  href={`tel:${PROFILE.phoneHref}`}
                  className="flex items-center gap-2 rounded-full border border-foam/12 bg-abyss/40 px-3 py-1.5 text-[12.5px] text-mist/85 transition-colors hover:text-foam"
                >
                  <IconPhone className="h-3.5 w-3.5 text-tide" />
                  {PROFILE.phone}
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full border border-foam/12 bg-abyss/40 px-3 py-1.5 text-[12.5px] text-mist/85 transition-colors hover:text-foam"
                >
                  <IconLinkedIn className="h-3.5 w-3.5 text-tide" />
                  {PROFILE.linkedinLabel}
                </a>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-foam/10 pt-4 font-mono text-[11.5px] text-mist/50">
                <IconX className="h-3.5 w-3.5 text-foam/60" />
                <span>{XCARD.time}</span>
              </div>

              <div className="mt-3 flex gap-6 text-sm text-mist/60">
                <span className="flex items-center gap-1.5">
                  <IconReply className="h-4 w-4" />
                  {XCARD.stats.replies}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconRepost className="h-4 w-4" />
                  {XCARD.stats.reposts}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconHeart className="h-4 w-4" />
                  {XCARD.stats.likes}
                </span>
              </div>
            </article>
          </div>

          {/* RIGHT — floating trait cards. Outer [data-reveal] is driven by GSAP
              (entrance); inner div carries the continuous `animate-floaty` bob so
              the two transforms don't fight. */}
          <div className="flex flex-col gap-4">
            {TRAITS.map((t, i) => (
              <div key={t.name} data-reveal>
                <div
                  className="animate-floaty rounded-xl border border-foam/10 bg-deep p-4 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
                  style={{ animationDelay: `${i * 1.5}s` }}
                >
                  <span className="font-mono text-[11px] tracking-widest text-tide">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1.5 font-display text-lg font-medium text-foam">
                    {t.name}
                  </h3>
                  <p className="mt-1.5 text-[13px] font-light leading-relaxed text-mist/65">
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
