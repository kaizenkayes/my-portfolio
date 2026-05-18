"use client";

import { useState, useTransition } from "react";
import {
  createLearningLog,
  updateLearningLog,
  deleteLearningLog,
} from "@/lib/actions/index";
import type { ILearningLog } from "@/types";
import type { LearningLogInput } from "@/lib/validations/schemas";
import { LogCard } from "./LogCard";
import { ReusableModal } from "../../shared/reusable-modal";

interface Props {
  logs: ILearningLog[];
  isAdmin: boolean;
}

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
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload: LearningLogInput = { ...form, tags };

    startTransition(async () => {
      if (editId) {
        const res = await updateLearningLog(editId, payload);
        if (!res.success) {
          setError(res.error ?? "Update failed");
          return;
        }
        setLogs((prev) =>
          prev.map((l) => (l._id === editId ? { ...l, ...payload } : l)),
        );
      } else {
        const res = await createLearningLog(payload);
        if (!res.success) {
          setError(res.error ?? "Create failed");
          return;
        }
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

      <div className="flex flex-col gap-4">
        {logs.length === 0 ? (
          <div  className="glass-card text-center text-[var(--text-dim)] ">
            No learning logs yet.
          </div>
        ) : (
          logs.map((log) => (
            <LogCard
              key={log._id}
              log={log}
              isAdmin={isAdmin}
              onEdit={() => openEdit(log)}
              onDelete={() => handleDelete(log._id)}
              isPending={isPending}
            />
          ))
        )}
      </div>

      <ReusableModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        title={editId ? "Edit Learning Log" : "New Learning Log"}
        error={error}
        isPending={isPending}
        modalType="learning"
        learningForm={form}
        setLearningForm={setForm}
        tagsInput={tagsInput}
        setTagsInput={setTagsInput}
      />
    </>
  );
}
