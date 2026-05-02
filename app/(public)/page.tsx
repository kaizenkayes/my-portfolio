import type { Metadata } from "next";
import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import { ProjectsSection } from "@/components/public/ProjectsSection";
import { EducationSection } from "@/components/public/EducationSection";
import { ContactSection } from "@/components/public/ContactSection";
import { getSkills, getProjects } from "@/lib/actions/index";
import type { ISkill, IProject } from "@/types";

export const metadata: Metadata = {
  title: "Kayes | Code. Create. Illuminate.",
  description:
    "Full-Stack Developer specializing in Next.js, React, TypeScript and Node.js. Precision-engineered digital experiences.",
};

export const revalidate = 3600; // ISR — revalidate every 1 hour

export default async function HomePage() {
  const [skillsRes, projectsRes] = await Promise.all([
    getSkills(),
    getProjects(),
  ]);

  const skills = (skillsRes.data ?? []) as ISkill[];
  const projects = (projectsRes.data ?? []) as IProject[];

  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <EducationSection />
      <ContactSection />
    </>
  );
}
