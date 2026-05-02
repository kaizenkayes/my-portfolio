"use client";

import { useState, useTransition } from "react";
import { createSkill, updateSkill, deleteSkill } from "@/lib/actions/index";
import type { ISkill } from "@/types";
import type { SkillInput } from "@/lib/validations/schemas";

interface Props {
  skills: ISkill[];
  isAdmin: boolean;
}

const CATEGORIES = ["frontend", "backend", "database", "devops", "tools", "other"] as const;

type SkillFormData = SkillInput;

const EMPTY_FORM: SkillFormData = {
  name: "",
  icon: "",
  category: "frontend",
  proficiency: 80,
  order: 0,
};

export function SkillsClient({ skills: initialSkills, isAdmin }: Props) {
  const [skills, setSkills] = useState<ISkill[]>(initialSkills);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillFormData>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const grouped = CATEGORIES.map((cat) => ({
    cat,
    items: skills.filter((s) => s.category === cat).sort((a, b) => a.order - b.order),
  })).filter((g) => g.items.length > 0);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (skill: ISkill) => {
    setForm({
      name: skill.name,
      icon: skill.icon ?? "",
      category: skill.category,
      proficiency: skill.proficiency,
      order: skill.order,
    });
    setEditId(skill._id);
    setError("");
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this skill?")) return;
    startTransition(async () => {
      const res = await deleteSkill(id);
      if (res.success) setSkills((prev) => prev.filter((s) => s._id !== id));
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const payload = form;

      if (editId) {
        const res = await updateSkill(editId, payload);
        if (!res.success) {
          setError(res.error ?? "Update failed");
          return;
        }
        setSkills((prev) =>
          prev.map((s) => (s._id === editId ? { ...s, ...form } : s))
        );
      } else {
        const res = await createSkill(payload);
        if (!res.success) {
          setError(res.error ?? "Create failed");
          return;
        }
        if (res.data) setSkills((prev) => [...prev, res.data as ISkill]);
      }
      setModalOpen(false);
    });
  };

  return (
    <>
      {isAdmin && (
        <div style={{ marginBottom: "24px" }}>
          <button className="btn-grad-border" onClick={openCreate}>
            + New Skill
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {grouped.map(({ cat, items }) => (
          <div key={cat} className="glass-card" style={{ padding: "28px" }}>
            <h3
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--accent-gold)",
                marginBottom: "20px",
              }}
            >
              {cat}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {items.map((skill) => (
                <div key={skill._id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {skill.name}
                    </span>
                    {isAdmin && (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          onClick={() => openEdit(skill)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--accent-indigo)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "2px 6px",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#f87171",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "2px 6px",
                          }}
                        >
                          Del
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="glass-card" style={{ width: "100%", maxWidth: "440px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "28px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                }}
              >
                {editId ? "Edit Skill" : "New Skill"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-dim)",
                  fontSize: "1.2rem",
                }}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label className="form-label">Skill Name *</label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Next.js"
                  required
                />
              </div>

              <div>
                <label className="form-label">Category *</label>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as SkillFormData["category"],
                    })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Order</label>
                <input
                  className="form-input"
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Proficiency (1-100) *</label>
                <input
                  className="form-input"
                  type="number"
                  min={1}
                  max={100}
                  value={form.proficiency}
                  onChange={(e) =>
                    setForm({ ...form, proficiency: Number(e.target.value) })
                  }
                  required
                />
              </div>

              {error && (
                <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{error}</p>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  type="submit"
                  className="btn-grad-border"
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : editId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    background: "none",
                    border: "1px solid var(--card-border)",
                    color: "var(--text-dim)",
                    padding: "16px 24px",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
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