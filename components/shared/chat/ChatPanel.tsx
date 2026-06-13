"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatSuggestions } from "./ChatSuggestions";
import { MessageBubble, type ChatMessage } from "./MessageBubble";
import { TypingDots } from "./TypingDots";
import { AIIcon } from "./AIIcon";

interface ChatPanelProps {
  messages: ChatMessage[];
  suggestions: string[];
  showSuggestions: boolean;
  input: string;
  loading: boolean;
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSend: (text: string) => void;
}

export function ChatPanel({
  messages,
  suggestions,
  showSuggestions,
  input,
  loading,
  onClose,
  onInputChange,
  onSend,
}: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed bottom-[100px] left-[30px] z-[999] flex h-[520px] max-h-[70vh] w-[360px] max-w-[calc(100vw-60px)] flex-col overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--bg-subtle)] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] backdrop-blur-xl max-md:bottom-20 max-md:left-5"
    >
      <ChatHeader onClose={onClose} />

      <div className="flex flex-1 flex-col overflow-y-auto px-4 pt-4 pb-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2.5 flex items-start gap-2"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--card-border)] bg-[linear-gradient(135deg,rgba(240,177,51,0.15),rgba(129,140,248,0.15))]">
              <AIIcon size={14} />
            </div>
            <div className="rounded-2xl rounded-bl rounded-tl-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3.5 py-2.5">
              <TypingDots />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {showSuggestions && (
        <ChatSuggestions suggestions={suggestions} onSelect={onSend} />
      )}

      <ChatInput
        inputRef={inputRef}
        value={input}
        loading={loading}
        onChange={onInputChange}
        onSend={() => onSend(input)}
      />
    </motion.div>
  );
}
