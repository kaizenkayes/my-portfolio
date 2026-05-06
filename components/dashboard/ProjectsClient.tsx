"use client";

import { useState, useTransition } from "react";
import { createProject, updateProject, deleteProject } from "@/lib/actions/index";
import type { IProject, ITechStack } from "@/types";
import type { ProjectInput } from "@/lib/validations/schemas";
import { ProjectTable } from "./ProjectTable";
import { ProjectModal } from "./ProjectModal";


interface Props {
  projects: IProject[];
  isAdmin: boolean;
}

const EMPTY_FORM: ProjectInput = {
  title: "",
  description: "",
  longDescription: "",
  thumbnail: "",
  techStack: [],
  liveUrl: "",
  demoUrl: "",
  githubUrl: "",
  featured: false,
  status: "completed",
  order: 0,
};

export function ProjectsClient({ projects: initialProjects, isAdmin }: Props) {
  const [projects, setProjects] = useState<IProject[]>(initialProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectInput>(EMPTY_FORM);
  const [techInput, setTechInput] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setTechInput("");
    setEditId(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (project: IProject) => {
    setForm({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription ?? "",
      thumbnail: project.thumbnail ?? "",
      techStack: project.techStack,
      liveUrl: project.liveUrl ?? "",
      demoUrl: project.demoUrl ?? "",
      githubUrl: project.githubUrl ?? "",
      featured: project.featured,
      status: project.status,
      order: project.order,
    });
    setTechInput(project.techStack.map((t) => t.name).join(", "));
    setEditId(project._id);
    setError("");
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this project?")) return;
    startTransition(async () => {
      const res = await deleteProject(id);
      if (res.success) setProjects((prev) => prev.filter((p) => p._id !== id));
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const techStack: ITechStack[] = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    const payload: ProjectInput = { ...form, techStack };

    startTransition(async () => {
      if (editId) {
        const res = await updateProject(editId, payload);
        if (!res.success) { setError(res.error ?? "Update failed"); return; }
        setProjects((prev) => prev.map((p) => (p._id === editId ? { ...p, ...payload } : p)));
      } else {
        const res = await createProject(payload);
        if (!res.success) { setError(res.error ?? "Create failed"); return; }
        if (res.data) setProjects((prev) => [res.data as IProject, ...prev]);
      }
      setModalOpen(false);
    });
  };

  return (
    <>
      {isAdmin && (
        <div style={{ marginBottom: "24px" }}>
          <button className="btn-grad-border" onClick={openCreate}>
            + New Project
          </button>
        </div>
      )}

      <ProjectTable 
        projects={projects} 
        isAdmin={isAdmin} 
        onEdit={openEdit} 
        onDelete={handleDelete} 
        isPending={isPending} 
        
      />

      {modalOpen && (
        <ProjectModal 
          form={form} 
          setForm={setForm} 
          techInput={techInput} 
          setTechInput={setTechInput}
          editId={editId} 
          error={error} 
          isPending={isPending} 
          onSubmit={handleSubmit} 
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}