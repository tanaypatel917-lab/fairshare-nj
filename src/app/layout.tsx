import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { PageEnter } from "@/components/PageEnter";
import { Sw } from "@/components/Sw";

const display = localFont({ src: "../../public/fonts/CabinetGrotesk-Variable.woff2", variable: "--font-display", weight: "100 900", display: "swap" });
const body = localFont({ src: "../../public/fonts/GeneralSans-Variable.woff2", variable: "--font-body", weight: "200 700", display: "swap" });
const serif = localFont({ src: [{ path: "../../public/fonts/InstrumentSerif-Regular.woff2", style: "normal" }, { path: "../../public/fonts/InstrumentSerif-Italic.woff2", style: "italic" }], variable: "--font-serif", weight: "400", display: "swap" });
const mono = localFont({ src: "../../public/fonts/IBMPlexMono-Medium.woff2", variable: "--font-mono", weight: "500", display: "swap" });

export const metadata: Metadata = {
  title: "FairShare NJ — every affordable-housing lottery in NJ-12",
  description: "One radar for every affordable-housing lottery in New Jersey's 12th District: eligibility math, deadlines, document checklists, and a town scoreboard.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "FairShare NJ", statusBarStyle: "black-translucent" },
};
export const viewport: Viewport = { themeColor: "#0E0F12", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${serif.variable} ${mono.variable}`}>
      <body className="grain min-h-dvh sm:bg-ink sm:bg-[radial-gradient(rgba(14,15,18,0.18)_1px,transparent_1px)] sm:[background-size:18px_18px]">
        <div className="hidden lg:flex fixed inset-y-0 left-0 w-[calc(50vw-240px)] flex-col justify-between p-10 text-paper select-none pointer-events-none">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">Congressional App Challenge · NJ-12 · 2026</div>
          <div>
            <div className="font-display font-black text-[72px] leading-[0.85] tracking-[-0.04em]">Fair<br />Share<span className="text-orange">NJ</span></div>
            <p className="mt-6 font-serif italic text-2xl max-w-[26ch] opacity-90">Every affordable-housing lottery in New Jersey&apos;s 12th District, one radar.</p>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">Open on your phone · installs as an app</div>
        </div>
        <div className="hidden lg:block fixed right-10 bottom-10 text-paper font-mono text-[11px] uppercase tracking-[0.22em] opacity-70 [writing-mode:vertical-rl] rotate-180">UHAC 2025 · DCA Round 4 · Local-first</div>
        <div className="mx-auto min-h-dvh w-full max-w-[480px] sm:border-x-3 sm:border-ink bg-paper relative sm:shadow-[0_0_0_1px_rgba(14,15,18,0.2),24px_24px_0_0_#2E5BFF] sm:my-0">
          <main className="pb-28 min-h-dvh"><PageEnter>{children}</PageEnter></main>
          <Nav />
        </div>
        <Sw />
      </body>
    </html>
  );
}
