import type {
  SkillInput,
  ProjectInput,
  NoteInput,
  LearningLogInput,
} from "@/lib/validations/schemas";

export type ModalType = "skill" | "project" | "note" | "learning";

export interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  error: string;
  isPending: boolean;
  modalType: ModalType;
  skillForm?: SkillInput;
  setSkillForm?: (f: SkillInput) => void;
  categories?: readonly string[];
  projectForm?: ProjectInput;
  setProjectForm?: (f: ProjectInput) => void;
  techInput?: string;
  setTechInput?: (s: string) => void;
  noteForm?: NoteInput;
  setNoteForm?: (f: NoteInput) => void;
  tagsInput?: string;
  setTagsInput?: (s: string) => void;
  learningForm?: LearningLogInput;
  setLearningForm?: (f: LearningLogInput) => void;
}
