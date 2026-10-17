import Link from "next/link";
import uhac from "@/data/uhac2025.json";
import towns from "@/data/towns.json";

const U = uhac as { source?: string; effective?: string };
const T = towns as { source: string; asOf: string };

export default function About() {
  const rows: [string, string, string][] = [
    ["Income tiers", "NJHMFA Uniform Housing Affordability Controls (UHAC) 2025 regional income limits, parsed from the official PDF into versioned JSON with unit tests.", U.source ?? "https://www.nj.gov/dca/hmfa/about/regulations/docs/UHAC_Income%20Limits.pdf"],
    ["Town obligations", `NJ DCA Fourth Round (2025–2035) Calculation Workbook, “Final Summary” sheet, for all 32 NJ-12 municipalities. ${T.asOf}.`, T.source],
    ["Lotteries", "Hand-verified from administrative-agent postings (CGP&H / Affordable Homes New Jersey, Piazza & Associates, Princeton Community Housing) and local reporting; every listing links to its sources and shows a last-checked date.", "/feed"],
    ["Map", "OpenStreetMap tiles via Leaflet; NJ Transit Northeast Corridor drawn from station coordinates.", "https://www.openstreetmap.org/copyright"],
  ];
  return (
    <div className="px-5 pt-5">
      <Link href="/" className="font-mono text-[11px] uppercase tracking-widest">← Home</Link>
      <h1 className="mt-4 font-display font-black text-[40px] leading-[0.9] tracking-[-0.03em]">Sources<br />& method</h1>
      <p className="mt-3 font-serif italic text-lg text-ink2 leading-snug">FairShare never submits an application and never stores your answers off-device. It routes you to the official administrative agent for each development.</p>
      <ul className="mt-6 border-t-3 border-ink">
        {rows.map(([t, d, href]) => (
          <li key={t} className="py-4 border-b-2 border-ink/25">
            <div className="font-display font-bold text-[20px]">{t}</div>
            <p className="mt-1 text-[15px] text-ink2 leading-snug">{d}</p>
            {href.startsWith("http") ? <a href={href} target="_blank" rel="noreferrer" className="mt-1 inline-block font-mono text-[11px] underline break-all">{href.replace(/^https?:\/\//, "")} ↗</a> : <Link href={href} className="mt-1 inline-block font-mono text-[11px] underline break-all">{href} →</Link>}
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">How eligibility is computed</h2>
      <pre className="mt-2 border-3 border-ink bg-ink text-paper p-4 font-mono text-[11px] leading-relaxed overflow-x-auto">{`region  = regionForCounty(county)      // Middlesex → 3
limits  = uhac[region][householdSize]  // {veryLow, low, moderate, median}
tier    = income ≤ limits.veryLow ? "veryLow"
        : income ≤ limits.low     ? "low"
        : income ≤ limits.moderate? "moderate" : "over"
unit OK = rank(tier) ≤ rank(unit.tier) && |unit.br − wanted| ≤ 1`}</pre>
      <p className="mt-3 font-mono text-[10px] text-mute leading-relaxed">“Likely eligible” only. Agents also verify assets, credit, household composition, set-asides (55+, veteran, accessible) and regional preference.</p>
      <h2 className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">What&apos;s in the code</h2>
      <ul className="mt-2 grid grid-cols-2 gap-2">
        {([
          ["Rules engine", "UHAC limits as versioned JSON + a pure tierFor() with Vitest tests"],
          ["Static PWA", "Next.js export on GitHub Pages; service worker precaches every tab for offline use"],
          ["On-device state", "Profile, stars and checklist live in localStorage — nothing is uploaded"],
          ["Open data", "DCA Round 4 workbook parsed for 32 towns; .ics reminders generated client-side"],
        ] as const).map(([t, d]) => (
          <li key={t} className="border-3 border-ink p-3 shadow-hardSm"><div className="font-display font-bold leading-tight">{t}</div><p className="mt-1 text-[13px] text-ink2 leading-snug">{d}</p></li>
        ))}
      </ul>
      <a href="https://github.com/tanaypatel917-lab/fairshare-nj" target="_blank" rel="noreferrer" className="btn btn-light w-full mt-3">Source on GitHub ↗</a>
      <h2 className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">Monroe Township note</h2>
      <p className="mt-2 text-[15px] text-ink2 leading-snug">Figures for Monroe refer to Monroe Township, Middlesex County (monroetwp.com) — not Monroe Township in Gloucester County.</p>
      <p className="mt-8 mb-4 font-mono text-[10px] text-mute leading-relaxed text-center">Built for the 2026 Congressional App Challenge · NJ-12 · Monroe Township, NJ</p>
    </div>
  );
}
