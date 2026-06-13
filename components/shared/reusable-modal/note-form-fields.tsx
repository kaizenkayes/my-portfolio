import type { NoteInput } from "@/lib/validations/schemas";
import { cn } from "@/lib/utils";
import { FormCheckboxLabel, FormInput, FormLabel, FormTextarea } from "@/components/shared/ui/form";
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
        <FormLabel>Title *</FormLabel>
        <FormInput
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Note title..."
          required
        />
      </div>

      <div>
        <FormLabel>Content *</FormLabel>
        <FormTextarea
          rows={6}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Write your note here..."
          required
        />
      </div>

      <div>
        <FormLabel>Tags (comma separated)</FormLabel>
        <FormInput
          placeholder="react, tips, architecture"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>

      <div>
        <FormLabel>Color</FormLabel>
        <div className="flex flex-wrap gap-2">
          {NOTE_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setForm({ ...form, color: c.value })}
              title={c.label}
              className={cn(
                "h-8 w-8 cursor-pointer rounded-full transition-all duration-200",
                form.color === c.value
                  ? "border-2 border-[var(--accent-indigo)]"
                  : "border-2 border-[var(--card-border)]"
              )}
              style={{ background: c.value }}
            />
          ))}
        </div>
      </div>

      <FormCheckboxLabel>
        <input
          type="checkbox"
          checked={form.isPinned}
          onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
          className="accent-[var(--accent-gold)]"
        />
        📌 Pin this note
      </FormCheckboxLabel>
    </>
  );
}
