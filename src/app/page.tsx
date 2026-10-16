import towns from "@/data/towns.json";
import Link from "next/link";
import { listings } from "@/lib/listings";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";

const owed = (towns as { towns: { prospective: number }[] }).towns.reduce((a, t) => a + t.prospective, 0);

export default function Landing() {
  const open = listings.filter((l) => l.status !== "closed").length;
  const hero = listings.find((l) => l.id === "princeton-orchards-2026") ?? listings[0];
  return (
    <div className="min-h-dvh flex flex-col overflow-x-clip">
      <header className="flex items-center justify-between px-5 pt-5">
        <span className="font-display font-black text-lg tracking-tight">FairShare<span className="text-orange">NJ</span></span>
        <span className="stamp">NJ-12 · 2026</span>
      </header>

      <section className="px-5 pt-9 relative">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute animate-rise">4,000 families applied for 28 apartments.</p>
        <h1 className="mt-3 font-display font-black text-[58px] leading-[0.86] tracking-[-0.035em]">
          {["Every", "affordable", "housing"].map((w, i) => <span key={w} className="block animate-rise" style={{ animationDelay: `${80 + i * 70}ms` }}>{w}</span>)}
          <span className="block font-serif italic font-normal text-orange animate-rise" style={{ animationDelay: "290ms" }}>lottery,</span>
          <span className="block animate-rise" style={{ animationDelay: "360ms" }}>one radar.</span>
        </h1>
        <p className="mt-6 text-[17px] leading-snug text-ink2 max-w-[34ch] animate-rise" style={{ animationDelay: "440ms" }}>
          New Jersey&apos;s 12th District owes <b className="num">{owed.toLocaleString()}</b> new income-restricted homes this decade. Each one is rented or sold by a lottery you have to hear about in time. FairShare finds them, does the income math, and reminds you before the deadline.
        </p>
      </section>

      {/* hero ticket */}
      <section className="px-5 mt-10 animate-rise" style={{ animationDelay: "520ms" }}>
        <Link href={`/listing/${hero.id}`} className="block relative float">
          <div className="border-3 border-ink bg-lime shadow-hardLg">
            <div className="flex">
              <div className="w-12 shrink-0 border-r-3 border-dashed border-ink flex items-center justify-center py-5">
                <span className="font-mono text-[11px] tracking-[0.22em] [writing-mode:vertical-rl] rotate-180 uppercase">Admit one · {hero.county}</span>
              </div>
              <div className="flex-1 p-4">
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.16em]"><span>Latest lottery</span><span>{hero.type}</span></div>
                <div className="mt-2 font-display font-black text-[30px] leading-[0.92] tracking-tight">{hero.name}</div>
                <div className="font-serif italic text-lg">{hero.town}</div>
                <div className="mt-3 flex items-end gap-5 border-t-2 border-ink pt-3">
                  <div><div className="font-mono text-[10px] uppercase">Units</div><div className="font-display font-black text-3xl num leading-none">{hero.totalUnits}</div></div>
                  <div><div className="font-mono text-[10px] uppercase">From</div><div className="font-display font-black text-3xl num leading-none">$676<span className="text-base">/mo</span></div></div>
                  <div className="ml-auto font-mono text-[10px] uppercase text-right leading-tight">1 · 2 · 3 BR<br />low / moderate</div>
                </div>
              </div>
            </div>
          </div>
          <span className="stamp stamp-in absolute -top-4 right-3 bg-paper text-orange border-orange text-[12px]">Oct 5 · closed</span>
        </Link>
      </section>

      <section className="px-5 mt-8 grid grid-cols-3 gap-3">
        <Reveal><div className="border-3 border-ink p-3 bg-paper shadow-hardSm h-full"><div className="font-display font-black text-[30px] leading-none"><CountUp to={open} /></div><div className="font-mono text-[10px] uppercase tracking-wider mt-1">open now</div><div className="font-serif italic text-sm text-mute">lotteries & lists</div></div></Reveal>
        <Reveal delay={80}><div className="border-3 border-ink p-3 bg-paper shadow-hardSm h-full"><div className="font-display font-black text-[30px] leading-none"><CountUp to={owed} /></div><div className="font-mono text-[10px] uppercase tracking-wider mt-1">owed</div><div className="font-serif italic text-sm text-mute">new homes, 32 towns</div></div></Reveal>
        <Reveal delay={160}><div className="border-3 border-ink p-3 bg-paper shadow-hardSm h-full"><div className="font-display font-black text-[30px] leading-none"><CountUp to={676} prefix="$" /></div><div className="font-mono text-[10px] uppercase tracking-wider mt-1">/mo</div><div className="font-serif italic text-sm text-mute">lowest rent seen</div></div></Reveal>
      </section>

      <div className="px-5 pt-10 space-y-3">
        <Link href="/start" className="btn btn-orange w-full text-lg py-4 lift">Check what I qualify for →</Link>
        <Link href="/feed" className="btn btn-light w-full lift">Just show me the lotteries</Link>
        <p className="font-mono text-[10px] text-mute text-center pt-2">Free · no account · nothing leaves your phone</p>
      </div>

      <div className="mt-10 overflow-hidden border-y-3 border-ink bg-ink text-paper py-2">
        <div className="flex whitespace-nowrap animate-marquee font-mono text-[11px] uppercase tracking-[0.18em]">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="shrink-0">Princeton Orchards · 46 apts from $676 · Oakwood Park · 27 condos from $152K · Old Bridge · 12 homes · Monroe Round 4 · 253 units planned · UHAC 2025 limits loaded · &nbsp;</span>
          ))}
        </div>
      </div>

      {/* how it works */}
      <section className="px-5 pt-10">
        <Reveal><p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">How it works</p></Reveal>
        <ol className="mt-4 space-y-0 border-t-3 border-ink">
          {[
            ["01", "Tell us four things", "Household size, income, county, rent or buy. Stored only on your phone."],
            ["02", "See your UHAC tier", "We run the same NJHMFA income table every agent uses — very-low, low, or moderate — and show the math."],
            ["03", "Watch the radar", "Every lottery across every administrative agent in NJ-12, with deadlines, rents and bedroom counts."],
            ["04", "Never miss a drawing", "Star a listing to get a calendar alert 7 days and 1 day before, plus a document checklist in your language."],
          ].map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 70}><li className="grid grid-cols-[44px_1fr] gap-3 py-4 border-b-2 border-ink/25"><span className="font-display font-black text-[28px] leading-none text-orange num">{n}</span><div><div className="font-display font-bold text-[20px] leading-tight">{t}</div><p className="mt-1 text-[15px] text-ink2 leading-snug">{d}</p></div></li></Reveal>
          ))}
        </ol>
      </section>

      {/* evidence */}
      <section className="px-5 pt-10 pb-8">
        <Reveal><div className="border-3 border-ink bg-ink text-paper p-5 shadow-[6px_6px_0_0_#FF5A1F]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70">Why this exists</p>
          <p className="mt-3 font-serif italic text-[22px] leading-tight">&ldquo;More than 4,000 people applied for 28 affordable units in Cherry Hill. About 9,500 applied for 45 in East Hanover.&rdquo;</p>
          <p className="mt-3 text-[14px] text-paper/80 leading-snug">NJ-12 has roughly 96,000 renter households; in Trenton, 62% of homes are rented and most renters are cost-burdened. The 2024 Fair Housing Act makes every town build — but the lotteries are scattered across agents&apos; websites and one-off news stories.</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-paper/60"><span>NJHMFA UHAC 2025</span><span>DCA Round 4 workbook</span><span>ACS 2024 5-yr</span><span>Bergen Record</span><span>nj.com</span></div>
        </div></Reveal>
        <p className="mt-6 font-mono text-[10px] text-mute leading-relaxed text-center">Built for the 2026 Congressional App Challenge · Monroe Township, NJ · <Link href="/about" className="underline">sources & method</Link></p>
      </section>
    </div>
  );
}
