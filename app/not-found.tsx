import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex flex-col items-center justify-center text-center px-5 py-10 relative overflow-hidden">
      <div className="hero-bg" />

      <div className="relative z-10">
        <p className="font-mono text-[10px] font-bold tracking-[0.4em] text-[var(--accent-gold)] uppercase mb-4">
          404 // Not Found
        </p>

        <h1 className="text-[clamp(4rem,15vw,10rem)] font-black tracking-[-4px] leading-none mb-6">
          <span className="indigo">OO</span>
          <span className="gold">PS.</span>
        </h1>

        <p className="text-[var(--text-dim)] text-[1.1rem] leading-[1.7] max-w-[400px] mx-auto mb-10">
          This page doesn&apos;t exist. It might have been moved, deleted, or
          you followed a broken link.
        </p>

        <Link href="/" className="btn-grad-border">
          ← Back to Portfolio
        </Link>
      </div>
    </div>
  );
}
