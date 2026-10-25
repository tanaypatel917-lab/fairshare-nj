"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { listings, liveStatus, type Listing } from "@/lib/listings";
const LotteryMap = dynamic(() => import("@/components/LotteryMap"), { ssr: false, loading: () => <div className="h-full grid place-items-center font-mono text-xs uppercase tracking-widest animate-blink">Loading map…</div> });

export default function MapPage() {
  const [sel, setSel] = useState<Listing | null>(null);
  return (
    <div className="flex flex-col h-[calc(100dvh-64px)]">
      <div className="px-5 pt-5 pb-3 flex items-end justify-between border-b-3 border-ink">
        <div><span className="font-mono text-[12px] uppercase tracking-[0.18em] text-mute">NJ-12</span><h1 className="font-display font-black text-[34px] leading-[0.9] tracking-[-0.03em]">Where they are</h1></div>
        <div className="font-mono text-[12px] uppercase leading-tight text-right"><span className="inline-block w-3 h-3 border-2 border-ink bg-lime align-middle mr-1" />open<br /><span className="inline-block w-3 h-3 border-2 border-ink bg-orange align-middle mr-1" />closing<br /><span className="inline-block w-3 h-3 border-2 border-ink bg-sky align-middle mr-1" />pipeline<br /><span className="inline-block w-3 h-3 border-2 border-ink bg-mute align-middle mr-1" />closed<br /><span className="inline-block w-5 border-t-2 border-dashed border-ink align-middle mr-1" />NJ-12 border</div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-3 border-b-3 border-ink">
        {listings.map((l) => { const st = liveStatus(l); const on = sel?.id === l.id; return (
          <button key={l.id} onClick={() => setSel(l)} aria-pressed={on} className={`shrink-0 flex items-center gap-2 border-3 border-ink px-3 py-1.5 font-mono text-[12px] uppercase tracking-normal transition-colors ${on ? "bg-ink text-paper" : "bg-paper"}`}>
            <span className={`inline-block w-2.5 h-2.5 border-2 ${on ? "border-paper" : "border-ink"} ${st.tone === "lime" ? "bg-lime" : st.tone === "orange" ? "bg-orange" : st.tone === "sky" ? "bg-sky" : "bg-mute"}`} /><span className="max-w-[150px] truncate">{l.name.replace(/ \(.*\)$/, "")}</span>
          </button>); })}
      </div>
      <div className="flex-1 relative"><LotteryMap flyTo={sel} /></div>
      <p className="px-5 py-2 font-mono text-[12px] text-mute border-t-3 border-ink">NJ-12 district outline · Dashed line: NJ Transit Northeast Corridor. Circle size = number of units. © OpenStreetMap contributors.</p>
    </div>
  );
}
