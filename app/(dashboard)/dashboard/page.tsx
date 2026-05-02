export const experimental_ppr = true;

import { Suspense } from "react";
import { auth } from "@/auth";

import {
  getProjects,
  getSkills,
  getLearningLogs,
  getNotes,
} from "@/lib/actions/index";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { RecentProjectsTable } from "@/components/shared/RecentProjectsTable";
import { DashboardSkeleton } from "@/components/shared/DashboardSkeleton";
import { ILearningLog, INote, IProject, ISkill } from "@/types";

// Static part - instantly served
async function StaticHeader() {
  const session = await auth();

  return (
    <DashboardHeader
      title={`Welcome, ${session?.user?.name?.split(" ")[0] ?? "Admin"}.`}
      subtitle="Here's what's happening in your dashboard."
      badgeText="DASHBOARD"
    />
  );
}

// Dynamic part 1 - Stats (streamed)
async function DynamicStats() {
  const [projectsRes, skillsRes, logsRes, notesRes] = await Promise.all([
    getProjects(),
    getSkills(),
    getLearningLogs(),
    getNotes(),
  ]);

  const projects = (projectsRes.data ?? []) as IProject[];
  const skills = (skillsRes.data ?? []) as ISkill[];
  const logs = (logsRes.data ?? []) as ILearningLog[];
  const notes = (notesRes.data ?? []) as INote[];

  const stats = [
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
      sub: `${Array.from(new Set(skills.map((s) => s.category))).length} categories`,
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

  return <StatsGrid stats={stats} />;
}

// Dynamic part 2 - Recent Projects (streamed separately)
async function DynamicRecentProjects() {
  const projectsRes = await getProjects();
  const projects = (projectsRes.data ?? []) as IProject[];
  const recentProjects = projects.slice(0, 5);

  return <RecentProjectsTable projects={recentProjects} />;
}

// Main Page Component
export default async function DashboardPage() {
  return (
    <div className="dashboard-container">
      {/* Static part - instantly visible */}
      <StaticHeader />

      {/* Dynamic parts - streamed as they load */}
      <Suspense fallback={<DashboardSkeleton type="stats" />}>
        <DynamicStats />
      </Suspense>

      <Suspense fallback={<DashboardSkeleton type="table" />}>
        <DynamicRecentProjects />
      </Suspense>
    </div>
  );
}
