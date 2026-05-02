"use client";

import { useActionState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { sendContactEmail } from "@/lib/actions/contact.action";

const initialState = { success: false, error: "" };

export function ContactSection() {
  const [state, formAction, pending] = useActionState(sendContactEmail, initialState);

  return (
    <section
      id="contact"
      className="section-base"
      style={{
        background: "var(--bg-subtle)",
        padding: "100px 10%",
        minHeight: "auto",
        borderTop: "1px solid var(--card-border)",
      }}
    >
      <div className="content" style={{ maxWidth: "1200px" }}>
        <Reveal>
          <h2
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "48px",
              color: "var(--text-main)",
            }}
          >
            START A <br />
            <span style={{ fontStyle: "italic", color: "var(--accent-gold)" }}>
              MOVEMENT.
            </span>
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "64px",
          }}
        >
          {/* Left: Info */}
          <Reveal delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
              <div>
                <p className="form-label" style={{ marginBottom: "12px" }}>
                  Drop an email
                </p>
                <a
                  href="mailto:kayesmia674@gmail.com"
                  className="contact-link"
                  style={{
                    fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
                    fontWeight: 600,
                    borderBottom: "1px solid var(--accent-gold)",
                    display: "inline-block",
                    paddingBottom: "4px",
                  }}
                >
                  kayesmia674@gmail.com
                </a>
              </div>

              <div>
                <p className="form-label" style={{ marginBottom: "12px" }}>
                  Social Archives
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "32px" }}>
                  {[
                    { label: "GitHub", href: "https://github.com/kaizenkayes" },
                    { label: "LinkedIn", href: "https://www.linkedin.com/in/md-kayes-mia-5b5b20216/" },
                   
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: Form */}
          <Reveal delay={0.2}>
            <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label className="form-label" htmlFor="name">Your Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Kayes Mia"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="kayesmia674@gmail.com"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label" htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Let's build something"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="form-input"
                  required
                  style={{ resize: "vertical" }}
                />
              </div>

              {state.error && (
                <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{state.error}</p>
              )}
              {state.success && (
                <p style={{ fontSize: "0.85rem", color: "#4ade80" }}>
                  ✓ Message sent! I&apos;ll get back to you soon.
                </p>
              )}

              <button
                type="submit"
                className="btn-grad-border"
                disabled={pending}
                style={{ alignSelf: "flex-start" }}
              >
                {pending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
