"use client";

import Link from "next/link";
import type { IProject } from "@/types";

interface RecentProjectsTableProps {
  projects: IProject[];
}

export function RecentProjectsTable({ projects }: RecentProjectsTableProps) {
  return (
    <div className="glass-card recent-projects-section">
      <div className="section-header">
        <h2 className="section-title">Recent Projects</h2>
        <Link href="/dashboard/projects" className="view-all-link">
          View All →
        </Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Stack</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={4} className="empty-state">
                No projects yet.{" "}
                <Link href="/dashboard/projects" className="empty-link">
                  Add one →
                </Link>
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project._id}>
                <td className="project-title">{project.title}</td>
                <td>
                  <span className={`status-badge status-${project.status.replace(/_/g, "-")}`}>
                    {project.status}
                  </span>
                </td>
                <td className={project.featured ? "featured-yes" : "featured-no"}>
                  {project.featured ? "★ Yes" : "—"}
                </td>
                <td>
                  <div className="tech-stack">
                    {project.techStack.slice(0, 3).map((t) => (
                      <span key={t.name} className="tech-badge">
                        {t.name}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}