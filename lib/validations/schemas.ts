import { z } from "zod";

// Auth
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase and number"
    ),
});

// Project
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required").max(500),
  longDescription: z.string().optional(),
  thumbnail: z.string().optional(),
  techStack: z
    .array(
      z.object({
        name: z.string().min(1),
        color: z.string().optional(),
      })
    )
    .default([]),
  liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  demoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["completed", "in-progress", "archived"]).default("completed"),
  order: z.number().default(0),
});

// Skill
export const skillSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  icon: z.string().optional(),
  category: z.enum([
    "frontend",
    "backend",
    "database",
    "devops",
    "tools",
    "other",
  ]),
  proficiency: z.number().min(1).max(100),
  order: z.number().default(0),
});

// Learning Log
export const learningLogSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).default([]),
  type: z.enum(["daily", "weekly", "resource", "milestone"]).default("daily"),
  date: z.string().or(z.date()).default(() => new Date().toISOString()),
});

// Note
export const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).default([]),
  isPinned: z.boolean().default(false),
  color: z.string().optional(),
});

// Contact
export const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(60),
  email: z.string().email("Invalid email"),
  subject: z.string().min(5, "Subject is required").max(100),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type LearningLogInput = z.infer<typeof learningLogSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
