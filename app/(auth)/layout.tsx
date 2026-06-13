/**
 * Auth Layout — লগইন ও রেজিস্টার পেজের সাধারণ wrapper
 * ─────────────────────────────────────────────────────
 * `(auth)` route group — URL-এ দেখা যায় না, শুধু layout/share করার জন্য।
 * login ও register দুটোই এই layout-এর children হিসেবে render হয়।
 */
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    // পুরো স্ক্রিন জুড়ে centered auth UI
    <div className="min-h-screen bg-[var(--bg-light)] flex flex-col items-center justify-center px-5 py-10 relative">
      {/* hero-bg: globals.css-এ define করা decorative background */}
      <div className="hero-bg" />

      {/* ব্র্যান্ড লোগো — ক্লিক করলে portfolio home (/) */}
      <Link
        href="/"
        className="font-black text-[1.5rem] tracking-[-0.5px] text-[var(--text-main)] no-underline mb-12 relative z-10"
      >
        K<span className="gold">.Kayes</span>
      </Link>

      {/*
        glass-card: frosted glass effect-এর card
        children = login/page.tsx বা register/page.tsx-এর content
        max-w-[440px]: ফর্মের সর্বোচ্চ প্রস্থ
      */}
      <div className="glass-card w-full max-w-[440px] relative z-10">
        {children}
      </div>
    </div>
  );
}
