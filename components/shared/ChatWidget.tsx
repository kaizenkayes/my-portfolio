"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { ChatPanel } from "./chat/ChatPanel";
import { ChatToggle } from "./chat/ChatToggle";
import type { ChatMessage } from "./chat/MessageBubble";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! 👋 I'm Kayes's AI assistant. Ask me anything about his projects, skills, or background!",
    },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d: { suggestions?: string[] }) => {
        if (d.suggestions) setSuggestions(d.suggestions);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });

        const data = (await res.json()) as { reply?: string; error?: string };
        const replyText = data.reply ?? data.error ?? "Sorry, something went wrong.";

        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", content: replyText },
        ]);
        if (!open) setUnread((n) => n + 1);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: "Connection error. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, open]
  );

  const showSuggestions = messages.length <= 1 && !loading && suggestions.length > 0;

  return (
    <>
      <AnimatePresence>
        {open && (
          <ChatPanel
            messages={messages}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            input={input}
            loading={loading}
            onClose={() => setOpen(false)}
            onInputChange={setInput}
            onSend={sendMessage}
          />
        )}
      </AnimatePresence>

      <ChatToggle open={open} unread={unread} onToggle={() => setOpen((v) => !v)} />
    </>
  );
}
