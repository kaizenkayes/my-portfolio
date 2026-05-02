"use client";

import { Reveal } from "@/components/shared/Reveal";

const EDUCATION = [
  {
    period: "7/14/2023 - PRESENT",
    title: "Creative Tech Alchemist",
    subtitle: "Self-Learning | Deep Learning & Advanced Web Systems",
    accent: true,
  },
 
];

export function EducationSection() {
  return (
    <section
      id="education"
      className="section-base"
      style={{
        background: "var(--bg-light)",
        minHeight: "auto",
        padding: "100px 10%",
      }}
    >
      <div className="education-bg" />

      <div className="content" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "48px" }}>
            <span className="section-label">04 // Education</span>
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 800,
                textTransform: "uppercase",
                marginTop: "0",
                letterSpacing: "-0.02em",
                color: "var(--text-main)",
              }}
            >
              Jour<span className="indigo">ney</span>
            </h2>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "20px",
            maxWidth: "900px",
          }}
        >
          {EDUCATION.map((item, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="education-item">
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    opacity: 0.6,
                    letterSpacing: "0.5px",
                    color: "var(--text-dim)",
                  }}
                >
                  {item.period}
                </p>
                <h3
                  style={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    fontSize: "1.4rem",
                    marginTop: "8px",
                    fontStyle: "italic",
                    color: item.accent
                      ? "var(--accent-gold)"
                      : "var(--text-main)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    opacity: 0.7,
                    marginTop: "6px",
                    lineHeight: 1.5,
                    color: "var(--text-dim)",
                  }}
                >
                  {item.subtitle}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
