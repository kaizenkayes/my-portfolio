import { useState } from "react";
import { format } from "date-fns";
import type { ILearningLog } from "@/types";

const TYPE_COLORS: Record<string, string> = {
  daily: "var(--accent-indigo)",
  weekly: "var(--accent-gold)",
  resource: "#4ade80",
  milestone: "#f472b6",
};

interface LogCardProps {
  log: ILearningLog;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isPending: boolean;
}

export function LogCard({ log, isAdmin, onEdit, onDelete, isPending }: LogCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "9px", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase",
              color: TYPE_COLORS[log.type] ?? "var(--text-dim)",
              border: `1px solid ${TYPE_COLORS[log.type] ?? "var(--card-border)"}`,
              padding: "2px 8px", borderRadius: "2px",
            }}>
              {log.type}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "monospace" }}>
              {format(new Date(log.date), "MMM dd, yyyy")}
            </span>
          </div>

          <h3 style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.3px", marginBottom: "8px" }}>
            {log.title}
          </h3>

          {log.tags.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
              {log.tags.map((tag) => (
                <span key={tag} className="tech-badge">#{tag}</span>
              ))}
            </div>
          )}

          {expanded ? (
            <div style={{ marginTop: "12px" }}>
              <p style={{ color: "var(--text-dim)", lineHeight: 1.8, fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
                {log.content}
              </p>
              <button onClick={() => setExpanded(false)} style={{ background: "none", border: "none", color: "var(--accent-indigo)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, marginTop: "10px", padding: 0 }}>
                Show less ↑
              </button>
            </div>
          ) : (
            <button onClick={() => setExpanded(true)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, padding: 0, textAlign: "left" }}>
              {log.content.slice(0, 80)}... <span style={{ color: "var(--accent-indigo)" }}>Read more ↓</span>
            </button>
          )}
        </div>

        {isAdmin && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={onEdit} style={{ background: "none", border: "1px solid var(--card-border)", color: "var(--accent-indigo)", padding: "4px 12px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}>
              Edit
            </button>
            <button onClick={onDelete} disabled={isPending} style={{ background: "none", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", padding: "4px 12px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}