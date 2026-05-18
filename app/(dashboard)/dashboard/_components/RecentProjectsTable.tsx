import Link from "next/link";
import { IProject } from "@/types";

export function RecentProjectsTable({ projects }: { projects: IProject[] }) {
  return (
    <section style={{ marginTop: "20px" }} className="glass-card p-8">
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
        <table className="data-table w-full">
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
                <td
                  colSpan={4}
                  className="text-center text-[var(--text-dim)] p-12"
                >
                  No projects yet.{" "}
                  <Link
                    href="/dashboard/projects"
                    className="text-[var(--accent-indigo)] font-bold"
                  >
                    Add one →
                  </Link>
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project._id}>
                  <td className="font-semibold">{project.title}</td>

                  <td>
                    <span className={`status-badge badge-${project.status}`}>
                      {project.status}
                    </span>
                  </td>

                  <td
                    className={
                      project.featured
                        ? "text-yellow-400"
                        : "text-[var(--text-dim)]"
                    }
                  >
                    {project.featured ? "★ Yes" : "—"}
                  </td>

                  <td>
                    <div className="flex gap-1 flex-wrap">
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
    </section>
  );
}
