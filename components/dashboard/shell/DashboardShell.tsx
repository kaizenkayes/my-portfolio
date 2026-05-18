"use client";

import type { ReactNode } from "react";

export function DashboardShell({ children }: { children: ReactNode }) {
  return <main className="dash-shell">{children}</main>;
}
