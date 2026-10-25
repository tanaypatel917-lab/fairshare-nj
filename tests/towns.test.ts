import { describe, expect, it } from "vitest";
import { districtSeen, seenUnits } from "../src/lib/towns";
import type { Listing } from "../src/lib/listings";

function fixture(town: string, totalUnits: number | null, status: Listing["status"] = "open"): Listing {
  return {
    id: `${town}-${status}`,
    name: "Fixture Homes",
    town,
    county: "Middlesex",
    address: "1 Main Street",
    lat: 40,
    lng: -74,
    type: "rent",
    agent: "Fixture Agent",
    applyUrl: "https://example.test",
    units: [],
    totalUnits,
    deadline: null,
    drawingDate: null,
    status,
    moveIn: null,
    notes: "",
    sources: [],
    lastChecked: "2026-01-01",
  };
}

describe("lottery units by town", () => {
  it("matches town-name prefixes and excludes pipeline listings", () => {
    const listings = [
      fixture("South Brunswick (Dayton)", 46),
      fixture("South Brunswick Phase 2", 8),
      fixture("South Brunswick Plan", 253, "pipeline"),
      fixture("East Brunswick", 12),
      fixture("Highland Park Borough (Fixture)", 5),
    ];
    expect(seenUnits("South Brunswick Township", listings)).toBe(54);
    expect(seenUnits("East Brunswick Township", listings)).toBe(12);
    expect(seenUnits("Highland Park Borough", listings)).toBe(5);
  });

  it("sums fixture lottery units across district towns", () => {
    const listings = [
      fixture("South Brunswick (Fixture)", 8),
      fixture("South Brunswick Plan", 253, "pipeline"),
    ];
    expect(districtSeen(listings)).toBe(8);
  });
});
