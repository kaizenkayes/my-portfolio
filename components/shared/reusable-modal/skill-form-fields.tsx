import type { SkillInput } from "@/lib/validations/schemas";
import { FormInput, FormLabel, FormSelect } from "@/components/shared/ui/form";

interface SkillFormFieldsProps {
  form: SkillInput;
  setForm: (f: SkillInput) => void;
  categories: readonly string[];
}

export function SkillFormFields({ form, setForm, categories }: SkillFormFieldsProps) {
  return (
    <>
      <div>
        <FormLabel>Skill Name *</FormLabel>
        <FormInput
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Next.js"
          required
        />
      </div>

      <div>
        <FormLabel>Category *</FormLabel>
        <FormSelect
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
    </>
  );
}
