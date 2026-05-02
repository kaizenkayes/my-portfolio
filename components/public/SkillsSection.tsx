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
            <Reveal key={cat.category} delay={i * 0.1}>
              <div className="glass-card" style={{ height: "100%" }}>
                <h3
                  className={cat.category}
                  style={{
                    marginBottom: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  {cat.title}
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
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
                    style={{
                      flexShrink: 0,
                      animation: "spin 1.4s linear infinite",
                    }}
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
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted, #6b7280)",
                    }}
                  >
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
