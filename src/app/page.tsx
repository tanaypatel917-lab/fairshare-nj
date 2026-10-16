import Link from "next/link";
import { listings } from "@/lib/listings";

export default function Landing() {
  const open = listings.filter((l) => l.status !== "closed").length;
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex items-center justify-between px-5 pt-5">
        <span className="font-display font-black text-lg tracking-tight">FairShare<span className="text-orange">NJ</span></span>
        <span className="stamp">NJ-12 · 2026</span>
      </header>
      <section className="px-5 pt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">4,000 families applied for 28 apartments.</p>
        <h1 className="mt-3 font-display font-black text-[56px] leading-[0.88] tracking-[-0.03em]">
          Every<br />affordable<br />housing<br /><span className="font-serif italic font-normal text-orange">lottery,</span><br />one radar.
        </h1>
        <p className="mt-6 text-[17px] leading-snug text-ink2 max-w-[34ch]">
          New Jersey&apos;s 12th District is building hundreds of income-restricted homes. Each one is rented or sold by a lottery you have to hear about in time. FairShare finds them, does the income math, and reminds you before the deadline.
        </p>
      </section>
      <section className="px-5 mt-8 grid grid-cols-3 gap-3">
        {[["Open now", open, "lotteries & lists"], ["31", "towns", "in NJ-12 tracked"], ["$676", "/mo", "lowest rent seen"]].map(([a, b, c]) => (
          <div key={String(a)} className="border-3 border-ink p-3 bg-paper shadow-hardSm">
            <div className="font-display font-black text-[28px] leading-none num">{a === "Open now" ? b : a}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider mt-1">{a === "Open now" ? a : b}</div>
            <div className="font-serif italic text-sm text-mute">{c}</div>
          </div>
        ))}
      </section>
      <div className="mt-auto px-5 pb-8 pt-10 space-y-3">
        <Link href="/start" className="btn btn-orange w-full text-lg py-4">Check what I qualify for →</Link>
        <Link href="/feed" className="btn btn-light w-full">Just show me the lotteries</Link>
        <p className="font-mono text-[10px] text-mute text-center pt-2">Free · no account · nothing leaves your phone</p>
      </div>
      <div className="overflow-hidden border-y-3 border-ink bg-ink text-paper py-2">
        <div className="flex whitespace-nowrap animate-marquee font-mono text-[11px] uppercase tracking-[0.18em]">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="shrink-0">Princeton Orchards · 46 apts from $676 · Oakwood Park · 27 condos from $152K · Old Bridge · 12 homes · Monroe Round 4 · 253 units planned · UHAC 2025 limits loaded · &nbsp;</span>
          ))}
        </div>
      </div>
    </div>
  );
}
