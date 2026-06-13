"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AIIcon } from "./AIIcon";

interface ChatToggleProps {
  open: boolean;
  unread: number;
  onToggle: () => void;
}

export function ChatToggle({ open, unread, onToggle }: ChatToggleProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label="Toggle AI chat"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "fixed bottom-[30px] left-[30px] z-[1000] flex h-[54px] w-[54px] cursor-pointer items-center justify-center rounded-full border border-[var(--card-border)] shadow-[0_5px_20px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-colors duration-300 max-md:bottom-5 max-md:left-5 max-md:h-12 max-md:w-12",
        open
          ? "bg-[var(--bg-light)]"
          : "bg-[linear-gradient(135deg,rgba(240,177,51,0.15),rgba(129,140,248,0.15))]"
      )}
    >
      <AnimatePresence mode="wait">
        {open ? (
          <motion.svg
            key="close"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            width="20"
            height="20"
            fill="none"
            stroke="var(--text-dim)"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </motion.svg>
        ) : (
          <motion.div
            key="ai"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <AIIcon size={24} />
          </motion.div>
        )}
      </AnimatePresence>

      {unread > 0 && !open && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--accent-gold)] text-[0.65rem] font-black text-black"
        >
          {unread}
        </motion.div>
      )}

      {!open && (
        <motion.div
          animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-[var(--accent-indigo)]"
        />
      )}
    </motion.button>
  );
}
