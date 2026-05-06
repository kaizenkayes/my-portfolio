import type { ProjectInput } from "@/lib/validations/schemas";

interface ProjectModalProps {
  form: ProjectInput;
  setForm: (f: ProjectInput) => void;
  techInput: string;
  setTechInput: (s: string) => void;
  editId: string | null;
  error: string;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ProjectModal({ 
  form, setForm, techInput, setTechInput, editId, error, isPending, onSubmit, onClose 
}: ProjectModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-[4px] z-[2000] flex items-center justify-center p-5"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass-card w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-[1.2rem] font-black tracking-[-0.5px]">
            {editId ? "Edit Project" : "New Project"}
          </h2>
          <button 
            onClick={onClose} 
            className="bg-transparent border-none cursor-pointer text-[var(--text-dim)] text-[1.2rem]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="form-label">Title *</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div>
            <label className="form-label">Short Description *</label>
            <textarea className="form-input rows-[2] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>

          <div>
            <label className="form-label">Long Description</label>
            <textarea className="form-input rows-[4] resize-y" value={form.longDescription ?? ""} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} />
          </div>

          <div>
            <label className="form-label">Tech Stack (comma separated)</label>
            <input className="form-input" placeholder="Next.js, TypeScript, MongoDB" value={techInput} onChange={(e) => setTechInput(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">GitHub URL</label>
              <input className="form-input" type="url" placeholder="https://github.com/..." value={form.githubUrl ?? ""} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Live URL</label>
              <input className="form-input" type="url" placeholder="https://..." value={form.liveUrl ?? ""} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="form-label">Status</label>
              <select 
                className="form-input" 
                value={form.status} 
                onChange={(e) => setForm({ ...form, status: e.target.value as ProjectInput["status"] })}
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="form-label">Order</label>
              <input className="form-input" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 cursor-pointer text-[var(--text-main)] text-sm font-semibold">
                <input 
                  type="checkbox" 
                  checked={form.featured} 
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-[var(--accent-gold)]"
                /> 
                Featured
              </label>
            </div>
          </div>

          {error && <p className="text-[0.85rem] text-red-400">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="submit" className="btn-grad-border" disabled={isPending}>
              {isPending ? "Saving..." : editId ? "Update Project" : "Create Project"}
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