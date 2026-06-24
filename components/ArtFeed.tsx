"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ILLUSTRATIONS } from "@/lib/media";
import { thumb, full } from "@/lib/cloudinary";
import { Eyebrow } from "@/components/ui/Section";
import { useReveal } from "@/hooks/useReveal";

// Carousel geometry (px). Items are square; the track is centred on `active`.
const ITEM = 116;
const GAP = 14;
const STRIDE = ITEM + GAP;
const INTERVAL = 3400; // auto-advance cadence
const SWAP = [0.65, 0, 0.35, 1] as const; // ease-in-out for the media swap
const GLIDE = [0.22, 1, 0.36, 1] as const; // ease for the carousel glide

const ART = ILLUSTRATIONS;

// A stable, plausible like-count derived from the index so it doesn't
// reshuffle on every render.
const baseLikes = (i: number) => 180 + ((i * 137) % 900);

export default function ArtFeed() {
  const ref = useReveal<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  const trackWrapRef = useRef<HTMLDivElement>(null);
  const [wrapW, setWrapW] = useState(0);

  // Honour reduced-motion: no auto-cycle, instant swaps.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Measure the carousel viewport so we can centre the active item.
  useEffect(() => {
    const el = trackWrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWrapW(el.clientWidth));
    ro.observe(el);
    setWrapW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Auto-cycle through the feed.
  useEffect(() => {
    if (paused || reduce || ART.length <= 1) return;
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % ART.length),
      INTERVAL
    );
    return () => window.clearInterval(id);
  }, [paused, reduce]);

  const current = ART[active];
  const isLiked = !!liked[active];
  const isSaved = !!saved[active];
  const likes = baseLikes(active) + (isLiked ? 1 : 0);

  // Offset that parks the active item dead-centre in the viewport.
  const x = wrapW ? wrapW / 2 - ITEM / 2 - active * STRIDE : 0;

  return (
    <section
      id="art"
      ref={ref}
      className="relative border-t border-foam/10 bg-deep/15 px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-[1280px]">
        <Eyebrow>Art Feed</Eyebrow>

        {/* Lightly animated title: the accent word shimmers like light on water. */}
        <h2
          data-reveal
          className="mt-4 font-display text-[clamp(34px,4.4vw,60px)] font-light leading-[1.02] tracking-tight text-foam"
        >
          Sketches, posted
          <br />
          to the{" "}
          <em className="text-shimmer animate-shimmer not-italic italic">feed.</em>
        </h2>
        <p
          data-reveal
          className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-mist/70"
        >
          Personal illustration: characters, studies, and experiments,
          scrolling by the way they live online.
        </p>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14">
          {/* ───────────────── Instagram-style post card ───────────────── */}
          {/* Plain <article> on purpose: this node carries `data-reveal`, whose
              opacity is driven by GSAP. Making it a framer `motion` element would
              let framer also claim the node's inline style and fight the reveal. */}
          <article
            data-reveal
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="w-full overflow-hidden rounded-2xl border border-foam/12 bg-abyss/70 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)] backdrop-blur-sm"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-tide to-deep font-jp text-[15px] leading-none text-foam ring-2 ring-tide/40">
                ル
              </span>
              <div className="leading-tight">
                <div className="font-sans text-[13px] font-semibold text-foam">
                  siddharth.lulu
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wide text-mist/55">
                  Original work · ルル
                </div>
              </div>
              <button
                aria-label="More options"
                className="ml-auto flex h-7 w-7 items-center justify-center text-mist/60 transition-colors hover:text-foam"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="1.6" />
                  <circle cx="12" cy="12" r="1.6" />
                  <circle cx="19" cy="12" r="1.6" />
                </svg>
              </button>
            </div>

            {/* Media — crossfades on swap, easing in and out */}
            <div className="relative aspect-square w-full overflow-hidden bg-abyss">
              <AnimatePresence initial={false}>
                <motion.img
                  key={current.url}
                  src={full(current.url)}
                  alt={current.title}
                  initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reduce ? 1 : 0.99 }}
                  transition={{ duration: reduce ? 0 : 0.62, ease: SWAP }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 pt-3">
              <div className="flex items-center gap-4">
                <button
                  aria-label={isLiked ? "Unlike" : "Like"}
                  onClick={() =>
                    setLiked((m) => ({ ...m, [active]: !m[active] }))
                  }
                  className="transition-transform active:scale-90"
                >
                  <motion.svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    animate={{ scale: isLiked ? [1, 1.25, 1] : 1 }}
                    transition={{ duration: 0.32 }}
                    fill={isLiked ? "#f0506e" : "none"}
                    stroke={isLiked ? "#f0506e" : "currentColor"}
                    strokeWidth="1.8"
                    className={isLiked ? "" : "text-foam"}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21s-7.5-4.6-10-9.2C.6 9 1.6 5.5 4.8 4.8 7 4.3 8.9 5.4 12 8c3.1-2.6 5-3.7 7.2-3.2C22.4 5.5 23.4 9 22 11.8 19.5 16.4 12 21 12 21z"
                    />
                  </motion.svg>
                </button>

                <button aria-label="Comment" className="text-foam transition-opacity hover:opacity-70">
                  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" />
                  </svg>
                </button>

                <button aria-label="Share" className="text-foam transition-opacity hover:opacity-70">
                  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>

                <button
                  aria-label={isSaved ? "Remove from saved" : "Save"}
                  onClick={() =>
                    setSaved((m) => ({ ...m, [active]: !m[active] }))
                  }
                  className="ml-auto text-foam transition-transform active:scale-90"
                >
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill={isSaved ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-4.5L5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </button>
              </div>

              <div className="mt-3 font-sans text-[13px] font-semibold text-foam">
                {likes.toLocaleString()} likes
              </div>

              {/* Caption — the title animates with the active piece */}
              <div className="mt-1 text-[13px] leading-snug text-mist/85">
                <span className="font-semibold text-foam">siddharth.lulu</span>{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={current.url}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.4 }}
                    className="font-light"
                  >
                    {current.title}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="mt-2 font-mono text-[10px] uppercase tracking-wide text-mist/45">
                {active + 1} / {ART.length} · digital illustration
              </div>
            </div>
          </article>

          {/* ───────────────── Auto-cycling horizontal carousel ───────────────── */}
          <div
            data-reveal
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest2 text-tide">
                The feed
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wide text-mist/45">
                {paused ? "Paused" : "Auto-playing"} · tap to feature
              </span>
            </div>

            {/* edge-fade-x masks the ends so frames fade in and out of view */}
            <div
              ref={trackWrapRef}
              className="edge-fade-x relative overflow-hidden py-3"
            >
              <motion.div
                className="flex"
                style={{ gap: `${GAP}px` }}
                animate={{ x }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.7, ease: GLIDE }
                }
              >
                {ART.map((it, i) => {
                  const on = i === active;
                  return (
                    <motion.button
                      key={it.url}
                      onClick={() => setActive(i)}
                      aria-label={`Show ${it.title}`}
                      aria-current={on}
                      style={{ width: `${ITEM}px` }}
                      animate={{
                        opacity: on ? 1 : 0.42,
                        scale: on ? 1 : 0.9,
                      }}
                      transition={
                        reduce ? { duration: 0 } : { duration: 0.5, ease: GLIDE }
                      }
                      className={`group relative aspect-square shrink-0 overflow-hidden rounded-xl border bg-abyss/40 ${
                        on
                          ? "border-tide ring-1 ring-tide/60"
                          : "border-foam/10 hover:border-tide/40"
                      }`}
                    >
                      <img
                        src={thumb(it.url)}
                        alt={it.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                      />
                      {!on && (
                        <span className="absolute inset-0 bg-abyss/30 transition-opacity group-hover:opacity-0" />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            {/* Auto-advance progress — a thin tide line that refills each cycle */}
            <div className="mt-5 h-px w-full overflow-hidden bg-foam/10">
              {!reduce && (
                <motion.div
                  key={`${active}-${paused}`}
                  className="h-full bg-tide"
                  initial={{ width: paused ? undefined : "0%" }}
                  animate={{ width: paused ? "100%" : "100%" }}
                  transition={{
                    duration: paused ? 0 : INTERVAL / 1000,
                    ease: "linear",
                  }}
                />
              )}
            </div>

            <p className="mt-5 max-w-sm text-[13px] font-light leading-relaxed text-mist/55">
              The strip glides on its own. Frames ease past the edges and fade
              as they go. Tap any frame to pin it to the post above.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
