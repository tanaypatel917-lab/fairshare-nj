import { describe, expect, it } from "vitest";
import { cheapestPrice, listings, isActive, inDistrict, liveStatus, lowestRent, matchListing, pickHero, type Listing } from "../src/lib/listings";
import type { Profile } from "../src/lib/store";

const now = new Date("2026-01-01T12:00:00");

function fixture(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "fixture",
    name: "Fixture Homes",
    town: "Princeton",
    county: "Middlesex",
    address: "1 Main Street",
    lat: 40,
    lng: -74,
    type: "rent",
    agent: "Fixture Agent",
    applyUrl: "https://example.test",
    units: [{ bedrooms: 2, count: 1, tier: "moderate", rentFrom: 1000 }],
    totalUnits: 1,
    deadline: null,
    drawingDate: null,
    status: "open",
    moveIn: null,
    notes: "",
    sources: [],
    lastChecked: "2026-01-01",
    ...overrides,
  };
}

function profile(overrides: Partial<Profile> = {}): Profile {
  return {
    householdSize: 2,
    income: 50000,
    county: "Middlesex",
    bedrooms: 2,
    type: "any",
    prefs: { senior: false, veteran: false, accessible: false },
    lang: "en",
    ...overrides,
  };
}

describe("listing status and hero selection", () => {
  it("closes past deadlines and marks deadlines within 14 days as closing", () => {
    expect(liveStatus(fixture({ deadline: "2025-12-31" }), now).key).toBe("closed");
    expect(liveStatus(fixture({ deadline: "2026-01-15" }), now).key).toBe("closing");
    expect(liveStatus(fixture({ deadline: "2026-01-16" }), now).key).toBe("open");
  });

  it("lets waitlist and pipeline statuses win over their deadlines", () => {
    expect(liveStatus(fixture({ status: "waitlist", deadline: "2025-12-31" }), now).key).toBe("waitlist");
    expect(liveStatus(fixture({ status: "pipeline", deadline: "2025-12-31" }), now).key).toBe("pipeline");
  });

  it("excludes closed and pipeline listings from active listings", () => {
    expect(isActive(fixture({ status: "closed" }), now)).toBe(false);
    expect(isActive(fixture({ deadline: "2025-12-31" }), now)).toBe(false);
    expect(isActive(fixture({ status: "pipeline" }), now)).toBe(false);
    expect(isActive(fixture({ status: "waitlist" }), now)).toBe(true);
  });

  it("finds the cheapest unit price and lowest listed rent", () => {
    const rent = fixture({ units: [
      { bedrooms: 1, count: 1, tier: "moderate", rentFrom: 1450 },
      { bedrooms: 2, count: 1, tier: "low", rentFrom: 1250 },
    ] });
    const buy = fixture({ type: "buy", units: [
      { bedrooms: 1, count: 1, tier: "moderate", priceFrom: 220000 },
      { bedrooms: 2, count: 1, tier: "low", priceFrom: 260000 },
    ] });
    expect(cheapestPrice(rent)).toBe(1250);
    expect(cheapestPrice(buy)).toBe(220000);
    expect(lowestRent([rent, buy])).toBe(1250);
    expect(lowestRent([buy])).toBeNull();
  });

  it("prioritizes closing, open, waitlist, then pipeline listings", () => {
    const rows = [
      fixture({ id: "pipeline", status: "pipeline" }),
      fixture({ id: "waitlist", status: "waitlist" }),
      fixture({ id: "open", deadline: "2026-01-16" }),
      fixture({ id: "closing", deadline: "2026-01-15" }),
    ];
    expect(pickHero(rows, now).listing.id).toBe("closing");
    expect(pickHero(rows.slice(0, 3), now).listing.id).toBe("open");
    expect(pickHero(rows.slice(0, 2), now).listing.id).toBe("waitlist");
    expect(pickHero([rows[0]], now).kicker).toBe("Coming up");
  });

  it("chooses the soonest closing deadline and the soonest open deadline", () => {
    const closingRows = [
      fixture({ id: "later", deadline: "2026-01-10" }),
      fixture({ id: "sooner", deadline: "2026-01-03" }),
    ];
    expect(pickHero(closingRows, now).listing.id).toBe("sooner");
    const openRows = [
      fixture({ id: "no-deadline", deadline: null }),
      fixture({ id: "later", deadline: "2026-01-20" }),
      fixture({ id: "sooner", deadline: "2026-01-16" }),
    ];
    expect(pickHero(openRows, now).listing.id).toBe("sooner");
  });

  it("uses the most recent closed listing when every listing is closed", () => {
    const result = pickHero([
      fixture({ id: "old", status: "closed", deadline: "2025-12-01" }),
      fixture({ id: "recent", status: "closed", deadline: "2025-12-20" }),
    ], now);
    expect(result.listing.id).toBe("recent");
    expect(result.kicker).toBe("Recently closed");
  });

  it("selects the in-district waiting list as the October 25 hero", () => {
    const result = pickHero(inDistrict(listings), new Date(2026, 9, 25, 12));
    expect(result.listing.id).toBe("oakwood-park-sb-2026");
    expect(result.kicker).toBe("Waiting list open");
  });
});

describe("district listing scope", () => {
  it("excludes listings marked near the district", () => {
    const rows = [fixture(), fixture({ id: "near", nearDistrict: true })];
    expect(inDistrict(rows).map((listing) => listing.id)).toEqual(["fixture"]);
  });
});

describe("profile matching", () => {
  it("qualifies a null profile and gives it no preference perks", () => {
    const result = matchListing(fixture({ restrictions: { veteranPreference: true } }), null);
    expect(result.qualifies).toBe(true);
    expect(result.perks).toEqual([]);
  });

  it("rejects income above the moderate tier with an income reason", () => {
    const result = matchListing(fixture(), profile({ income: 500000 }));
    expect(result.qualifies).toBe(false);
    expect(result.reasons[0]).toContain("Income above the Middlesex Region limits");
  });

  it("rejects rent profiles for listings for sale", () => {
    const result = matchListing(fixture({ type: "buy" }), profile({ type: "rent" }));
    expect(result.qualifies).toBe(false);
    expect(result.reasons).toContain("For sale, not rent");
  });

  it("enforces senior-only listings and exposes preferences only when both sides match", () => {
    const listing = fixture({ restrictions: { seniorOnly: true, veteranPreference: true, accessibleUnits: true } });
    const noPrefs = matchListing(listing, profile());
    expect(noPrefs.qualifies).toBe(false);
    expect(noPrefs.reasons).toContain("55+ community");
    expect(noPrefs.perks).toEqual([]);

    const prefs = matchListing(listing, profile({ prefs: { senior: true, veteran: true, accessible: true } }));
    expect(prefs.qualifies).toBe(true);
    expect(prefs.perks).toEqual(["Veteran preference", "Accessible units"]);
  });
});
