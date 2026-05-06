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
  completed: "text-[#4ade80]",
  "in-progress": "text-[var(--accent-gold)]",
  archived: "text-[var(--text-dim)]",
};

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const res = await getProjectBySlug(slug);
  if (!res.success || !res.data) notFound();

  const project = res.data as IProject;

  return (
    <section className="section-base bg-[var(--bg-light)] pt-[140px]">
      <div className="hero-bg" />
      <div className="content max-w-[900px]">
        {/* Back link */}
        <Link
          href="/#projects"
          className="contact-link inline-flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.2em] uppercase text-[var(--text-dim)] no-underline mb-12 transition-colors duration-200"
        >
          ← Back to Works
        </Link>

        {/* Status */}
        <p className={`text-[9px] font-bold tracking-[0.3em] uppercase mb-4 ${STATUS_COLORS[project.status] ?? "text-[var(--text-dim)]"}`}>
          ● {project.status}
          {project.featured && (
            <span className="ml-4 text-[var(--accent-gold)]">
              ★ FEATURED
            </span>
          )}
        </p>

        {/* Title */}
        <h1 className="text-[clamp(2.5rem,7vw,4rem)] font-black tracking-[-2px] leading-[1.1] mb-6 text-[var(--text-main)] uppercase">
          {project.title}
        </h1>

        {/* Description */}
        <p className="text-[1.15rem] leading-[1.8] text-[var(--text-dim)] max-w-[640px] mb-10">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="mb-10">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[var(--text-dim)] mb-3">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech.name} className="tech-badge">
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 mb-[60px]">
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
          <div className="glass-card mt-0">
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[var(--text-dim)] mb-5">
              Project Details
            </p>
            <div className="leading-[1.9] text-[var(--text-main)] text-[1rem] whitespace-pre-wrap">
              {project.longDescription}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}