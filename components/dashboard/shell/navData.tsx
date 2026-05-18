import { Home, FolderKanban, Lightbulb, BookOpen, FileText } from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    exact: true,
    icon: Home,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    exact: false,
    icon: FolderKanban, // অথবা Folder ব্যবহার করতে পারো
  },
  {
    label: "Skills",
    href: "/dashboard/skills",
    exact: false,
    icon: Lightbulb,
  },
  {
    label: "Learning",
    href: "/dashboard/learning",
    exact: false,
    icon: BookOpen,
  },
  {
    label: "Notes",
    href: "/dashboard/notes",
    exact: false,
    icon: FileText,
  },
];
