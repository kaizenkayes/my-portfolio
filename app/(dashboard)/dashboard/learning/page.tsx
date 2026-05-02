import { getLearningLogs } from "@/lib/actions/index";
import { auth } from "@/auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LearningClient } from "@/components/dashboard/LearningClient";
import type { ILearningLog } from "@/types";

export default async function DashboardLearningPage() {
  const [session, logsRes] = await Promise.all([auth(), getLearningLogs()]);
  const logs = (logsRes.data ?? []) as ILearningLog[];
  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      <DashboardHeader
        title="Learning Tracker"
        subtitle={`${logs.length} entries logged`}
      />
      <LearningClient logs={logs} isAdmin={isAdmin} />
    </>
  );
}
