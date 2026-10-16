"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { tierFor, TIER_LABEL, type Tier } from "@/lib/eligibility";
import { money } from "@/lib/listings";

const order: Tier[] = ["veryLow", "low", "moderate", "over"];
const short: Record<Tier, string> = { veryLow: "Very-low", low: "Low", moderate: "Moderate", over: "Over limit" };

export default function TierPage() {
  const { profile, hydrated } = useStore();
  if (!hydrated) return null;
  if (!profile) return <Empty />;
  const r = tierFor(profile.county, profile.householdSize, profile.income);
  if (!r) return <Empty />;
  const { tier, limits, pctOfMedian } = r;
  const bands: { key: Exclude<Tier, "over">; max: number }[] = [{ key: "veryLow", max: limits.veryLow }, { key: "low", max: limits.low }, { key: "moderate", max: limits.moderate }];
  const scaleMax = limits.moderate * 1.25;
  return (
    <div className="px-5 pt-5">
      <div className="flex items-center justify-between"><span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">Your income tier</span><Link href="/start" className="font-mono text-[11px] uppercase underline">Edit</Link></div>
      <h1 className="mt-3 font-display font-black text-[52px] leading-[0.9] tracking-[-0.03em]">{short[tier]}<br /><span className="font-serif italic font-normal text-orange text-[40px]">{tier === "over" ? "for these units" : "income"}</span></h1>
      <p className="mt-4 text-ink2 leading-snug">{TIER_LABEL[tier]}. A {profile.householdSize}-person household earning <b className="num">{money(profile.income)}</b> is at <b className="num">{pctOfMedian}%</b> of the Region {limits.region} median ({limits.counties.join(", ")}).</p>

      <div className="mt-8 border-3 border-ink bg-paper shadow-hard p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">UHAC 2025 limits · {profile.householdSize} persons · Region {limits.region}</div>
        <div className="relative mt-4 h-10 border-3 border-ink flex">
          {bands.map((b, i) => { const prev = i ? bands[i - 1].max : 0; return <div key={b.key} className={`${b.key === tier ? "bg-orange" : i % 2 ? "bg-paper2" : "bg-paper"} border-r-3 border-ink last:border-r-0`} style={{ width: `${((b.max - prev) / scaleMax) * 100}%` }} />; })}
          <div className="flex-1 bg-[repeating-linear-gradient(135deg,#141414_0_2px,transparent_2px_8px)]" />
          <div className="absolute -top-3 -bottom-3 w-[3px] bg-ink" style={{ left: `calc(${Math.min(profile.income / scaleMax, 0.99) * 100}% - 1px)` }}><span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[10px] whitespace-nowrap">you</span></div>
        </div>
        <ul className="mt-5 divide-y-2 divide-ink border-t-2 border-ink">
          {bands.map((b) => (
            <li key={b.key} className="flex items-center justify-between py-2.5">
              <span className={`font-display font-bold ${b.key === tier ? "text-orange" : ""}`}>{short[b.key]} <span className="font-mono text-[10px] text-mute">{b.key === "veryLow" ? "≤30%" : b.key === "low" ? "≤50%" : "≤80%"}</span></span>
              <span className="font-display font-bold num">≤ {money(b.max)}</span>
            </li>
          ))}
          <li className="flex items-center justify-between py-2.5"><span className="font-display font-bold">Regional median</span><span className="font-display font-bold num">{money(limits.median)}</span></li>
        </ul>
        <p className="mt-3 font-mono text-[10px] text-mute leading-relaxed">Source: NJHMFA Uniform Housing Affordability Controls income limits, effective May 16, 2025. Units restricted to a tier are open to households at or below it; agents also apply asset tests and set-asides.</p>
      </div>

      <div className="mt-6">
        <p className="font-serif italic text-lg">{tier === "over" ? "You're above the moderate limit for this region — but limits rise with household size, and other regions differ." : `You can apply for ${order.slice(order.indexOf(tier), 3).map((t) => short[t].toLowerCase()).join(" and ")}-income units.`}</p>
        <Link href="/feed" className="btn btn-orange w-full mt-4 text-lg py-4">Show my lotteries →</Link>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="px-5 pt-16 text-center">
      <h1 className="font-display font-black text-4xl">No profile yet</h1>
      <p className="mt-3 font-serif italic text-lg text-ink2">Four quick questions and we&apos;ll do the UHAC math for you.</p>
      <Link href="/start" className="btn btn-orange mt-6">Start →</Link>
    </div>
  );
}
