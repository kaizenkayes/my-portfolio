import { getProjects } from "@/lib/actions/index";
import { auth } from "@/auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProjectsClient } from "@/components/dashboard/ProjectsClient";
import type { IProject } from "@/types";

export default async function DashboardProjectsPage() {
  const [session, projectsRes] = await Promise.all([auth(), getProjects()]);
  const projects = (projectsRes.data ?? []) as IProject[];
  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      <DashboardHeader
        title="Projects"
        subtitle={`${projects.length} total`}
      />
      <ProjectsClient projects={projects} isAdmin={isAdmin} />
    </>
  );
}
