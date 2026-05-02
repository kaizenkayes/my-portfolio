"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { createNote, updateNote, deleteNote } from "@/lib/actions/index";
import type { INote } from "@/types";
import type { NoteInput } from "@/lib/validations/schemas";

interface Props {
  notes: INote[];
  isAdmin: boolean;
}

const NOTE_COLORS = [
  { label: "Default", value: "var(--card-bg)" },
  { label: "Gold", value: "rgba(240,177,51,0.08)" },
  { label: "Indigo", value: "rgba(129,140,248,0.08)" },
  { label: "Green", value: "rgba(74,222,128,0.08)" },
  { label: "Pink", value: "rgba(244,114,182,0.08)" },
];

const EMPTY_FORM: NoteInput = {
  title: "",
  content: "",
  tags: [],
  isPinned: false,
  color: "var(--card-bg)",
};

export function NotesClient({ notes: initialNotes, isAdmin }: Props) {
  const [notes, setNotes] = useState<INote[]>(initialNotes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<NoteInput>(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const pinned = notes.filter((n) => n.isPinned);
  const unpinned = notes.filter((n) => !n.isPinned);

  const filtered = (arr: INote[]) =>
    search
      ? arr.filter(
          (n) =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase()) ||
            n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
        )
      : arr;

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setTagsInput("");
    setEditId(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (note: INote) => {
    setForm({
      title: note.title,
      content: note.content,
      tags: note.tags,
      isPinned: note.isPinned,
      color: note.color ?? "var(--card-bg)",
    });
    setTagsInput(note.tags.join(", "));
    setEditId(note._id);
    setError("");
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this note?")) return;
    startTransition(async () => {
      const res = await deleteNote(id);
      if (res.success) setNotes((prev) => prev.filter((n) => n._id !== id));
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload: NoteInput = { ...form, tags };

    startTransition(async () => {
      if (editId) {
        const res = await updateNote(editId, payload);
        if (!res.success) { setError(res.error ?? "Update failed"); return; }
        setNotes((prev) => prev.map((n) => (n._id === editId ? { ...n, ...payload } : n)));
      } else {
        const res = await createNote(payload);
        if (!res.success) { setError(res.error ?? "Create failed"); return; }
        if (res.data) setNotes((prev) => [res.data as INote, ...prev]);
      }
      setModalOpen(false);
    });
  };

  const NoteCard = ({ note }: { note: INote }) => (
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
        <span
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            fontSize: "14px",
          }}
        >
          📌
        </span>
      )}
      <h3
        style={{
          fontWeight: 800,
          fontSize: "1rem",
          letterSpacing: "-0.3px",
          marginBottom: "10px",
          paddingRight: "24px",
          color: "var(--text-main)",
        }}
      >
        {note.title}
      </h3>
      <p
        style={{
          color: "var(--text-dim)",
          fontSize: "0.875rem",
          lineHeight: 1.7,
          flex: 1,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          marginBottom: "16px",
        }}
      >
        {note.content}
      </p>

      {note.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
          {note.tags.map((tag) => (
            <span key={tag} className="tech-badge">#{tag}</span>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
        }}
      >
        <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "monospace" }}>
          {format(new Date(note.createdAt), "MMM dd, yyyy")}
        </span>
        {isAdmin && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => openEdit(note)}
              style={{
                background: "none",
                border: "1px solid var(--card-border)",
                color: "var(--accent-indigo)",
                padding: "3px 10px",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(note._id)}
              disabled={isPending}
              style={{
                background: "none",
                border: "1px solid rgba(248,113,113,0.2)",
                color: "#f87171",
                padding: "3px 10px",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              Del
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "28px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {isAdmin && (
          <button className="btn-grad-border" onClick={openCreate}>
            + New Note
          </button>
        )}
        <input
          className="form-input"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "280px" }}
        />
      </div>

      {/* Pinned */}
      {filtered(pinned).length > 0 && (
        <div style={{ marginBottom: "36px" }}>
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--accent-gold)",
              marginBottom: "16px",
            }}
          >
            📌 Pinned
          </p>
          <div className="card-grid" style={{ marginTop: 0 }}>
            {filtered(pinned).map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        </div>
      )}

      {/* All notes */}
      {filtered(unpinned).length > 0 && (
        <div>
          {pinned.length > 0 && (
            <p
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginBottom: "16px",
              }}
            >
              Other Notes
            </p>
          )}
          <div className="card-grid" style={{ marginTop: 0 }}>
            {filtered(unpinned).map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        </div>
      )}

      {filtered([...pinned, ...unpinned]).length === 0 && (
        <div
          className="glass-card"
          style={{ textAlign: "center", color: "var(--text-dim)", padding: "64px" }}
        >
          {search ? `No notes matching "${search}"` : "No notes yet."}
        </div>
      )}

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
          <div
            className="glass-card"
            style={{ width: "100%", maxWidth: "540px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "28px",
              }}
            >
              <h2 style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.5px" }}>
                {editId ? "Edit Note" : "New Note"}
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
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Note title..."
                  required
                />
              </div>

              <div>
                <label className="form-label">Content *</label>
                <textarea
                  className="form-input"
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your note here..."
                  required
                  style={{ resize: "vertical" }}
                />
              </div>

              <div>
                <label className="form-label">Tags (comma separated)</label>
                <input
                  className="form-input"
                  placeholder="react, tips, architecture"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Color</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm({ ...form, color: c.value })}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: c.value,
                        border:
                          form.color === c.value
                            ? "2px solid var(--accent-indigo)"
                            : "2px solid var(--card-border)",
                        cursor: "pointer",
                        transition: "border 0.2s",
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  color: "var(--text-main)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.isPinned}
                  onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                  style={{ accentColor: "var(--accent-gold)" }}
                />
                📌 Pin this note
              </label>

              {error && (
                <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{error}</p>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" className="btn-grad-border" disabled={isPending}>
                  {isPending ? "Saving..." : editId ? "Update Note" : "Create Note"}
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
