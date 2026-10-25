"use client";
import Link from "next/link";
import { daysUntil, liveStatus, money, cheapestPrice, type Match } from "@/lib/listings";

const tone: Record<string, string> = { orange: "bg-orange", lime: "bg-lime", sky: "bg-sky", mute: "bg-paper2 text-mute" };

export function Ticket({ m, index, anon = false }: { m: Match; index: number; anon?: boolean }) {
  const l = m.listing; const s = liveStatus(l);
  const cheapest = cheapestPrice(l);
  return (
    <Link href={`/listing/${l.id}`} className={`relative block border-3 border-ink bg-paper shadow-hard lift transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-hardSm animate-rise ${!m.qualifies ? "opacity-60" : ""}`} style={{ animationDelay: `${index * 70}ms` }}>
      {s.tone === "orange" && l.deadline && <span className="stamp stamp-in absolute -top-3 right-3 bg-orange text-ink border-ink text-[12px] z-10">{daysUntil(l.deadline)} days left</span>}
      <div className="flex items-stretch">
        <div className="w-11 shrink-0 border-r-3 border-dashed border-ink flex items-center justify-center">
          <span aria-hidden="true" className="font-mono text-[12px] tracking-normal [writing-mode:vertical-rl] rotate-180 uppercase">No. {String(index + 1).padStart(3, "0")} · {l.county}</span>
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <span className={`font-mono text-[12px] uppercase tracking-[0.14em] px-1.5 py-0.5 border-2 border-ink ${tone[s.tone]}`}>{s.label}</span>
            <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">{l.type === "rent" ? "Rent" : "Buy"}</span>
          </div>
          <h3 className="mt-2 font-display font-extrabold text-[26px] leading-[0.95]">{l.name}</h3>
          <p className="font-serif italic text-[17px] text-ink2 mt-1">{l.town}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t-2 border-ink pt-3">
            <div><div className="font-mono text-[12px] uppercase text-mute">Units</div><div className="font-display font-bold text-xl num">{l.totalUnits ?? "—"}</div></div>
            <div><div className="font-mono text-[12px] uppercase text-mute">From</div><div className="font-display font-bold text-xl num tracking-[-0.03em] pr-2 whitespace-nowrap">{cheapest ? (l.type === "rent" ? `${money(cheapest)}/mo` : money(cheapest)) : "TBD"}</div></div>
            <div><div className="font-mono text-[12px] uppercase text-mute">Deadline</div><div className="font-display font-bold text-[17px] leading-tight num">{l.deadline ? new Date(l.deadline + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Rolling"}</div></div>
          </div>
          {s.key === "closed" ? <p className="mt-2 font-mono text-[12px] text-mute">Closed — <span aria-hidden="true">☆ </span>Watch for the next round</p>
            : s.key === "pipeline" ? <p className="mt-2 font-mono text-[12px] text-mute">Not taking applications yet</p>
              : !m.qualifies && m.reasons[0] ? <p className="mt-2 font-mono text-[12px] text-accentInk"><span aria-hidden="true">✕ </span>{m.reasons[0]}</p>
                : m.qualifies && m.matchingUnits.length > 0 && (anon
                  ? <p className="mt-2 font-mono text-[12px] text-ink2">{Array.from(new Set(l.units.map((u) => `${u.bedrooms}BR`))).join(" · ")} · {Array.from(new Set(l.units.map((u) => ({ veryLow: "very-low", low: "low", moderate: "moderate" } as const)[u.tier]))).join(" / ")} income</p>
                  : <p className="mt-2 font-mono text-[12px]"><span aria-hidden="true">✓ </span>{m.matchingUnits.map((u) => `${u.bedrooms}BR`).join(" · ")} match your household</p>)}
          {m.perks.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{m.perks.map((perk) => <span key={perk} className="border-2 border-ink bg-lime px-1.5 py-0.5 font-mono text-[12px] leading-none">{perk}</span>)}</div>}
        </div>
      </div>
    </Link>
  );
}
