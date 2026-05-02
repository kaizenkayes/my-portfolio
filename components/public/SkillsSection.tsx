"use client";

import { Reveal } from "@/components/shared/Reveal";
import type { ISkill } from "@/types";

interface SkillsSectionProps {
  skills: ISkill[];
}

const SKILL_CATEGORIES = [
  { key: "frontend", label: "Frontend", accent: "indigo" },
  { key: "backend", label: "Backend", accent: "gold" },
  { key: "database", label: "Database", accent: "indigo" },
  { key: "devops", label: "DevOps", accent: "gold" },
  { key: "tools", label: "Tools", accent: "indigo" },
] as const;

const CATEGORY_LEARNING: Record<string, string> = {
  frontend: "Exploring React Server Components & Next.js 15",
  backend: "Diving into microservice architecture patterns",
  database: "Mastering advanced aggregation pipelines",
  devops: "Learning Kubernetes & CI/CD pipelines",
  tools: "Integrating AI-powered dev tools into workflow",
};

const DEFAULT_SKILLS: ISkill[] = [
  { _id: "1", name: "Next.js", category: "frontend", order: 1, createdAt: new Date(), updatedAt: new Date() },
  { _id: "2", name: "React", category: "frontend", order: 2, createdAt: new Date(), updatedAt: new Date() },
  { _id: "3", name: "TypeScript", category: "frontend", order: 3, createdAt: new Date(), updatedAt: new Date() },
  { _id: "4", name: "Tailwind CSS", category: "frontend", order: 4, createdAt: new Date(), updatedAt: new Date() },
  { _id: "5", name: "Node.js", category: "backend", order: 5, createdAt: new Date(), updatedAt: new Date() },
  { _id: "6", name: "Express.js", category: "backend", order: 6, createdAt: new Date(), updatedAt: new Date() },
  { _id: "7", name: "MongoDB", category: "database", order: 7, createdAt: new Date(), updatedAt: new Date() },
  { _id: "8", name: "Mongoose", category: "database", order: 8, createdAt: new Date(), updatedAt: new Date() },
];

export function SkillsSection({ skills }: SkillsSectionProps) {
  const displaySkills = skills.length > 0 ? skills : DEFAULT_SKILLS;

  const grouped = SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    items: displaySkills
      .filter((s) => s.category === cat.key)
      .sort((a, b) => a.order - b.order),
  })).filter((cat) => cat.items.length > 0);

  return (
    <section id="skills" className="section-base">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
            <Reveal key={cat.key} delay={i * 0.1}>
              <div className="glass-card" style={{ height: "100%" }}>
                <h3
                  className={cat.accent}
                  style={{
                    marginBottom: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  {cat.label}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {cat.items.map((skill) => (
                    <div
                      key={skill._id}
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--text-main)",
                      }}
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>

                {/* Learning strip */}
                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "14px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    style={{ flexShrink: 0, animation: "spin 1.4s linear infinite" }}
                  >
                    <circle cx="6.5" cy="6.5" r="5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <path
                      d="M6.5 1.5A5 5 0 0 1 11.5 6.5"
                      fill="none"
                      stroke={cat.accent === "gold" ? "#f59e0b" : "#818cf8"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted, #6b7280)" }}>
                    {CATEGORY_LEARNING[cat.key]}
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