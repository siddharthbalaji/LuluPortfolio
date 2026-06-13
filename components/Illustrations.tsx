"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ILLUSTRATIONS, type Media } from "@/lib/media";
import { thumb } from "@/lib/cloudinary";
import { useUI } from "@/lib/store";
import { Eyebrow, Heading } from "@/components/ui/Section";

/**
 * The Reflection Reel — illustrations surface from the deep and drift
 * horizontally as you scroll, each floating above its own mirrored
 * water reflection (the LULU "reflection in still water" idea, made
 * literal for the artwork).
 *
 * Desktop: the section is pinned; vertical scroll drives a spring-smoothed
 * horizontal drift of the reel.
 * Mobile / reduced-motion: falls back to a normal swipeable, snapping track.
 */

// A curated cut keeps the reel cinematic; the full set still lives in Work.
const REEL: Media[] = ILLUSTRATIONS.slice(0, 14);

const cardVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Illustrations() {
  const open = useUI((s) => s.open);
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // `pinned` is the scroll-driven horizontal experience. We only turn it on
  // after mount, on wide screens, and when motion is allowed — otherwise we
  // render a plain swipeable track (which also works fine pre-hydration).
  const [pinned, setPinned] = useState(false);
  const [maxX, setMaxX] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      const enable = mq.matches && !reduce;
      setPinned(enable);
      const track = trackRef.current;
      if (enable && track) {
        // How far the reel must slide so its right edge reaches the viewport.
        setMaxX(Math.max(0, track.scrollWidth - window.innerWidth + 80));
      } else {
        setMaxX(0);
      }
    };
    measure();
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, [reduce]);

  // Vertical scroll progress through the (tall) pinned section -> 0..1.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -maxX]);
  // Spring smoothing is what makes the drift glide instead of track 1:1.
  const x = useSpring(rawX, { stiffness: 90, damping: 26, mass: 0.4 });

  // Pin height scales with the reel length so the drift speed feels constant.
  const pinHeight = `${Math.round(160 + REEL.length * 9)}vh`;

  const Header = (
    <div className="mb-10 lg:mb-0">
      <Eyebrow>Illustration · イラスト</Eyebrow>
      <Heading className="mt-4">
        A wall,
        <br />
        <em className="italic text-tide">reflected.</em>
      </Heading>
      <p className="mt-5 max-w-sm text-[15px] font-light leading-relaxed text-mist/70">
        Character studies, brand pieces and experiments — each one surfacing
        from the deep and mirrored on still water.
      </p>
    </div>
  );

  return (
    <section
      id="illustrations"
      ref={sectionRef}
      style={pinned ? { height: pinHeight } : undefined}
      className="relative border-t border-foam/10 bg-abyss"
    >
      {pinned ? (
        /* ---------- Desktop: pinned, scroll-driven horizontal reel ---------- */
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6 sm:px-10">
          <div className="pointer-events-none absolute left-6 top-[14vh] z-10 sm:left-10">
            {Header}
          </div>

          <motion.div
            ref={trackRef}
            style={{ x }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.07 }}
            className="edge-fade-x flex w-max items-end gap-8 pl-[2vw] pr-[10vw] pt-[26vh]"
          >
            {REEL.map((it, i) => (
              <ReflectionCard key={it.url + i} item={it} onOpen={open} />
            ))}
            <SeeAll />
          </motion.div>
        </div>
      ) : (
        /* ---------- Mobile / reduced-motion: swipeable track ---------- */
        <div className="px-6 py-24 sm:px-10">
          <div className="mx-auto max-w-[1280px]">{Header}</div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ staggerChildren: 0.06 }}
            className="edge-fade-x mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6"
            style={{ scrollbarWidth: "none" }}
          >
            {REEL.map((it, i) => (
              <div key={it.url + i} className="snap-center">
                <ReflectionCard item={it} onOpen={open} />
              </div>
            ))}
            <div className="snap-center">
              <SeeAll />
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

function ReflectionCard({
  item,
  onOpen,
}: {
  item: Media;
  onOpen: (m: Media & { kind: "image" | "video" }) => void;
}) {
  return (
    <motion.button
      variants={cardVariants}
      onClick={() => onOpen({ ...item, kind: "image" })}
      className="group relative block shrink-0 text-left"
    >
      {/* The piece */}
      <div className="relative w-[68vw] max-w-[420px] overflow-hidden rounded-2xl border border-foam/10 bg-deep/20 shadow-2xl shadow-black/40 transition-transform duration-700 ease-smooth group-hover:-translate-y-2 sm:w-[360px]">
        <img
          src={thumb(item.url)}
          alt={item.title}
          loading="lazy"
          className="block w-full transition-transform duration-700 ease-smooth group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="font-display text-base text-foam">{item.title}</span>
        </div>
      </div>

      {/* The reflection in still water — mirrored, masked, slightly rippling */}
      <div
        aria-hidden
        className="mt-1.5 w-[68vw] max-w-[420px] overflow-hidden rounded-2xl opacity-25 transition-opacity duration-700 ease-smooth group-hover:opacity-40 sm:w-[360px]"
        style={{
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 72%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 72%)",
        }}
      >
        <img
          src={thumb(item.url)}
          alt=""
          loading="lazy"
          className="block w-full -scale-y-100 blur-[1px]"
        />
      </div>
    </motion.button>
  );
}

function SeeAll() {
  return (
    <a
      href="#work"
      className="group relative grid h-[260px] w-[220px] shrink-0 place-items-center rounded-2xl border border-tide/25 bg-deep/30 text-center transition-colors duration-500 hover:border-tide"
    >
      <span className="flex flex-col items-center gap-3 px-6">
        <span className="font-display text-xl text-foam">
          See the full wall
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest2 text-tide">
          {ILLUSTRATIONS.length} pieces →
        </span>
      </span>
    </a>
  );
}
