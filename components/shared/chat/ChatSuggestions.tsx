interface ChatSuggestionsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export function ChatSuggestions({ suggestions, onSelect }: ChatSuggestionsProps) {
  return (
    <div className="flex shrink-0 flex-wrap gap-1.5 px-4 pb-2">
      {suggestions.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className="cursor-pointer rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-[5px] font-[inherit] text-[0.75rem] font-semibold text-[var(--text-dim)] transition-colors hover:border-[var(--accent-indigo)] hover:text-[var(--accent-indigo)]"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
