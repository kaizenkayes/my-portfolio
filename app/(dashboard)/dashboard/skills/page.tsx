import { getSkills } from "@/lib/actions/index";
import { auth } from "@/auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import type { ISkill } from "@/types";
import { SkillsClient } from "@/components/dashboard/SkillsClient";

export default async function DashboardSkillsPage() {
  const [session, skillsRes] = await Promise.all([auth(), getSkills()]);
  const skills = (skillsRes.data ?? []) as ISkill[];
  const isAdmin = session?.user?.role === "admin";
  const categoryCount = Array.from(new Set(skills.map((s) => s.category))).length;

  return (
    <>
      <DashboardHeader
        title="Skills"
        subtitle={`${skills.length} skills across ${categoryCount} categories`}
      />
      <SkillsClient skills={skills} isAdmin={isAdmin} />
    </>
  );
}
