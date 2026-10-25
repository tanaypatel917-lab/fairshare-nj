import { describe, expect, it } from "vitest";
import { buildReport, diffLines, districtTerms, htmlToLines, isHit, staleListings } from "../scripts/watch/lib.mjs";

describe("lottery watcher helpers", () => {
  it("strips scripts and markup, decodes entities, splits blocks, filters short lines, and deduplicates", () => {
    const lines = htmlToLines(`
      <!-- hidden comment -->
      <script>script-only content must disappear</script>
      <style>.notice { color: red }</style>
      <noscript>noscript-only content must disappear</noscript>
      <svg><text>svg-only content must disappear</text></svg>
      <h1>East Windsor lottery</h1>
      <p>Applications &amp; rentals&nbsp;available &#39;today&#39; &quot;online&quot; &lt;check&gt; &rsquo;26 &ndash; now</p>
      <div>short</div><li>Applications &amp; rentals&nbsp;available &#39;today&#39; &quot;online&quot; &lt;check&gt; &rsquo;26 &ndash; now</li>
      <section>Another useful block line.</section>
    `);
    expect(lines).toEqual([
      "East Windsor lottery",
      "Applications & rentals available 'today' \"online\" <check> ’26 – now",
      "Another useful block line.",
    ]);
    expect(htmlToLines("<p>Request unsuccessful. Incapsula incident ID: 123456789</p>")).toEqual([]);
  });

  it("returns ordered set differences", () => {
    expect(diffLines(["keep", "remove", "remove"], ["keep", "add", "add", "later"])).toEqual({
      added: ["add", "later"],
      removed: ["remove"],
    });
  });

  it("builds district terms and requires both a district and lottery keyword", () => {
    const terms = districtTerms([
      { name: "South Brunswick Township" },
      { name: "Highland Park Borough" },
      { name: "Jersey City" },
    ]);
    expect(terms).toContain("South Brunswick");
    expect(terms).toContain("Highland Park");
    expect(terms).toContain("Jersey");
    expect(terms).toContain("Mercer");
    expect(isHit("Applications are open in South Brunswick today", terms)).toBe(true);
    expect(isHit("Applications are open for affordable rentals today", terms)).toBe(false);
    expect(isHit("Princetonian affordable rentals posted today", ["Princeton"])).toBe(false);
  });

  it("finds expired open listings and records older than 30 days", () => {
    const listings = [
      { id: "expired-open", name: "Expired", town: "Princeton", status: "open", deadline: "2026-01-30", lastChecked: "2026-01-31" },
      { id: "expired-closing", name: "Closing", town: "Princeton", status: "closing", deadline: "2026-01-30", lastChecked: "2026-01-31" },
      { id: "stale-check", name: "Old check", town: "Princeton", status: "closed", deadline: null, lastChecked: "2025-12-31" },
      { id: "fresh", name: "Fresh", town: "Princeton", status: "open", deadline: "2026-02-10", lastChecked: "2026-01-31" },
    ];
    expect(staleListings(listings, new Date("2026-02-01T12:00:00")).map(({ id }) => id)).toEqual([
      "expired-open",
      "expired-closing",
      "stale-check",
    ]);
  });

  it("omits unchanged reports and includes grouped district hits", () => {
    expect(buildReport([], [], "2026-02-01")).toBeNull();
    const report = buildReport([{
      label: "Piazza",
      url: "https://example.test",
      kind: "html",
      added: ["Lottery applications open in East Windsor"],
      removed: [],
      hits: ["Lottery applications open in East Windsor"],
    }], [], "2026-02-01");
    expect(report).toContain("## Possible new or changed NJ-12 lotteries");
    expect(report).toContain("### [Piazza](https://example.test)");
    expect(report).toContain("Lottery applications open in East Windsor");
  });
});
