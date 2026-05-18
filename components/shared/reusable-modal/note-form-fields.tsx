import type { NoteInput } from "@/lib/validations/schemas";
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
        <label className="form-label">Title *</label>
        <input
          className="form-input"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Note title..."
          required
        />
      </div>

      <div>
        <label className="form-label">Content *</label>
        <textarea
          className="form-input"
          rows={6}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Write your note here..."
          required
          style={{ resize: "vertical" }}
        />
      </div>

      <div>
        <label className="form-label">Tags (comma separated)</label>
        <input
          className="form-input"
          placeholder="react, tips, architecture"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>

      <div>
        <label className="form-label">Color</label>
        <div className="flex gap-2 flex-wrap">
          {NOTE_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setForm({ ...form, color: c.value })}
              className="w-8 h-8 rounded-full cursor-pointer transition-all duration-200"
              style={{
                background: c.value,
                border:
                  form.color === c.value
                    ? "2px solid var(--accent-indigo)"
                    : "2px solid var(--card-border)",
              }}
              title={c.label}
            />
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer text-[var(--text-main)] text-sm font-semibold">
        <input
          type="checkbox"
          checked={form.isPinned}
          onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
          className="accent-[var(--accent-gold)]"
        />
        📌 Pin this note
      </label>
    </>
  );
}
