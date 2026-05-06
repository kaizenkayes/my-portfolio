"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "ABOUT", href: "#about" },
  { label: "STACK", href: "#skills" },
  { label: "WORKS", href: "#projects" },
  { label: "EDUCATION", href: "#education" },
  { label: "CONTACT", href: "#contact" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    setTimeout(() => scrollToSection(id), 100);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="logo">
          K<span className="gold">.Kayes</span>
        </Link>

        <div className="nav-links-desktop">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className="nav-link"
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </button>
          ))}
          <Link href="/login" className="nav-link portal-link">
            PORTAL
          </Link>
        </div>

        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          ✕
        </button>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className="nav-link mobile-nav-link"
            onClick={() => handleNavClick(item.href)}
          >
            {item.label}
          </button>
        ))}
        <Link href="/login" className="nav-link mobile-nav-link portal-link" onClick={() => setMenuOpen(false)}>
          PORTAL
        </Link>
      </div>
    </>
  );
}