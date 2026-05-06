import type { SkillInput } from "@/lib/validations/schemas";

interface SkillModalProps {
  form: SkillInput;
  setForm: (f: SkillInput) => void;
  editId: string | null;
  error: string;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  categories: readonly string[];
}

export function SkillModal({ 
  form, setForm, editId, error, isPending, onSubmit, onClose, categories 
}: SkillModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-[4px] z-[2000] flex items-center justify-center p-5"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass-card w-full max-w-[440px]">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-[1.2rem] font-black tracking-[-0.5px]">
            {editId ? "Edit Skill" : "New Skill"}
          </h2>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer text-[var(--text-dim)] text-[1.2rem]">✕</button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="form-label">Skill Name *</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Next.js" required />
          </div>

          <div>
            <label className="form-label">Category *</label>
            <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as SkillInput["category"] })}>
              {categories.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Proficiency: {form.proficiency}%</label>
            <input
              type="range"
              min={1}
              max={100}
              value={form.proficiency}
              onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
              className="w-full accent-[var(--accent-indigo)] cursor-pointer"
            />
            <div className="skill-bar-track mt-2">
              <div className="skill-bar-fill" style={{ width: `${form.proficiency}%` }} />
            </div>
          </div>

          <div>
            <label className="form-label">Order</label>
            <input className="form-input" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          </div>

          {error && <p className="text-[0.85rem] text-red-400">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="submit" className="btn-grad-border" disabled={isPending}>
              {isPending ? "Saving..." : editId ? "Update" : "Create"}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-transparent border border-[var(--card-border)] text-[var(--text-dim)] px-6 py-4 cursor-pointer font-bold text-[0.85rem] tracking-[1px] uppercase"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}