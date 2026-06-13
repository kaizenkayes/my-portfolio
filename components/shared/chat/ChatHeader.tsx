import { AIIcon } from "./AIIcon";

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-[var(--card-border)] bg-[linear-gradient(135deg,rgba(240,177,51,0.06),rgba(129,140,248,0.06))] px-5 py-4">
      <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-[var(--card-border)] bg-[linear-gradient(135deg,rgba(240,177,51,0.2),rgba(129,140,248,0.2))]">
        <AIIcon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-[0.9rem] font-extrabold tracking-tight text-[var(--text-main)]">
          Kayes<span className="text-[var(--accent-gold)]">.</span>AI
        </p>
        <div className="flex items-center gap-[5px]">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
          <p className="text-[0.72rem] font-semibold text-[var(--text-dim)]">
            Online — Portfolio Assistant
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close chat"
        className="flex cursor-pointer items-center border-none bg-transparent p-1 text-[var(--text-dim)]"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
