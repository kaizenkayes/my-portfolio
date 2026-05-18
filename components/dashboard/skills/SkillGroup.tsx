import type { ISkill } from "@/types";

interface SkillGroupProps {
  cat: string;
  items: ISkill[];
  isAdmin: boolean;
  onEdit: (skill: ISkill) => void;
  onDelete: (id: string) => void;
}

export function SkillGroup({ cat, items, isAdmin, onEdit, onDelete }: SkillGroupProps) {
  return (
    <div className="glass-card p-7">
      <h3 className="text-[0.75rem] font-bold tracking-[0.3em] uppercase text-[var(--accent-gold)] mb-5">
        {cat}
      </h3>
      <div className="flex flex-col gap-4">
        {items.map((skill) => (
          <div key={skill._id}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-semibold text-[0.9rem]">{skill.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[0.75rem] text-[var(--text-dim)] font-bold">
                  {skill.proficiency}%
                </span>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(skill)} className="bg-transparent border-none cursor-pointer text-[var(--accent-indigo)] text-[0.75rem] font-bold px-1.5 py-0.5">
                      Edit
                    </button>
                    <button onClick={() => onDelete(skill._id)} className="bg-transparent border-none cursor-pointer text-red-400 text-[0.75rem] font-bold px-1.5 py-0.5">
                      Del
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="skill-bar-track">
              <div className="skill-bar-fill" style={{ width: `${skill.proficiency}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
