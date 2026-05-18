import { auth } from "@/auth";
import { DashboardHeader } from "@/components/dashboard";
import { StatItem } from "@/types";
import {
  getProjects,
  getSkills,
  getLearningLogs,
  getNotes,
} from "@/lib/actions/index";
import type { IProject, ISkill, ILearningLog, INote } from "@/types";
import { StatCards } from "./_components/StatCards";
import { RecentProjectsTable } from "./_components/RecentProjectsTable";

export default async function DashboardPage() {
  const [session, projectsRes, skillsRes, logsRes, notesRes] =
    await Promise.all([
      auth(),
      getProjects(),
      getSkills(),
      getLearningLogs(),
      getNotes(),
    ]);

  const projects = (projectsRes.data ?? []) as IProject[];
  const skills = (skillsRes.data ?? []) as ISkill[];
  const logs = (logsRes.data ?? []) as ILearningLog[];
  const notes = (notesRes.data ?? []) as INote[];

  const stats: StatItem[] = [
    {
      label: "Projects",
      value: projects.length,
      href: "/dashboard/projects",
      accent: "indigo",
      sub: `${projects.filter((p) => p.featured).length} featured`,
    },
    {
      label: "Skills",
      value: skills.length,
      href: "/dashboard/skills",
      accent: "gold",
      sub: `${new Set(skills.map((s) => s.category)).size} categories`,
    },
    {
      label: "Learning Logs",
      value: logs.length,
      href: "/dashboard/learning",
      accent: "indigo",
      sub: "entries tracked",
    },
    {
      label: "Notes",
      value: notes.length,
      href: "/dashboard/notes",
      accent: "gold",
      sub: `${notes.filter((n) => n.isPinned).length} pinned`,
    },
  ];

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title={`Welcome, ${session?.user?.name?.split(" ")[0] ?? "Admin"}.`}
        subtitle="Here's what's happening in your lab."
      />

      <StatCards stats={stats} />

      <RecentProjectsTable projects={projects.slice(0, 5)} />
    </div>
  );
}
