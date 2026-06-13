import { MODAL_MAX_WIDTH } from "./constants";
import { LearningFormFields } from "./learning-form-fields";
import { ModalFormShell } from "./modal-form-shell";
import { NoteFormFields } from "./note-form-fields";
import { ProjectFormFields } from "./project-form-fields";
import { SkillFormFields } from "./skill-form-fields";
import type { ReusableModalProps } from "./types";

export type { ReusableModalProps, ModalType } from "./types";
export { ReusableModal };

function ReusableModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  error,
  isPending,
  modalType,
  skillForm,
  setSkillForm,
  categories,
  projectForm,
  setProjectForm,
  techInput,
  setTechInput,
  noteForm,
  setNoteForm,
  tagsInput,
  setTagsInput,
  learningForm,
  setLearningForm,
}: ReusableModalProps) {
  if (!isOpen) return null;

  return (
    <ModalFormShell
      title={title}
      maxWidthClass={MODAL_MAX_WIDTH[modalType]}
      error={error}
      isPending={isPending}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      {modalType === "skill" && skillForm && setSkillForm && categories && (
        <SkillFormFields
          form={skillForm}
          setForm={setSkillForm}
          categories={categories}
        />
      )}
      {modalType === "project" &&
        projectForm &&
        setProjectForm &&
        techInput !== undefined &&
        setTechInput && (
          <ProjectFormFields
            form={projectForm}
            setForm={setProjectForm}
            techInput={techInput}
            setTechInput={setTechInput}
          />
        )}
      {modalType === "note" &&
        noteForm &&
        setNoteForm &&
        tagsInput !== undefined &&
        setTagsInput && (
          <NoteFormFields
            form={noteForm}
            setForm={setNoteForm}
            tagsInput={tagsInput}
            setTagsInput={setTagsInput}
          />
        )}
      {modalType === "learning" &&
        learningForm &&
        setLearningForm &&
        tagsInput !== undefined &&
        setTagsInput && (
          <LearningFormFields
            form={learningForm}
            setForm={setLearningForm}
            tagsInput={tagsInput}
            setTagsInput={setTagsInput}
          />
        )}
    </ModalFormShell>
  );
}
