"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ─── AI ICON ─────────────────────────────────────────────────
function AIIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="1.5" fill="url(#aiG)" />
      <circle cx="7.5" cy="11" r="1.2" fill="url(#aiG)" />
      <circle cx="16.5" cy="11" r="1.2" fill="url(#aiG)" />
      <circle cx="9" cy="15" r="1.2" fill="url(#aiG)" />
      <circle cx="15" cy="15" r="1.2" fill="url(#aiG)" />
      <line x1="12" y1="9.5" x2="8.3" y2="10.2" stroke="url(#aiG)" strokeWidth="0.8" />
      <line x1="12" y1="9.5" x2="15.7" y2="10.2" stroke="url(#aiG)" strokeWidth="0.8" />
      <line x1="8.3" y1="12" x2="9.5" y2="14" stroke="url(#aiG)" strokeWidth="0.8" />
      <line x1="15.7" y1="12" x2="14.5" y2="14" stroke="url(#aiG)" strokeWidth="0.8" />
      <line x1="10.2" y1="15" x2="13.8" y2="15" stroke="url(#aiG)" strokeWidth="0.8" />
      <defs>
        <linearGradient id="aiG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent-gold)" />
          <stop offset="100%" stopColor="var(--accent-indigo)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── TYPING DOTS ─────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-indigo)" }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── MESSAGE BUBBLE ───────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: "10px" }}
    >
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "linear-gradient(135deg,rgba(240,177,51,.15),rgba(129,140,248,.15))",
          border: "1px solid var(--card-border)", display: "flex", alignItems: "center",
          justifyContent: "center", flexShrink: 0, marginRight: "8px", marginTop: "2px",
        }}>
          <AIIcon size={14} />
        </div>
      )}
      <div style={{
        maxWidth: "80%", padding: "10px 14px",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: isUser
          ? "linear-gradient(135deg,var(--accent-gold),var(--accent-indigo))"
          : "var(--card-bg)",
        border: isUser ? "none" : "1px solid var(--card-border)",
        color: isUser ? "#fff" : "var(--text-main)",
        fontSize: "0.875rem", lineHeight: 1.6,
        backdropFilter: "blur(8px)", whiteSpace: "pre-wrap", wordBreak: "break-word",
      }}>
        {msg.content}
      </div>
    </motion.div>
  );
}

// ─── MAIN WIDGET ──────────────────────────────────────────────
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome",
    role: "assistant",
    content: "Hi! 👋 I'm Kayes's AI assistant. Ask me anything about his projects, skills, or background!",
  }]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions on mount
  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d: { suggestions?: string[] }) => {
        if (d.suggestions) setSuggestions(d.suggestions);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ← Send { message } — matches the API
        body: JSON.stringify({ message: trimmed }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };
      const replyText = data.reply ?? data.error ?? "Sorry, something went wrong.";

      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", content: replyText }]);
      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`, role: "assistant",
        content: "Connection error. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const showSuggestions = messages.length <= 1 && !loading && suggestions.length > 0;

  return (
    <>
      {/* ── CHAT PANEL ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: "fixed", bottom: "100px", left: "30px",
              width: "360px", maxWidth: "calc(100vw - 60px)",
              height: "520px", maxHeight: "70vh", zIndex: 999,
              display: "flex", flexDirection: "column",
              background: "var(--bg-subtle)", border: "1px solid var(--card-border)",
              borderRadius: "16px", backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 24px 48px -12px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 20px", borderBottom: "1px solid var(--card-border)",
              display: "flex", alignItems: "center", gap: "12px", flexShrink: 0,
              background: "linear-gradient(135deg,rgba(240,177,51,.06),rgba(129,140,248,.06))",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,rgba(240,177,51,.2),rgba(129,140,248,.2))",
                border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <AIIcon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)", letterSpacing: "-0.3px" }}>
                  Kayes<span style={{ color: "var(--accent-gold)" }}>.</span>AI
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
                  <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontWeight: 600 }}>
                    Online — Portfolio Assistant
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-dim)", padding: "4px", display: "flex", alignItems: "center",
              }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column" }}>
              {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
              {loading && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "10px" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg,rgba(240,177,51,.15),rgba(129,140,248,.15))",
                    border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <AIIcon size={14} />
                  </div>
                  <div style={{
                    padding: "10px 14px", background: "var(--card-bg)",
                    border: "1px solid var(--card-border)", borderRadius: "16px 16px 16px 4px",
                  }}>
                    <TypingDots />
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <div style={{ padding: "0 16px 8px", display: "flex", flexWrap: "wrap", gap: "6px", flexShrink: 0 }}>
                {suggestions.map((s) => (
                  <button key={s} onClick={() => sendMessage(s)} style={{
                    background: "var(--card-bg)", border: "1px solid var(--card-border)",
                    borderRadius: "20px", padding: "5px 12px", fontSize: "0.75rem",
                    color: "var(--text-dim)", cursor: "pointer", fontFamily: "inherit",
                    fontWeight: 600, transition: "all 0.2s",
                  }}
                    onMouseEnter={(e) => {
                      const t = e.currentTarget;
                      t.style.borderColor = "var(--accent-indigo)";
                      t.style.color = "var(--accent-indigo)";
                    }}
                    onMouseLeave={(e) => {
                      const t = e.currentTarget;
                      t.style.borderColor = "var(--card-border)";
                      t.style.color = "var(--text-dim)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: "12px 16px", borderTop: "1px solid var(--card-border)",
              display: "flex", gap: "8px", alignItems: "center",
              background: "var(--bg-light)", flexShrink: 0,
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about projects, skills..."
                disabled={loading}
                style={{
                  flex: 1, background: "var(--card-bg)", border: "1px solid var(--card-border)",
                  borderRadius: "24px", padding: "10px 16px", color: "var(--text-main)",
                  fontSize: "0.875rem", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--accent-indigo)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--card-border)"; }}
              />
              <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} aria-label="Send" style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: input.trim() && !loading
                  ? "linear-gradient(135deg,var(--accent-gold),var(--accent-indigo))"
                  : "var(--card-bg)",
                border: "1px solid var(--card-border)",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: input.trim() && !loading ? 1 : 0.5, transition: "all 0.2s",
              }}>
                <svg width="16" height="16" fill="none"
                  stroke={input.trim() && !loading ? "#fff" : "var(--text-dim)"} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOGGLE BUTTON ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle AI chat"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed", bottom: "30px", left: "30px", width: 54, height: 54,
          borderRadius: "50%", zIndex: 1000, cursor: "pointer",
          background: open
            ? "var(--bg-light)"
            : "linear-gradient(135deg,rgba(240,177,51,.15),rgba(129,140,248,.15))",
          border: "1px solid var(--card-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 5px 20px rgba(0,0,0,0.25)", backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)", transition: "background 0.3s ease",
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg key="close"
              initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}
              width="20" height="20" fill="none" stroke="var(--text-dim)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.div key="ai"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}>
              <AIIcon size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {unread > 0 && !open && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{
            position: "absolute", top: -3, right: -3, width: 18, height: 18,
            borderRadius: "50%", background: "var(--accent-gold)", color: "#000",
            fontSize: "0.65rem", fontWeight: 900, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            {unread}
          </motion.div>
        )}

        {/* Pulse ring */}
        {!open && (
          <motion.div
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "2px solid var(--accent-indigo)", pointerEvents: "none",
            }}
          />
        )}
      </motion.button>
    </>
  );
}