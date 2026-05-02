"use client";

interface DashboardSkeletonProps {
  type: "stats" | "table";
}

export function DashboardSkeleton({ type }: DashboardSkeletonProps) {
  if (type === "stats") {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card-skeleton">
            <div className="skeleton-label"></div>
            <div className="skeleton-value"></div>
            <div className="skeleton-sub"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card recent-projects-section">
      <div className="section-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-link"></div>
      </div>
      <div className="table-skeleton">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
          </div>
        ))}
      </div>
    </div>
  );
}