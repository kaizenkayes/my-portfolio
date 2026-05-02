"use client";

import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import type { IProject } from "@/types";

const ACCENT_CYCLE = [
  "project-card-indigo",
  "project-card-gold",
  "project-card-indigo",
  "project-card-gold",
];

const STATUS_COLORS: Record<string, string> = {
  completed: "#4ade80",
  "in-progress": "var(--accent-gold)",
  archived: "var(--text-dim)",
};

export function ProjectsSection({ projects }: { projects: IProject[] }) {
  const displayProjects = [...(projects ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <section
      id="projects"
      className="section-base"
      style={{ background: "var(--bg-subtle)" }}
    >
      <div className="project-bg" />

      <div className="content">
        <Reveal>
          <span className="section-label">03 // Works</span>
          <h2 className="heading-lg">
            LATEST <span className="indigo">WORK</span>
          </h2>
        </Reveal>

        <div className="card-grid">
          {displayProjects.map((project, i) => (
            <Reveal key={project._id} delay={i * 0.1}>
              <div
                className={`glass-card ${ACCENT_CYCLE[i % ACCENT_CYCLE.length]}`}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Status + Featured */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: STATUS_COLORS[project.status] ?? "var(--text-dim)",
                    }}
                  >
                    ● {project.status}
                  </span>
                  {project.featured && (
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--accent-gold)",
                      }}
                    >
                      FEATURED
                    </span>
                  )}
                </div>

                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    marginBottom: "12px",
                    color: "var(--text-main)",
                    textTransform: "uppercase",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {project.title}
                </h3>

                <p
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    flex: 1,
                    marginBottom: "20px",
                  }}
                >
                  {project.description}
                </p>

                {/* Tech badges */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginBottom: "20px",
                  }}
                >
                  {(project.techStack ?? []).map((tech, idx) => (
                    <span key={`${tech.name}-${idx}`} className="tech-badge">
                      {tech.name}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div style={{ display: "flex", gap: "16px" }}>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      GitHub ↗
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      Live ↗
                    </a>
                  )}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="contact-link"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
