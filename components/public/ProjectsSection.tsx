"use client";

import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import type { IProject } from "@/types";

interface ProjectsSectionProps {
  projects: IProject[];
}

const DEFAULT_PROJECTS: IProject[] = [
  {
    _id: "1",
    title: "KaizenHub",
    slug: "kaizenhub",
    description: "Full-stack portfolio + learning management dashboard with MCP server integration and role-based access control.",
    techStack: [
      { name: "Next.js 15" },
      { name: "TypeScript" },
      { name: "MongoDB" },
      { name: "NextAuth v5" },
    ],
    featured: true,
    status: "in-progress",
    order: 1,
    githubUrl: "https://github.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    title: "Fintech App UI",
    slug: "fintech-app",
    description: "High-security interface for digital banking with real-time transaction tracking and advanced data visualization.",
    techStack: [{ name: "React" }, { name: "Tailwind" }, { name: "Node.js" }],
    featured: true,
    status: "completed",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    title: "E-Commerce Platform",
    slug: "ecommerce",
    description: "Scalable e-commerce solution with payment integration, inventory management, and admin dashboard.",
    techStack: [{ name: "Next.js" }, { name: "Stripe" }, { name: "MongoDB" }],
    featured: false,
    status: "completed",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "4",
    title: "Dev Portfolio",
    slug: "dev-portfolio",
    description: "Minimalist showcase for modern developers with dark/light themes and smooth scroll animations.",
    techStack: [{ name: "Next.js" }, { name: "Framer Motion" }, { name: "Lenis" }],
    featured: false,
    status: "completed",
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

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

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const displayProjects = projects.length > 0 ? projects : DEFAULT_PROJECTS;

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
                style={{ height: "100%", display: "flex", flexDirection: "column" }}
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
                  style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}
                >
                  {project.techStack.map((tech) => (
                    <span key={tech.name} className="tech-badge">
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
