"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Ticket } from "@/components/Ticket";
import { listings, matchListing, liveStatus, lastUpdated } from "@/lib/listings";
import { useStore } from "@/lib/store";

type F = "all" | "open" | "mine" | "rent" | "buy";

export default function Feed() {
  const { profile, hydrated } = useStore();
  const [f, setF] = useState<F>("all");
  const rows = useMemo(() => {
    const ms = listings.map((l) => matchListing(l, profile));
    const rank = (k: string) => ({ closing: 0, open: 1, waitlist: 2, pipeline: 3, closed: 4 }[k] ?? 5);
    return ms
      .filter((m) => f === "all" || (f === "open" && liveStatus(m.listing).key !== "closed") || (f === "mine" && m.qualifies) || (f === "rent" && m.listing.type === "rent") || (f === "buy" && m.listing.type === "buy"))
      .sort((a, b) => rank(liveStatus(a.listing).key) - rank(liveStatus(b.listing).key) || Number(b.qualifies) - Number(a.qualifies));
  }, [f, profile]);
  if (!hydrated) return null;
  return (
    <div className="pt-5">
      <div className="px-5 flex items-end justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">NJ-12 · updated {lastUpdated}</span>
          <h1 className="font-display font-black text-[40px] leading-[0.9] tracking-[-0.03em] mt-1">Lotteries</h1>
        </div>
        {!profile && <Link href="/start" className="stamp bg-lime">Personalize</Link>}
      </div>
      <div className="mt-4 px-5 flex gap-2 overflow-x-auto no-scrollbar">
        {(["all", "open", "mine", "rent", "buy"] as F[]).map((k) => (
          <button key={k} onClick={() => setF(k)} className={`shrink-0 border-3 border-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider ${f === k ? "bg-ink text-paper" : "bg-paper"}`}>{k === "mine" ? "I qualify" : k}</button>
        ))}
      </div>
      <div className="mt-5 px-5 space-y-5">
        {rows.map((m, i) => <Ticket key={m.listing.id} m={m} index={i} />)}
        {rows.length === 0 && <p className="font-serif italic text-lg text-mute">Nothing here yet — try another filter.</p>}
      </div>
      <p className="mt-8 px-5 font-mono text-[10px] text-mute leading-relaxed">FairShare routes you to each development&apos;s official administrative agent. It never submits applications and never stores your answers off-device.</p>
    </div>
  );
}
