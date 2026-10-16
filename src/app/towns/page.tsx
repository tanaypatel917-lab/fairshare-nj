"use client";
import { useState } from "react";
import towns from "@/data/towns.json";
import { listings } from "@/lib/listings";

type Town = { name: string; county: string; region: number; present: number; prospective: number; planned: number | null; verified: boolean; source: string; note?: string; planSource?: string };
const T = towns as { source: string; page: string; asOf: string; note: string; towns: Town[] };
const COUNTIES = ["All", "Middlesex", "Mercer", "Somerset", "Union"] as const;

function seen(name: string) {
  const key = name.replace(/ (Township|Borough)$/, "");
  return listings.filter((l) => l.town.startsWith(key) && l.status !== "pipeline").reduce((a, l) => a + (l.totalUnits ?? 0), 0);
}

export default function Towns() {
  const [county, setCounty] = useState<(typeof COUNTIES)[number]>("All");
  const [open, setOpen] = useState<string | null>("Monroe Township");
  const rows = T.towns.filter((t) => county === "All" || t.county === county);
  const owe = rows.reduce((a, t) => a + t.prospective, 0);
  const fix = rows.reduce((a, t) => a + t.present, 0);
  const got = rows.reduce((a, t) => a + seen(t.name), 0);
  const max = Math.max(...T.towns.map((t) => t.prospective));
  return (
    <div className="pt-5 px-5">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">Round 4 · 2025–2035 · {rows.length} towns</span>
      <h1 className="mt-1 font-display font-black text-[40px] leading-[0.9] tracking-[-0.03em]">Who owes<br />what.</h1>
      <p className="mt-3 font-serif italic text-lg text-ink2 leading-snug">New affordable homes each NJ-12 town must plan for under the 2024 Fair Housing Act, next to units that have actually reached a lottery.</p>

      <div className="mt-5 grid grid-cols-3 border-3 border-ink shadow-hard bg-paper divide-x-3 divide-ink">
        <div className="p-3"><div className="font-display font-black text-[28px] leading-none num">{owe.toLocaleString()}</div><div className="font-mono text-[9px] uppercase tracking-wider mt-1">new units owed</div></div>
        <div className="p-3"><div className="font-display font-black text-[28px] leading-none num">{fix.toLocaleString()}</div><div className="font-mono text-[9px] uppercase tracking-wider mt-1">to rehabilitate</div></div>
        <div className="p-3 bg-lime"><div className="font-display font-black text-[28px] leading-none num">{got}</div><div className="font-mono text-[9px] uppercase tracking-wider mt-1">seen in lotteries</div></div>
      </div>

      <div className="mt-5 flex gap-1.5 overflow-x-auto no-scrollbar -mx-5 px-5">
        {COUNTIES.map((c) => <button key={c} onClick={() => setCounty(c)} className={`shrink-0 border-2 border-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider ${county === c ? "bg-ink text-paper" : "bg-paper"}`}>{c}</button>)}
      </div>

      <ol className="mt-5 border-t-3 border-ink">
        {rows.map((t, i) => {
          const g = seen(t.name); const isOpen = open === t.name; const w = (t.prospective / max) * 100;
          return (
            <li key={t.name} className="border-b-2 border-ink/25">
              <button onClick={() => setOpen(isOpen ? null : t.name)} className="w-full text-left py-3 group">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-mute w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display font-bold text-[19px] leading-none tracking-tight flex-1">{t.name}</span>
                  <span className="font-display font-black text-[22px] leading-none num">{t.prospective}</span>
                </div>
                <div className="ml-9 mt-2 h-2.5 border-2 border-ink bg-paper relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-700" style={{ width: `${w}%` }} />
                  {g > 0 && <div className="absolute inset-y-0 left-0 bg-lime" style={{ width: `${Math.min(100, (g / max) * 100)}%` }} />}
                </div>
              </button>
              {isOpen && (
                <div className="ml-9 mb-4 grid grid-cols-3 gap-2 animate-rise">
                  <div className="border-2 border-ink p-2"><div className="font-mono text-[9px] uppercase text-mute">owes new</div><div className="font-display font-black text-xl num">{t.prospective}</div></div>
                  <div className="border-2 border-ink p-2"><div className="font-mono text-[9px] uppercase text-mute">{t.planned ? "town plans" : "rehab"}</div><div className="font-display font-black text-xl num">{t.planned ?? t.present}</div></div>
                  <div className={`border-2 border-ink p-2 ${g ? "bg-lime" : ""}`}><div className="font-mono text-[9px] uppercase text-mute">in lotteries</div><div className="font-display font-black text-xl num">{g}</div></div>
                  <div className="col-span-3 font-mono text-[10px] text-mute leading-relaxed">{t.county} County · Region {t.region} · present need {t.present}{t.note ? ` · ${t.note}` : ""} <a href={t.source} target="_blank" rel="noreferrer" className="underline text-ink">DCA workbook ↗</a>{t.planSource && <> · <a href={t.planSource} target="_blank" rel="noreferrer" className="underline text-ink">resolution ↗</a></>}</div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-6 font-mono text-[10px] text-mute leading-relaxed">{T.note} {T.asOf}. <a className="underline" href={T.page} target="_blank" rel="noreferrer">nj.gov/dca ↗</a></p>
    </div>
  );
}
