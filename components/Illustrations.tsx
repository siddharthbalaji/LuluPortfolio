"use client";

import DomeGallery from "@/components/DomeGallery";
import { ILLUSTRATIONS } from "@/lib/media";
import { thumb } from "@/lib/cloudinary";
import { Eyebrow, Heading } from "@/components/ui/Section";

/**
 * Selected illustration — wrapped onto an interactive 3D dome.
 * Replaces the old auto-playing CSS carousel with React Bits' DomeGallery.
 * The portfolio's ILLUSTRATIONS media is mapped into the { src, alt } shape
 * the gallery expects; clicking a tile enlarges it inside the dome (the
 * component handles its own lightbox, so the Zustand store isn't needed here).
 */
const DOME_IMAGES = ILLUSTRATIONS.map((it) => ({
  src: thumb(it.url),
  alt: it.title,
}));

export default function Illustrations() {
  return (
    <section
      id="illustrations"
      className="relative border-t border-foam/10 bg-abyss px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-[1280px]">
        <Eyebrow>Illustration · イラスト</Eyebrow>
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Heading>
            Selected
            <br />
            <em className="italic text-tide">illustration.</em>
          </Heading>
          <p className="max-w-sm text-[15px] font-light leading-relaxed text-mist/70">
            Character studies, brand pieces and experiments — wrapped onto a
            dome. Drag to spin it; tap a piece to open it.
          </p>
        </div>

        <div className="mt-14">
          <div className="relative mx-auto h-[clamp(460px,72vh,760px)] w-full overflow-hidden rounded-[24px] border border-foam/10">
            <DomeGallery
              images={DOME_IMAGES}
              fit={0.5}
              minRadius={600}
              grayscale={false}
              overlayBlurColor="#0A1931"
              imageBorderRadius="18px"
              openedImageBorderRadius="18px"
              openedImageWidth="420px"
              openedImageHeight="560px"
              maxVerticalRotationDeg={6}
              dragDampening={2}
            />
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
