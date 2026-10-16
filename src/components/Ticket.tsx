"use client";
import Link from "next/link";
import { fmtDate, liveStatus, money, type Match } from "@/lib/listings";

const tone: Record<string, string> = { orange: "bg-orange", lime: "bg-lime", sky: "bg-sky", mute: "bg-paper2 text-mute" };

export function Ticket({ m, index }: { m: Match; index: number }) {
  const l = m.listing; const s = liveStatus(l);
  const cheapest = l.units.map((u) => u.rentFrom ?? u.priceFrom ?? null).filter((x): x is number => x != null).sort((a, b) => a - b)[0];
  return (
    <Link href={`/listing/${l.id}`} className={`block border-3 border-ink bg-paper shadow-hard transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-hardSm animate-rise ${!m.qualifies ? "opacity-60" : ""}`} style={{ animationDelay: `${index * 70}ms` }}>
      <div className="flex items-stretch">
        <div className="w-11 shrink-0 border-r-3 border-dashed border-ink flex items-center justify-center">
          <span className="font-mono text-[11px] tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 uppercase">No. {String(index + 1).padStart(3, "0")} · {l.county}</span>
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <span className={`font-mono text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 border-2 border-ink ${tone[s.tone]}`}>{s.label}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">{l.type === "rent" ? "Rent" : "Buy"}</span>
          </div>
          <h3 className="mt-2 font-display font-extrabold text-[26px] leading-[0.95]">{l.name}</h3>
          <p className="font-serif italic text-[17px] text-ink2 mt-1">{l.town}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t-2 border-ink pt-3">
            <div><div className="font-mono text-[10px] uppercase text-mute">Units</div><div className="font-display font-bold text-xl num">{l.totalUnits ?? "—"}</div></div>
            <div><div className="font-mono text-[10px] uppercase text-mute">From</div><div className="font-display font-bold text-xl num">{cheapest ? (l.type === "rent" ? `${money(cheapest)}/mo` : money(cheapest)) : "TBD"}</div></div>
            <div><div className="font-mono text-[10px] uppercase text-mute">Deadline</div><div className="font-display font-bold text-[17px] leading-tight num">{fmtDate(l.deadline)}</div></div>
          </div>
          {!m.qualifies && m.reasons[0] && <p className="mt-2 font-mono text-[11px] text-orange">✕ {m.reasons[0]}</p>}
          {m.qualifies && m.matchingUnits.length > 0 && <p className="mt-2 font-mono text-[11px]">✓ {m.matchingUnits.map((u) => `${u.bedrooms}BR`).join(" · ")} match your household</p>}
        </div>
      </div>
    </Link>
  );
}
