"use client";

import { useState, useTransition } from "react";
import { createSkill, updateSkill, deleteSkill } from "@/lib/actions/index";
import type { ISkill } from "@/types";
import type { SkillInput } from "@/lib/validations/schemas";
import { SkillGroup } from "./SkillGroup";
import { SkillModal } from "./SkillModal";


interface Props {
  skills: ISkill[];
  isAdmin: boolean;
}

const CATEGORIES = ["frontend", "backend", "database", "devops", "tools", "other"] as const;

const EMPTY_FORM: SkillInput = {
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
  const [form, setForm] = useState<SkillInput>(EMPTY_FORM);
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
      if (editId) {
        const res = await updateSkill(editId, form);
        if (!res.success) { setError(res.error ?? "Update failed"); return; }
        setSkills((prev) => prev.map((s) => (s._id === editId ? { ...s, ...form } : s)));
      } else {
        const res = await createSkill(form);
        if (!res.success) { setError(res.error ?? "Create failed"); return; }
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

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
        {grouped.map(({ cat, items }) => (
          <SkillGroup 
            key={cat} 
            cat={cat} 
            items={items} 
            isAdmin={isAdmin} 
            onEdit={openEdit} 
            onDelete={handleDelete} 
          />
        ))}

        {grouped.length === 0 && (
          <div className="text-[var(--text-dim)] text-center py-12 col-span-full">
            No skills yet. {isAdmin && (
              <button onClick={openCreate} className="bg-transparent border-none text-[var(--accent-indigo)] cursor-pointer font-bold">
                Add one →
              </button>
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <SkillModal 
          form={form} 
          setForm={setForm} 
          editId={editId} 
          error={error} 
          isPending={isPending} 
          onSubmit={handleSubmit} 
          onClose={() => setModalOpen(false)}
          categories={CATEGORIES}
        />
      )}
    </>
  );
}