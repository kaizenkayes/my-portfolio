"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex flex-col items-center justify-center text-center px-5 py-10">
      <p className="font-mono text-[10px] font-bold tracking-[0.4em] text-red-400 uppercase mb-4">
        500 // Something went wrong
      </p>

      <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-black tracking-[-2px] text-[var(--text-main)] mb-4">
        Server <span className="text-red-400">Error.</span>
      </h1>

      <p className="text-[var(--text-dim)] max-w-[400px] mb-10">
        An unexpected error occurred. Please try again.
      </p>

      <button className="btn-grad-border" onClick={reset}>
        Try Again
      </button>
    </div>
  );
}