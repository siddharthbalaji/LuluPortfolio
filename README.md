# Siddharth Balaji — Portfolio (LULU)

A modern, Awwwards-style portfolio for **Siddharth Balaji** (alias *Lulu* / ルル) — a
product, visual & motion designer. The entire identity is built around a single
idea drawn from the LULU brand: **reflection in still water**. The palette is the
depth of water, the hero is a live rippling WebGL surface, and the brand section
makes the 180° katakana reflection literal.

## Stack

- **Next.js 14** — App Router, TypeScript
- **Tailwind CSS v3**
- **Three.js + React Three Fiber + Drei** — the hero water surface
- **Framer Motion** (UI transitions) + **GSAP / ScrollTrigger** (scroll reveals)
- **Zustand** — lightbox state
- **Vercel** — hosting target

## Palette

| Token | Hex | Role |
|-------|-----|------|
| `abyss` | `#0A1931` | Base background (deep water) |
| `deep`  | `#1A3D63` | Elevated surfaces / cards |
| `tide`  | `#4A7FA7` | Interactive / accent |
| `mist`  | `#B3CFE5` | Soft text & secondary |
| `foam`  | `#F6FAFD` | Near-white text on dark |

## Typography

- **Fraunces** — editorial display serif (headlines)
- **Hanken Grotesk** — body / UI
- **Space Mono** — labels, data, captions
- **Noto Sans JP** — the ルル brand glyphs

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Project structure

```
app/                # App Router entry, layout, global styles
components/         # Section components (Hero, Work, About, …)
  three/           # WaterScene (R3F)
  ui/              # Shared primitives (Section, CountUp)
hooks/useReveal.ts # GSAP ScrollTrigger reveal hook
lib/
  media.ts         # All poster / illustration / video URLs (auto-generated)
  content.ts       # Bio, experience, skills, education, brand copy
  cloudinary.ts    # On-the-fly thumbnail transforms
  store.ts         # Zustand lightbox store
  fonts.ts         # next/font setup
```

## Media

All imagery and video are served from Cloudinary. The grid requests resized,
auto-format thumbnails via `lib/cloudinary.ts`; the lightbox loads larger
renditions. To swap assets, edit `lib/media.ts`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Next.js.
3. No environment variables are required.

```bash
git init
git add .
git commit -m "Portfolio: Siddharth Balaji / LULU"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Accessibility & performance

- Respects `prefers-reduced-motion` (animations and the water swell are disabled).
- Keyboard-accessible nav, lightbox (Esc to close), and focus-visible states.
- Lazy-loaded imagery, `preload="none"` video, dynamic (client-only) WebGL.
