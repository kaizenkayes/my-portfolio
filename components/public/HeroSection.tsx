"use client";

import { motion } from "framer-motion";
import { OrbitalElement } from "../shared/OrbitalElement";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function HeroSection() {
  return (
    <section id="hero" className="section-base">
      <div className="hero-bg" />

      <div className="hero-layout">
        <div className="content">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="heading-xl indigo">PRECISION.</h1>
            <h1 className="heading-xl gold">CREATIVITY.</h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              maxWidth: "580px",
              color: "var(--text-dim)",
              fontSize: "1.15rem",
              lineHeight: 1.8,
              marginBottom: "30px",
              marginTop: "25px",
            }}
          >
            <span style={{ fontWeight: 700 }}>
              Passionate Front-End Developer | React & Next.js Enthusiast
            </span>
            <br />
            <br />
            <span style={{ fontWeight: 600 }}>How can I help you?</span>
            <br />I transform your{" "}
            <span style={{ fontWeight: 600 }}>
              complex business visions
            </span>{" "}
            into{" "}
            <span style={{ fontWeight: 600 }}>
              high-performance, pixel-perfect web applications
            </span>
            .
            <br />
            <br />I don’t just write code —{" "}
            <span style={{ fontWeight: 700 }}>
              I build the digital experience your brand deserves.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
          >
            <button
              className="btn-grad-border"
              onClick={() => scrollToSection("projects")}
            >
              View Projects
            </button>
            <button
              className="btn-grad-border"
              onClick={() => scrollToSection("contact")}
              style={{ opacity: 0.7 }}
            >
              Get In Touch
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            style={{
              position: "absolute",
              bottom: "60px",
              left: "10%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "1px",
                height: "50px",
                background:
                  "linear-gradient(to bottom, var(--accent-gold), transparent)",
              }}
            />
            <span
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.3em",
                color: "var(--text-dim)",
                textTransform: "uppercase",
              }}
            >
              Scroll Down
            </span>
          </motion.div>
        </div>

        <motion.div
          className="hero-orbital"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <OrbitalElement></OrbitalElement>
        </motion.div>
      </div>
    </section>
  );
}
