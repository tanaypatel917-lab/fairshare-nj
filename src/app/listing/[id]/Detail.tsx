"use client";
import Link from "next/link";
import { fmtDate, liveStatus, matchListing, money, type Listing } from "@/lib/listings";
import { downloadIcs } from "@/lib/ics";
import { useStore } from "@/lib/store";
import { tierFor } from "@/lib/eligibility";

const tone: Record<string, string> = { orange: "bg-orange", lime: "bg-lime", sky: "bg-sky", mute: "bg-paper2 text-mute" };
const tierName = { veryLow: "Very-low", low: "Low", moderate: "Moderate" } as const;

export function Detail({ l }: { l: Listing }) {
  const { profile, starred, toggleStar } = useStore();
  const s = liveStatus(l); const m = matchListing(l, profile);
  const t = profile ? tierFor(l.county, profile.householdSize, profile.income) : null;
  const star = starred.includes(l.id);
  return (
    <div>
      <div className="px-5 pt-5 flex items-center justify-between">
        <Link href="/feed" className="font-mono text-[11px] uppercase tracking-widest">← Lotteries</Link>
        <button onClick={() => toggleStar(l.id)} className={`stamp ${star ? "bg-orange" : ""}`}>{star ? "★ Watching" : "☆ Watch"}</button>
      </div>
      <div className="px-5 mt-6">
        <span className={`font-mono text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 border-2 border-ink ${tone[s.tone]}`}>{s.label}</span>
        <h1 className="mt-3 font-display font-black text-[44px] leading-[0.9] tracking-[-0.03em]">{l.name}</h1>
        <p className="font-serif italic text-xl text-ink2 mt-2">{l.town}, {l.county} County</p>
        <p className="mt-3 text-ink2 leading-snug">{l.notes}</p>
      </div>

      <div className="mx-5 mt-6 border-3 border-ink shadow-hard bg-paper">
        <div className="grid grid-cols-2 divide-x-3 divide-ink border-b-3 border-ink">
          <div className="p-4"><div className="font-mono text-[10px] uppercase text-mute">Apply by</div><div className="font-display font-black text-2xl num">{fmtDate(l.deadline)}</div></div>
          <div className="p-4"><div className="font-mono text-[10px] uppercase text-mute">Units</div><div className="font-display font-black text-2xl num">{l.totalUnits ?? "TBD"}</div></div>
        </div>
        {l.units.length > 0 && (
          <ul className="divide-y-2 divide-ink">
            {l.units.map((u, i) => {
              const ok = t ? m.matchingUnits.includes(u) : null;
              return (
                <li key={i} className="flex items-center justify-between px-4 py-3">
                  <div><div className="font-display font-bold text-lg">{u.bedrooms} bedroom</div><div className="font-mono text-[10px] uppercase text-mute">{tierName[u.tier]} income</div></div>
                  <div className="text-right"><div className="font-display font-bold num">{u.rentFrom ? `${money(u.rentFrom)}/mo` : u.priceFrom ? money(u.priceFrom) : "TBD"}</div>{ok !== null && <div className={`font-mono text-[10px] uppercase ${ok ? "text-ink" : "text-orange"}`}>{ok ? "✓ you fit" : "✕ not your tier"}</div>}</div>
                </li>
              );
            })}
          </ul>
        )}
        <div className="px-4 py-3 border-t-3 border-ink font-mono text-[11px]">Agent: {l.agent}</div>
      </div>

      <div className="px-5 mt-6 grid gap-3">
        <a href={l.applyUrl} target="_blank" rel="noreferrer" className="btn btn-orange text-lg py-4">Apply on the agent&apos;s site ↗</a>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => downloadIcs(l)} className="btn btn-light text-sm">+ Calendar alert</button>
          <Link href="/checklist" className="btn btn-light text-sm">Document list</Link>
        </div>
      </div>

      <div className="px-5 mt-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Sources · last checked {l.lastChecked}</div>
        <ul className="mt-2 space-y-1">{l.sources.map((u) => <li key={u}><a href={u} target="_blank" rel="noreferrer" className="font-mono text-[11px] underline break-all">{u.replace(/^https?:\/\/(www\.)?/, "").slice(0, 70)}…</a></li>)}</ul>
        <p className="mt-4 font-mono text-[10px] text-mute leading-relaxed">{l.address}. FairShare does not take applications. Eligibility shown is based on UHAC income limits only; agents also check assets, credit, and preference categories.</p>
      </div>
    </div>
  );
}
