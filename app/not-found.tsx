import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-light)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="hero-bg" />
      <div style={{ position: "relative", zIndex: 10 }}>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.4em",
            color: "var(--accent-gold)",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          404 // Not Found
        </p>
        <h1
          style={{
            fontSize: "clamp(4rem, 15vw, 10rem)",
            fontWeight: 900,
            letterSpacing: "-4px",
            lineHeight: 1,
            marginBottom: "24px",
          }}
        >
          <span className="indigo">OO</span>
          <span className="gold">PS.</span>
        </h1>
        <p
          style={{
            color: "var(--text-dim)",
            fontSize: "1.1rem",
            lineHeight: 1.7,
            maxWidth: "400px",
            margin: "0 auto 40px",
          }}
        >
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
