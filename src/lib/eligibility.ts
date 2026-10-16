import uhac from "@/data/uhac2025.json";

export type Tier = "veryLow" | "low" | "moderate" | "over";
export const TIER_LABEL: Record<Tier, string> = {
  veryLow: "Very-low income (≤30% of median)",
  low: "Low income (≤50% of median)",
  moderate: "Moderate income (≤80% of median)",
  over: "Above moderate (>80% of median)",
};

type Limits = Record<string, number>;
type Region = { counties: string[]; limits: { median: Limits; moderate: Limits; low: Limits; veryLow: Limits } };
const regions = (uhac as { regions: Record<string, Region> }).regions;

export function regionForCounty(county: string): string | null {
  const c = county.trim().toLowerCase();
  for (const [id, r] of Object.entries(regions)) {
    if (r.counties.some((x) => x.toLowerCase() === c)) return id;
  }
  return null;
}

/** UHAC publishes 1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 6, 7, 8 person columns; households above 8 use the 8-person column. */
export function householdKey(size: number): string {
  const s = Math.max(1, Math.min(8, Math.round(size)));
  return String(s);
}

export function limitsFor(county: string, householdSize: number) {
  const id = regionForCounty(county);
  if (!id) return null;
  const k = householdKey(householdSize);
  const L = regions[id].limits;
  return {
    region: id,
    counties: regions[id].counties,
    median: L.median[k],
    moderate: L.moderate[k],
    low: L.low[k],
    veryLow: L.veryLow[k],
  };
}

export function tierFor(county: string, householdSize: number, grossAnnualIncome: number): { tier: Tier; limits: NonNullable<ReturnType<typeof limitsFor>>; pctOfMedian: number } | null {
  const limits = limitsFor(county, householdSize);
  if (!limits) return null;
  const inc = Math.max(0, grossAnnualIncome);
  const tier: Tier = inc <= limits.veryLow ? "veryLow" : inc <= limits.low ? "low" : inc <= limits.moderate ? "moderate" : "over";
  return { tier, limits, pctOfMedian: Math.round((inc / limits.median) * 100) };
}

/** A household qualifies for a unit restricted to tier T if its own tier is T or lower. */
export function qualifiesFor(householdTier: Tier, unitTier: Exclude<Tier, "over">): boolean {
  const order: Tier[] = ["veryLow", "low", "moderate", "over"];
  return order.indexOf(householdTier) <= order.indexOf(unitTier);
}
