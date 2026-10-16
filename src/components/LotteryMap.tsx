"use client";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { listings, liveStatus, type Listing } from "@/lib/listings";

const color: Record<string, string> = { orange: "#FF5A1F", lime: "#8BC34A", sky: "#8BB8FF", mute: "#9A948A" };
// Northeast Corridor + Princeton Dinky + Hamilton-Trenton, simplified station points (NJ Transit)
const nec: [number, number][] = [[40.6153,-74.4148],[40.5620,-74.4653],[40.5180,-74.4442],[40.4967,-74.4458],[40.4580,-74.4800],[40.4300,-74.5200],[40.3160,-74.6230],[40.2690,-74.7050],[40.2180,-74.7550]];

export default function LotteryMap({ focus }: { focus?: Listing }) {
  const center: [number, number] = focus ? [focus.lat, focus.lng] : [40.37, -74.55];
  return (
    <MapContainer center={center} zoom={focus ? 13 : 10} scrollWheelZoom={false} className="h-full w-full" attributionControl={false}>
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" className="tiles-paper" />
      <Polyline positions={nec} pathOptions={{ color: "#141414", weight: 3, dashArray: "6 6" }} />
      {listings.map((l) => { const s = liveStatus(l); return (
        <CircleMarker key={l.id} center={[l.lat, l.lng]} radius={l.totalUnits ? Math.max(9, Math.min(22, Math.sqrt(l.totalUnits) * 2.6)) : 9} pathOptions={{ color: "#141414", weight: 3, fillColor: color[s.tone], fillOpacity: 0.95 }}>
          <Popup><div style={{ fontFamily: "var(--font-display)" }}><b style={{ fontSize: 16 }}>{l.name}</b><br /><span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{l.town} · {l.totalUnits ?? "?"} units · {s.label}</span><br /><Link href={`/listing/${l.id}`} style={{ textDecoration: "underline" }}>Open ticket →</Link></div></Popup>
        </CircleMarker>); })}
    </MapContainer>
  );
}
