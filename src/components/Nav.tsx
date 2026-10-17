"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/feed", label: "Lotteries", glyph: "◫" },
  { href: "/tier", label: "My tier", glyph: "◔" },
  { href: "/checklist", label: "Papers", glyph: "☰" },
  { href: "/map", label: "Map", glyph: "◎" },
  { href: "/towns", label: "Towns", glyph: "▤" },
];

export function Nav() {
  const path = usePathname();
  if (path === "/" || path.startsWith("/start")) return null;
  return (
    <nav aria-label="Primary" className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] border-t-3 border-ink bg-paper z-40" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = path.startsWith(it.href);
          return (
            <li key={it.href} className="border-r-3 border-ink last:border-r-0">
              <Link href={it.href} aria-current={active ? "page" : undefined} className={`relative flex flex-col items-center gap-0.5 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-200 ${active ? "bg-ink text-paper" : "text-ink hover:bg-paper2 active:bg-paper2"}`}>
                {active && <span aria-hidden className="absolute -top-[3px] left-0 right-0 h-[3px] bg-orange" />}
                <span className="text-lg leading-none" aria-hidden>{it.glyph}</span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
