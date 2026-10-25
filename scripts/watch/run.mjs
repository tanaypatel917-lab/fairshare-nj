import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildReport, diffLines, districtTerms, htmlToLines, isHit, staleListings } from "./lib.mjs";
import sources from "./sources.json" with { type: "json" };

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const stateDir = resolve(root, ".watch-state");
const statePath = resolve(stateDir, "state.json");
const reportPath = resolve(stateDir, "report.md");
const userAgent = "FairShareNJ-lottery-watch (+https://tanaypatel917-lab.github.io/fairshare-nj/)";
const delay = (ms) => new Promise((done) => setTimeout(done, ms));

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

const listingsData = await readJson(resolve(root, "src/data/listings.json"), { listings: [] });
const townsData = await readJson(resolve(root, "src/data/towns.json"), { towns: [] });
const terms = districtTerms(townsData.towns);
const urls = new Map(sources.map((source) => [source.url, source.label]));
for (const listing of listingsData.listings) {
  for (const url of listing.sources) {
    if (!urls.has(url)) urls.set(url, listing.name);
  }
}

await mkdir(stateDir, { recursive: true });
await rm(reportPath, { force: true });
const oldState = await readJson(statePath, {});
const newState = { ...oldState };
const results = [];
let baselined = 0;
let fetched = 0;

for (const [index, [url, label]] of [...urls.entries()].entries()) {
  const previous = oldState[url];
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": userAgent },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const checkedAt = new Date().toISOString();
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (contentType.includes("html")) {
      const lines = htmlToLines(await response.text());
      newState[url] = { kind: "html", lines, checkedAt };
      if (previous?.kind === "html") {
        const diff = diffLines(previous.lines ?? [], lines);
        results.push({ label, url, kind: "html", ...diff, hits: diff.added.filter((line) => isHit(line, terms)) });
      } else {
        baselined++;
      }
    } else {
      const sha256 = createHash("sha256").update(Buffer.from(await response.arrayBuffer())).digest("hex");
      newState[url] = { kind: "file", sha256, checkedAt };
      if (previous?.kind === "file") results.push({ label, url, kind: "file", changed: previous.sha256 !== sha256 });
      else baselined++;
    }
    fetched++;
  } catch (error) {
    results.push({ label, url, kind: previous?.kind ?? "html", error: error instanceof Error ? error.message : String(error) });
  }
  if (index < urls.size - 1) await delay(1000);
}

await writeFile(statePath, `${JSON.stringify(newState, null, 2)}\n`);
const now = new Date();
const stale = staleListings(listingsData.listings, now);
const report = buildReport(results, stale, now.toISOString().slice(0, 10));
if (report) await writeFile(reportPath, `${report}\n`);
const changed = results.filter((result) => result.added?.length || result.removed?.length || result.changed).length;
const failures = urls.size - fetched;
console.log(`Checked ${urls.size} sources: ${baselined} baselined, ${changed} changed, ${failures} failed; ${report ? "report written" : "no report"}.`);
if (failures === urls.size) process.exitCode = 1;
