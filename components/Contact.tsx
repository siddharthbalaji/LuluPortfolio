"use client";

import { motion } from "framer-motion";
import { PROFILE } from "@/lib/content";

const CARDS = [
  { sub: "Email", label: PROFILE.email, href: `mailto:${PROFILE.email}`, glyph: "✉" },
  { sub: "Phone", label: PROFILE.phone, href: `tel:${PROFILE.phoneHref}`, glyph: "☏" },
  { sub: "LinkedIn", label: PROFILE.linkedinLabel, href: PROFILE.linkedin, glyph: "in" },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-foam/10 bg-abyss px-6 py-28 text-center sm:px-10 lg:py-36"
    >
      {/* soft radial swell */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-tide/10 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 select-none font-jp text-[40vw] leading-none text-foam/[0.025]"
      >
        ルル
      </div>

      <div className="relative mx-auto max-w-2xl">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-tide"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tide" />
          Available for work
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-[clamp(36px,6vw,72px)] font-light leading-[1.02] text-foam"
        >
          Let&apos;s create something
          <br />
          <em className="italic text-tide">remarkable</em> together.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-md text-[15px] font-light leading-relaxed text-mist/70"
        >
          Open to freelance, full-time roles, and exciting collaborations. I&apos;d
          love to hear what you&apos;re building.
        </motion.p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {CARDS.map((c) => (
            <a
              key={c.sub}
              href={c.href}
              target={c.sub === "LinkedIn" ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex items-center gap-3.5 rounded-2xl border border-foam/12 bg-deep/25 px-6 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-tide/50 hover:bg-deep/40"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-foam/12 bg-abyss/50 font-mono text-sm text-tide">
                {c.glyph}
              </span>
              <span className="leading-tight">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-mist/45">
                  {c.sub}
                </span>
                <span className="block text-sm text-foam">{c.label}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
