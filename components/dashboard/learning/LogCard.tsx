"use client";

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

export function LogCard({
  log,
  isAdmin,
  onEdit,
  onDelete,
  isPending,
}: LogCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card">
      <div className="flex justify-between items-start flex-wrap gap-3">
        {/* LEFT CONTENT */}
        <div className="flex-1">
          {/* TYPE + DATE */}
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span
              className="text-[9px] font-bold tracking-[0.3em] uppercase border px-2 py-[2px] rounded-[2px]"
              style={{
                color:
                  TYPE_COLORS[log.type] ?? "var(--text-dim)",
                borderColor:
                  TYPE_COLORS[log.type] ?? "var(--card-border)",
              }}
            >
              {log.type}
            </span>

            <span className="text-[0.75rem] text-[var(--text-dim)] font-mono">
              {format(new Date(log.date), "MMM dd, yyyy")}
            </span>
          </div>

          {/* TITLE */}
          <h3 className="font-extrabold text-[1rem] tracking-[-0.3px] mb-2">
            {log.title}
          </h3>

          {/* TAGS */}
          {log.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {log.tags.map((tag) => (
                <span key={tag} className="tech-badge">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CONTENT */}
          {expanded ? (
            <div className="mt-3">
              <p className="text-[0.9rem] leading-[1.8] text-[var(--text-dim)] whitespace-pre-wrap">
                {log.content}
              </p>

              <button
                onClick={() => setExpanded(false)}
                className="mt-2 text-[0.8rem] font-bold text-[var(--accent-indigo)] bg-transparent border-0 p-0 cursor-pointer"
              >
                Show less ↑
              </button>
            </div>
          ) : (
            <button
              onClick={() => setExpanded(true)}
              className="text-left text-[0.8rem] font-semibold text-[var(--text-dim)] bg-transparent border-0 p-0 cursor-pointer"
            >
              {log.content.slice(0, 80)}...{" "}
              <span className="text-[var(--accent-indigo)] font-bold">
                Read more ↓
              </span>
            </button>
          )}
        </div>

        {/* ACTIONS */}
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-[0.75rem] font-bold px-3 py-1 border border-[var(--card-border)] text-[var(--accent-indigo)] bg-transparent rounded-[2px] cursor-pointer"
            >
              Edit
            </button>

            <button
              onClick={onDelete}
              disabled={isPending}
              className="text-[0.75rem] font-bold px-3 py-1 border border-[rgba(248,113,113,0.2)] text-[#f87171] bg-transparent rounded-[2px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
