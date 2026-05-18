import type { SkillInput } from "@/lib/validations/schemas";

interface SkillFormFieldsProps {
  form: SkillInput;
  setForm: (f: SkillInput) => void;
  categories: readonly string[];
}

export function SkillFormFields({ form, setForm, categories }: SkillFormFieldsProps) {
  return (
    <>
      <div>
        <label className="form-label">Skill Name *</label>
        <input
          className="form-input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Next.js"
          required
        />
      </div>

      <div>
        <label className="form-label">Category *</label>
        <select
          className="form-input"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value as SkillInput["category"],
            })
          }
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label">Order</label>
        <input
          className="form-input"
          type="number"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
        />
      </div>
    </>
  );
}
