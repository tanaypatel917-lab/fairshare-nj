"use client";
import data from "@/data/checklist.json";
import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Profile } from "@/lib/store";

type L = Profile["lang"];
type Item = { id: string } & Record<L, string>;
type Group = { id: string; name: Record<L, string>; items: Item[] };
const LANG_KEY = "fairshare-lang";
const d = data as unknown as { langs: Record<L, string>; title: Record<L, string>; intro: Record<L, string>; groups: Group[]; source: string };

export default function Checklist() {
  const { profile, hydrated, checked, setChecked, setProfile } = useStore();
  const [localLang, setLocalLang] = useState<L | null>(() => (typeof window === "undefined" ? null : (localStorage.getItem(LANG_KEY) as L | null)));
  const [showAllPrefs, setShowAllPrefs] = useState(false);
  if (!hydrated) return null;
  const lang: L = localLang ?? profile?.lang ?? "en";
  const pick = (k: L) => { setLocalLang(k); localStorage.setItem(LANG_KEY, k); if (profile) setProfile({ ...profile, lang: k }); };
  const prefForItem: Record<string, keyof Profile["prefs"]> = { veteran: "veteran", disability: "accessible", age: "senior" };
  const preferredItems = d.groups.find((g) => g.id === "preference")?.items.filter((it) => profile?.prefs[prefForItem[it.id]]) ?? [];
  const visibleItems = d.groups.flatMap((g) => g.id === "preference" && profile && !showAllPrefs ? preferredItems : g.items);
  const items = visibleItems;
  const done = items.filter((i) => checked[i.id]).length;
  return (
    <div className="pt-5 px-5" lang={lang}>
      <div className="flex gap-1 flex-wrap">{(Object.keys(d.langs) as L[]).map((k) => <button key={k} onClick={() => pick(k)} lang={k} aria-pressed={lang === k} className={`border-2 border-ink px-2 py-1 font-mono text-[12px] transition-colors ${lang === k ? "bg-ink text-paper" : "hover:bg-paper2"}`}>{d.langs[k]}</button>)}</div>
      <h1 className="mt-4 font-display font-black text-[38px] leading-[0.92] tracking-[-0.03em]">{d.title[lang]}</h1>
      <p className="mt-3 font-serif italic text-lg text-ink2 leading-snug">{d.intro[lang]}</p>
      <div className="mt-5 border-3 border-ink h-7 relative bg-paper shadow-hardSm"><div className="h-full bg-lime border-r-3 border-ink transition-all duration-500" style={{ width: `${(done / items.length) * 100}%` }} /><span className="absolute inset-0 grid place-items-center font-mono text-[12px] uppercase tracking-widest">{done}/{items.length} ready</span></div>
      {done === items.length && <p className="mt-3 stamp stamp-in bg-lime">Packet complete — you can answer any certification letter</p>}
      {d.groups.map((g) => (
        <section key={g.id} className="mt-7">
          {(() => {
            const groupItems = g.id === "preference" && profile && !showAllPrefs ? preferredItems : g.items;
            const hiddenCount = g.id === "preference" && profile && !showAllPrefs ? g.items.length - groupItems.length : 0;
            return (
              <>
                <h2 className="flex items-baseline justify-between font-mono text-[12px] uppercase tracking-[0.18em] text-mute border-b-2 border-ink pb-1"><span>{g.name[lang]}</span><span className={`num ${groupItems.length > 0 && groupItems.every((it) => checked[it.id]) ? "text-lime" : ""}`}>{groupItems.filter((it) => checked[it.id]).length}/{groupItems.length}</span></h2>
                {hiddenCount > 0 && <button type="button" onClick={() => setShowAllPrefs(true)} className="mt-2 font-mono text-[12px] uppercase tracking-normal underline text-mute">Show all {hiddenCount}</button>}
                {g.id === "preference" && profile && showAllPrefs && <button type="button" onClick={() => setShowAllPrefs(false)} className="mt-2 font-mono text-[12px] uppercase tracking-normal underline text-mute">Show preferred items</button>}
                <ul>
                  {groupItems.map((it) => (
                    <li key={it.id} className="border-b-2 border-ink/20">
                      <label className="flex gap-3 py-3 items-start cursor-pointer">
                        <input type="checkbox" checked={!!checked[it.id]} onChange={(e) => setChecked(it.id, e.target.checked)} className="peer sr-only" />
                        <span aria-hidden="true" className={`mt-0.5 h-6 w-6 shrink-0 border-3 border-ink grid place-items-center peer-checked:bg-lime peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-lime font-display font-black text-sm transition-colors ${checked[it.id] ? "pop" : ""}`}>{checked[it.id] ? "✓" : ""}</span>
                        <span className={`text-[16px] leading-snug ${checked[it.id] ? "line-through text-mute" : ""}`}>{it[lang]}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </>
            );
          })()}
        </section>
      ))}
      {d.groups.some((g) => g.items.some((it) => checked[it.id])) && (
        <button onClick={() => d.groups.forEach((g) => g.items.forEach((it) => setChecked(it.id, false)))} className="mt-8 font-mono text-[12px] uppercase tracking-wider underline text-mute">{({ en: "Reset packet", es: "Reiniciar lista", hi: "सूची रीसेट करें", gu: "યાદી રીસેટ કરો" } as Record<L, string>)[lang]}</button>
      )}
      <p className="mt-8 font-mono text-[12px] text-mute leading-relaxed">{d.source}</p>
    </div>
  );
}
