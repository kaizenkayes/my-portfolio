import type { ProjectInput } from "@/lib/validations/schemas";
<<<<<<< HEAD
import {
  FormCheckboxLabel,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "@/components/shared/ui/form";
=======
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)

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
          required
        />
      </div>

      <div>
<<<<<<< HEAD
        <FormLabel>Short Description *</FormLabel>
        <FormTextarea
          rows={2}
=======
        <label className="form-label">Short Description *</label>
        <textarea
          className="form-input rows-[2] resize-y"
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>

      <div>
<<<<<<< HEAD
        <FormLabel>Long Description</FormLabel>
        <FormTextarea
          rows={4}
=======
        <label className="form-label">Long Description</label>
        <textarea
          className="form-input rows-[4] resize-y"
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
          value={form.longDescription ?? ""}
          onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
        />
      </div>

      <div>
<<<<<<< HEAD
        <FormLabel>Tech Stack (comma separated)</FormLabel>
        <FormInput
=======
        <label className="form-label">Tech Stack (comma separated)</label>
        <input
          className="form-input"
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
          placeholder="Next.js, TypeScript, MongoDB"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
<<<<<<< HEAD
          <FormLabel>GitHub URL</FormLabel>
          <FormInput
=======
          <label className="form-label">GitHub URL</label>
          <input
            className="form-input"
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
            type="url"
            placeholder="https://github.com/..."
            value={form.githubUrl ?? ""}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
          />
        </div>
        <div>
<<<<<<< HEAD
          <FormLabel>Live URL</FormLabel>
          <FormInput
=======
          <label className="form-label">Live URL</label>
          <input
            className="form-input"
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
            type="url"
            placeholder="https://..."
            value={form.liveUrl ?? ""}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
<<<<<<< HEAD
          <FormLabel>Status</FormLabel>
          <FormSelect
=======
          <label className="form-label">Status</label>
          <select
            className="form-input"
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
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
<<<<<<< HEAD
          </FormSelect>
        </div>
        <div>
          <FormLabel>Order</FormLabel>
          <FormInput
=======
          </select>
        </div>
        <div>
          <label className="form-label">Order</label>
          <input
            className="form-input"
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          />
        </div>
        <div className="flex items-end pb-3">
<<<<<<< HEAD
          <FormCheckboxLabel>
=======
          <label className="flex items-center gap-2 cursor-pointer text-[var(--text-main)] text-sm font-semibold">
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="accent-[var(--accent-gold)]"
            />
            Featured
<<<<<<< HEAD
          </FormCheckboxLabel>
=======
          </label>
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
        </div>
      </div>
    </>
  );
}
