"use client";

import Link from "next/link";

interface Stat {
  label: string;
  value: number;
  href: string;
  accent: string;
  sub: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <Link key={stat.label} href={stat.href} className="stat-card-link">
          <div className={`stat-card stat-card-${stat.accent}`}>
            <p className="stat-label">{stat.label}</p>
            <p className={`stat-value stat-value-${stat.accent}`}>
              {stat.value}
            </p>
            <p className="stat-sub">{stat.sub}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}