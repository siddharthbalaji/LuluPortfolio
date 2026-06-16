// LogoMark — the LULU monogram, rendered from the SVGs in /public.
// Three theme-aware variants so the same mark reads correctly on any surface:
//   • "white"    → flat foam mark, for dark surfaces (nav, footer)
//   • "gradient" → foam → mist → tide sheen, for feature/brand moments
//   • "black"    → flat ink mark, for light surfaces (rarely needed here)

type Variant = "white" | "gradient" | "black";

const SRC: Record<Variant, string> = {
  white: "/logo-white.svg",
  gradient: "/logo-gradient.svg",
  black: "/logo-black.svg",
};

export default function LogoMark({
  variant = "white",
  className = "",
  alt = "LULU — Siddharth Balaji monogram",
}: {
  variant?: Variant;
  className?: string;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SRC[variant]}
      alt={alt}
      draggable={false}
      className={`select-none ${className}`}
    />
  );
}
