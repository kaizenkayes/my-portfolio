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
    <header style={{ marginBottom: "24px" }} className="flex flex-wrap items-start justify-between gap-4 mb-9">
      <div className="flex items-center gap-3.5">
        {/* Hamburger — Mobile Only via dash-hamburger class */}
        <button
          onClick={toggleSidebar}
          className="dash-hamburger p-1 hover:bg-white/5 rounded-md transition-colors"
          aria-label="Toggle sidebar"
          type="button"
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div>
          <span className="block font-mono text-[9px] font-bold tracking-[0.3em] uppercase text-[var(--accent-gold)] mb-1">
            Dashboard
          </span>
          
          <h1 className="text-[clamp(1.4rem,4vw,2rem)] font-black tracking-tighter text-[var(--text-main)] leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-[var(--text-dim)] mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && (
        <div className="flex items-center">
          {action}
        </div>
      )}
    </header>
  );
}