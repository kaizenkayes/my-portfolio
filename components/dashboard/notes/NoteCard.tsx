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
      className="glass-card p-6 relative h-full flex flex-col"
      style={{
        background: note.color ?? "var(--card-bg)",
        borderTop: note.isPinned ? "2px solid var(--accent-gold)" : undefined,
      }}
    >
      {/* Pinned Icon */}
      {note.isPinned && (
        <span className="absolute top-3 right-3 text-[14px]">📌</span>
      )}

      {/* Note Title */}
      <h3 className="font-extrabold text-[1rem] tracking-[-0.3px] mb-2.5 pr-6 text-[var(--text-main)]">
        {note.title}
      </h3>

      {/* Note Content */}
      <p className="text-[var(--text-dim)] text-sm leading-[1.7] flex-1 overflow-hidden line-clamp-4 mb-4">
        {note.content}
      </p>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.map((tag) => (
            <span key={tag} className="tech-badge">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Area */}
      <div className="flex justify-between items-center mt-auto">
        <span className="text-[0.72rem] text-[var(--text-dim)] font-mono">
          {format(new Date(note.createdAt), "MMM dd, yyyy")}
        </span>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="bg-none border border-[var(--card-border)] text-[var(--accent-indigo)] px-2.5 py-[3px] text-[0.72rem] font-bold cursor-pointer rounded-[2px]"
              type="button"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              disabled={isPending}
              className="bg-none border border-[rgba(248,113,113,0.2)] text-[#f87171] px-2.5 py-[3px] text-[0.72rem] font-bold cursor-pointer rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isPending ? "..." : "Del"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
