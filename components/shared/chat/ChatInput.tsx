import { cn } from "@/lib/utils";
import type { RefObject, KeyboardEvent } from "react";

interface ChatInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ inputRef, value, loading, onChange, onSend }: ChatInputProps) {
  const canSend = value.trim().length > 0 && !loading;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-[var(--card-border)] bg-[var(--bg-light)] px-4 py-3">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about projects, skills..."
        disabled={loading}
        className="flex-1 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2.5 font-[inherit] text-[0.875rem] text-[var(--text-main)] outline-none transition-colors focus:border-[var(--accent-indigo)]"
      />
      <button
        type="button"
        onClick={onSend}
        disabled={!canSend}
        aria-label="Send"
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--card-border)] transition-all",
          canSend
            ? "cursor-pointer bg-[linear-gradient(135deg,var(--accent-gold),var(--accent-indigo))] opacity-100"
            : "cursor-not-allowed bg-[var(--card-bg)] opacity-50"
        )}
      >
        <svg
          width="16"
          height="16"
          fill="none"
          stroke={canSend ? "#fff" : "var(--text-dim)"}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
