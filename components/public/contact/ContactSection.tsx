"use client";

import { useActionState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { sendContactEmail } from "@/lib/actions/contact.action";

const initialState = { success: false, error: "" };

export function ContactSection() {
  const [state, formAction, pending] = useActionState(
    sendContactEmail,
    initialState,
  );

  return (
    <section
      id="contact"
      className="section-base !min-h-0 border-t border-[var(--card-border)] bg-[var(--bg-subtle)] !py-[100px]"
    >
      <div className="content max-w-[1200px]">
        <Reveal>
          <h2 className="mb-12 font-sans text-[clamp(2.5rem,8vw,5rem)] font-black uppercase leading-[1.1] tracking-[-0.02em] text-[var(--text-main)]">
            START A <br />
            <span className="italic text-[var(--accent-gold)]">MOVEMENT.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-16">
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-12">
              <div>
                <p className="form-label mb-3">Drop an email</p>
                <a
                  href="mailto:kayesmia674@gmail.com"
                  className="contact-link inline-block pb-1 text-[clamp(1.2rem,4vw,1.8rem)] font-semibold border-b border-[var(--accent-gold)]"
                >
                  kayesmia674@gmail.com
                </a>
              </div>

              <div>
                <p className="form-label mb-3">Social Archives</p>
                <div className="flex flex-wrap gap-8">
                  {[
                    { label: "GitHub", href: "https://github.com/kaizenkayes" },
                    {
                      label: "LinkedIn",
                      href: "https://www.linkedin.com/in/md-kayes-mia-5b5b20216/",
                    },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link text-[0.9rem] font-bold uppercase tracking-[0.5px]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <form action={formAction} className="flex flex-col gap-5">
              <div>
                <label className="form-label" htmlFor="name">
                  Your Name
                </label>
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
                <label className="form-label" htmlFor="email">
                  Email
                </label>
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
                <label className="form-label" htmlFor="subject">
                  Subject
                </label>
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
                <label className="form-label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="form-input resize-y"
                  required
                />
              </div>

              {state.error && (
                <p className="text-[0.85rem] text-red-400">{state.error}</p>
              )}
              {state.success && (
                <p className="text-[0.85rem] text-green-400">
                  ✓ Message sent! I&apos;ll get back to you soon.
                </p>
              )}

              <button
                type="submit"
                className="btn-grad-border self-start"
                disabled={pending}
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
