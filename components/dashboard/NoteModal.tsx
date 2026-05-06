import type { NoteInput } from "@/lib/validations/schemas";

const NOTE_COLORS = [
  { label: "Default", value: "var(--card-bg)" },
  { label: "Gold", value: "rgba(240,177,51,0.08)" },
  { label: "Indigo", value: "rgba(129,140,248,0.08)" },
  { label: "Green", value: "rgba(74,222,128,0.08)" },
  { label: "Pink", value: "rgba(244,114,182,0.08)" },
];

interface NoteModalProps {
  form: NoteInput;
  setForm: (form: NoteInput) => void;
  tagsInput: string;
  setTagsInput: (tags: string) => void;
  editId: string | null;
  error: string;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function NoteModal({ 
  form, setForm, tagsInput, setTagsInput, editId, error, isPending, onSubmit, onClose 
}: NoteModalProps) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass-card" style={{ width: "100%", maxWidth: "540px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.5px" }}>{editId ? "Edit Note" : "New Note"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", fontSize: "1.2rem" }}>✕</button>
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label className="form-label">Title *</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Note title..." required />
          </div>

          <div>
            <label className="form-label">Content *</label>
            <textarea className="form-input" rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your note here..." required style={{ resize: "vertical" }} />
          </div>

          <div>
            <label className="form-label">Tags (comma separated)</label>
            <input className="form-input" placeholder="react, tips, architecture" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
          </div>

          <div>
            <label className="form-label">Color</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.value} type="button" onClick={() => setForm({ ...form, color: c.value })}
                  style={{
                    width: "32px", height: "32px", borderRadius: "50%", background: c.value,
                    border: form.color === c.value ? "2px solid var(--accent-indigo)" : "2px solid var(--card-border)",
                    cursor: "pointer", transition: "border 0.2s",
                  }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "var(--text-main)", fontSize: "0.875rem", fontWeight: 600 }}>
            <input type="checkbox" checked={form.isPinned} onChange={(e) => setForm({ ...form, isPinned: e.target.checked })} style={{ accentColor: "var(--accent-gold)" }} />
            📌 Pin this note
          </label>

          {error && <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{error}</p>}

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" className="btn-grad-border" disabled={isPending}>
              {isPending ? "Saving..." : editId ? "Update Note" : "Create Note"}
            </button>
            <button type="button" onClick={onClose} style={{ background: "none", border: "1px solid var(--card-border)", color: "var(--text-dim)", padding: "16px 24px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "1px", textTransform: "uppercase" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}