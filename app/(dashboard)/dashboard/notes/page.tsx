import { getNotes } from "@/lib/actions/index";
import { auth } from "@/auth";
import type { INote } from "@/types";
import { DashboardHeader, NotesClient } from "@/components/dashboard";

export default async function DashboardNotesPage() {
  const [session, notesRes] = await Promise.all([auth(), getNotes()]);
  const notes = (notesRes.data ?? []) as INote[];
  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      <DashboardHeader
        title="Notes"
        subtitle={`${notes.length} notes — ${notes.filter((n) => n.isPinned).length} pinned`}
      />
      <NotesClient notes={notes} isAdmin={isAdmin} />
    </>
  );
}
