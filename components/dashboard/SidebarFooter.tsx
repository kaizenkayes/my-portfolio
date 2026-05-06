import Link from "next/link";
import { signOut } from "next-auth/react";

export function SidebarFooter() {
  return (
    <div className="p-4 border-t border-[var(--card-border)]">
      <Link href="/" className="sidebar-link mb-1">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        <span>View Portfolio</span>
      </Link>
      
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="sidebar-link w-full bg-transparent border-none text-left cursor-pointer text-[#f87171]"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Sign Out</span>
      </button>
    </div>
  );
}