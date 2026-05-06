import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex flex-col items-center justify-center px-5 py-10 relative">
      {/* Background radial */}
      <div className="hero-bg" />

      {/* Logo */}
      <Link
        href="/"
        className="font-black text-[1.5rem] tracking-[-0.5px] text-[var(--text-main)] no-underline mb-12 relative z-10"
      >
        K<span className="gold">.Kayes</span>
      </Link>

      {/* Card */}
      <div className="glass-card w-full max-w-[440px] relative z-10">
        {children}
      </div>
    </div>
  );
}