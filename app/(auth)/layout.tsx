import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-light)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
      }}
    >
      {/* Background radial */}
      <div className="hero-bg" />

      {/* Logo */}
      <Link
        href="/"
        style={{
          fontWeight: 900,
          fontSize: "1.5rem",
          letterSpacing: "-0.5px",
          color: "var(--text-main)",
          textDecoration: "none",
          marginBottom: "48px",
          position: "relative",
          zIndex: 10,
        }}
      >
        K<span className="gold">.Kayes</span>
      </Link>

      {/* Card */}
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "440px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
}
