"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const titles: [RegExp, string][] = [
  [/^\/$/, "FairShare NJ — every affordable-housing lottery in NJ-12"],
  [/^\/start/, "Check what you qualify for · FairShare NJ"],
  [/^\/tier/, "Your UHAC income tier · FairShare NJ"],
  [/^\/feed/, "Lotteries · FairShare NJ"],
  [/^\/listing\//, "Lottery details · FairShare NJ"],
  [/^\/checklist/, "Documents agents ask for · FairShare NJ"],
  [/^\/map/, "Where they are · FairShare NJ"],
  [/^\/towns/, "Who owes what · FairShare NJ"],
  [/^\/about/, "Sources & method · FairShare NJ"],
];

export function Title() {
  const path = usePathname();
  useEffect(() => {
    const hit = titles.find(([re]) => re.test(path || "/"));
    if (hit) document.title = hit[1];
  }, [path]);
  return null;
}
