import type { Listing } from "@/lib/listings";

function stamp(d: Date) {
  const part = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${part(d.getMonth() + 1)}${part(d.getDate())}T${part(d.getHours())}${part(d.getMinutes())}${part(d.getSeconds())}`;
}

function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r\n|\n|\r/g, "\\n");
}

export function listingToIcs(l: Listing, now = new Date()): string {
  const dead = l.deadline ? new Date(l.deadline + "T17:00:00") : null;
  const start = dead ?? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 10);
  const uid = `${l.id}@fairshare-nj`;
  const title = dead ? `Apply: ${l.name} (${l.town}) — affordable housing lottery` : `Check status: ${l.name} (${l.town})`;
  const dtstamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//FairShare NJ//EN", "BEGIN:VEVENT",
    `UID:${uid}`, `DTSTAMP:${dtstamp}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(new Date(start.getTime() + 3600000))}`,
    `SUMMARY:${escapeText(title)}`,
    `DESCRIPTION:${escapeText(`${l.totalUnits ?? ""} units via ${l.agent}. Apply at ${l.applyUrl}. Tracked by FairShare NJ.`)}`,
    `LOCATION:${escapeText(l.address)}`, `URL:${l.applyUrl}`,
    ...(dead ? [
      "BEGIN:VALARM", "TRIGGER:-P7D", "ACTION:DISPLAY", "DESCRIPTION:7 days left to apply", "END:VALARM",
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Deadline tomorrow", "END:VALARM",
    ] : ["BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY", "DESCRIPTION:Check this lottery", "END:VALARM"]),
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
