"use client";
import Link from "next/link";
import { fmtDate, listings, liveStatus, matchListing, money, type Listing } from "@/lib/listings";
import { downloadIcs } from "@/lib/ics";
import { useStore } from "@/lib/store";
import { useState } from "react";
import dynamic from "next/dynamic";
const LotteryMap = dynamic(() => import("@/components/LotteryMap"), { ssr: false });
import { tierFor } from "@/lib/eligibility";

const tone: Record<string, string> = { orange: "bg-orange", lime: "bg-lime", sky: "bg-sky", mute: "bg-paper2 text-mute" };
const tierName = { veryLow: "Very-low", low: "Low", moderate: "Moderate" } as const;

export function Detail({ l }: { l: Listing }) {
  const { profile, starred, toggleStar } = useStore();
  const s = liveStatus(l); const m = matchListing(l, profile);
  const t = profile ? tierFor(l.county, profile.householdSize, profile.income) : null;
  const star = starred.includes(l.id);
  const [added, setAdded] = useState(false);
  const [shared, setShared] = useState(false);
  async function share() {
    const text = `${l.name} — ${l.town}: ${l.totalUnits ?? ""} affordable units${l.deadline ? `, apply by ${fmtDate(l.deadline)}` : ""}. Found on FairShare NJ.`;
    try {
      if (navigator.share) await navigator.share({ title: l.name, text, url: location.href });
      else { await navigator.clipboard.writeText(`${text} ${location.href}`); setShared(true); setTimeout(() => setShared(false), 2000); }
    } catch { /* user cancelled */ }
  }
  return (
    <div>
      <div className="px-5 pt-5 flex items-center justify-between">
        <Link href="/feed" className="font-mono text-[12px] uppercase tracking-widest">← Lotteries</Link>
        <div className="flex items-center gap-2">
          <button onClick={share} aria-label="Share this lottery" className="stamp">{shared ? "Copied" : <>Share <span aria-hidden="true">↗</span></>}</button>
          <button onClick={() => toggleStar(l.id)} aria-pressed={star} className={`stamp ${star ? "bg-orange" : ""}`}><span aria-hidden="true">{star ? "★ " : "☆ "}</span>{star ? "Watching" : "Watch"}</button>
        </div>
      </div>
      <div className="px-5 mt-6">
        <span className={`font-mono text-[12px] uppercase tracking-[0.14em] px-1.5 py-0.5 border-2 border-ink ${tone[s.tone]}`}>{s.label}</span>
        <h1 className="mt-3 font-display font-black text-[44px] leading-[0.9] tracking-[-0.03em]">{l.name}</h1>
        <p className="font-serif italic text-xl text-ink2 mt-2">{l.town}, {l.county} County</p>
        {l.nearDistrict && <span className="mt-2 inline-block border border-ink/40 px-1.5 py-0.5 font-mono text-[12px] uppercase tracking-[0.14em] text-mute">Just outside NJ-12</span>}
        <p className="mt-3 text-ink2 leading-snug">{l.notes}</p>
        {m.perks.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{m.perks.map((perk) => <span key={perk} className="border-2 border-ink bg-lime px-1.5 py-0.5 font-mono text-[12px] leading-none">{perk}</span>)}</div>}
      </div>

      <div className="mx-5 mt-6 border-3 border-ink shadow-hard bg-paper">
        <div className="grid grid-cols-2 divide-x-3 divide-ink border-b-3 border-ink">
          <div className="p-4"><div className="font-mono text-[12px] uppercase text-mute">Apply by</div><div className="font-display font-black text-2xl num">{fmtDate(l.deadline)}</div>{s.key === "closing" && <div className="mt-1 inline-block font-mono text-[12px] uppercase bg-orange text-ink px-1.5 py-0.5">{s.label}</div>}</div>
          <div className="p-4"><div className="font-mono text-[12px] uppercase text-mute">Units</div><div className="font-display font-black text-2xl num">{l.totalUnits ?? "TBD"}</div></div>
        </div>
        {l.units.length > 0 && (
          <ul className="divide-y-2 divide-ink">
            {l.units.map((u, i) => {
              const ok = t ? m.matchingUnits.includes(u) : null;
              return (
                <li key={i} className="flex items-center justify-between px-4 py-3">
                  <div><div className="font-display font-bold text-lg">{u.bedrooms} bedroom</div><div className="font-mono text-[12px] uppercase text-mute">{tierName[u.tier]} income</div></div>
                  <div className="text-right"><div className="font-display font-bold num">{u.rentFrom ? `${money(u.rentFrom)}/mo` : u.priceFrom ? money(u.priceFrom) : "TBD"}</div>{ok !== null && <div className={`font-mono text-[12px] uppercase ${ok ? "text-ink" : "text-accentInk"}`}><span aria-hidden="true">{ok ? "✓ " : "✕ "}</span>{ok ? "you fit" : "not your tier"}</div>}</div>
                </li>
              );
            })}
          </ul>
        )}
        {(l.drawingDate || l.moveIn) && (
          <div className="grid grid-cols-2 divide-x-3 divide-ink border-t-3 border-ink">
            <div className="p-4"><div className="font-mono text-[12px] uppercase text-mute">Drawing</div><div className="font-display font-bold num">{l.drawingDate ? fmtDate(l.drawingDate) : "TBA"}</div></div>
            <div className="p-4"><div className="font-mono text-[12px] uppercase text-mute">Move-in</div><div className="font-display font-bold num">{l.moveIn ?? "TBA"}</div></div>
          </div>
        )}
        <div className="px-4 py-3 border-t-3 border-ink font-mono text-[12px]">Agent: {l.agent}</div>
      </div>

      <div className="px-5 mt-6 grid gap-3">
        <a href={l.applyUrl} target="_blank" rel="noreferrer" className="btn btn-orange text-lg py-4">Apply on the agent&apos;s site <span aria-hidden="true">↗</span></a>
        <div className={`grid ${s.key === "closed" ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
          {s.key !== "closed" && <button onClick={() => { downloadIcs(l); setAdded(true); setTimeout(() => setAdded(false), 2500); }} className={`btn text-sm whitespace-nowrap ${added ? "bg-lime text-ink" : "btn-light"}`}>{added ? <><span aria-hidden="true">✓ </span>Reminder saved</> : l.deadline ? "+ Remind me" : "+ Check back in 2 weeks"}</button>}
          <Link href="/checklist" className="btn btn-light text-sm whitespace-nowrap">Documents</Link>
        </div>
      </div>

      <div className="mx-5 mt-8 border-3 border-ink shadow-hard h-52 relative overflow-hidden"><LotteryMap focus={l} /><span className="absolute top-2 left-2 z-[1001] stamp bg-paper text-[12px]">{l.address.split(",")[0]}</span></div>

      {(() => { const near = listings.filter((o) => o.id !== l.id && o.county === l.county && liveStatus(o).key !== "closed").slice(0, 3); return near.length > 0 && (
        <div className="px-5 mt-8">
          <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-mute">More in {l.county} County</div>
          <ul className="mt-2 border-t-2 border-ink divide-y-2 divide-ink/30">
            {near.map((o) => { const os = liveStatus(o); return (
              <li key={o.id}><Link href={`/listing/${o.id}`} className="flex items-center justify-between gap-3 py-3 lift">
                <div className="min-w-0"><div className="font-display font-bold leading-tight truncate">{o.name}</div><div className="font-serif italic text-sm text-ink2">{o.town} · {o.totalUnits ?? "—"} units</div></div>
                <span className={`shrink-0 font-mono text-[12px] uppercase px-1.5 py-0.5 border-2 border-ink ${tone[os.tone]}`}>{os.label}</span>
              </Link></li>); })}
          </ul>
        </div>
      ); })()}

      <div className="px-5 mt-8">
        <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-mute">Sources · last checked {l.lastChecked}</div>
        <ul className="mt-2 space-y-1">{l.sources.map((u) => <li key={u}><a href={u} target="_blank" rel="noreferrer" className="font-mono text-[12px] underline break-all">{u.replace(/^https?:\/\/(www\.)?/, "").slice(0, 70)}…</a></li>)}</ul>
        <p className="mt-4 font-mono text-[12px] text-mute leading-relaxed">{l.address}. FairShare does not take applications. Eligibility shown is based on UHAC income limits only; agents also check assets, credit, and preference categories.</p>
      </div>
    </div>
  );
}
