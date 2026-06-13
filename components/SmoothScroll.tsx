"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertial smooth scrolling for the whole page.
 *
 * Lenis interpolates wheel/trackpad input frame-by-frame instead of letting the
 * browser jump in discrete steps, which is what removes the "jagged" feel. It
 * scrolls the real window, so anything reading window.scrollY (e.g. the Nav) and
 * any IntersectionObserver reveals keep working untouched.
 *
 * Disabled entirely for users who prefer reduced motion — they get native scroll.
 * Native touch scrolling is left alone (smoothTouch off) since phones already
 * feel good and hijacking them tends to feel worse.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1, // smoothing — lower = smoother/heavier, higher = snappier
      wheelMultiplier: 1,
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Keep in-page anchor links (nav, footer, CTAs) smooth and correct.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      if (href === "#top") {
        e.preventDefault();
        lenis.scrollTo(0);
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement);
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
