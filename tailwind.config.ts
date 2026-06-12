import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // exact palette provided
        abyss: "#0A1931", // deepest navy — base background (the deep water)
        deep: "#1A3D63",  // dark blue — elevated surfaces / cards
        tide: "#4A7FA7",  // mid blue — interactive / accent
        mist: "#B3CFE5",  // light blue — soft text & secondary accents
        foam: "#F6FAFD",  // near-white — light surfaces & primary text on dark
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        jp: ["var(--font-jp)", "var(--font-display)", "serif"],
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        caret: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        shimmer: "shimmer 4s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        caret: "caret 1.1s steps(1) infinite",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
