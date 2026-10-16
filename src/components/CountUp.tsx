"use client";
import { useEffect, useRef, useState } from "react";

export function CountUp({ to, prefix = "", suffix = "", ms = 1100, className = "" }: { to: number; prefix?: string; suffix?: string; ms?: number; className?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    let raf = 0; let start = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const tick = (t: number) => { if (!start) start = t; const p = Math.min(1, (t - start) / ms); const ease = 1 - Math.pow(1 - p, 4); setV(Math.round(to * ease)); if (p < 1) raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, ms]);
  return <span ref={ref} className={`num ${className}`}>{prefix}{v.toLocaleString("en-US")}{suffix}</span>;
}
