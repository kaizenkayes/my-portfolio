import type { IProject } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  completed: "#4ade80",
  "in-progress": "var(--accent-gold)",
  archived: "var(--text-dim)",
};

interface ProjectTableProps {
  projects: IProject[];
  isAdmin: boolean;
  onEdit: (p: IProject) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

export function ProjectTable({ projects, isAdmin, onEdit, onDelete, isPending }: ProjectTableProps) {
  return (
    <div className="glass-card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Stack</th>
              <th>Order</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td 
                  colSpan={isAdmin ? 6 : 5} 
                  className="text-center text-[var(--text-dim)] py-12"
                >
                  No projects yet.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project._id}>
                  <td className="font-bold max-w-[200px]">
                    <div>{project.title}</div>
                    <div className="text-[0.78rem] text-[var(--text-dim)] font-normal mt-0.5">
                      {project.description.slice(0, 60)}...
                    </div>
                  </td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ color: STATUS_COLORS[project.status] }}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className={project.featured ? "text-[var(--accent-gold)]" : "text-[var(--text-dim)]"}>
                    {project.featured ? "★" : "—"}
                  </td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      {project.techStack.slice(0, 3).map((t) => (
                        <span key={t.name} className="tech-badge">{t.name}</span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="tech-badge">+{project.techStack.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="text-[var(--text-dim)]">{project.order}</td>
                  {isAdmin && (
                    <td>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onEdit(project)} 
                          className="bg-transparent border border-[var(--card-border)] text-[var(--accent-indigo)] px-3 py-1 text-[0.75rem] font-bold cursor-pointer rounded-[2px]"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => onDelete(project._id)} 
                          disabled={isPending}
                          className="bg-transparent border border-red-500/20 text-red-400 px-3 py-1 text-[0.75rem] font-bold cursor-pointer rounded-[2px]"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}