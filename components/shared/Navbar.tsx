"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "ABOUT", href: "#about" },
  { label: "STACK", href: "#skills" },
  { label: "WORKS", href: "#projects" },
  { label: "EDUCATION", href: "#education" },
  { label: "CONTACT", href: "#contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  // Scroll event listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Smooth scroll logic
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");

    // যদি ইউজার হোম পেজে থাকে তবে সরাসরি স্ক্রোল হবে
    if (pathname === "/") {
      scrollToSection(id);
    } else {
      // অন্য পেজে (যেমন: /login) থাকলে প্রথমে হোম পেজে যাবে, তারপর স্ক্রোল করবে
      router.push(`/${href}`);
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="logo">
          K<span className="gold">.Kayes</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links-desktop">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className="nav-link"
              onClick={() => handleNavClick(item.href)}
              type="button"
            >
              {item.label}
            </button>
          ))}
          <Link href="/login" className="nav-link portal-link">
            PORTAL
          </Link>
        </div>

        {/* Hamburger Icon */}
        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          type="button"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button 
          className="close-menu" 
          onClick={() => setMenuOpen(false)} 
          aria-label="Close menu"
          type="button"
        >
          <X size={24} />
        </button>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className="nav-link mobile-nav-link"
            onClick={() => handleNavClick(item.href)}
            type="button"
          >
            {item.label}
          </button>
        ))}
        <Link 
          href="/login" 
          className="nav-link mobile-nav-link portal-link" 
          onClick={() => setMenuOpen(false)}
        >
          PORTAL
        </Link>
      </div>
    </>
  );
}