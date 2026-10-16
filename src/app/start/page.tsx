"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore, type Profile } from "@/lib/store";
import { tierFor } from "@/lib/eligibility";
import { money } from "@/lib/listings";

const counties: Profile["county"][] = ["Middlesex", "Mercer", "Somerset", "Union"];

export default function Start() {
  const { setProfile, profile } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>(profile ?? { householdSize: 3, income: 58000, county: "Middlesex", bedrooms: 2, type: "any", prefs: { senior: false, veteran: false, accessible: false }, lang: "en" });

  const steps = [
    { q: "How many people live with you?", sub: "Count everyone who will live in the home, including kids.", body: (
      <div className="grid grid-cols-4 gap-2">{[1,2,3,4,5,6,7,8].map((n) => <button key={n} onClick={() => setP({ ...p, householdSize: n })} className={`border-3 border-ink py-4 font-display font-black text-2xl ${p.householdSize === n ? "bg-ink text-paper" : "bg-paper"}`}>{n}{n === 8 ? "+" : ""}</button>)}</div>) },
    { q: "Household income, before taxes?", sub: "Everyone's gross yearly income added together. Estimates are fine.", body: (
      <div>
        <div className="flex items-end gap-1"><span className="font-display font-black text-3xl">$</span><input inputMode="numeric" className="field" value={p.income.toLocaleString("en-US")} onChange={(e) => setP({ ...p, income: Number(e.target.value.replace(/[^0-9]/g, "")) || 0 })} /></div>
        <input type="range" min={0} max={200000} step={1000} value={p.income} onChange={(e) => setP({ ...p, income: Number(e.target.value) })} className="w-full mt-4 accent-orange" />
      </div>) },
    { q: "Where do you want to live?", sub: "Income limits are set per county region.", body: (
      <div className="grid grid-cols-2 gap-2">{counties.map((c) => <button key={c} onClick={() => setP({ ...p, county: c })} className={`border-3 border-ink py-4 font-display font-bold text-xl ${p.county === c ? "bg-ink text-paper" : "bg-paper"}`}>{c}</button>)}</div>) },
    { q: "Rent or buy, and how big?", sub: "We'll show units within one bedroom of your pick.", body: (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">{(["rent", "buy", "any"] as const).map((t) => <button key={t} onClick={() => setP({ ...p, type: t })} className={`border-3 border-ink py-3 font-display font-bold uppercase ${p.type === t ? "bg-ink text-paper" : "bg-paper"}`}>{t}</button>)}</div>
        <div className="grid grid-cols-4 gap-2">{[1,2,3,4].map((n) => <button key={n} onClick={() => setP({ ...p, bedrooms: n })} className={`border-3 border-ink py-3 font-display font-bold ${p.bedrooms === n ? "bg-ink text-paper" : "bg-paper"}`}>{n} BR</button>)}</div>
        <div className="grid grid-cols-3 gap-2">{(Object.keys(p.prefs) as (keyof Profile["prefs"])[]).map((k) => <button key={k} onClick={() => setP({ ...p, prefs: { ...p.prefs, [k]: !p.prefs[k] } })} className={`border-3 border-ink py-2 font-mono text-[11px] uppercase ${p.prefs[k] ? "bg-lime" : "bg-paper"}`}>{k === "senior" ? "55+" : k}</button>)}</div>
      </div>) },
  ];
  const last = step === steps.length - 1;
  const live = tierFor(p.county, p.householdSize, p.income);
  const tierWord = live ? ({ veryLow: "very-low", low: "low", moderate: "moderate", over: "above moderate" } as const)[live.tier] : "";
  return (
    <div className="min-h-dvh flex flex-col px-5 pt-5">
      <div className="flex items-center justify-between">
        <button onClick={() => (step ? setStep(step - 1) : router.push("/"))} className="font-mono text-[11px] uppercase tracking-widest">← Back</button>
        <div className="flex gap-1">{steps.map((_, i) => <span key={i} className={`h-2 w-6 border-2 border-ink ${i <= step ? "bg-ink" : ""}`} />)}</div>
      </div>
      <div key={step} className="mt-10 animate-rise">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">Step {step + 1} of {steps.length}</span>
        <h1 className="mt-2 font-display font-black text-[38px] leading-[0.95]">{steps[step].q}</h1>
        <p className="mt-3 font-serif italic text-lg text-ink2">{steps[step].sub}</p>
        <div className="mt-8">{steps[step].body}</div>
      </div>
      <div className="mt-auto pt-8">
        <div className="border-3 border-ink border-dashed p-3 flex items-center justify-between gap-3 bg-paper/60">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] leading-relaxed text-ink2">{p.householdSize}{p.householdSize === 8 ? "+" : ""} people · {money(p.income)} · {p.county}{step >= 3 ? ` · ${p.type} · ${p.bedrooms}BR` : ""}</div>
          {live && step >= 1 && <span key={live.tier} className={`stamp stamp-in shrink-0 ${live.tier === "over" ? "" : "bg-lime"}`}>{tierWord}</span>}
        </div>
      </div>
      <div className="pb-8 pt-4">
        <button className="btn btn-orange w-full text-lg py-4" onClick={() => { if (last) { setProfile(p); router.push("/tier"); } else setStep(step + 1); }}>{last ? "See my tier →" : "Next →"}</button>
      </div>
    </div>
  );
}
