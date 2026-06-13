"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AIIcon } from "./AIIcon";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("mb-2.5 flex", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="mr-2 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--card-border)] bg-[linear-gradient(135deg,rgba(240,177,51,0.15),rgba(129,140,248,0.15))]">
          <AIIcon size={14} />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] break-words px-3.5 py-2.5 text-[0.875rem] leading-relaxed whitespace-pre-wrap backdrop-blur-lg",
          isUser
            ? "rounded-2xl rounded-br rounded-tr-2xl bg-[linear-gradient(135deg,var(--accent-gold),var(--accent-indigo))] text-white"
            : "rounded-2xl rounded-bl rounded-tl-2xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-main)]"
        )}
      >
        {msg.content}
      </div>
    </motion.div>
  );
}
