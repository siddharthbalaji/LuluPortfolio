import { ReactNode } from "react";

export function Eyebrow({
  children,
  tone = "tide",
}: {
  children: ReactNode;
  tone?: "tide" | "mist";
}) {
  const color = tone === "mist" ? "text-mist" : "text-tide";
  const line = tone === "mist" ? "bg-mist" : "bg-tide";
  return (
    <div className="flex items-center gap-3" data-reveal>
      <span className={`h-px w-7 ${line}`} />
      <span
        className={`font-mono text-[11px] uppercase tracking-widest2 ${color}`}
      >
        {children}
      </span>
    </div>
  );
}

export function Heading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      data-reveal
      className={`font-display font-light leading-[1.02] tracking-tight text-foam text-[clamp(34px,4.4vw,60px)] ${className}`}
    >
      {children}
    </h2>
  );
}
