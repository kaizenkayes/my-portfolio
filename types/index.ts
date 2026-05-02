export type UserRole = "admin" | "user";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITechStack {
  name: string;
  color?: string;
}

export interface IProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  thumbnail?: string;
  techStack: ITechStack[];
  liveUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface ISkill {
  _id: string;
  name: string;
  icon?: string;
  category: "frontend" | "backend" | "database" | "devops" | "tools" | "other";
  proficiency: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILearningLog {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  type: "daily" | "weekly" | "resource" | "milestone";
  date: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface INote {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  color?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: PaginationMeta;
}
