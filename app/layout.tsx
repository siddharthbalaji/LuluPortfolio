import type { Metadata, Viewport } from "next";
import { display, sans, mono, jp } from "@/lib/fonts";
import { PROFILE } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://siddharthbalaji.vercel.app"),
  title: `${PROFILE.name} — Product · Visual · Motion Designer`,
  description: PROFILE.tagline,
  keywords: [
    "Siddharth Balaji", "Lulu", "product designer", "UI/UX",
    "motion graphics", "illustration", "portfolio",
  ],
  authors: [{ name: PROFILE.name }],
  openGraph: {
    title: `${PROFILE.name} — Designer`,
    description: PROFILE.tagline,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.name} — Designer`,
    description: PROFILE.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1931",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${jp.variable}`}
    >
      <body className="font-sans antialiased bg-abyss text-foam selection:bg-tide/50">
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
