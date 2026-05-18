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

const STATUS_TEXT_CLASS: Record<string, string> = {
  completed: "text-[#4ade80]",
  "in-progress": "text-[var(--accent-gold)]",
  archived: "text-[var(--text-dim)]",
};

const PROJECT_LINK_CLASS =
  "contact-link text-[0.8rem] font-bold uppercase tracking-[0.5px]";

export function ProjectsSection({ projects }: { projects: IProject[] }) {
  const displayProjects = [...(projects ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <section id="projects" className="section-base bg-[var(--bg-subtle)]">
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
                className={`glass-card flex h-full flex-col ${ACCENT_CYCLE[i % ACCENT_CYCLE.length]}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-[0.2em] ${STATUS_TEXT_CLASS[project.status] ?? "text-[var(--text-dim)]"}`}
                  >
                    ● {project.status}
                  </span>
                  {project.featured && (
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)]">
                      FEATURED
                    </span>
                  )}
                </div>

                <h3 className="mb-3 text-[1.25rem] font-extrabold uppercase tracking-[-0.5px] text-[var(--text-main)]">
                  {project.title}
                </h3>

                <p className="mb-5 flex-1 text-[0.9rem] leading-[1.7] text-[var(--text-dim)]">
                  {project.description}
                </p>

                <div className="mb-5 flex flex-wrap gap-1.5">
                  {(project.techStack ?? []).map((tech, idx) => (
                    <span key={`${tech.name}-${idx}`} className="tech-badge">
                      {tech.name}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={PROJECT_LINK_CLASS}
                    >
                      GitHub ↗
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={PROJECT_LINK_CLASS}
                    >
                      Live ↗
                    </a>
                  )}
                  <Link
                    href={`/projects/${project.slug}`}
                    className={PROJECT_LINK_CLASS}
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
