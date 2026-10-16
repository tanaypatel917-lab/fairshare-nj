import data from "@/data/listings.json";
import { qualifiesFor, tierFor, type Tier } from "@/lib/eligibility";
import type { Profile } from "@/lib/store";

export type Unit = { bedrooms: number; count: number | null; tier: Exclude<Tier, "over">; rentFrom?: number | null; priceFrom?: number | null };
export type Listing = {
  id: string; name: string; town: string; county: string; address: string; lat: number; lng: number;
  type: "rent" | "buy"; agent: string; applyUrl: string; units: Unit[]; totalUnits: number | null;
  deadline: string | null; drawingDate: string | null; status: "open" | "closed" | "waitlist" | "pipeline";
  moveIn: string | null; notes: string; sources: string[]; lastChecked: string;
};

export const listings = (data as { listings: Listing[] }).listings;
export const lastUpdated = (data as { lastUpdated: string }).lastUpdated;
export const byId = (id: string) => listings.find((l) => l.id === id);

export function daysUntil(iso: string | null, now = new Date()): number | null {
  if (!iso) return null;
  const d = new Date(iso + "T23:59:59");
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

export function liveStatus(l: Listing, now = new Date()) {
  const d = daysUntil(l.deadline, now);
  if (l.status === "pipeline") return { key: "pipeline", label: "In the pipeline", tone: "sky" } as const;
  if (l.status === "waitlist") return { key: "waitlist", label: "Waiting list open", tone: "lime" } as const;
  if (d !== null && d < 0) return { key: "closed", label: "Closed", tone: "mute" } as const;
  if (d !== null && d <= 14) return { key: "closing", label: `${d} day${d === 1 ? "" : "s"} left`, tone: "orange" } as const;
  return { key: "open", label: "Open", tone: "lime" } as const;
}

export type Match = { listing: Listing; qualifies: boolean; matchingUnits: Unit[]; reasons: string[] };

export function matchListing(l: Listing, p: Profile | null): Match {
  if (!p) return { listing: l, qualifies: true, matchingUnits: l.units, reasons: [] };
  const t = tierFor(l.county, p.householdSize, p.income);
  const reasons: string[] = [];
  const units = l.units.filter((u) => {
    const tierOk = t ? qualifiesFor(t.tier, u.tier) : true;
    const bedOk = p.bedrooms ? Math.abs(u.bedrooms - p.bedrooms) <= 1 : true;
    return tierOk && bedOk;
  });
  if (t && !l.units.some((u) => qualifiesFor(t.tier, u.tier)) && l.units.length) reasons.push(`Income above the ${l.county} Region limits for these units`);
  if (p.type !== "any" && l.type !== p.type) reasons.push(p.type === "rent" ? "For sale, not rent" : "Rental, not for sale");
  const qualifies = reasons.length === 0 && (units.length > 0 || l.units.length === 0);
  return { listing: l, qualifies, matchingUnits: units, reasons };
}

export const money = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }));
export const fmtDate = (iso: string | null) => (iso ? new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Rolling");
