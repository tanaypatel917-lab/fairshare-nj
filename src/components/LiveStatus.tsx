"use client";
import { useEffect, useState } from "react";
import { fmtDate, liveStatus, type Listing } from "@/lib/listings";

export function LiveStatus({ listing }: { listing: Listing }) {
  const [status, setStatus] = useState(() => liveStatus(listing));
  useEffect(() => {
    const update = () => setStatus(liveStatus(listing));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, [listing]);
  const colors = status.key === "closed" ? "bg-paper text-accentInk border-orange" : status.tone === "orange" ? "bg-orange text-ink" : "bg-paper text-ink";
  return <span className={`stamp stamp-in absolute -top-8 right-3 text-[12px] ${colors}`}>{listing.deadline ? `${fmtDate(listing.deadline).replace(/, \d{4}$/, "")} · ` : ""}{status.label}</span>;
}
