"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import Project from "@/lib/db/models/Project";
import Skill from "@/lib/db/models/Skill";
import LearningLog from "@/lib/db/models/LearningLog";
import Note from "@/lib/db/models/Note";
import {
  projectSchema,
  skillSchema,
  learningLogSchema,
  noteSchema,
  type ProjectInput,
  type SkillInput,
  type LearningLogInput,
  type NoteInput,
} from "@/lib/validations/schemas";
import type { ApiResponse } from "@/types";

// ─── AUTH GUARD ───────────────────────────────────────────────
async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

// ─── PROJECTS ─────────────────────────────────────────────────
export async function getProjects(): Promise<ApiResponse<unknown[]>> {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(projects)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function getFeaturedProjects(): Promise<ApiResponse<unknown[]>> {
  try {
    await connectDB();
    const projects = await Project.find({ featured: true })
      .sort({ order: 1 })
      .lean();
    return { success: true, data: JSON.parse(JSON.stringify(projects)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function getProjectBySlug(slug: string): Promise<ApiResponse<unknown>> {
  try {
    await connectDB();
    const project = await Project.findOne({ slug }).lean();
    if (!project) return { success: false, error: "Project not found" };
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function createProject(
  data: ProjectInput
): Promise<ApiResponse<unknown>> {
  try {
    await requireAdmin();
    const parsed = projectSchema.parse(data);
    await connectDB();
    const project = await Project.create(parsed);
    revalidatePath("/");
    revalidatePath("/dashboard/projects");
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function updateProject(
  id: string,
  data: ProjectInput
): Promise<ApiResponse<unknown>> {
  try {
    await requireAdmin();
    const parsed = projectSchema.parse(data);
    await connectDB();
    const project = await Project.findByIdAndUpdate(id, parsed, {
      new: true,
      runValidators: true,
    });
    if (!project) return { success: false, error: "Project not found" };
    revalidatePath("/");
    revalidatePath("/dashboard/projects");
    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function deleteProject(id: string): Promise<ApiResponse<null>> {
  try {
    await requireAdmin();
    await connectDB();
    await Project.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/dashboard/projects");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

// ─── SKILLS ───────────────────────────────────────────────────
export async function getSkills(): Promise<ApiResponse<unknown[]>> {
  try {
    await connectDB();
    const skills = await Skill.find({}).sort({ category: 1, order: 1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(skills)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function createSkill(
  data: SkillInput
): Promise<ApiResponse<unknown>> {
  try {
    await requireAdmin();
    const parsed = skillSchema.parse(data);
    await connectDB();
    const skill = await Skill.create(parsed);
    revalidatePath("/");
    revalidatePath("/dashboard/skills");
    return { success: true, data: JSON.parse(JSON.stringify(skill)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function updateSkill(
  id: string,
  data: SkillInput
): Promise<ApiResponse<unknown>> {
  try {
    await requireAdmin();
    const parsed = skillSchema.parse(data);
    await connectDB();
    const skill = await Skill.findByIdAndUpdate(id, parsed, {
      new: true,
      runValidators: true,
    });
    if (!skill) return { success: false, error: "Skill not found" };
    revalidatePath("/");
    revalidatePath("/dashboard/skills");
    return { success: true, data: JSON.parse(JSON.stringify(skill)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function deleteSkill(id: string): Promise<ApiResponse<null>> {
  try {
    await requireAdmin();
    await connectDB();
    await Skill.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/dashboard/skills");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

// ─── LEARNING LOGS ────────────────────────────────────────────
export async function getLearningLogs(): Promise<ApiResponse<unknown[]>> {
  try {
    await connectDB();
    const logs = await LearningLog.find({}).sort({ date: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(logs)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function createLearningLog(
  data: LearningLogInput
): Promise<ApiResponse<unknown>> {
  try {
    await requireAdmin();
    const parsed = learningLogSchema.parse(data);
    await connectDB();
    const log = await LearningLog.create(parsed);
    revalidatePath("/dashboard/learning");
    return { success: true, data: JSON.parse(JSON.stringify(log)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function updateLearningLog(
  id: string,
  data: LearningLogInput
): Promise<ApiResponse<unknown>> {
  try {
    await requireAdmin();
    const parsed = learningLogSchema.parse(data);
    await connectDB();
    const log = await LearningLog.findByIdAndUpdate(id, parsed, { new: true });
    if (!log) return { success: false, error: "Log not found" };
    revalidatePath("/dashboard/learning");
    return { success: true, data: JSON.parse(JSON.stringify(log)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function deleteLearningLog(id: string): Promise<ApiResponse<null>> {
  try {
    await requireAdmin();
    await connectDB();
    await LearningLog.findByIdAndDelete(id);
    revalidatePath("/dashboard/learning");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

// ─── NOTES ────────────────────────────────────────────────────
export async function getNotes(): Promise<ApiResponse<unknown[]>> {
  try {
    await connectDB();
    const notes = await Note.find({})
      .sort({ isPinned: -1, createdAt: -1 })
      .lean();
    return { success: true, data: JSON.parse(JSON.stringify(notes)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function createNote(
  data: NoteInput
): Promise<ApiResponse<unknown>> {
  try {
    await requireAdmin();
    const parsed = noteSchema.parse(data);
    await connectDB();
    const note = await Note.create(parsed);
    revalidatePath("/dashboard/notes");
    return { success: true, data: JSON.parse(JSON.stringify(note)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function updateNote(
  id: string,
  data: NoteInput
): Promise<ApiResponse<unknown>> {
  try {
    await requireAdmin();
    const parsed = noteSchema.parse(data);
    await connectDB();
    const note = await Note.findByIdAndUpdate(id, parsed, { new: true });
    if (!note) return { success: false, error: "Note not found" };
    revalidatePath("/dashboard/notes");
    return { success: true, data: JSON.parse(JSON.stringify(note)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function deleteNote(id: string): Promise<ApiResponse<null>> {
  try {
    await requireAdmin();
    await connectDB();
    await Note.findByIdAndDelete(id);
    revalidatePath("/dashboard/notes");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

// ─── AUTH ACTIONS ─────────────────────────────────────────────

/**
 * registerUser — নতুন account MongoDB-তে তৈরি (Server Action)
 * register/page.tsx থেকে call হয়; NextAuth signIn() এখানে ব্যবহার হয় না।
 *
 * @param data - name, email, password (plain text — User model save-এ hash হবে)
 * @returns success: true → login-এ redirect; false → toast.error(result.error)
 */
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse<null>> {
  try {
    await connectDB();
    // dynamic import — bundle size কমাতে User model lazy load
    const User = (await import("@/lib/db/models/User")).default;

    // একই email দিয়ে আগে register হলে duplicate block
    const exists = await User.findOne({ email: data.email });
    if (exists) return { success: false, error: "Email already registered" };

    // role সবসময় "user" — admin manually DB বা seed দিয়ে set করা হয়
    await User.create({ ...data, role: "user" });
    return { success: true, data: null, message: "Account created successfully" };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
