"use client";

import { Reveal } from "../shared/Reveal";


export function AboutSection() {
  return (
    <section
      id="about"
      className="section-base"
      style={{ background: "var(--bg-subtle)" }}
    >
      <div className="about-bg" />

      <div className="content">
        <Reveal>
          <span className="section-label">01 // About</span>
          <h2 className="heading-lg">
            CLEAN <span className="gold">CODE.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div
            className="glass-card"
            style={{ maxWidth: "850px", marginTop: "40px" }}
          >
            <p
              style={{
                lineHeight: 1.9,
                color: "var(--text-main)",
                fontSize: "1.1rem",
              }}
            >
              Building the bridge between complex backend systems and intuitive
              user experiences. As a Full-Stack Engineer specializing in the
              MERN ecosystem, I craft scalable architectures with React and
              Next.js — transforming ideas into fast, seamless, and
              production-ready applications.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "40px",
              marginTop: "50px",
            }}
          >
            {[
              { value: "1.5", label: "Years Experience" },
              { value: "3", label: "Projects Built" },
             
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    fontWeight: 900,
                    letterSpacing: "-2px",
                    color: "var(--accent-indigo)",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--text-dim)",
                    marginTop: "6px",
                  }}
                >
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
