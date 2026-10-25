import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-5 pt-16 min-h-[70dvh] flex flex-col">
      <span className="stamp bg-orange text-ink self-start">Void ticket</span>
      <h1 className="mt-6 font-display font-black text-[64px] leading-[0.85] tracking-[-0.04em]">404</h1>
      <p className="mt-4 font-serif italic text-2xl text-ink2">This lottery was never drawn.</p>
      <p className="mt-3 text-ink2 leading-snug">The page you asked for doesn&apos;t exist — the listing may have been removed when its source went offline.</p>
      <Link href="/feed" className="btn btn-orange mt-8 self-start">Back to lotteries <span aria-hidden="true">→</span></Link>
    </div>
  );
}
