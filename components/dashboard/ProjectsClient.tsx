"use client";

import { useState, useTransition } from "react";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/actions/index";
import type { IProject, ITechStack } from "@/types";
import type { ProjectInput } from "@/lib/validations/schemas";

interface Props {
  projects: IProject[];
  isAdmin: boolean;
}

const EMPTY_FORM: ProjectInput = {
  title: "",
  description: "",
  longDescription: "",
  thumbnail: "",
  techStack: [],
  liveUrl: "",
  demoUrl: "",
  githubUrl: "",
  featured: false,
  status: "completed",
  order: 0,
};

const STATUS_COLORS: Record<string, string> = {
  completed: "#4ade80",
  "in-progress": "var(--accent-gold)",
  archived: "var(--text-dim)",
};

export function ProjectsClient({ projects: initialProjects, isAdmin }: Props) {
  const [projects, setProjects] = useState<IProject[]>(initialProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectInput>(EMPTY_FORM);
  const [techInput, setTechInput] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setTechInput("");
    setEditId(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (project: IProject) => {
    setForm({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription ?? "",
      thumbnail: project.thumbnail ?? "",
      techStack: project.techStack,
      liveUrl: project.liveUrl ?? "",
      demoUrl: project.demoUrl ?? "",
      githubUrl: project.githubUrl ?? "",
      featured: project.featured,
      status: project.status,
      order: project.order,
    });
    setTechInput(project.techStack.map((t) => t.name).join(", "));
    setEditId(project._id);
    setError("");
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this project?")) return;
    startTransition(async () => {
      const res = await deleteProject(id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const techStack: ITechStack[] = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    const payload: ProjectInput = { ...form, techStack };

    startTransition(async () => {
      if (editId) {
        const res = await updateProject(editId, payload);
        if (!res.success) { setError(res.error ?? "Update failed"); return; }
        setProjects((prev) =>
          prev.map((p) => (p._id === editId ? { ...p, ...payload } : p))
        );
      } else {
        const res = await createProject(payload);
        if (!res.success) { setError(res.error ?? "Create failed"); return; }
        if (res.data) setProjects((prev) => [res.data as IProject, ...prev]);
      }
      setModalOpen(false);
    });
  };

  return (
    <>
      {isAdmin && (
        <div style={{ marginBottom: "24px" }}>
          <button className="btn-grad-border" onClick={openCreate}>
            + New Project
          </button>
        </div>
      )}

      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
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
                  <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: "center", color: "var(--text-dim)", padding: "48px" }}>
                    No projects yet.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id}>
                    <td style={{ fontWeight: 700, maxWidth: "200px" }}>
                      <div>{project.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontWeight: 400, marginTop: "2px" }}>
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
                    <td style={{ color: project.featured ? "var(--accent-gold)" : "var(--text-dim)" }}>
                      {project.featured ? "★" : "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {project.techStack.slice(0, 3).map((t) => (
                          <span key={t.name} className="tech-badge">{t.name}</span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="tech-badge">+{project.techStack.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: "var(--text-dim)" }}>{project.order}</td>
                    {isAdmin && (
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => openEdit(project)}
                            style={{
                              background: "none",
                              border: "1px solid var(--card-border)",
                              color: "var(--accent-indigo)",
                              padding: "4px 12px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              borderRadius: "2px",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            disabled={isPending}
                            style={{
                              background: "none",
                              border: "1px solid rgba(248,113,113,0.2)",
                              color: "#f87171",
                              padding: "4px 12px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              borderRadius: "2px",
                              letterSpacing: "0.5px",
                            }}
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

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div
            className="glass-card"
            style={{ width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.5px" }}>
                {editId ? "Edit Project" : "New Project"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", fontSize: "1.2rem" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>

              <div>
                <label className="form-label">Short Description *</label>
                <textarea className="form-input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required style={{ resize: "vertical" }} />
              </div>

              <div>
                <label className="form-label">Long Description</label>
                <textarea className="form-input" rows={4} value={form.longDescription ?? ""} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} style={{ resize: "vertical" }} />
              </div>

              <div>
                <label className="form-label">Tech Stack (comma separated)</label>
                <input className="form-input" placeholder="Next.js, TypeScript, MongoDB" value={techInput} onChange={(e) => setTechInput(e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="form-label">GitHub URL</label>
                  <input className="form-input" type="url" placeholder="https://github.com/..." value={form.githubUrl ?? ""} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Live URL</label>
                  <input className="form-input" type="url" placeholder="https://..." value={form.liveUrl ?? ""} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="form-label">Status</label>
                  <select className="form-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectInput["status"] })}>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Order</label>
                  <input className="form-input" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "1px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "var(--text-main)", fontSize: "0.875rem", fontWeight: 600 }}>
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                    Featured
                  </label>
                </div>
              </div>

              {error && (
                <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{error}</p>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" className="btn-grad-border" disabled={isPending}>
                  {isPending ? "Saving..." : editId ? "Update Project" : "Create Project"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ background: "none", border: "1px solid var(--card-border)", color: "var(--text-dim)", padding: "16px 24px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "1px", textTransform: "uppercase" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
