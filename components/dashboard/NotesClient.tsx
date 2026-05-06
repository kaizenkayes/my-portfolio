"use client";

import { useState, useTransition } from "react";
import { createNote, updateNote, deleteNote } from "@/lib/actions/index";
import type { INote } from "@/types";
import type { NoteInput } from "@/lib/validations/schemas";
import { NoteCard } from "./NoteCard";
import { NoteModal } from "./NoteModal";


interface Props {
  notes: INote[];
  isAdmin: boolean;
}

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

  const filterNotes = (arr: INote[]) =>
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

  return (
    <>
      <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap", alignItems: "center" }}>
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

      {/* Pinned Section */}
      {filterNotes(pinned).length > 0 && (
        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent-gold)", marginBottom: "16px" }}>
            📌 Pinned
          </p>
          <div className="card-grid" style={{ marginTop: 0 }}>
            {filterNotes(pinned).map((note) => (
              <NoteCard key={note._id} note={note} isAdmin={isAdmin} onEdit={() => openEdit(note)} onDelete={() => handleDelete(note._id)} isPending={isPending} />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes Section */}
      {filterNotes(unpinned).length > 0 && (
        <div>
          {pinned.length > 0 && (
            <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "16px" }}>
              Other Notes
            </p>
          )}
          <div className="card-grid" style={{ marginTop: 0 }}>
            {filterNotes(unpinned).map((note) => (
              <NoteCard key={note._id} note={note} isAdmin={isAdmin} onEdit={() => openEdit(note)} onDelete={() => handleDelete(note._id)} isPending={isPending} />
            ))}
          </div>
        </div>
      )}

      {filterNotes([...pinned, ...unpinned]).length === 0 && (
        <div className="glass-card" style={{ textAlign: "center", color: "var(--text-dim)", padding: "64px" }}>
          {search ? `No notes matching "${search}"` : "No notes yet."}
        </div>
      )}

      {modalOpen && (
        <NoteModal 
          form={form} setForm={setForm} tagsInput={tagsInput} 
          setTagsInput={setTagsInput} editId={editId} error={error} 
          isPending={isPending} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} 
        />
      )}
    </>
  );
}