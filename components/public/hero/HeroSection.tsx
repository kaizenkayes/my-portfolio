"use client";

import { motion } from "framer-motion";
import { OrbitalElement } from "@/components/shared/OrbitalElement";

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
            className="mb-[30px] mt-[25px] max-w-[580px] text-[1.15rem] leading-[1.8] text-[var(--text-dim)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <span className="font-bold">
              Passionate Front-End Developer | React & Next.js Enthusiast
            </span>
            <br />
            <br />
            <span className="font-semibold">How can I help you?</span>
            <br />I transform your{" "}
            <span className="font-semibold">complex business visions</span> into{" "}
            <span className="font-semibold">
              high-performance, pixel-perfect web applications
            </span>
            .
            <br />
            <br />I don’t just write code —{" "}
            <span className="font-bold">
              I build the digital experience your brand deserves.
            </span>
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <button
              type="button"
              className="btn-grad-border"
              onClick={() => scrollToSection("projects")}
            >
              View Projects
            </button>
            <button
              type="button"
              className="btn-grad-border opacity-70"
              onClick={() => scrollToSection("contact")}
            >
              Get In Touch
            </button>
          </motion.div>

          <motion.div
            className="absolute bottom-[60px] left-[10%] flex items-center gap-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="h-[50px] w-px bg-gradient-to-b from-[var(--accent-gold)] to-transparent" />
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--text-dim)]">
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
          <OrbitalElement />
        </motion.div>
      </div>
    </section>
  );
}
