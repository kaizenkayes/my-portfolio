import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { ReactNode } from "react";
import { DashboardShell, DashboardSidebar } from "@/components/dashboard";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-[var(--bg-light)]">
      <DashboardSidebar />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}