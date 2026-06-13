"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

const navLinkClass =
  "cursor-pointer border-none bg-transparent font-[inherit] text-[0.85rem] font-bold tracking-[1px] text-[var(--text-dim)] no-underline transition-colors hover:text-[var(--accent-indigo)]";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");

    if (pathname === "/") {
      scrollToSection(id);
    } else {
      router.push(`/${href}`);
    }
  };

  return (
    <>
      <nav
         className="navbar"
         style={{
           boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
         }}
      >
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-[var(--text-main)] no-underline max-md:text-[1.3rem]"
        >
          K<span className="text-[var(--accent-gold)] transition-colors">.Kayes</span>
        </Link>

        <div className="hidden items-center gap-[30px] md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={navLinkClass}
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </button>
          ))}
          <Link href="/login" className={cn(navLinkClass, "text-[var(--accent-indigo)]")}>
            PORTAL
          </Link>
        </div>

        <button
          type="button"
          className="hidden cursor-pointer border-none bg-transparent p-1 text-[var(--text-main)] max-md:flex"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-[1001] flex h-screen flex-col items-center justify-center gap-10 bg-[var(--bg-light)]",
          menuOpen ? "flex" : "hidden"
        )}
      >
        <button
          type="button"
          className="absolute right-[6%] top-6 cursor-pointer border-none bg-transparent text-[var(--text-main)] transition-colors hover:text-[var(--accent-indigo)]"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className={cn(navLinkClass, "text-[1.4rem] tracking-[3px]")}
            onClick={() => handleNavClick(item.href)}
          >
            {item.label}
          </button>
        ))}
        <Link
          href="/login"
          className={cn(navLinkClass, "text-[1.4rem] tracking-[3px] text-[var(--accent-indigo)]")}
          onClick={() => setMenuOpen(false)}
        >
          PORTAL
        </Link>
      </div>
    </>
  );
}
