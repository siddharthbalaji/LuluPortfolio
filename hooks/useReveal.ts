"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Reveals direct children (or [data-reveal] descendants) of the returned ref
 * with a staggered upward fade as they scroll into view. Respects
 * prefers-reduced-motion by skipping the animation entirely.
 *
 * Uses an IntersectionObserver rather than GSAP ScrollTrigger on purpose:
 * ScrollTrigger caches each trigger's pixel position when it is created and
 * only recomputes on resize / window "load". The Work section above these
 * sections streams in `loading="lazy"` images *after* those events, which
 * grows its height and leaves every trigger below it pointing at a stale
 * position — so the section would scroll fully into view without the reveal
 * ever firing, and its contents (which start at opacity:0) stayed blank.
 * An IntersectionObserver reports the element's real-time position, so it is
 * immune to that layout shift.
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
      gsap.set(targets, { opacity: 0, y });

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger,
        });
      };

      // Fire once the element's top crosses ~82% of the viewport height,
      // matching the previous ScrollTrigger "top 82%" feel. The negative
      // bottom margin shrinks the root so the callback waits until the
      // element is genuinely on screen rather than the moment it pokes in.
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              play();
              io.disconnect();
              break;
            }
          }
        },
        { rootMargin: "0px 0px -18% 0px", threshold: 0.01 }
      );
      io.observe(el);

      // Fail-open guarantee: content must never stay invisible. If, for any
      // reason, the observer never reported (very tall element already framed
      // in the viewport, an old browser, etc.), reveal anything on screen.
      const failSafe = window.setTimeout(() => {
        if (!played && el.getBoundingClientRect().top < window.innerHeight) {
          play();
        }
      }, 2500);

      return () => {
        io.disconnect();
        window.clearTimeout(failSafe);
      };
    }, el);

    return () => ctx.revert();
  }, [y, stagger, selector]);

  return ref;
}
