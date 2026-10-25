import Link from "next/link";
import { listings, money, isActive, pickHero, cheapestPrice, lowestRent, inDistrict, liveStatus } from "@/lib/listings";
import { districtOwed, districtSeen, districtTownCount } from "@/lib/towns";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";
import { LiveStatus } from "@/components/LiveStatus";

export default function Landing() {
  const districtListings = inDistrict(listings);
  const owed = districtOwed();
  const seen = districtSeen(listings);
  const townCount = districtTownCount();
  const open = districtListings.filter((l) => isActive(l)).length;
  const heroPick = pickHero(districtListings);
  const hero = heroPick.listing;
  const heroPrice = cheapestPrice(hero);
  const rentFloor = lowestRent(districtListings);
  const heroTiers = Array.from(new Set(hero.units.map((u) => ({ veryLow: "very-low", low: "low", moderate: "moderate" } as const)[u.tier]))).join(" / ");
  const heroBr = Array.from(new Set(hero.units.map((u) => u.bedrooms))).sort().join(" · ");
  const seenPct = owed ? (seen / owed) * 100 : 0;
  const marquee = [
    ...districtListings.filter((l) => liveStatus(l).key !== "closed").map((l) => {
      const price = cheapestPrice(l);
      const units = l.totalUnits == null ? "" : ` · ${l.totalUnits} ${l.type === "rent" ? "apts" : "homes"}`;
      return `${l.name}${units}${price == null ? "" : ` from ${money(price)}`}`;
    }),
    `${owed} homes owed in ${townCount} towns`,
    "UHAC 2025 limits loaded",
  ].join(" · ");
  return (
    <div className="min-h-dvh flex flex-col overflow-x-clip">
      <header className="flex items-center justify-between px-5 pt-5">
        <span className="font-display font-black text-lg tracking-tight">FairShare<span className="text-accentInk">NJ</span></span>
        <span className="stamp">NJ-12 · 2026</span>
      </header>

      <section className="px-5 pt-9 relative">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-mute animate-rise">{owed.toLocaleString()} homes owed. {seen} have reached a lottery.</p>
        <h1 className="mt-3 font-display font-black text-[58px] leading-[0.86] tracking-[-0.035em]">
          {["Every", "affordable", "housing"].map((w, i) => <span key={w} className="block animate-rise" style={{ animationDelay: `${80 + i * 70}ms` }}>{w}</span>)}
          <span className="block font-serif italic font-normal text-accentInk animate-rise" style={{ animationDelay: "290ms" }}>lottery,</span>
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
                <span aria-hidden="true" className="font-mono text-[12px] tracking-normal [writing-mode:vertical-rl] rotate-180 uppercase">Admit one · {hero.county}</span>
              </div>
              <div className="flex-1 p-4">
                <div className="flex justify-between font-mono text-[12px] uppercase tracking-[0.16em]"><span>{heroPick.kicker}</span><span>{hero.type}</span></div>
                <div className="mt-2 font-display font-black text-[30px] leading-[0.92] tracking-tight">{hero.name}</div>
                <div className="font-serif italic text-lg">{hero.town}</div>
                <div className="mt-3 flex items-end gap-5 border-t-2 border-ink pt-3">
                  <div><div className="font-mono text-[12px] uppercase">Units</div><div className="font-display font-black text-3xl num leading-none">{hero.totalUnits}</div></div>
                  <div><div className="font-mono text-[12px] uppercase">From</div><div className="font-display font-black text-3xl num leading-none">{heroPrice ? money(heroPrice) : "TBD"}{hero.type === "rent" && heroPrice ? <span className="text-base">/mo</span> : null}</div></div>
                  <div className="ml-auto font-mono text-[12px] uppercase text-right leading-tight">{heroBr} BR<br />{heroTiers}</div>
                </div>
              </div>
            </div>
          </div>
          <LiveStatus listing={hero} />
        </Link>
      </section>

      <section className={`px-5 mt-8 grid ${rentFloor == null ? "grid-cols-2" : "grid-cols-3"} gap-3`}>
        <Reveal><div className="border-3 border-ink p-2 bg-paper shadow-hardSm h-full"><div className="font-display font-black text-[30px] leading-none"><CountUp to={open} /></div><div className="font-mono text-[12px] uppercase tracking-[-0.08em] whitespace-nowrap mt-1">accepting now</div><div className="font-serif italic text-sm text-mute">lotteries & lists</div></div></Reveal>
        <Reveal delay={80}><div className="border-3 border-ink p-2 bg-paper shadow-hardSm h-full"><div className="font-display font-black text-[30px] leading-none"><CountUp to={owed} /></div><div className="font-mono text-[12px] uppercase tracking-[-0.08em] whitespace-nowrap mt-1">owed</div><div className="font-serif italic text-sm text-mute">new homes, {townCount} towns</div></div></Reveal>
        {rentFloor != null && <Reveal delay={160}><div className="border-3 border-ink p-2 bg-paper shadow-hardSm h-full"><div className="font-display font-black text-[30px] leading-none"><CountUp to={rentFloor} prefix="$" /></div><div className="font-mono text-[12px] uppercase tracking-[-0.08em] whitespace-nowrap mt-1">/mo</div><div className="font-serif italic text-sm text-mute">lowest rent seen</div></div></Reveal>}
      </section>

      <div className="px-5 pt-10 space-y-3">
        <Link href="/start" className="btn btn-orange w-full text-lg py-4 lift">Check what I qualify for <span aria-hidden="true">→</span></Link>
        <Link href="/feed" className="btn btn-light w-full lift">Just show me the lotteries</Link>
        <p className="font-mono text-[12px] text-mute text-center pt-2">Free · no account · nothing leaves your phone</p>
      </div>

      <div className="marquee-window mt-10 overflow-hidden border-y-3 border-ink bg-ink text-paper py-2">
        <div className="marquee-track flex whitespace-nowrap animate-marquee font-mono text-[12px] uppercase tracking-[0.18em]">
          <span className="shrink-0">{marquee} · &nbsp;</span>
          <span className="shrink-0" aria-hidden="true">{marquee} · &nbsp;</span>
        </div>
      </div>

      {/* how it works */}
      <section className="px-5 pt-10">
        <Reveal><p className="font-mono text-[12px] uppercase tracking-[0.18em] text-mute">How it works</p></Reveal>
        <ol className="mt-4 space-y-0 border-t-3 border-ink">
          {[
            ["01", "Tell us four things", "Household size, income, county, rent or buy. Stored only on your phone."],
            ["02", "See your UHAC tier", "We run the same NJHMFA income table every agent uses — very-low, low, or moderate — and show the math."],
            ["03", "Watch the radar", "Every lottery across every administrative agent in NJ-12, with deadlines, rents and bedroom counts."],
            ["04", "Never miss a drawing", "Star a listing to get a calendar alert 7 days and 1 day before, plus a document checklist in your language."],
          ].map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 70}><li className="grid grid-cols-[44px_1fr] gap-3 py-4 border-b-2 border-ink/25"><span className="font-display font-black text-[28px] leading-none text-accentInk num">{n}</span><div><div className="font-display font-bold text-[20px] leading-tight">{t}</div><p className="mt-1 text-[15px] text-ink2 leading-snug">{d}</p></div></li></Reveal>
          ))}
        </ol>
      </section>

      {/* evidence */}
      <section className="px-5 pt-10 pb-8">
        <Reveal><div className="border-3 border-ink bg-ink text-paper p-5 shadow-[6px_6px_0_0_#2A52E8]">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-paper/70">Why this exists</p>
          <div className="mt-4">
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-paper/70">NJ-12 housing gap</p>
            <p className="mt-1 font-mono text-[12px] leading-snug">{seen.toLocaleString()} of {owed.toLocaleString()} owed homes have reached a lottery — {seenPct.toFixed(1)}%</p>
            <div className="mt-2 h-3 border-3 border-paper bg-paper/20 relative overflow-hidden" role="img" aria-label={`${seen} of ${owed} owed homes have reached a lottery`}>
              <div className="absolute inset-y-0 left-0 bg-paper" style={{ width: "100%" }} />
              {seen > 0 && <div className="absolute inset-y-0 left-0 bg-lime" style={{ width: `${Math.max(2, seenPct)}%` }} />}
            </div>
          </div>
          <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.12em] text-paper/70">Elsewhere in New Jersey</p>
          <p className="mt-2 font-serif italic text-[22px] leading-tight">&ldquo;More than 4,000 people applied for 28 affordable units in Cherry Hill. About 9,500 applied for 45 in East Hanover.&rdquo;</p>
          <p className="mt-3 text-[14px] text-paper/80 leading-snug">NJ-12 has roughly 96,000 renter households; in Trenton, 62% of homes are rented and most renters are cost-burdened. The 2024 Fair Housing Act makes every town build — but the lotteries are scattered across agents&apos; websites and one-off news stories.</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] uppercase tracking-wider text-paper/60"><span>NJHMFA UHAC 2025</span><span>DCA Round 4 workbook</span><span>ACS 2024 5-yr</span><span>Bergen Record</span><span>nj.com</span></div>
        </div></Reveal>
        <p className="mt-6 font-mono text-[12px] text-mute leading-relaxed text-center">Built for the 2026 Congressional App Challenge · Monroe Township, NJ · <Link href="/about" className="underline">sources & method</Link></p>
      </section>
    </div>
  );
}
