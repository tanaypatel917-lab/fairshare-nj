"use client";
import { BASE } from "@/lib/base";
import { useEffect } from "react";
export function Sw() {
  useEffect(() => { if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") navigator.serviceWorker.register(`${BASE}/sw.js`).catch(() => {}); }, []);
  return null;
}
