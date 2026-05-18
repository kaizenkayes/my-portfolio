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
    <section className="section-base bg-[var(--bg-light)] pt-[140px] min-h-screen">
      <div className="hero-bg" />

      <div className="content max-w-[900px] mx-auto px-6">
      
        <Link
          href="/#projects"
          className="contact-link inline-flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.2em] uppercase no-underline mb-10"
        >
          ← Back to Works
        </Link>

       
        <p
          className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3.5"
          style={{
            color: STATUS_COLORS[project.status] ?? "var(--text-dim)",
          }}
        >
          ● {project.status}
          {project.featured && (
            <span className="ml-3.5 text-[var(--accent-gold)]">★ FEATURED</span>
          )}
        </p>

      
        <h1 className="text-[clamp(2.5rem,7vw,4rem)] font-black tracking-[-2px] leading-[1.05] mb-5.5 text-[var(--text-main)] uppercase">
          {project.title}
        </h1>

       
        <p className="text-[1.1rem] leading-[1.85] text-[var(--text-dim)] max-w-[650px] mb-8.5">
          {project.description}
        </p>

       
        {project.techStack.length > 0 && (
          <div className="mb-8.5">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--text-dim)] mb-3">
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
        )}

       
        <div className="flex flex-wrap gap-3.5">
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
      </div>
    </section>
  );
}
