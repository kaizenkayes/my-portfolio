"use client";

import { useUIStore } from "@/store/useUIStore";
import type { ReactNode } from "react";
import { Menu } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function DashboardHeader({ title, subtitle, action }: Props) {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <header style={{ marginBottom: "24px" }} className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <button
          onClick={toggleSidebar}
          className="dash-hamburger p-1 hover:bg-white/5 rounded-md transition-colors"
          aria-label="Toggle sidebar"
          type="button"
        >

          <Menu size={22} strokeWidth={2} />
        </button>

        <div>
          <span className="block font-mono text-[9px] font-bold tracking-[0.3em] uppercase text-[var(--accent-gold)] mb-1">
            Dashboard
          </span>

          <h1 className="text-[clamp(1.4rem,4vw,2rem)] font-black tracking-tighter text-[var(--text-main)] leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-[var(--text-dim)] mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {action && <div className="flex items-center">{action}</div>}
    </header>
  );
}
