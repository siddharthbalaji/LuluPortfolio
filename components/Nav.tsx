"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROFILE, NAV_LINKS } from "@/lib/content";
import LogoMark from "@/components/LogoMark";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth ${
          scrolled
            ? "border-b border-foam/10 bg-abyss/65 py-3 backdrop-blur-xl"
            : "py-6"
        }`}
      >
        <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-6 sm:px-10">
          <a href="#top" className="group flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-tide/30 bg-gradient-to-br from-deep/60 to-abyss/60 p-[5px] transition-all duration-300 group-hover:border-tide group-hover:shadow-[0_0_18px_-2px_rgba(74,127,167,0.6)]">
              <LogoMark
                variant="white"
                className="h-full w-full object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
              />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[17px] font-medium text-foam">
                {PROFILE.name}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-widest text-tide">
                {PROFILE.aliasGlyph} · {PROFILE.alias}
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative font-sans text-[13px] font-medium tracking-wide text-mist/70 transition-colors hover:text-foam"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-tide transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
            <a
              href="#contact"
              className="rounded-full bg-foam px-5 py-2 font-sans text-[13px] font-medium text-abyss transition-colors hover:bg-mist"
            >
              Get in touch
            </a>
          </ul>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className={`h-px w-6 bg-foam transition-all ${open ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-foam transition-all ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </button>
        </nav>
      </header>

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
