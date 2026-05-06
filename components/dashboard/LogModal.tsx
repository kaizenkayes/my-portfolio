import type { LearningLogInput } from "@/lib/validations/schemas";

const LOG_TYPES = ["daily", "weekly", "resource", "milestone"] as const;

interface LogModalProps {
  form: LearningLogInput;
  setForm: (form: LearningLogInput) => void;
  tagsInput: string;
  setTagsInput: (tags: string) => void;
  editId: string | null;
  error: string;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function LogModal({
  form,
  setForm,
  tagsInput,
  setTagsInput,
  editId,
  error,
  isPending,
  onSubmit,
  onClose,
}: LogModalProps) {
  return (
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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
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
            {editId ? "Edit Log" : "New Log Entry"}
          </h2>
          <button
            onClick={onClose}
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
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label className="form-label">Title *</label>
            <input
              className="form-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label className="form-label">Type</label>
              <select
                className="form-input"
                value={form.type}
                // টাইপ কাস্টিং সরাসরি schemas থেকে আসা টাইপে করা হয়েছে
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as LearningLogInput["type"],
                  })
                }
              >
                {LOG_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={
                  form.date
                    ? new Date(form.date).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    date: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : new Date().toISOString(),
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="form-label">Content * (Markdown supported)</label>
            <textarea
              className="form-input"
              rows={6}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              style={{
                resize: "vertical",
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            />
          </div>

          <div>
            <label className="form-label">Tags (comma separated)</label>
            <input
              className="form-input"
              placeholder="Next.js, TypeScript, React"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
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
              onClick={onClose}
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
  );
}
