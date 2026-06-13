"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Switch between dark and light mode"
      className={cn(
        "fixed bottom-[30px] right-[30px] z-[1000] flex h-[54px] w-[54px] cursor-pointer items-center justify-center",
        "rounded-full border border-[var(--card-border)] bg-[var(--bg-light)] shadow-[0_5px_15px_rgba(0,0,0,0.2)] backdrop-blur-xl",
        "transition-transform duration-300 hover:scale-[1.08] max-md:bottom-5 max-md:right-5 max-md:h-12 max-md:w-12"
      )}
    >
      {!isDark ? (
        <svg
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="text-[var(--accent-gold)]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="text-[var(--accent-indigo)]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
