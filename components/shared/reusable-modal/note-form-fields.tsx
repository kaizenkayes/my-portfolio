import type { NoteInput } from "@/lib/validations/schemas";
<<<<<<< HEAD
import { cn } from "@/lib/utils";
import { FormCheckboxLabel, FormInput, FormLabel, FormTextarea } from "@/components/shared/ui/form";
=======
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
import { NOTE_COLORS } from "./constants";

interface NoteFormFieldsProps {
  form: NoteInput;
  setForm: (f: NoteInput) => void;
  tagsInput: string;
  setTagsInput: (s: string) => void;
}

export function NoteFormFields({
  form,
  setForm,
  tagsInput,
  setTagsInput,
}: NoteFormFieldsProps) {
  return (
    <>
      <div>
<<<<<<< HEAD
        <FormLabel>Title *</FormLabel>
        <FormInput
=======
        <label className="form-label">Title *</label>
        <input
          className="form-input"
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Note title..."
          required
        />
      </div>

      <div>
<<<<<<< HEAD
        <FormLabel>Content *</FormLabel>
        <FormTextarea
=======
        <label className="form-label">Content *</label>
        <textarea
          className="form-input"
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
          rows={6}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Write your note here..."
          required
<<<<<<< HEAD
=======
          style={{ resize: "vertical" }}
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
        />
      </div>

      <div>
<<<<<<< HEAD
        <FormLabel>Tags (comma separated)</FormLabel>
        <FormInput
=======
        <label className="form-label">Tags (comma separated)</label>
        <input
          className="form-input"
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
          placeholder="react, tips, architecture"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>

      <div>
<<<<<<< HEAD
        <FormLabel>Color</FormLabel>
        <div className="flex flex-wrap gap-2">
=======
        <label className="form-label">Color</label>
        <div className="flex gap-2 flex-wrap">
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
          {NOTE_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setForm({ ...form, color: c.value })}
<<<<<<< HEAD
              title={c.label}
              className={cn(
                "h-8 w-8 cursor-pointer rounded-full transition-all duration-200",
                form.color === c.value
                  ? "border-2 border-[var(--accent-indigo)]"
                  : "border-2 border-[var(--card-border)]"
              )}
              style={{ background: c.value }}
=======
              className="w-8 h-8 rounded-full cursor-pointer transition-all duration-200"
              style={{
                background: c.value,
                border:
                  form.color === c.value
                    ? "2px solid var(--accent-indigo)"
                    : "2px solid var(--card-border)",
              }}
              title={c.label}
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
            />
          ))}
        </div>
      </div>

<<<<<<< HEAD
      <FormCheckboxLabel>
=======
      <label className="flex items-center gap-2 cursor-pointer text-[var(--text-main)] text-sm font-semibold">
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
        <input
          type="checkbox"
          checked={form.isPinned}
          onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
          className="accent-[var(--accent-gold)]"
        />
        📌 Pin this note
<<<<<<< HEAD
      </FormCheckboxLabel>
=======
      </label>
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
    </>
  );
}
