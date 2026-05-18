import Link from "next/link";

export function SidebarHeader({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{ padding: "20px" }}
      className="px-5 py-6 border-b border-[var(--card-border)] flex items-center justify-between"
    >
      <div>
        <Link
          href="/"
          className="font-black text-[1.2rem] p-4 tracking-tight text-[var(--text-main)] no-underline"
        >
          K.<span className="gold">Kayes</span>
        </Link>
        <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-[var(--text-dim)] mt-1">
          ADMIN PORTAL
        </p>
      </div>

      <button
        onClick={onClose}
        className="sidebar-close-btn bg-transparent border-none cursor-pointer text-[var(--text-dim)] p-1 hidden items-center justify-center"
        aria-label="Close sidebar"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
