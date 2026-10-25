import data from "@/data/listings.json";
import { qualifiesFor, tierFor, type Tier } from "@/lib/eligibility";
import type { Profile } from "@/lib/store";

export type Unit = { bedrooms: number; count: number | null; tier: Exclude<Tier, "over">; rentFrom?: number | null; priceFrom?: number | null };
export type Listing = {
  id: string; name: string; town: string; county: string; address: string; lat: number; lng: number;
  type: "rent" | "buy"; agent: string; applyUrl: string; units: Unit[]; totalUnits: number | null;
  deadline: string | null; drawingDate: string | null; status: "open" | "closed" | "waitlist" | "pipeline";
  moveIn: string | null; notes: string; sources: string[]; lastChecked: string;
  nearDistrict?: boolean;
  restrictions?: { seniorOnly?: boolean; veteranPreference?: boolean; accessibleUnits?: boolean };
};

export const listings = (data as { listings: Listing[] }).listings;
export const lastUpdated = (data as { lastUpdated: string }).lastUpdated;
export const buildDate = (): string | null => process.env.NEXT_PUBLIC_BUILD_DATE || null;
export const byId = (id: string) => listings.find((l) => l.id === id);
export const inDistrict = (ls: Listing[]) => ls.filter((l) => !l.nearDistrict);

export function daysUntil(iso: string | null, now = new Date()): number | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export function liveStatus(l: Listing, now = new Date()) {
  const d = daysUntil(l.deadline, now);
  if (l.status === "pipeline") return { key: "pipeline", label: "In the pipeline", tone: "sky" } as const;
  if (l.status === "waitlist") return { key: "waitlist", label: "Waiting list open", tone: "lime" } as const;
  if (l.status === "closed" || (d !== null && d < 0)) return { key: "closed", label: "Closed", tone: "mute" } as const;
  if (d !== null && d <= 14) return { key: "closing", label: `${d} day${d === 1 ? "" : "s"} left`, tone: "orange" } as const;
  return { key: "open", label: "Open", tone: "lime" } as const;
}

export function isActive(l: Listing, now = new Date()): boolean {
  const key = liveStatus(l, now).key;
  return key === "closing" || key === "open" || key === "waitlist";
}

export function pickHero(ls: Listing[], now = new Date()): { listing: Listing; kicker: string } {
  const first = (key: ReturnType<typeof liveStatus>["key"], sort: (a: Listing, b: Listing) => number = () => 0) =>
    ls.filter((l) => liveStatus(l, now).key === key).sort(sort)[0];
  const deadlineAscending = (a: Listing, b: Listing) => {
    if (a.deadline === null) return b.deadline === null ? 0 : 1;
    if (b.deadline === null) return -1;
    return a.deadline.localeCompare(b.deadline);
  };
  const deadlineDescending = (a: Listing, b: Listing) => {
    if (a.deadline === null) return b.deadline === null ? 0 : 1;
    if (b.deadline === null) return -1;
    return b.deadline.localeCompare(a.deadline);
  };
  const choices = [
    [first("closing", deadlineAscending), "Closing soon"],
    [first("open", deadlineAscending), "Open now"],
    [first("waitlist"), "Waiting list open"],
    [first("pipeline"), "Coming up"],
    [first("closed", deadlineDescending), "Recently closed"],
  ] as const;
  const picked = choices.find(([listing]) => listing);
  if (!picked) throw new RangeError("Cannot pick a hero from an empty listing collection");
  return { listing: picked[0]!, kicker: picked[1] };
}

export function cheapestPrice(l: Listing): number | null {
  const prices = l.units.map((u) => u.rentFrom ?? u.priceFrom ?? null).filter((n): n is number => n !== null);
  return prices.length ? Math.min(...prices) : null;
}

export function lowestRent(ls: Listing[]): number | null {
  const rents = ls.filter((l) => l.type === "rent").flatMap((l) => l.units.map((u) => u.rentFrom)).filter((n): n is number => n != null);
  return rents.length ? Math.min(...rents) : null;
}

export type Match = { listing: Listing; qualifies: boolean; matchingUnits: Unit[]; reasons: string[]; perks: string[] };

export function matchListing(l: Listing, p: Profile | null): Match {
  if (!p) return { listing: l, qualifies: true, matchingUnits: l.units, reasons: [], perks: [] };
  const t = tierFor(l.county, p.householdSize, p.income);
  const reasons: string[] = [];
  if (l.restrictions?.seniorOnly && !p.prefs.senior) reasons.push("55+ community");
  const units = l.units.filter((u) => {
    const tierOk = t ? qualifiesFor(t.tier, u.tier) : true;
    const bedOk = p.bedrooms ? Math.abs(u.bedrooms - p.bedrooms) <= 1 : true;
    return tierOk && bedOk;
  });
  if (t && !l.units.some((u) => qualifiesFor(t.tier, u.tier)) && l.units.length) reasons.push(`Income above the ${l.county} Region limits for these units`);
  if (p.type !== "any" && l.type !== p.type) reasons.push(p.type === "rent" ? "For sale, not rent" : "Rental, not for sale");
  const qualifies = reasons.length === 0 && (units.length > 0 || l.units.length === 0);
  const perks = [
    l.restrictions?.veteranPreference && p.prefs.veteran ? "Veteran preference" : null,
    l.restrictions?.accessibleUnits && p.prefs.accessible ? "Accessible units" : null,
  ].filter((perk): perk is string => perk !== null);
  return { listing: l, qualifies, matchingUnits: units, reasons, perks };
}

export const money = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }));
export const fmtDate = (iso: string | null) => (iso ? new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Rolling");
