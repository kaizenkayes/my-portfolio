"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
      }}
    >
      <p
        style={{
          fontFamily: "monospace",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.4em",
          color: "#f87171",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}
      >
        500 // Something went wrong
      </p>
      <h1
        style={{
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontWeight: 900,
          letterSpacing: "-2px",
          color: "var(--text-main)",
          marginBottom: "16px",
        }}
      >
        Server <span style={{ color: "#f87171" }}>Error.</span>
      </h1>
      <p
        style={{
          color: "var(--text-dim)",
          marginBottom: "40px",
          maxWidth: "400px",
        }}
      >
        An unexpected error occurred. Please try again.
      </p>
      <button className="btn-grad-border" onClick={reset}>
        Try Again
      </button>
    </div>
  );
}
