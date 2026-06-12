import { MARQUEE } from "@/lib/content";

export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="border-y border-foam/10 bg-deep/20 py-4">
      <div className="edge-fade-x overflow-hidden">
        <div className="flex w-max animate-marquee">
          {items.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-4 whitespace-nowrap px-7 font-mono text-[11px] uppercase tracking-widest text-mist/55"
            >
              {item}
              <span className="h-1 w-1 rounded-full bg-tide" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
