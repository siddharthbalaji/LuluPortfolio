"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { POSTER_GROUPS, ILLUSTRATIONS, VIDEOS, type Media } from "@/lib/media";
import { thumb, poster } from "@/lib/cloudinary";
import { useUI } from "@/lib/store";
import { Eyebrow, Heading } from "@/components/ui/Section";

type Tab = "posters" | "illustrations" | "motion";

const TABS: { id: Tab; label: string; count: number }[] = [
  { id: "posters", label: "Posters", count: POSTER_GROUPS.reduce((a, g) => a + g.items.length, 0) },
  { id: "illustrations", label: "Illustration", count: ILLUSTRATIONS.length },
  { id: "motion", label: "Motion", count: VIDEOS.length },
];

const POSTER_CATS = ["All", ...POSTER_GROUPS.map((g) => g.category)];

export default function Work() {
  const [tab, setTab] = useState<Tab>("posters");
  const [cat, setCat] = useState("All");
  const open = useUI((s) => s.open);

  const posterItems = useMemo<Media[]>(() => {
    if (cat === "All") return POSTER_GROUPS.flatMap((g) => g.items);
    return POSTER_GROUPS.find((g) => g.category === cat)?.items ?? [];
  }, [cat]);

  return (
    <section id="work" className="relative bg-abyss px-6 py-24 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        <Eyebrow>Selected Work</Eyebrow>
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Heading>
            The archive,
            <br />
            <em className="italic text-tide">surfaced.</em>
          </Heading>
          <p className="max-w-sm text-[15px] font-light leading-relaxed text-mist/70" data-reveal>
            Over a hundred posters, a wall of illustration, and motion experiments —
            a working record of how I think across brand, type, and frame.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-12 flex flex-wrap gap-2 border-b border-foam/10 pb-px">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative -mb-px flex items-baseline gap-2 px-4 py-3 font-sans text-sm transition-colors ${
                tab === t.id ? "text-foam" : "text-mist/55 hover:text-mist"
              }`}
            >
              {t.label}
              <span className="font-mono text-[10px] text-tide">{t.count}</span>
              {tab === t.id && (
                <motion.span
                  layoutId="work-underline"
                  className="absolute inset-x-0 -bottom-px h-px bg-tide"
                />
              )}
            </button>
          ))}
        </div>

        {/* Poster category chips */}
        <AnimatePresence initial={false}>
          {tab === "posters" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-6">
                {POSTER_CATS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                      cat === c
                        ? "border-tide bg-tide/15 text-foam"
                        : "border-foam/12 text-mist/60 hover:border-tide/40 hover:text-mist"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab + cat}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="[column-fill:_balance] gap-4 [column-count:1] sm:[column-count:2] lg:[column-count:3] xl:[column-count:4]"
            >
              {tab === "posters" &&
                posterItems.map((it, i) => (
                  <ImageCard key={it.url} item={it} onOpen={open} index={i} />
                ))}
              {tab === "illustrations" &&
                ILLUSTRATIONS.map((it, i) => (
                  <ImageCard key={it.url} item={it} onOpen={open} index={i} />
                ))}
              {tab === "motion" &&
                VIDEOS.map((it, i) => (
                  <VideoCard key={it.url} item={it} onOpen={open} index={i} />
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ImageCard({
  item,
  onOpen,
  index,
}: {
  item: Media;
  onOpen: (m: Media & { kind: "image" | "video" }) => void;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.6, delay: (index % 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen({ ...item, kind: "image" })}
      className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-foam/8 bg-deep/20 text-left"
    >
      <div className="relative overflow-hidden">
        <img
          src={thumb(item.url)}
          alt={item.title}
          loading="lazy"
          className="w-full transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss/85 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="font-display text-base text-foam">{item.title}</span>
        </div>
      </div>
    </motion.button>
  );
}

function VideoCard({
  item,
  onOpen,
  index,
}: {
  item: Media;
  onOpen: (m: Media & { kind: "image" | "video" }) => void;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.6, delay: (index % 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen({ ...item, kind: "video" })}
      className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-foam/8 bg-deep/30 text-left"
    >
      <video
        src={item.url}
        poster={poster(item.url)}
        muted
        loop
        playsInline
        preload="none"
        onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
        onMouseLeave={(e) => {
          e.currentTarget.pause();
          e.currentTarget.currentTime = 0;
        }}
        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-foam/40 bg-abyss/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-foam">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss/85 to-transparent p-4">
        <span className="font-mono text-[11px] uppercase tracking-widest text-mist">
          {item.title}
        </span>
      </div>
    </motion.button>
  );
}
