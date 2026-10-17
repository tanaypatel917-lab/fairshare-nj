"use client";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { listings, liveStatus, type Listing } from "@/lib/listings";

const color: Record<string, string> = { orange: "#2E5BFF", lime: "#E8FF4F", sky: "#8FB3FF", mute: "#6B675F" };
// Northeast Corridor + Princeton Dinky + Hamilton-Trenton, simplified station points (NJ Transit)
const nec: [number, number][] = [[40.6153,-74.4148],[40.5620,-74.4653],[40.5180,-74.4442],[40.4967,-74.4458],[40.4580,-74.4800],[40.4300,-74.5200],[40.3160,-74.6230],[40.2690,-74.7050],[40.2180,-74.7550]];

function Fly({ to }: { to: Listing | null | undefined }) {
  const map = useMap();
  useEffect(() => { if (to) map.flyTo([to.lat, to.lng], 13, { duration: 0.9 }); }, [to, map]);
  return null;
}

export default function LotteryMap({ focus, flyTo }: { focus?: Listing; flyTo?: Listing | null }) {
  const center: [number, number] = focus ? [focus.lat, focus.lng] : [40.37, -74.55];
  return (
    <MapContainer center={center} zoom={focus ? 13 : 10} scrollWheelZoom={false} className="h-full w-full" attributionControl={false}
      zoomControl={!focus}
      dragging={!focus}>
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" className="tiles-paper" />
      <Fly to={flyTo} />
      <Polyline positions={nec} pathOptions={{ color: "#F1EDE4", weight: 3, dashArray: "6 6" }} />
      {listings.map((l) => { const s = liveStatus(l); return (
        <CircleMarker key={l.id} center={[l.lat, l.lng]} radius={l.totalUnits ? Math.max(9, Math.min(22, Math.sqrt(l.totalUnits) * 2.6)) : 9} pathOptions={{ color: "#F1EDE4", weight: 3, fillColor: color[s.tone], fillOpacity: 0.95 }}>
          <Popup><div style={{ fontFamily: "var(--font-display)" }}><b style={{ fontSize: 16 }}>{l.name}</b><br /><span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{l.town} · {l.totalUnits ?? "?"} units · {s.label}</span><br /><Link href={`/listing/${l.id}`} style={{ textDecoration: "underline" }}>Open ticket →</Link></div></Popup>
        </CircleMarker>); })}
    </MapContainer>
  );
}
