import type { ProjectInput } from "@/lib/validations/schemas";
import {
  FormCheckboxLabel,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "@/components/shared/ui/form";

interface ProjectFormFieldsProps {
  form: ProjectInput;
  setForm: (f: ProjectInput) => void;
  techInput: string;
  setTechInput: (s: string) => void;
}

export function ProjectFormFields({
  form,
  setForm,
  techInput,
  setTechInput,
}: ProjectFormFieldsProps) {
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

      <div>
        <FormLabel>Short Description *</FormLabel>
        <FormTextarea
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>

      <div>
        <FormLabel>Long Description</FormLabel>
        <FormTextarea
          rows={4}
          value={form.longDescription ?? ""}
          onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
        />
      </div>

      <div>
        <FormLabel>Tech Stack (comma separated)</FormLabel>
        <FormInput
          placeholder="Next.js, TypeScript, MongoDB"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormLabel>GitHub URL</FormLabel>
          <FormInput
            type="url"
            placeholder="https://github.com/..."
            value={form.githubUrl ?? ""}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
          />
        </div>
        <div>
          <FormLabel>Live URL</FormLabel>
          <FormInput
            type="url"
            placeholder="https://..."
            value={form.liveUrl ?? ""}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <FormLabel>Status</FormLabel>
          <FormSelect
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as ProjectInput["status"],
              })
            }
          >
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="archived">Archived</option>
          </FormSelect>
        </div>
        <div>
          <FormLabel>Order</FormLabel>
          <FormInput
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          />
        </div>
        <div className="flex items-end pb-3">
          <FormCheckboxLabel>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="accent-[var(--accent-gold)]"
            />
            Featured
          </FormCheckboxLabel>
        </div>
      </div>
    </>
  );
}
