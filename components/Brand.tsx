"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/lib/content";
import { Eyebrow, Heading } from "@/components/ui/Section";
import { useReveal } from "@/hooks/useReveal";
import LogoMark from "@/components/LogoMark";

// ── Button cards ────────────────────────────────────────────────────────────
// To make Card 2 live later, just paste your store/merch URL into `href` below.
const WIP_BADGE =
  "https://res.cloudinary.com/dxqucwyyo/image/upload/v1782458075/under-construction-sign-icon_lhhmga.png";

type BrandLink = {
  title: string;
  desc: string;
  href: string;
  icon: "books" | "cart";
  wip?: boolean;
};

const BRAND_LINKS: BrandLink[] = [
  {
    title: "Take a Look at My Books",
    desc: "Browse the full collection on my books page.",
    href: "https://www.books.lulusidd.com/",
    icon: "books",
  },
  {
    title: "Work in Progress",
    desc: "My store & merch — launching soon.",
    href: "", // ← add your store / merchandise URL here later
    icon: "cart",
    wip: true,
  },
];

function CardIcon({ icon }: { icon: BrandLink["icon"] }) {
  if (icon === "books") {
    // open book resting in its cover — pages fanning out
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7.5H1.6V19a.6.6 0 0 0 .8.58C5.9 18.4 9.3 18.8 12 20.2c2.7-1.4 6.1-1.8 9.6-.62a.6.6 0 0 0 .8-.58V7.5H21" />
        <path d="M12 8.1C10.3 6.3 7.6 5.4 4.7 5.4a.55.55 0 0 0-.55.55V16.3a.55.55 0 0 0 .55.55c2.8 0 5.3.75 7.3 2.25" />
        <path d="M12 8.1c1.7-1.8 4.4-2.7 7.3-2.7a.55.55 0 0 1 .55.55V16.3a.55.55 0 0 1-.55.55c-2.8 0-5.3.75-7.3 2.25" />
        <path d="M12 8.1V19.1" />
      </svg>
    );
  }
  // shopping cart — tapered basket, three bars, two wheels
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.6 3.1H3.4a1 1 0 0 1 .97.78L4.8 6.2" />
      <path d="M4.8 6.2H21.4L19.2 13.2H6.7Z" />
      <path d="M6.7 13.2l.55 1.9a2.1 2.1 0 0 0 2 1.5H19" />
      <path d="M9.6 8.4V11M13 8.4V11M16.4 8.4V11" />
      <circle cx="9.7" cy="20.1" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="17.6" cy="20.1" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

const Arrow = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function BrandCard({ link }: { link: BrandLink }) {
  const isLive = link.href.trim().length > 0;

  const shell =
    "group relative flex items-center gap-4 rounded-2xl border border-foam/10 bg-deep/25 p-5 " +
    "shadow-[0_4px_12px_rgba(0,0,0,0.22),0_12px_32px_rgba(0,0,0,0.18)] " +
    "transition-all duration-500 ease-smooth outline-none";
  const liveHover =
    " hover:-translate-y-1 hover:border-tide/40 hover:bg-deep/40 " +
    "hover:shadow-[0_10px_28px_rgba(10,25,49,0.55),0_0_30px_rgba(74,127,167,0.28)] " +
    "focus-visible:-translate-y-1 focus-visible:border-tide/50 focus-visible:ring-2 focus-visible:ring-tide/60 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-abyss";

  const inner = (
    <>
      {/* icon (sits beside the title — clear visual hierarchy) */}
      <span className="relative shrink-0">
        {link.wip && (
          // mini work-in-progress badge, glowing yellow, above the icon
          <span className="pointer-events-none absolute -right-2.5 -top-3 z-[2] grid place-items-center">
            <span className="absolute h-7 w-7 animate-pulse rounded-full bg-yellow-400/45 blur-md" />
            <img
              src={WIP_BADGE}
              alt=""
              aria-hidden="true"
              className="relative h-7 w-7 animate-floaty object-contain drop-shadow-[0_0_8px_rgba(250,204,21,0.9)] brightness-0 invert"
            />
          </span>
        )}
        <span className="grid h-12 w-12 place-items-center rounded-xl border border-foam/12 bg-abyss/50 text-tide transition-all duration-500 group-hover:scale-105 group-hover:border-tide/40 group-hover:text-mist">
          <CardIcon icon={link.icon} />
        </span>
      </span>

      {/* title + supporting line */}
      <span className="min-w-0">
        <span className="block font-display text-[17px] font-medium leading-tight text-foam">
          {link.title}
        </span>
        <span className="mt-1 block text-[13px] font-light leading-snug text-mist/60">
          {link.desc}
        </span>
      </span>

      {/* trailing affordance */}
      {isLive ? (
        <span className="ml-auto shrink-0 self-center text-tide opacity-50 transition-all duration-500 group-hover:translate-x-1 group-hover:text-mist group-hover:opacity-100">
          <Arrow />
        </span>
      ) : (
        <span className="ml-auto shrink-0 self-center rounded-full border border-yellow-400/30 bg-yellow-400/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-yellow-300/90">
          Soon
        </span>
      )}
    </>
  );

  if (isLive) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={link.title}
        className={shell + liveHover}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      role="link"
      aria-disabled="true"
      aria-label={`${link.title} — coming soon`}
      className={shell + " cursor-default"}
    >
      {inner}
    </div>
  );
}

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

          {/* The three-step story (compact) + the two button cards */}
          <div>
            <ol className="flex flex-col">
              {BRAND.steps.map((s) => (
                <li
                  key={s.idx}
                  data-reveal
                  className="group grid grid-cols-[56px_1fr] gap-4 border-t border-foam/10 py-4 first:border-t-0 first:pt-0"
                >
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="font-mono text-[11px] tracking-widest text-tide">
                      {s.idx}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-mist/45">
                      {s.kicker}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium leading-tight text-foam">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-[13px] font-light leading-relaxed text-mist/65">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Button cards */}
            <div data-reveal className="mt-8 grid gap-4 sm:grid-cols-2">
              {BRAND_LINKS.map((link) => (
                <BrandCard key={link.title} link={link} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
