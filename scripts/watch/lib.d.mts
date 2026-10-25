export type WatchResult = {
  label: string;
  url: string;
  kind: "html" | "file";
  added?: string[];
  removed?: string[];
  hits?: string[];
  changed?: boolean;
  error?: string;
};

export function htmlToLines(html: string): string[];
export function diffLines(prev: string[], next: string[]): { added: string[]; removed: string[] };
export function districtTerms(towns: { name: string }[] | { towns: { name: string }[] }): string[];
export function isHit(line: string, terms: string[]): boolean;
export function staleListings<T extends { status: string; deadline?: string | null; lastChecked: string }>(listings: T[], now?: Date): T[];
export function buildReport(results: WatchResult[], stale: { name: string; town: string; status: string; deadline?: string | null; lastChecked: string }[], date: string): string | null;
