export function AIIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
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
