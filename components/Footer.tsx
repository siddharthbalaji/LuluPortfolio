import { PROFILE, NAV_LINKS } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-[2] border-t border-foam/10 bg-abyss px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-6 md:flex-row">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-tide/30 bg-deep/40 font-jp text-[15px] text-mist">
            ル
          </span>
          <span className="font-display text-base text-foam">{PROFILE.name}</span>
        </a>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[11px] uppercase tracking-widest text-mist/55 transition-colors hover:text-foam"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <p className="font-mono text-[11px] tracking-wide text-mist/40">
          © {year} {PROFILE.alias} · {PROFILE.location}
        </p>
      </div>
    </footer>
  );
}
