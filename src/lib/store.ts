"use client";
import { useEffect, useState, useCallback } from "react";

export type Profile = {
  householdSize: number;
  income: number;
  county: "Middlesex" | "Mercer" | "Somerset" | "Union";
  bedrooms: number;
  type: "rent" | "buy" | "any";
  prefs: { senior: boolean; veteran: boolean; accessible: boolean };
  lang: "en" | "es" | "hi" | "gu";
};
export type State = { profile: Profile | null; starred: string[]; checked: Record<string, boolean>; seenIntro: boolean };

const KEY = "fairshare:v1";
const DEFAULT: State = { profile: null, starred: [], checked: {}, seenIntro: false };
const listeners = new Set<() => void>();
let cache: State | null = null;

function read(): State {
  if (cache) return cache;
  if (typeof window === "undefined") return DEFAULT;
  try { cache = { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { cache = DEFAULT; }
  return cache!;
}
function write(next: State) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

export function useStore() {
  const [state, setState] = useState<State>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setState(read()); setHydrated(true);
    const l = () => setState({ ...read() });
    listeners.add(l); return () => { listeners.delete(l); };
  }, []);
  const setProfile = useCallback((p: Profile) => write({ ...read(), profile: p }), []);
  const toggleStar = useCallback((id: string) => { const s = read(); write({ ...s, starred: s.starred.includes(id) ? s.starred.filter((x) => x !== id) : [...s.starred, id] }); }, []);
  const setChecked = useCallback((k: string, v: boolean) => { const s = read(); write({ ...s, checked: { ...s.checked, [k]: v } }); }, []);
  const reset = useCallback(() => write(DEFAULT), []);
  return { ...state, hydrated, setProfile, toggleStar, setChecked, reset };
}
