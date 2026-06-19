"use client";

// Adapted from React Bits "Border Glow" (reactbits.dev/components/border-glow).
// The original follows the cursor; this version is fully automatic — no hover or
// pointer interaction. The directional beam rotates continuously around the
// border via a CSS variable updated in a rAF loop, and honours reduced-motion.

import {
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

interface BorderGlowProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Mesh-gradient colours painted on the border (3 read best). */
  colors?: string[];
  /** "H S L" string for the outer glow halo. */
  glowColor?: string;
  /** Solid card background — must be opaque for the border mask to work. */
  backgroundColor?: string;
  borderRadius?: number;
  /** How far the halo bleeds beyond the card (px). */
  glowRadius?: number;
  /** Halo strength (0.1–3). */
  glowIntensity?: number;
  /** Width of the visible beam arc as a % (5–45). */
  coneSpread?: number;
  /** Seconds for one full rotation. 0 disables motion. */
  speed?: number;
  /** Opacity of the soft interior mesh fill. */
  fillOpacity?: number;
}

function parseHSL(hslStr: string) {
  const m = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!m) return { h: 205, s: 55, l: 62 };
  return { h: parseFloat(m[1]), s: parseFloat(m[2]), l: parseFloat(m[3]) };
}

function buildBoxShadow(glowColor: string, intensity: number) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, boolean][] = [
    [0, 1, 100, true], [1, 0, 60, true], [3, 0, 50, true], [6, 0, 40, true],
    [15, 0, 30, true], [25, 2, 20, true], [50, 2, 10, true],
    [1, 0, 60, false], [3, 0, 50, false], [6, 0, 40, false], [15, 0, 30, false],
    [25, 2, 20, false], [50, 2, 10, false],
  ];
  return layers
    .map(([blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100);
      return `${inset ? "inset " : ""}0px 0px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
    })
    .join(", ");
}

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors: string[]) {
  const gradients: string[] = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

const ANGLE = "var(--bg-angle)";

export default function BorderGlow({
  children,
  className = "",
  colors = ["#4A7FA7", "#B3CFE5", "#6FA8D0"],
  glowColor = "205 55 62",
  backgroundColor = "#102744",
  borderRadius = 16,
  glowRadius = 28,
  glowIntensity = 0.7,
  coneSpread = 30,
  speed = 8,
  fillOpacity = 0.5,
  style,
  ...rest
}: BorderGlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !speed) {
      el.style.setProperty("--bg-angle", "135deg");
      return;
    }

    let raf = 0;
    let start: number | null = null;
    const loop = (t: number) => {
      if (start === null) start = t;
      const deg = (((t - start) / (speed * 1000)) * 360) % 360;
      el.style.setProperty("--bg-angle", `${deg}deg`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  const mesh = buildMeshGradients(colors);
  const borderBg = mesh.map((g) => `${g} border-box`);
  const fillBg = mesh.map((g) => `${g} padding-box`);

  return (
    <div
      ref={ref}
      {...rest}
      className={`relative isolate grid ${className}`}
      style={
        {
          "--bg-angle": "90deg",
          background: backgroundColor,
          border: "1px solid rgba(246,250,253,0.10)",
          borderRadius: `${borderRadius}px`,
          transform: "translate3d(0,0,0.01px)",
          boxShadow:
            "rgba(0,0,0,0.22) 0 4px 12px, rgba(0,0,0,0.22) 0 12px 32px",
          ...style,
        } as CSSProperties
      }
    >
      {/* mesh-gradient border */}
      <div
        className="absolute inset-0 -z-[1] rounded-[inherit]"
        style={{
          border: "1px solid transparent",
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            "linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box",
            ...borderBg,
          ].join(", "),
          maskImage: `conic-gradient(from ${ANGLE} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          WebkitMaskImage: `conic-gradient(from ${ANGLE} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
        }}
      />

      {/* soft interior mesh fill near the edges */}
      <div
        className="absolute inset-0 -z-[1] rounded-[inherit]"
        style={
          {
            border: "1px solid transparent",
            background: fillBg.join(", "),
            maskImage: [
              "linear-gradient(to bottom, black, black)",
              "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
              "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
              `conic-gradient(from ${ANGLE} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
            ].join(", "),
            WebkitMaskImage: [
              "linear-gradient(to bottom, black, black)",
              "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
              "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
              `conic-gradient(from ${ANGLE} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
            ].join(", "),
            maskComposite: "subtract, add, add, add, add, add",
            WebkitMaskComposite:
              "source-out, source-over, source-over, source-over, source-over, source-over",
            opacity: fillOpacity,
            mixBlendMode: "soft-light",
          } as CSSProperties
        }
      />

      {/* outer glow halo */}
      <span
        className="pointer-events-none absolute z-[1] rounded-[inherit]"
        style={
          {
            inset: `${-glowRadius}px`,
            maskImage: `conic-gradient(from ${ANGLE} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
            WebkitMaskImage: `conic-gradient(from ${ANGLE} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
            mixBlendMode: "plus-lighter",
          } as CSSProperties
        }
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: buildBoxShadow(glowColor, glowIntensity),
          }}
        />
      </span>

      <div className="relative z-[1] rounded-[inherit]">{children}</div>
    </div>
  );
}
