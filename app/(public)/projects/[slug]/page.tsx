import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getProjects } from "@/lib/actions/index";
import type { IProject } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const res = await getProjects();
  const projects = (res.data ?? []) as IProject[];
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getProjectBySlug(slug);
  const project = res.data as IProject | undefined;
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.description,
  };
}

const STATUS_COLORS: Record<string, string> = {
  completed: "#4ade80",
  "in-progress": "var(--accent-gold)",
  archived: "var(--text-dim)",
};

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const res = await getProjectBySlug(slug);
  if (!res.success || !res.data) notFound();

  const project = res.data as IProject;

  return (
    <section
      className="section-base"
      style={{ background: "var(--bg-light)", paddingTop: "140px" }}
    >
      <div className="hero-bg" />
      <div className="content" style={{ maxWidth: "900px" }}>
        {/* Back link */}
        <Link
          href="/#projects"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            textDecoration: "none",
            marginBottom: "48px",
            transition: "color 0.2s",
          }}
          className="contact-link"
        >
          ← Back to Works
        </Link>

        {/* Status */}
        <p
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: STATUS_COLORS[project.status] ?? "var(--text-dim)",
            marginBottom: "16px",
          }}
        >
          ● {project.status}
          {project.featured && (
            <span style={{ marginLeft: "16px", color: "var(--accent-gold)" }}>
              ★ FEATURED
            </span>
          )}
        </p>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(2.5rem, 7vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: "24px",
            color: "var(--text-main)",
            textTransform: "uppercase",
          }}
        >
          {project.title}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "1.15rem",
            lineHeight: 1.8,
            color: "var(--text-dim)",
            maxWidth: "640px",
            marginBottom: "40px",
          }}
        >
          {project.description}
        </p>

        {/* Tech Stack */}
        <div style={{ marginBottom: "40px" }}>
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--text-dim)",
              marginBottom: "12px",
            }}
          >
            Tech Stack
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {project.techStack.map((tech) => (
              <span key={tech.name} className="tech-badge">
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "60px" }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-grad-border"
            >
              View on GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-grad-border"
            >
              Live Demo
            </a>
          )}
        </div>

        {/* Long description */}
        {project.longDescription && (
          <div className="glass-card" style={{ marginTop: "0" }}>
            <p
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginBottom: "20px",
              }}
            >
              Project Details
            </p>
            <div
              style={{
                lineHeight: 1.9,
                color: "var(--text-main)",
                fontSize: "1rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {project.longDescription}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
