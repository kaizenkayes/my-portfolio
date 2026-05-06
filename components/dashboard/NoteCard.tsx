import { format } from "date-fns";
import type { INote } from "@/types";

interface NoteCardProps {
  note: INote;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isPending: boolean;
}

export function NoteCard({ note, isAdmin, onEdit, onDelete, isPending }: NoteCardProps) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "24px",
        background: note.color ?? "var(--card-bg)",
        borderTop: note.isPinned ? "2px solid var(--accent-gold)" : undefined,
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {note.isPinned && (
        <span style={{ position: "absolute", top: "12px", right: "12px", fontSize: "14px" }}>📌</span>
      )}
      <h3 style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.3px", marginBottom: "10px", paddingRight: "24px", color: "var(--text-main)" }}>
        {note.title}
      </h3>
      <p style={{ color: "var(--text-dim)", fontSize: "0.875rem", lineHeight: 1.7, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", marginBottom: "16px" }}>
        {note.content}
      </p>

      {note.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
          {note.tags.map((tag) => (
            <span key={tag} className="tech-badge">#{tag}</span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "monospace" }}>
          {format(new Date(note.createdAt), "MMM dd, yyyy")}
        </span>
        {isAdmin && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={onEdit} style={{ background: "none", border: "1px solid var(--card-border)", color: "var(--accent-indigo)", padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}>
              Edit
            </button>
            <button onClick={onDelete} disabled={isPending} style={{ background: "none", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}>
              Del
            </button>
          </div>
        )}
      </div>
    </div>
  );
}