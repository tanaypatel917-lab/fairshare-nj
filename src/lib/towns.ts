import towns from "@/data/towns.json";
import type { Listing } from "@/lib/listings";

const townData = towns as { towns: { name: string; prospective: number }[] };

export function seenUnits(townName: string, ls: Listing[]): number {
  const key = townName.replace(/ (Township|Borough)$/, "");
  return ls
    .filter((l) => l.town.startsWith(key) && l.status !== "pipeline")
    .reduce((total, l) => total + (l.totalUnits ?? 0), 0);
}

export function districtSeen(ls: Listing[]): number {
  return townData.towns.reduce((total, town) => total + seenUnits(town.name, ls), 0);
}

export function districtOwed(): number {
  return townData.towns.reduce((total, town) => total + town.prospective, 0);
}

export function districtTownCount(): number {
  return townData.towns.length;
}
