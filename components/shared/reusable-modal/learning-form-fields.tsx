import type { LearningLogInput } from "@/lib/validations/schemas";
import { FormInput, FormLabel, FormSelect, FormTextarea } from "@/components/shared/ui/form";
import { LOG_TYPES } from "./constants";

interface LearningFormFieldsProps {
  form: LearningLogInput;
  setForm: (f: LearningLogInput) => void;
  tagsInput: string;
  setTagsInput: (s: string) => void;
}

export function LearningFormFields({
  form,
  setForm,
  tagsInput,
  setTagsInput,
}: LearningFormFieldsProps) {
  return (
    <>
      <div>
        <FormLabel>Title *</FormLabel>
        <FormInput
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormLabel>Type</FormLabel>
          <FormSelect
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as LearningLogInput["type"],
              })
            }
          >
            {LOG_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </FormSelect>
        </div>
        <div>
          <FormLabel>Date</FormLabel>
          <FormInput
            type="date"
            value={form.date ? new Date(form.date).toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value
                  ? new Date(e.target.value).toISOString()
                  : new Date().toISOString(),
              })
            }
          />
        </div>
      </div>

      <div>
        <FormLabel>Content * (Markdown supported)</FormLabel>
        <FormTextarea
          className="font-mono text-[0.875rem]"
          rows={6}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
      </div>

      <div>
        <FormLabel>Tags (comma separated)</FormLabel>
        <FormInput
          placeholder="Next.js, TypeScript, React"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>
    </>
  );
}
