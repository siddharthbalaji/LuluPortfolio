"use client";

import { ILLUSTRATIONS, type Media } from "@/lib/media";
import { thumb } from "@/lib/cloudinary";
import { useUI } from "@/lib/store";
import { Eyebrow, Heading } from "@/components/ui/Section";

/**
 * A continuously auto-playing carousel: each slide drifts in from the right,
 * settles at center, then exits left — with scale + opacity falloff so the
 * neighbours read as soft peeks. Pure CSS keyframes (GPU transforms), no JS
 * ticking. Ported from https://codepen.io/aija/details/xvXWoK and generalised
 * so the keyframe + per-item delays are derived from the slide count.
 */

const SHOWN = 7; // odd number = clean centre + symmetric peeks
const REEL: Media[] = ILLUSTRATIONS.slice(0, SHOWN);

const DURATION = 16; // seconds for one full loop
const HOLD = 3; // % "dwell" offset at each position (the SCSS slide-change-timing)
const EASING = "cubic-bezier(0.37, 0, 0.63, 1)";

/** Build the @keyframes whose %-stops depend on how many slides there are. */
function keyframes(name: string, n: number) {
  const s = 100 / n;
  const p = (v: number) => Number(v.toFixed(4));
  return `@keyframes ${name}{
    0%{visibility:hidden;opacity:0;transform:translateX(200%) scale(.7)}
    ${p(HOLD)}%,${p(s)}%{visibility:visible;opacity:.5;transform:translateX(100%) scale(.86)}
    ${p(s + HOLD)}%,${p(2 * s)}%{visibility:visible;opacity:1;transform:translateX(0) scale(1)}
    ${p(2 * s + HOLD)}%,${p(3 * s)}%{visibility:visible;opacity:.5;transform:translateX(-100%) scale(.86)}
    ${p(3 * s + HOLD)}%{visibility:visible;opacity:0;transform:translateX(-200%) scale(.86)}
    100%{visibility:hidden;opacity:0;transform:translateX(-200%) scale(.7)}
  }`;
}

/** Mirror the SCSS delay rule: nth-child(i) -> frac*(i-2); last -> -2*frac. */
function delay(i: number, n: number) {
  const frac = DURATION / n;
  return i === n - 1 ? -2 * frac : frac * (i - 1); // i is 0-indexed here
}

const ANIM = "lulu-carousel";

const css = `
${keyframes(ANIM, SHOWN)}
.lulu-reel{position:relative;width:100%;height:clamp(300px,54vh,520px);}
.lulu-reel__item{
  position:absolute;inset-inline:0;margin-inline:auto;
  width:clamp(240px,78vw,380px);height:100%;
  display:block;padding:0;border:0;background:none;cursor:pointer;
  opacity:0;will-change:transform,opacity;
  animation:${ANIM} ${DURATION}s ${EASING} infinite;
}
.lulu-reel:hover .lulu-reel__item{animation-play-state:running;}
@media (hover: hover) and (pointer: fine){
  .lulu-reel:hover .lulu-reel__item{animation-play-state:paused;}
}
.lulu-reel__frame{
  width:100%;height:100%;overflow:hidden;border-radius:18px;
  border:1px solid rgba(246,250,253,.10);background:rgba(26,61,99,.20);
  box-shadow:0 30px 60px -20px rgba(0,0,0,.55);
}
.lulu-reel__frame img{width:100%;height:100%;object-fit:contain;}
@media (prefers-reduced-motion: reduce){
  .lulu-reel{height:auto;display:flex;gap:16px;overflow-x:auto;padding-bottom:8px;
    -webkit-mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);
    mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);}
  .lulu-reel__item{position:relative;inset:auto;margin:0;flex:0 0 auto;
    width:clamp(220px,70vw,320px);height:auto;animation:none;opacity:1;transform:none;}
  .lulu-reel__frame{height:auto;}
}
`;

export default function Illustrations() {
  const open = useUI((s) => s.open);

  return (
    <section
      id="illustrations"
      className="relative border-t border-foam/10 bg-abyss px-6 py-24 sm:px-10 lg:py-32"
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="mx-auto max-w-[1280px]">
        <Eyebrow>Illustration · イラスト</Eyebrow>
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Heading>
            Selected
            <br />
            <em className="italic text-tide">illustration.</em>
          </Heading>
          <p className="max-w-sm text-[15px] font-light leading-relaxed text-mist/70">
            Character studies, brand pieces and experiments — drifting past on a
            loop. Hover to pause; tap a piece to open it.
          </p>
        </div>

        <div className="mt-14 [perspective:1200px]">
          <div className="lulu-reel">
            {REEL.map((it, i) => (
              <button
                key={it.url + i}
                className="lulu-reel__item"
                style={{ animationDelay: `${delay(i, SHOWN)}s` }}
                onClick={() => open({ ...it, kind: "image" })}
                aria-label={`Open ${it.title}`}
              >
                <span className="lulu-reel__frame">
                  <img src={thumb(it.url)} alt={it.title} loading="lazy" />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#work"
            className="group inline-flex items-center gap-2.5 rounded-full border border-tide/30 bg-deep/30 px-6 py-3 font-mono text-[12px] uppercase tracking-widest2 text-mist backdrop-blur-sm transition-colors hover:border-tide hover:text-foam"
          >
            View all illustration
            <span className="font-mono text-[11px] text-tide">
              {ILLUSTRATIONS.length}
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
