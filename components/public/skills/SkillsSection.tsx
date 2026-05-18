"use client";

import { Reveal } from "@/components/shared/Reveal";
import type { ISkill } from "@/types";

const CATEGORIES: ISkill["category"][] = [
  "frontend",
  "backend",
  "database",
  "devops",
  "tools",
  "other",
];

const CATEGORY_TITLES: Record<ISkill["category"], string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  tools: "Tools",
  other: "Other",
};

const CATEGORY_LEARNING: Record<ISkill["category"], string> = {
  frontend: "Exploring React Server Components & Next.js 15",
  backend: "Diving into microservice architecture patterns",
  database: "Mastering advanced aggregation pipelines",
  devops: "Learning Kubernetes & CI/CD pipelines",
  tools: "Integrating AI-powered dev tools into workflow",
  other: "Expanding cross-domain engineering depth",
};

export function SkillsSection({ skills }: { skills: ISkill[] }) {
  const grouped = CATEGORIES.map((category) => ({
    category,
    title: CATEGORY_TITLES[category],
    items: skills
      .filter((s) => s.category === category)
      .sort((a, b) => a.order - b.order),
  })).filter((cat) => cat.items.length > 0);

  return (
    <section id="skills" className="section-base">
      <div className="skills-bg" />

      <div className="content">
        <Reveal>
          <span className="section-label">02 // Stack</span>
          <h2 className="heading-lg">
            CORE <span className="indigo">SKILLS</span>
          </h2>
        </Reveal>

        <div className="card-grid">
          {grouped.map((cat, i) => (
            <Reveal key={cat.category} delay={i * 0.1}>
              <div className="glass-card h-full">
                <h3
                  className={`${cat.category} mb-5 text-[0.75rem] font-extrabold uppercase tracking-[2px]`}
                >
                  {cat.title}
                </h3>

                <div className="flex flex-col gap-2.5">
                  {cat.items.map((skill) => (
                    <div
                      key={skill._id}
                      className="text-[0.875rem] font-semibold text-[var(--text-main)]"
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-3.5">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    className="shrink-0 animate-spin"
                  >
                    <circle
                      cx="6.5"
                      cy="6.5"
                      r="5"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M6.5 1.5A5 5 0 0 1 11.5 6.5"
                      fill="none"
                      stroke={cat.category === "frontend" ? "#f59e0b" : "#818cf8"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[0.75rem] text-[var(--text-dim)] opacity-90">
                    {CATEGORY_LEARNING[cat.category]}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
