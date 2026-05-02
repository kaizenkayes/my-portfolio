"use client";

import type { ReactNode } from "react";
import { useUIStore } from "@/store/useUIStore";

interface Props {
  title: string;
  subtitle?: string;
  badgeText?: string;
  action?: ReactNode;
  className?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  badgeText = "Dashboard",
  action,
  className = "",
}: Props) {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <div className={`dashboard-header ${className}`}>
      <div className="dashboard-header-left">
        <button
          onClick={toggleSidebar}
          className="dashboard-menu-btn"
          aria-label="Toggle sidebar"
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
          <p className="dashboard-badge">{badgeText}</p>
          <h1 className="dashboard-title">{title}</h1>
          {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
        </div>
      </div>

      {action && <div className="dashboard-action">{action}</div>}
    </div>
  );
}
