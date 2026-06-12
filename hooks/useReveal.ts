"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reveals direct children (or [data-reveal] descendants) of the returned ref
 * with a staggered upward fade as they scroll into view. Respects
 * prefers-reduced-motion by skipping the animation entirely.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(opts?: {
  y?: number;
  stagger?: number;
  selector?: string;
}) {
  const ref = useRef<T>(null);
  const { y = 28, stagger = 0.09, selector = "[data-reveal]" } = opts || {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(el.querySelectorAll<HTMLElement>(selector));
    if (!targets.length) return;

    if (reduce) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, stagger, selector]);

  return ref;
}
