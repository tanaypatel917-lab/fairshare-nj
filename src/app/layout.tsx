import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav";

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
export const viewport: Viewport = { themeColor: "#141414", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${serif.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        <div className="mx-auto min-h-dvh w-full max-w-[480px] border-x-0 sm:border-x-3 sm:border-ink bg-paper relative">
          <main className="pb-28">{children}</main>
          <Nav />
        </div>
      </body>
    </html>
  );
}
