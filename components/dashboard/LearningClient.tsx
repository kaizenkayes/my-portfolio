"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import {
  createLearningLog,
  updateLearningLog,
  deleteLearningLog,
} from "@/lib/actions/index";
import type { ILearningLog } from "@/types";
import type { LearningLogInput } from "@/lib/validations/schemas";

interface Props {
  logs: ILearningLog[];
  isAdmin: boolean;
}

const LOG_TYPES = ["daily", "weekly", "resource", "milestone"] as const;

const TYPE_COLORS: Record<string, string> = {
  daily: "var(--accent-indigo)",
  weekly: "var(--accent-gold)",
  resource: "#4ade80",
  milestone: "#f472b6",
};

const EMPTY_FORM: LearningLogInput = {
  title: "",
  content: "",
  tags: [],
  type: "daily",
  date: new Date().toISOString(),
};

export function LearningClient({ logs: initialLogs, isAdmin }: Props) {
  const [logs, setLogs] = useState<ILearningLog[]>(initialLogs);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<LearningLogInput>(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, date: new Date().toISOString() });
    setTagsInput("");
    setEditId(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (log: ILearningLog) => {
    setForm({
      title: log.title,
      content: log.content,
      tags: log.tags,
      type: log.type,
      date: new Date(log.date).toISOString(),
    });
    setTagsInput(log.tags.join(", "));
    setEditId(log._id);
    setError("");
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this log entry?")) return;
    startTransition(async () => {
      const res = await deleteLearningLog(id);
      if (res.success) setLogs((prev) => prev.filter((l) => l._id !== id));
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload: LearningLogInput = { ...form, tags };

    startTransition(async () => {
      if (editId) {
        const res = await updateLearningLog(editId, payload);
        if (!res.success) { setError(res.error ?? "Update failed"); return; }
        setLogs((prev) => prev.map((l) => (l._id === editId ? { ...l, ...payload } : l)));
      } else {
        const res = await createLearningLog(payload);
        if (!res.success) { setError(res.error ?? "Create failed"); return; }
        if (res.data) setLogs((prev) => [res.data as ILearningLog, ...prev]);
      }
      setModalOpen(false);
    });
  };

  return (
    <>
      {isAdmin && (
        <div style={{ marginBottom: "24px" }}>
          <button className="btn-grad-border" onClick={openCreate}>
            + New Entry
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {logs.length === 0 && (
          <div className="glass-card" style={{ textAlign: "center", color: "var(--text-dim)", padding: "48px" }}>
            No learning logs yet.
          </div>
        )}

        {logs.map((log) => (
          <div key={log._id} className="glass-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: TYPE_COLORS[log.type] ?? "var(--text-dim)",
                      border: `1px solid ${TYPE_COLORS[log.type] ?? "var(--card-border)"}`,
                      padding: "2px 8px",
                      borderRadius: "2px",
                    }}
                  >
                    {log.type}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "monospace" }}>
                    {format(new Date(log.date), "MMM dd, yyyy")}
                  </span>
                </div>

                <h3 style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.3px", marginBottom: "8px" }}>
                  {log.title}
                </h3>

                {/* Tags */}
                {log.tags.length > 0 && (
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                    {log.tags.map((tag) => (
                      <span key={tag} className="tech-badge">#{tag}</span>
                    ))}
                  </div>
                )}

                {/* Content (expandable) */}
                {expanded === log._id ? (
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ color: "var(--text-dim)", lineHeight: 1.8, fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
                      {log.content}
                    </p>
                    <button onClick={() => setExpanded(null)} style={{ background: "none", border: "none", color: "var(--accent-indigo)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, marginTop: "10px", padding: 0 }}>
                      Show less ↑
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setExpanded(log._id)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, padding: 0, textAlign: "left" }}>
                    {log.content.slice(0, 80)}... <span style={{ color: "var(--accent-indigo)" }}>Read more ↓</span>
                  </button>
                )}
              </div>

              {isAdmin && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => openEdit(log)} style={{ background: "none", border: "1px solid var(--card-border)", color: "var(--accent-indigo)", padding: "4px 12px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(log._id)} disabled={isPending} style={{ background: "none", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", padding: "4px 12px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="glass-card" style={{ width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.5px" }}>
                {editId ? "Edit Log" : "New Log Entry"}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", fontSize: "1.2rem" }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="form-label">Type</label>
                  <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LearningLogInput["type"] })}>
                    {LOG_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.date ? new Date(form.date as string).toISOString().split("T")[0] : ""} onChange={(e) => setForm({ ...form, date: new Date(e.target.value).toISOString() })} />
                </div>
              </div>

              <div>
                <label className="form-label">Content * (Markdown supported)</label>
                <textarea className="form-input" rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required style={{ resize: "vertical", fontFamily: "monospace", fontSize: "0.875rem" }} />
              </div>

              <div>
                <label className="form-label">Tags (comma separated)</label>
                <input className="form-input" placeholder="Next.js, TypeScript, React" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
              </div>

              {error && <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{error}</p>}

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" className="btn-grad-border" disabled={isPending}>
                  {isPending ? "Saving..." : editId ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} style={{ background: "none", border: "1px solid var(--card-border)", color: "var(--text-dim)", padding: "16px 24px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "1px", textTransform: "uppercase" }}>
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
