"use client";

import { useUIStore } from "@/store/useUIStore";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function DashboardHeader({ title, subtitle, action }: Props) {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "36px",
      flexWrap: "wrap",
      gap: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Hamburger — shown on mobile via CSS */}
        <button
          onClick={toggleSidebar}
          className="dash-hamburger"
          aria-label="Toggle sidebar"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <p style={{
            fontFamily: "monospace", fontSize: "9px", fontWeight: 700,
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "var(--accent-gold)", marginBottom: "4px",
          }}>
            Dashboard
          </p>
          <h1 style={{
            fontSize: "clamp(1.4rem,4vw,2rem)",
            fontWeight: 900, letterSpacing: "-1px", color: "var(--text-main)",
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: "var(--text-dim)", fontSize: "0.875rem", marginTop: "4px" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}