"use client";
import { useEffect, useRef } from "react";

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    const t = setTimeout(() => el.classList.add("is-in"), 1800);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
