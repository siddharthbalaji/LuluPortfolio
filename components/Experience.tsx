"use client";

import { useEffect, useRef, useState } from "react";
import { EXPERIENCE } from "@/lib/content";
import { Eyebrow, Heading } from "@/components/ui/Section";
import { useReveal } from "@/hooks/useReveal";

/* ------------------------------------------------------------------ *
 * Tunable tokens. Pass a partial `tokens` prop to override any of
 * these from the parent — card fill, gap, border opacity, path look,
 * dot size and the scroll/weave geometry are all exposed here.
 * ------------------------------------------------------------------ */
type Tokens = {
  cardFill: string; // faint deep-tinted surface fill
  cardBorder: string; // hairline border colour
  cardGap: number; // vertical px between cards
  cardPad: number; // px padding inside a card
  channel: number; // px width of the empty centre channel
  pathColor: string; // dashed spine colour
  pathWidth: number; // spine stroke width
  dash: string; // visible dash pattern
  dotSize: number; // px diameter of a node
  weaveDesktop: number; // horizontal ripple amplitude (desktop)
  weaveMobile: number; // horizontal ripple amplitude (mobile)
  revealLine: number; // 0..1 viewport fraction the draw-front rides
  dotLead: number; // px the activation leads the draw-front
  spineMobileX: number; // px x-position of the pinned mobile spine
};

const DEFAULT_TOKENS: Tokens = {
  cardFill: "rgba(26,61,99,0.22)",
  cardBorder: "rgba(246,250,253,0.07)",
  cardGap: 26,
  cardPad: 24,
  channel: 50,
  pathColor: "rgba(74,127,167,0.55)",
  pathWidth: 1.5,
  dash: "5 4",
  dotSize: 13,
  weaveDesktop: 20,
  weaveMobile: 10,
  revealLine: 0.82,
  dotLead: 6,
  spineMobileX: 16,
};

const SPRING = "cubic-bezier(0.34,1.56,0.64,1)";

type Dot = { x: number; y: number };
type Geo = { w: number; h: number; dots: Dot[]; path: string };

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/* A single dashed path that passes exactly through every node, bowing
 * gently from side to side and settling as it descends — a ripple trail
 * down the centre channel. */
function buildPath(dots: Dot[], amp: number, topY: number, botY: number) {
  if (!dots.length) return "";
  const cxv = dots[0].x;
  let d = `M ${cxv} ${topY} L ${dots[0].x} ${dots[0].y}`;
  for (let i = 1; i < dots.length; i++) {
    const a = dots[i - 1];
    const b = dots[i];
    const seg = amp * Math.max(0.4, 1 - (i - 1) * 0.12); // settle
    const dir = i % 2 === 1 ? 1 : -1;
    const c1x = a.x + dir * seg;
    const c1y = a.y + (b.y - a.y) * 0.35;
    const c2x = b.x + dir * seg;
    const c2y = a.y + (b.y - a.y) * 0.65;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;
  }
  d += ` L ${cxv} ${botY}`;
  return d;
}

export default function Experience({
  tokens,
}: {
  tokens?: Partial<Tokens>;
} = {}) {
  const T = { ...DEFAULT_TOKENS, ...tokens };

  // Header keeps the site's standard reveal (Eyebrow/Heading carry
  // [data-reveal]); the cards opt out and are driven by the spine below.
  const sectionRef = useReveal<HTMLElement>({ stagger: 0.12 });

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const rectRef = useRef<SVGRectElement>(null);
  const geoRef = useRef<Geo | null>(null);
  const reducedRef = useRef(false);

  const [geo, setGeo] = useState<Geo | null>(null);
  const [on, setOn] = useState<boolean[]>(() => EXPERIENCE.map(() => false));
  const onRef = useRef(on);
  const syncRef = useRef<() => void>();

  // Main lifecycle: measure geometry, drive the draw-front from scroll
  // with a rAF-throttled listener, and recompute on resize. No
  // ScrollTrigger — geometry is read live so the lazy Work grid above
  // can grow without leaving us pointing at stale pixel positions.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const measure = () => {
      const node = containerRef.current;
      if (!node) return;
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      if (!cards.length) return;

      const w = node.clientWidth;
      const h = node.offsetHeight;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const cxv = mobile ? T.spineMobileX : w / 2;
      const amp = mobile ? T.weaveMobile : T.weaveDesktop;

      const dots: Dot[] = cards.map((c) => ({
        x: cxv,
        y: c.offsetTop + c.offsetHeight / 2,
      }));
      const last = cards[cards.length - 1];
      const topY = cards[0].offsetTop;
      const botY = last.offsetTop + last.offsetHeight;

      const g: Geo = { w, h, dots, path: buildPath(dots, amp, topY, botY) };
      geoRef.current = g;
      setGeo(g);
    };

    const applyFront = () => {
      const g = geoRef.current;
      if (!g) return;

      let frontY: number;
      if (reducedRef.current) {
        frontY = g.h; // fully drawn, everything visible
      } else {
        const node = containerRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        frontY = clamp(
          window.innerHeight * T.revealLine - rect.top,
          0,
          g.h
        );
      }

      rectRef.current?.setAttribute("height", String(frontY));

      let changed = false;
      const next = onRef.current.slice();
      g.dots.forEach((dot, i) => {
        if (!next[i] && (reducedRef.current || frontY >= dot.y - T.dotLead)) {
          next[i] = true;
          changed = true;
        }
      });
      if (changed) {
        onRef.current = next;
        setOn(next);
      }
    };

    syncRef.current = applyFront;

    measure();

    if (reducedRef.current) {
      // Match useReveal's short-circuit: no listeners, no transforms.
      const allOn = EXPERIENCE.map(() => true);
      onRef.current = allOn;
      setOn(allOn);
      applyFront();
      const ro = new ResizeObserver(() => {
        measure();
        applyFront();
      });
      ro.observe(el);
      return () => ro.disconnect();
    }

    applyFront();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        applyFront();
        ticking = false;
      });
    };
    const onResize = () => {
      measure();
      applyFront();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    T.revealLine,
    T.dotLead,
    T.spineMobileX,
    T.weaveDesktop,
    T.weaveMobile,
  ]);

  // Once the SVG/rect mount (after geo lands in state), sync the
  // draw-front to its real position so nothing flashes undrawn.
  useEffect(() => {
    if (geo) syncRef.current?.();
  }, [geo]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative border-t border-foam/10 bg-abyss px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-[1280px]">
        <Eyebrow>Experience</Eyebrow>
        <Heading className="mt-4">
          Where I&apos;ve made
          <br />
          an <em className="italic text-tide">impact.</em>
        </Heading>

        <div ref={containerRef} className="relative mt-14">
          {/* Spine: above the card surfaces, but it only ever crosses the
              empty centre channel and the gaps between cards. Revealed by
              a clip-rect growing top→down so the decorative 5 4 dash is
              free to stay a real dash pattern. */}
          {geo && (
            <svg
              className="pointer-events-none absolute inset-0 z-10 h-full w-full"
              viewBox={`0 0 ${geo.w} ${geo.h}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="exp-spine-clip">
                  <rect ref={rectRef} x="0" y="0" width={geo.w} />
                </clipPath>
              </defs>
              <path
                d={geo.path}
                fill="none"
                stroke={T.pathColor}
                strokeWidth={T.pathWidth}
                strokeDasharray={T.dash}
                strokeLinecap="round"
                clipPath="url(#exp-spine-clip)"
              />
            </svg>
          )}

          {/* Cards */}
          <div className="flex flex-col pl-10 md:pl-0" style={{ gap: T.cardGap }}>
            {EXPERIENCE.map((job, i) => {
              const metaOnLeft = i % 2 === 0;
              const contentRight = metaOnLeft; // content half sits right
              const isOn = on[i];

              const halfMotion = (rightCol: boolean) =>
                cx(
                  "opacity-0 -translate-x-10 will-change-transform",
                  "transition duration-700",
                  rightCol ? "md:translate-x-10" : "md:-translate-x-10",
                  "data-[on=true]:opacity-100 data-[on=true]:translate-x-0",
                  "md:data-[on=true]:translate-x-0",
                  "motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none"
                );

              const meta = (
                <div
                  key="meta"
                  data-on={isOn ? "true" : "false"}
                  style={{ transitionTimingFunction: SPRING }}
                  className={cx(
                    "order-1 flex flex-col",
                    metaOnLeft ? "md:order-1" : "md:order-3",
                    metaOnLeft
                      ? "items-start text-left"
                      : "items-start text-left md:items-end md:text-right",
                    halfMotion(!metaOnLeft)
                  )}
                >
                  <div className="font-mono text-[11px] uppercase tracking-widest text-mist/55">
                    {job.date}
                  </div>
                  <div className="mt-2 font-mono text-[13px] font-medium uppercase tracking-wide text-tide">
                    {job.company}
                  </div>
                  <span className="mt-3 inline-flex rounded-full border border-tide/30 bg-tide/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-tide">
                    {job.type}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-medium text-foam">
                    {job.role}
                  </h3>
                </div>
              );

              const content = (
                <div
                  key="content"
                  data-on={isOn ? "true" : "false"}
                  style={{ transitionTimingFunction: SPRING }}
                  className={cx(
                    "order-2 flex flex-col",
                    metaOnLeft ? "md:order-3" : "md:order-1",
                    halfMotion(contentRight)
                  )}
                >
                  <ul
                    className={cx(
                      "flex flex-col gap-2.5",
                      contentRight ? "items-start md:items-end" : "items-start"
                    )}
                  >
                    {job.bullets.map((b, bi) => (
                      <li
                        key={bi}
                        className={cx(
                          "flex w-fit max-w-[44ch] gap-2 text-[15px] font-light leading-relaxed text-mist/70",
                          contentRight
                            ? "text-left md:flex-row-reverse md:text-right"
                            : "text-left"
                        )}
                      >
                        <span className="mt-[2px] shrink-0 text-tide">—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div
                    className={cx(
                      "mt-5 flex flex-wrap gap-2",
                      contentRight ? "justify-start md:justify-end" : "justify-start"
                    )}
                  >
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-foam/10 bg-abyss/55 px-2.5 py-1 font-mono text-[11px] tracking-wide text-mist/65"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );

              return (
                <article
                  key={job.company + job.date}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  style={{
                    background: T.cardFill,
                    borderColor: T.cardBorder,
                    padding: T.cardPad,
                  }}
                  className="relative rounded-2xl border"
                >
                  <div className="grid grid-cols-1 items-center gap-y-6 md:grid-cols-[minmax(0,1fr)_50px_minmax(0,1fr)] md:gap-y-0">
                    {meta}
                    <div
                      key="channel"
                      aria-hidden="true"
                      className="hidden md:order-2 md:block"
                    />
                    {content}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Nodes: their own overlay, above the path, so they stack
              cleanly regardless of each card's stacking context. */}
          {geo && (
            <div className="pointer-events-none absolute inset-0 z-20">
              {geo.dots.map((dot, i) => (
                <span
                  key={i}
                  data-on={on[i] ? "true" : "false"}
                  style={{
                    left: dot.x,
                    top: dot.y,
                    width: T.dotSize,
                    height: T.dotSize,
                    transitionTimingFunction: SPRING,
                  }}
                  className={cx(
                    "absolute -translate-x-1/2 -translate-y-1/2 scale-[0.4] rounded-full border border-tide bg-abyss opacity-0 will-change-transform",
                    "transition duration-500",
                    "data-[on=true]:scale-100 data-[on=true]:opacity-100",
                    "motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
