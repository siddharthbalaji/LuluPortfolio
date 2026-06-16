"use client";

/**
 * Nav — a macOS-style magnifying "dock" rendered as the top navbar.
 *
 * Adapted from the React Bits <Dock /> pattern, but rebuilt on this site's own
 * stack and identity:
 *   • framer-motion (already a dependency) instead of the `motion` package
 *   • the water palette (abyss / deep / tide / mist / foam) + Space Mono labels
 *   • inline stroke SVGs (the convention used everywhere else in /components)
 *   • prefers-reduced-motion respected (magnification collapses to a static bar)
 *
 * The magnification is the one bold gesture; everything around it stays quiet.
 * On touch / small screens the dock steps aside for the existing hamburger menu.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type SpringOptions,
} from "framer-motion";
import { PROFILE, NAV_LINKS } from "@/lib/content";
import LogoMark from "@/components/LogoMark";

/* ------------------------------------------------------------------ icons -- */
/* Stroke-based, 24-viewBox, currentColor — matching the rest of the site.   */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<string, ReactNode> = {
  "#work": (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  "#about": (
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5S20 17 20 21" />
    </svg>
  ),
  "#experience": (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  ),
  "#illustrations": (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M14.5 4.5l5 5L9 20H4v-5L14.5 4.5z" />
      <path d="M13 6l5 5" />
    </svg>
  ),
  "#skills": (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  ),
  "#brand": (
    // a droplet — the LULU "reflection in still water" identity
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M12 3.2c2.8 3.4 5.5 6.3 5.5 9.6a5.5 5.5 0 0 1-11 0c0-3.3 2.7-6.2 5.5-9.6z" />
    </svg>
  ),
  "#contact": (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M21.5 2.5L11 13" />
      <path d="M21.5 2.5l-6.8 19-3.7-8.5L2.5 9.3l19-6.8z" />
    </svg>
  ),
};

/* --------------------------------------------------------------- dock sizing */

const BASE = 42;
const MAG = 58;
const DISTANCE = 130;
const SPRING: SpringOptions = { mass: 0.1, stiffness: 170, damping: 14 };

type DockEntry = {
  id: string; // section id for scroll-spy ("top", "work", …)
  href: string;
  label: string;
  icon: ReactNode;
  accent?: boolean; // the primary action ("Get in touch")
};

/* -------------------------------------------------------------- DockItem -- */

function DockItem({
  entry,
  mouseX,
  active,
  reduce,
  onNavigate,
}: {
  entry: DockEntry;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  active: boolean;
  reduce: boolean;
  onNavigate: (id: string) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  const distanceFromMouse = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: BASE,
    };
    return val - rect.x - rect.width / 2;
  });

  const target = useTransform(
    distanceFromMouse,
    [-DISTANCE, 0, DISTANCE],
    [BASE, MAG, BASE]
  );
  const animatedSize = useSpring(target, SPRING);
  // Under reduced-motion we serve a static, non-magnifying bar.
  const size = reduce ? BASE : animatedSize;

  return (
    <motion.a
      ref={ref}
      href={entry.href}
      onClick={() => onNavigate(entry.id)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{ width: size, height: size }}
      aria-label={entry.label}
      aria-current={active ? "true" : undefined}
      className={`group relative grid shrink-0 place-items-center rounded-xl border outline-none transition-colors duration-300 ease-smooth
        focus-visible:ring-2 focus-visible:ring-tide/70
        ${
          entry.accent
            ? "border-tide/50 bg-tide/25 text-foam hover:border-tide hover:bg-tide/40"
            : active
              ? "border-tide/40 bg-deep/60 text-foam"
              : "border-foam/10 bg-deep/30 text-mist/75 hover:border-tide/40 hover:text-foam"
        }`}
    >
      {/* icon — scales gently with the item */}
      <span
        className="grid place-items-center"
        style={{ width: "46%", height: "46%" }}
      >
        {entry.icon}
      </span>

      {/* active-section indicator: a small tide bead under the item */}
      <span
        className={`pointer-events-none absolute -bottom-1.5 h-1 w-1 rounded-full bg-tide transition-opacity duration-300 ${
          active && !entry.accent ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* label tooltip — drops below, like a dock attached to the ceiling */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute top-[calc(100%+0.75rem)] left-1/2 -translate-x-1/2 whitespace-pre rounded-md border border-foam/10 bg-abyss/95 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-mist backdrop-blur-md"
          >
            {entry.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

/* ------------------------------------------------------------------- Nav -- */

export default function Nav() {
  const reduce = useReducedMotion() ?? false;
  const mouseX = useMotionValue(Infinity);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");

  // scroll-shrink state for the floating pill
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy: highlight the section currently in view
  useEffect(() => {
    const ids = ["top", ...NAV_LINKS.map((l) => l.href.slice(1)), "contact"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // build the dock: brand → section links → primary action
  const linkEntries: DockEntry[] = NAV_LINKS.map((l) => ({
    id: l.href.slice(1),
    href: l.href,
    label: l.label,
    icon: ICONS[l.href],
  }));

  const dividerCls = "mx-0.5 h-6 w-px shrink-0 self-center bg-foam/10";

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
        {/* ---------------------------------------------------- desktop dock */}
        <motion.nav
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          role="toolbar"
          aria-label="Primary"
          initial={false}
          className={`pointer-events-auto hidden items-center gap-2 rounded-2xl border px-2.5 transition-[background-color,border-color,box-shadow,padding] duration-500 ease-smooth md:flex
            ${
              scrolled
                ? "border-foam/12 bg-abyss/70 py-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                : "border-foam/10 bg-abyss/40 py-2.5 backdrop-blur-md"
            }`}
        >
          {/* brand — the LULU mark, links home */}
          <DockItem
            entry={{
              id: "top",
              href: "#top",
              label: `${PROFILE.aliasGlyph} · ${PROFILE.name}`,
              icon: (
                <LogoMark
                  variant="white"
                  className="h-full w-full object-contain opacity-90"
                />
              ),
            }}
            mouseX={mouseX}
            active={active === "top"}
            reduce={reduce}
            onNavigate={setActive}
          />

          <span className={dividerCls} aria-hidden />

          {linkEntries.map((entry) => (
            <DockItem
              key={entry.href}
              entry={entry}
              mouseX={mouseX}
              active={active === entry.id}
              reduce={reduce}
              onNavigate={setActive}
            />
          ))}

          <span className={dividerCls} aria-hidden />

          {/* primary action */}
          <DockItem
            entry={{
              id: "contact",
              href: "#contact",
              label: "Get in touch",
              icon: ICONS["#contact"],
              accent: true,
            }}
            mouseX={mouseX}
            active={active === "contact"}
            reduce={reduce}
            onNavigate={setActive}
          />
        </motion.nav>

        {/* --------------------------------------------------- mobile header */}
        <div
          className={`pointer-events-auto flex w-full items-center justify-between rounded-2xl border px-3 py-2 transition-all duration-500 ease-smooth md:hidden
            ${
              scrolled
                ? "border-foam/12 bg-abyss/75 backdrop-blur-xl"
                : "border-foam/10 bg-abyss/40 backdrop-blur-md"
            }`}
        >
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-tide/30 bg-gradient-to-br from-deep/60 to-abyss/60 p-[5px]">
              <LogoMark variant="white" className="h-full w-full object-contain" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-medium text-foam">
                {PROFILE.name}
              </span>
              <span className="block font-mono text-[9px] uppercase tracking-widest text-tide">
                {PROFILE.aliasGlyph} · {PROFILE.alias}
              </span>
            </span>
          </a>

          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
          >
            <span
              className={`h-px w-6 bg-foam transition-all ${open ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-foam transition-all ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* ----------------------------------------------- mobile full overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-abyss/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-7">
              {[...NAV_LINKS, { href: "#contact", label: "Get in touch" }].map(
                (l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i }}
                    className="font-display text-3xl font-light text-foam"
                  >
                    {l.label}
                  </motion.a>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
