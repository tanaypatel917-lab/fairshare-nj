"use client";
import dynamic from "next/dynamic";
const LotteryMap = dynamic(() => import("@/components/LotteryMap"), { ssr: false, loading: () => <div className="h-full grid place-items-center font-mono text-xs uppercase tracking-widest animate-blink">Loading map…</div> });

export default function MapPage() {
  return (
    <div className="flex flex-col h-[calc(100dvh-64px)]">
      <div className="px-5 pt-5 pb-3 flex items-end justify-between border-b-3 border-ink">
        <div><span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">NJ-12</span><h1 className="font-display font-black text-[34px] leading-[0.9] tracking-[-0.03em]">Where they are</h1></div>
        <div className="font-mono text-[10px] uppercase leading-tight text-right"><span className="inline-block w-3 h-3 border-2 border-ink bg-lime align-middle mr-1" />open<br /><span className="inline-block w-3 h-3 border-2 border-ink bg-orange align-middle mr-1" />closing<br /><span className="inline-block w-3 h-3 border-2 border-ink bg-sky align-middle mr-1" />pipeline</div>
      </div>
      <div className="flex-1 relative"><LotteryMap /></div>
      <p className="px-5 py-2 font-mono text-[10px] text-mute border-t-3 border-ink">Dashed line: NJ Transit Northeast Corridor. Circle size = number of units. © OpenStreetMap contributors.</p>
    </div>
  );
}
