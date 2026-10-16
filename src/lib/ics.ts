import type { Listing } from "@/lib/listings";

function stamp(d: Date) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }

export function listingToIcs(l: Listing): string {
  const dead = l.deadline ? new Date(l.deadline + "T17:00:00") : null;
  const start = dead ?? new Date();
  const uid = `${l.id}@fairshare-nj`;
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//FairShare NJ//EN", "BEGIN:VEVENT",
    `UID:${uid}`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(new Date(start.getTime() + 3600000))}`,
    `SUMMARY:Apply: ${l.name} (${l.town}) — affordable housing lottery`,
    `DESCRIPTION:${l.totalUnits ?? ""} units via ${l.agent}. Apply at ${l.applyUrl}. Tracked by FairShare NJ.`,
    `LOCATION:${l.address}`, `URL:${l.applyUrl}`,
    "BEGIN:VALARM", "TRIGGER:-P7D", "ACTION:DISPLAY", "DESCRIPTION:7 days left to apply", "END:VALARM",
    "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Deadline tomorrow", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function downloadIcs(l: Listing) {
  const blob = new Blob([listingToIcs(l)], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = `${l.id}.ics`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
