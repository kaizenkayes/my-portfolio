import { getLearningLogs } from "@/lib/actions/index";
import { auth } from "@/auth";
import type { ILearningLog } from "@/types";
import { DashboardHeader, LearningClient } from "@/components/dashboard";

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
