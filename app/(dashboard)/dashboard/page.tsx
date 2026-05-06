import { auth } from "@/auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { getProjects, getSkills, getLearningLogs, getNotes } from "@/lib/actions/index";
import type { IProject, ISkill, ILearningLog, INote } from "@/types";
import Link from "next/link";

export default async function DashboardPage() {
  const [session, projectsRes, skillsRes, logsRes, notesRes] = await Promise.all([
    auth(),
    getProjects(),
    getSkills(),
    getLearningLogs(),
    getNotes(),
  ]);

  const projects = (projectsRes.data ?? []) as IProject[];
  const skills = (skillsRes.data ?? []) as ISkill[];
  const logs = (logsRes.data ?? []) as ILearningLog[];
  const notes = (notesRes.data ?? []) as INote[];

  const stats = [
    { label: "Projects", value: projects.length, href: "/dashboard/projects", accent: "indigo", sub: `${projects.filter((p) => p.featured).length} featured` },
    { label: "Skills", value: skills.length, href: "/dashboard/skills", accent: "gold", sub: `${Array.from(new Set(skills.map((s) => s.category))).length} categories` },
    { label: "Learning Logs", value: logs.length, href: "/dashboard/learning", accent: "indigo", sub: "entries tracked" },
    { label: "Notes", value: notes.length, href: "/dashboard/notes", accent: "gold", sub: `${notes.filter((n) => n.isPinned).length} pinned` },
  ];

  const recentProjects = projects.slice(0, 5);

  return (
    // এখানে space-y-10 ব্যবহার করেছি যাতে চাইল্ডগুলোর মাঝে অটোমেটিক গ্যাপ থাকে
    <div className="flex flex-col ">
      <DashboardHeader
        title={`Welcome, ${session?.user?.name?.split(" ")[0] ?? "Admin"}.`}
        subtitle="Here's what's happening in your lab."
      />

      {/* Stats Grid */}
      <section>
        <div style={{ marginBottom: "24px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href} className="no-underline block group">
              <div
                className="glass-card p-7 transition-transform group-hover:-translate-y-1"
                style={{ borderTop: `3px solid var(--accent-${stat.accent})` } }
              >
                <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-[var(--text-dim)] mb-3">
                  {stat.label}
                </p>
                <p className={`${stat.accent} text-[3rem] font-black tracking-[-2px] leading-none mb-1.5`}>
                  {stat.value}
                </p>
                <p className="text-[0.8rem] text-[var(--text-dim)]">
                  {stat.sub}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section className="glass-card p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[1rem] font-extrabold uppercase tracking-[1px] text-[var(--text-main)]">
            Recent Projects
          </h2>
          <Link
            href="/dashboard/projects"
            className="text-[0.78rem] font-bold tracking-[0.3em] uppercase text-[var(--accent-indigo)] no-underline"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
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
              {recentProjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-[var(--text-dim)] p-12">
                    No projects yet. <Link href="/dashboard/projects" className="text-[var(--accent-indigo)] font-bold">Add one →</Link>
                  </td>
                </tr>
              ) : (
                recentProjects.map((project) => (
                  <tr key={project._id}>
                    <td className="font-semibold">{project.title}</td>
                    <td>
                      <span className={`status-badge badge-${project.status.replace("-", "-")}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className={project.featured ? "text-[var(--accent-gold)]" : "text-[var(--text-dim)]"}>
                      {project.featured ? "★ Yes" : "—"}
                    </td>
                    <td>
                      <div className="flex gap-1 flex-wrap">
                        {project.techStack.slice(0, 3).map((t) => (
                          <span key={t.name} className="tech-badge">{t.name}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}