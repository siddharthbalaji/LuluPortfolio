"use client";

import { useEffect, useRef } from "react";
import { Eyebrow, Heading } from "@/components/ui/Section";
import { useReveal } from "@/hooks/useReveal";

/**
 * Skills & Tools — a realistic Safari window. Three macOS notification cards
 * (Design / Motion / AI) sit center stage as the focus; the rest of the stack
 * floats around them in layered depth. Pure CSS motion (respects
 * prefers-reduced-motion); icons are served from Cloudinary.
 */

const CLOUD =
  "https://res.cloudinary.com/dxqucwyyo/image/upload/q_auto/f_auto/";

const ICON = {
  afterEffects: "adobe-after-effects-icon_ujdd4l.svg",
  illustrator: "adobe-illustrator-icon_dop4dk.svg",
  premiere: "adobe-premiere-icon_egr2hv.svg",
  figma: "figma-icon_fai0yb.svg",
  creative: "adobe-creative-icon_c6ijhp.svg",
  framer: "framer-icon_ynqhrq.svg",
  clipStudio: "clip-studio-icon_su5uzn.svg",
  blender: "blender-icon_qqamg3.svg",
  claude: "claude-ai-icon_mwot7k.svg",
  github: "github-icon_tn5wvh.svg",
  unreal: "unreal-icon_aop5pp.svg",
  typescript: "typescript-icon_jwueon.svg",
  html: "html-icon_o7a5xr.svg",
  unity: "unity-icon_nqi9q1.svg",
  tailwind: "tailwind-css-icon_aiglpc.svg",
  gemini: "gemini-icon_jwqgiy.svg",
  react: "react-js-icon_cnqqx2.svg",
  nextjs: "nextjs-icon_oygrku.svg",
  javascript: "javascript-icon_gurqlo.svg",
  chatgpt: "chatgpt-icon_pxufes.svg",
} as const;

const url = (file: string) => `${CLOUD}${file}`;

type Floater = {
  src: string;
  alt: string;
  size: number;
  top: string;
  left: string;
  rotate: number;
  layer?: "back" | "echo";
  bob: "A" | "B" | "C";
  delay: number;
};

const FLOATERS: Floater[] = [
  // far-background echoes (blurred, dim)
  { src: ICON.figma, alt: "", size: 42, top: "30%", left: "30%", rotate: -5, layer: "echo", bob: "C", delay: -2 },
  { src: ICON.blender, alt: "", size: 44, top: "60%", left: "64%", rotate: 6, layer: "echo", bob: "A", delay: -3 },
  { src: ICON.gemini, alt: "", size: 38, top: "20%", left: "62%", rotate: 4, layer: "echo", bob: "B", delay: -1 },
  // back layer
  { src: ICON.html, alt: "HTML", size: 46, top: "9%", left: "45%", rotate: -4, layer: "back", bob: "A", delay: -1.5 },
  { src: ICON.typescript, alt: "TypeScript", size: 50, top: "73%", left: "10%", rotate: 5, layer: "back", bob: "C", delay: -2.5 },
  { src: ICON.github, alt: "GitHub", size: 48, top: "80%", left: "43%", rotate: 4, layer: "back", bob: "B", delay: -4 },
  // mid / front layer
  { src: ICON.react, alt: "React", size: 58, top: "13%", left: "9%", rotate: -8, bob: "B", delay: 0 },
  { src: ICON.nextjs, alt: "Next.js", size: 54, top: "11%", left: "80%", rotate: 7, bob: "A", delay: -1.8 },
  { src: ICON.creative, alt: "Adobe Creative Cloud", size: 54, top: "44%", left: "4%", rotate: -10, bob: "C", delay: -3.2 },
  { src: ICON.clipStudio, alt: "Clip Studio Paint", size: 52, top: "40%", left: "87%", rotate: 9, bob: "B", delay: -2.2 },
  { src: ICON.javascript, alt: "JavaScript", size: 56, top: "71%", left: "82%", rotate: -6, bob: "A", delay: -1.2 },
];

type Card = {
  appIcon: string;
  eyebrow: string;
  title: string;
  time: string;
  body: string;
  minis: { src: string; alt: string }[];
};

const CARDS: Card[] = [
  {
    appIcon: ICON.figma,
    eyebrow: "Lulu · Portfolio",
    title: "Design & UI/UX",
    time: "now",
    body: "Interface, identity & product design — Figma, Illustrator, Framer & Tailwind.",
    minis: [
      { src: ICON.figma, alt: "Figma" },
      { src: ICON.illustrator, alt: "Illustrator" },
      { src: ICON.framer, alt: "Framer" },
      { src: ICON.tailwind, alt: "Tailwind CSS" },
    ],
  },
  {
    appIcon: ICON.afterEffects,
    eyebrow: "Lulu · Studio",
    title: "Motion & 3D",
    time: "1m ago",
    body: "Animation, edit & real-time — After Effects, Premiere, Blender, Unreal & Unity.",
    minis: [
      { src: ICON.afterEffects, alt: "After Effects" },
      { src: ICON.premiere, alt: "Premiere" },
      { src: ICON.blender, alt: "Blender" },
      { src: ICON.unreal, alt: "Unreal" },
      { src: ICON.unity, alt: "Unity" },
    ],
  },
  {
    appIcon: ICON.claude,
    eyebrow: "Lulu · Lab",
    title: "AI & Emerging Tools",
    time: "2m ago",
    body: "Generative & assisted workflows — Claude, ChatGPT & Gemini.",
    minis: [
      { src: ICON.claude, alt: "Claude" },
      { src: ICON.chatgpt, alt: "ChatGPT" },
      { src: ICON.gemini, alt: "Gemini" },
    ],
  },
];

export default function Skills() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.12 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Only run the floater/ripple animations (and the backdrop-filter recompositing
  // they trigger) while the canvas is actually on screen. Off-screen, the compositor
  // would otherwise keep re-blurring the glass cards every frame for nothing.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle("st-live", entry.isIntersecting),
      { threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={ref}
      className="relative border-t border-foam/10 bg-deep/15 px-6 py-24 sm:px-10 lg:py-32"
    >
      <style>{CSS}</style>

      <div className="mx-auto max-w-[1280px]">
        <Eyebrow tone="mist">Skills &amp; Tools</Eyebrow>
        <Heading className="mt-4">
          My creative <em className="italic text-tide">arsenal.</em>
        </Heading>
        <p data-reveal className="mt-5 max-w-[48ch] font-sans text-mist/80">
          The stack I reach for across design, motion, and the new wave of
          AI-assisted work.
        </p>

        <div data-reveal className="st-browser mt-14">
          {/* toolbar */}
          <div className="st-toolbar">
            <div className="st-lights">
              <span className="st-light st-r" />
              <span className="st-light st-y" />
              <span className="st-light st-g" />
            </div>
            <div className="st-nav">
              {/* sidebar toggle */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5" /><line x1="9" y1="5" x2="9" y2="19" /></svg>
              {/* back */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              {/* forward (disabled) */}
              <svg className="st-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </div>
            <div className="st-addr">
              {/* privacy shield */}
              <span className="st-shield">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><line x1="12" y1="3.4" x2="12" y2="19.6" /></svg>
              </span>
              <div className="st-url">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm3 8H9V6a3 3 0 0 1 6 0z" /></svg>
                lulusidd.com
                <span className="st-reload">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>
                </span>
              </div>
            </div>
            <div className="st-tools">
              {/* download */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v7M8.5 11.5L12 15l3.5-3.5" /></svg>
              {/* share */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M16 6l-4-4-4 4" /><path d="M12 2v14" /></svg>
              {/* new tab */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              {/* tab overview */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="3" width="13" height="13" rx="2.5" /><rect x="3" y="8" width="13" height="13" rx="2.5" /></svg>
            </div>
          </div>

          {/* tab strip */}
          <div className="st-tabstrip">
            <div className="st-tab">
              <span className="st-fav">ル</span> Skills &amp; Tools — Lulu
            </div>
            <div className="st-tab st-ghost">＋</div>
          </div>

          {/* water canvas */}
          <div className="st-canvas" ref={canvasRef}>
            <div className="st-ripples" aria-hidden>
              <span style={{ width: 340, height: 340 }} />
              <span style={{ width: 560, height: 560 }} />
              <span style={{ width: 820, height: 820 }} />
            </div>

            {/* floating icon tiles */}
            {FLOATERS.map((f, i) => (
              <div
                key={i}
                className={`st-floater${f.layer ? " st-" + f.layer : ""} st-bob${f.bob}`}
                style={{ top: f.top, left: f.left, animationDelay: `${f.delay}s` }}
              >
                <div
                  className="st-tile"
                  style={{ width: f.size, height: f.size, transform: `rotate(${f.rotate}deg)` }}
                >
                  <img src={url(f.src)} alt={f.alt} loading="lazy" decoding="async" />
                </div>
              </div>
            ))}

            {/* notification cards */}
            <div className="st-cluster">
              {CARDS.map((c, i) => (
                <div className="st-ncard" key={i}>
                  <div className="st-nhead">
                    <div className="st-appicon">
                      <img src={url(c.appIcon)} alt="" loading="lazy" decoding="async" />
                    </div>
                    <div className="st-nmeta">
                      <div className="st-neyebrow">{c.eyebrow}</div>
                      <div className="st-ntitle">{c.title}</div>
                    </div>
                    <div className="st-ntime">{c.time}</div>
                  </div>
                  <div className="st-nbody">{c.body}</div>
                  <div className="st-minirow">
                    {c.minis.map((m, j) => (
                      <div className="st-mini" key={j}>
                        <img src={url(m.src)} alt={m.alt} loading="lazy" decoding="async" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.st-browser{position:relative;border-radius:14px;overflow:hidden;background:#0c1c34;
  box-shadow:0 2px 4px rgba(0,0,0,.3),0 30px 70px -20px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.06)}

.st-toolbar{height:54px;background:linear-gradient(#3a3f49,#2c313b);display:flex;align-items:center;gap:14px;padding:0 16px;border-bottom:1px solid rgba(0,0,0,.4);position:relative;z-index:40}
.st-lights{display:flex;gap:8px}
.st-light{width:12px;height:12px;border-radius:50%;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.2)}
.st-r{background:#ff5f57}.st-y{background:#febc2e}.st-g{background:#28c840}
.st-nav{display:flex;gap:14px;color:rgba(255,255,255,.4);margin-left:6px}
.st-nav svg{width:16px;height:16px}
.st-addr{flex:1;display:flex;align-items:center;justify-content:center;gap:9px;min-width:0}
.st-shield{display:flex;color:rgba(255,255,255,.4)}
.st-shield svg{width:16px;height:16px}
.st-dim{opacity:.55}
.st-url{position:relative;width:100%;max-width:480px;height:30px;border-radius:8px;background:rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;gap:7px;color:rgba(255,255,255,.72);font-family:var(--font-sans),system-ui,sans-serif;font-size:13px}
.st-url svg{width:11px;height:11px;opacity:.6}
.st-reload{position:absolute;right:9px;top:50%;transform:translateY(-50%);display:flex}
.st-tools{display:flex;gap:16px;color:rgba(255,255,255,.4);margin-left:auto}
.st-tools svg{width:16px;height:16px}

.st-tabstrip{height:38px;background:#272c35;display:flex;align-items:flex-end;padding:0 12px;gap:2px;position:relative;z-index:40}
.st-tab{height:30px;min-width:200px;max-width:240px;background:#0c1c34;border-radius:8px 8px 0 0;display:flex;align-items:center;gap:8px;padding:0 12px;font-family:var(--font-sans),system-ui,sans-serif;font-size:12.5px;color:#B3CFE5}
.st-fav{width:15px;height:15px;border-radius:4px;background:linear-gradient(135deg,#4A7FA7,#1A3D63);display:flex;align-items:center;justify-content:center;font-family:var(--font-jp),sans-serif;font-size:9px;color:#F6FAFD;font-weight:700}
.st-ghost{background:transparent;color:rgba(255,255,255,.28);min-width:auto}

.st-canvas{position:relative;height:600px;overflow:hidden;
  background:radial-gradient(120% 90% at 50% -10%, #235182 0%, #14365c 38%, #0A1931 78%)}
.st-canvas::before{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(60% 40% at 50% 0%, rgba(179,207,229,.16), transparent 70%)}
.st-ripples{position:absolute;inset:0;opacity:.10;pointer-events:none}
.st-ripples span{position:absolute;left:50%;top:48%;border:1px solid #B3CFE5;border-radius:50%;transform:translate(-50%,-50%)}

.st-floater{position:absolute;z-index:15;will-change:transform}
.st-back{z-index:8}.st-echo{z-index:4}
.st-tile{border-radius:24%;background:rgba(247,251,255,.92);display:flex;align-items:center;justify-content:center;
  box-shadow:0 10px 24px -8px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.6)}
.st-tile img{width:62%;height:62%;object-fit:contain}
.st-back .st-tile{opacity:.7;filter:saturate(.85)}
.st-echo .st-tile{opacity:.34;filter:blur(2px) saturate(.7);box-shadow:0 8px 20px -10px rgba(0,0,0,.4), inset 0 0 0 1px rgba(255,255,255,.3)}

@keyframes st-bobA{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}
@keyframes st-bobB{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}
@keyframes st-bobC{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
.st-bobA{animation:st-bobA 7s ease-in-out infinite}
.st-bobB{animation:st-bobB 9s ease-in-out infinite}
.st-bobC{animation:st-bobC 6s ease-in-out infinite}

/* Idle until the canvas scrolls into view, then again once it leaves. Stops the
   compositor from re-blurring the glass cards every frame while off-screen. */
.st-canvas:not(.st-live) .st-bobA,
.st-canvas:not(.st-live) .st-bobB,
.st-canvas:not(.st-live) .st-bobC{animation-play-state:paused}

.st-cluster{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:368px;z-index:20;display:flex;flex-direction:column;align-items:center}
.st-ncard{width:344px;background:rgba(244,249,253,.78);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:20px;padding:14px 16px 13px;border:1px solid rgba(255,255,255,.5);
  box-shadow:0 1px 1px rgba(255,255,255,.5) inset, 0 22px 48px -16px rgba(4,12,28,.62)}
.st-ncard + .st-ncard{margin-top:-18px}
.st-ncard:nth-child(1){transform:rotate(-3deg) translateX(-12px);z-index:23}
.st-ncard:nth-child(2){transform:rotate(2.5deg) translateX(14px);z-index:22}
.st-ncard:nth-child(3){transform:rotate(-2deg) translateX(-6px);z-index:21}
.st-nhead{display:flex;align-items:center;gap:9px;margin-bottom:8px}
.st-appicon{width:38px;height:38px;border-radius:11px;flex:none;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.18), inset 0 0 0 .5px rgba(0,0,0,.06)}
.st-appicon img{width:66%;height:66%;object-fit:contain}
.st-nmeta{flex:1;min-width:0}
.st-neyebrow{font-family:var(--font-mono),monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#4A7FA7;line-height:1.2}
.st-ntitle{font-family:var(--font-display),serif;font-weight:600;font-size:18px;color:#0A1931;line-height:1.15;letter-spacing:-.01em}
.st-ntime{font-family:var(--font-sans),system-ui,sans-serif;font-size:11px;color:#7d93ab;align-self:flex-start}
.st-nbody{font-family:var(--font-sans),system-ui,sans-serif;font-size:13px;color:#1A3D63;line-height:1.35;margin-bottom:11px;padding-left:1px}
.st-minirow{display:flex;gap:7px;padding-left:1px}
.st-mini{width:26px;height:26px;border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.14), inset 0 0 0 .5px rgba(0,0,0,.05)}
.st-mini img{width:64%;height:64%;object-fit:contain}

@media (max-width:640px){
  .st-canvas{height:520px}
  .st-cluster{width:300px}
  .st-ncard{width:286px}
  .st-ntitle{font-size:16px}
  .st-url{max-width:160px}
  .st-tab{min-width:130px}
  .st-ghost{display:none}
}
@media (prefers-reduced-motion:reduce){
  .st-bobA,.st-bobB,.st-bobC{animation:none}
}
`;
