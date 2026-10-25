import { describe, expect, it } from "vitest";
import { listingToIcs } from "../src/lib/ics";
import type { Listing } from "../src/lib/listings";

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
    units: [],
    totalUnits: 1,
    deadline: "2026-01-15",
    drawingDate: null,
    status: "open",
    moveIn: null,
    notes: "",
    sources: [],
    lastChecked: "2026-01-01",
    ...overrides,
  };
}

describe("listing calendar reminders", () => {
  const now = new Date("2026-01-01T12:00:00");

  it("sets the deadline event at 17:00 and includes both alarms with CRLF lines", () => {
    const ics = listingToIcs(fixture(), now);
    expect(ics).toContain("DTSTART:20260115T170000");
    expect(ics).toContain("TRIGGER:-P7D");
    expect(ics).toContain("TRIGGER:-P1D");
    expect(ics).toContain("\r\n");
    expect(ics.replace(/\r\n/g, "")).not.toContain("\n");
    expect(ics).toContain("DTSTAMP:20260101T120000Z");
  });

  it("schedules a no-deadline status check in two weeks with one immediate alarm", () => {
    const ics = listingToIcs(fixture({ deadline: null }), now);
    expect(ics).toContain("DTSTART:20260115T100000");
    expect(ics).toContain("SUMMARY:Check status: Fixture Homes (Princeton)");
    expect(ics).toContain("TRIGGER:PT0M");
    expect(ics).not.toContain("TRIGGER:-P7D");
    expect(ics).not.toContain("TRIGGER:-P1D");
  });

  it("escapes commas, semicolons, backslashes, and newlines in TEXT values", () => {
    const ics = listingToIcs(fixture({
      name: "Oak, Park;\nHomes",
      town: "New, Jersey",
      agent: "Agent, North; Suite\\1\nDesk",
      address: "12 Main, Apt 2; Floor 3\\North\nNear park",
    }), now);
    expect(ics).toContain("SUMMARY:Apply: Oak\\, Park\\;\\nHomes (New\\, Jersey)");
    expect(ics).toContain("DESCRIPTION:1 units via Agent\\, North\\; Suite\\\\1\\nDesk. Apply at https://example.test. Tracked by FairShare NJ.");
    expect(ics).toContain("LOCATION:12 Main\\, Apt 2\\; Floor 3\\\\North\\nNear park");
  });
});
