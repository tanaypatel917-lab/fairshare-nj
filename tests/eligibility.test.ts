import { describe, it, expect } from "vitest";
import { limitsFor, tierFor, qualifiesFor, regionForCounty } from "../src/lib/eligibility";

describe("UHAC 2025 eligibility", () => {
  it("maps NJ-12 counties to regions", () => {
    expect(regionForCounty("Middlesex")).toBe("3");
    expect(regionForCounty("Somerset")).toBe("3");
    expect(regionForCounty("Mercer")).toBe("4");
    expect(regionForCounty("Union")).toBe("2");
  });
  it("Region 3 limits match the HMFA PDF", () => {
    const l = limitsFor("Middlesex", 1)!;
    expect(l.moderate).toBe(85920); expect(l.low).toBe(53700); expect(l.veryLow).toBe(32220);
    expect(limitsFor("Middlesex", 4)!.median).toBe(153400);
  });
  it("classifies a family of 3 at $58,000 in Middlesex as low income", () => {
    const r = tierFor("Middlesex", 3, 58000)!;
    expect(r.tier).toBe("low");
    expect(qualifiesFor(r.tier, "low")).toBe(true);
    expect(qualifiesFor(r.tier, "moderate")).toBe(true);
    expect(qualifiesFor(r.tier, "veryLow")).toBe(false);
  });
  it("uses the 8-person column above 8", () => {
    expect(limitsFor("Mercer", 11)!.median).toBe(limitsFor("Mercer", 8)!.median);
  });
});
