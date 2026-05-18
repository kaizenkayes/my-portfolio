"use client";

import { Reveal } from "@/components/shared/Reveal";

export function AboutSection() {
  return (
    <section id="about" className="section-base bg-[var(--bg-subtle)]">
      <div className="about-bg" />

      <div className="content">
        <Reveal>
          <span className="section-label">01 // About</span>
          <h2 className="heading-lg">
            CLEAN <span className="gold">CODE.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass-card mt-10 max-w-[850px]">
            <p className="text-[1.1rem] leading-[1.9] text-[var(--text-main)]">
              Building the bridge between complex backend systems and intuitive
              user experiences. As a Full-Stack Engineer specializing in the
              MERN ecosystem, I craft scalable architectures with React and
              Next.js — transforming ideas into fast, seamless, and
              production-ready applications.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-[50px] flex flex-wrap gap-10">
            {[
              { value: "1.5", label: "Years Experience" },
              { value: "3", label: "Projects Built" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[clamp(2rem,5vw,3rem)] font-black leading-none tracking-[-2px] text-[var(--accent-indigo)]">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[0.8rem] font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
