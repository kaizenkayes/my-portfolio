"use client";

import { Reveal } from "@/components/shared/Reveal";

const EDUCATION = [
  {
    period: "01/01/2024 - PRESENT",
    title: "Creative Tech Alchemist",
    subtitle: "Self-Learning | Deep Learning & Advanced Web Systems",
    accent: true,
  },
];

export function EducationSection() {
  return (
    <section
      id="education"
      className="section-base !min-h-0 bg-[var(--bg-light)] !py-[100px]"
    >
      <div className="education-bg" />

      <div className="content mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-12">
            <span className="section-label">04 // Education</span>
            <h2 className="mt-0 font-sans text-[clamp(2rem,5vw,3.5rem)] font-extrabold uppercase tracking-[-0.02em] text-[var(--text-main)]">
              Jour<span className="indigo">ney</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid max-w-[900px] grid-cols-1 gap-5">
          {EDUCATION.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.15}>
              <div className="education-item">
                <p className="font-mono text-[10px] tracking-[0.5px] text-[var(--text-dim)] opacity-60">
                  {item.period}
                </p>
                <h3
                  className={`mt-2 text-[1.4rem] font-extrabold uppercase italic ${
                    item.accent
                      ? "text-[var(--accent-gold)]"
                      : "text-[var(--text-main)]"
                  }`}
                >
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[0.85rem] leading-normal text-[var(--text-dim)] opacity-70">
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
