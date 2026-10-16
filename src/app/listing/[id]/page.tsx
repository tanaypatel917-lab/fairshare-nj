import { notFound } from "next/navigation";
import { listings, byId } from "@/lib/listings";
import { Detail } from "./Detail";

export function generateStaticParams() { return listings.map((l) => ({ id: l.id })); }

export default function ListingPage({ params }: { params: { id: string } }) {
  const l = byId(params.id);
  if (!l) notFound();
  return <Detail l={l} />;
}
