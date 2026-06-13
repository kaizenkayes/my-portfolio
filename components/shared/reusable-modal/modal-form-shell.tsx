// import {
//   GRADIENT_SUBMIT_BTN,
//   ModalCard,
//   ModalOverlay,
// } from "@/components/shared/ui/modal";

// interface ModalFormShellProps {
//   title: string;
//   maxWidthClass: string;
//   error: string;
//   isPending: boolean;
//   onClose: () => void;
//   onSubmit: (e: React.FormEvent) => void;
//   children: React.ReactNode;
// }

// export function ModalFormShell({
//   title,
//   maxWidthClass,
//   error,
//   isPending,
//   onClose,
//   onSubmit,
//   children,
// }: ModalFormShellProps) {
//   return (
//     <ModalOverlay onClose={onClose}>
//       <ModalCard maxWidthClass={maxWidthClass}>
//         <ModalHeader title={title} onClose={onClose} />
//         <form onSubmit={onSubmit} className="flex flex-col gap-4">
//           {children}
//           {error && <p className="text-[0.85rem] text-red-400">{error}</p>}
//           <ModalFormActions
//             isPending={isPending}
//             isEdit={title.includes("Edit")}
//             onClose={onClose}
//           />
//         </form>
//       </ModalCard>
//     </ModalOverlay>
//   );
// }

// function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
//   return (
//     <div className="mb-7 flex items-center justify-between">
//       <h2 className="text-[1.2rem] font-black tracking-[-0.5px]">{title}</h2>
//       <button
//         type="button"
//         onClick={onClose}
//         className="cursor-pointer border-none bg-transparent text-[1.2rem] text-[var(--text-dim)] transition-colors hover:text-[var(--text-main)]"
//       >
//         ✕
//       </button>
//     </div>
//   );
// }

// function ModalFormActions({
//   isPending,
//   isEdit,
//   onClose,
// }: {
//   isPending: boolean;
//   isEdit: boolean;
//   onClose: () => void;
// }) {
//   return (
//     <div className="mt-2 flex gap-3">
//       <button type="submit" className={GRADIENT_SUBMIT_BTN} disabled={isPending}>
//         {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
//       </button>
//       <button
//         type="button"
//         onClick={onClose}
//         className="cursor-pointer border border-[var(--card-border)] bg-transparent px-6 py-4 text-[0.85rem] font-bold tracking-[1px] text-[var(--text-dim)] uppercase transition-colors hover:bg-white/5"
//       >
//         Cancel
//       </button>
//     </div>
//   );
// }


import {
  GRADIENT_SUBMIT_BTN,
  ModalCard,
  ModalOverlay,
} from "@/components/shared/ui/modal";

interface ModalFormShellProps {
  title: string;
  maxWidthClass: string;
  error: string;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export function ModalFormShell({
  title,
  maxWidthClass,
  error,
  isPending,
  onClose,
  onSubmit,
  children,
}: ModalFormShellProps) {
  return (
    <ModalOverlay onClose={onClose}>
      <ModalCard maxWidthClass={maxWidthClass}>
        <ModalHeader title={title} onClose={onClose} />
        <form onSubmit={onSubmit} className="modal-form">
          {children}
          {error && <p className="form-error-msg">{error}</p>}
          <ModalFormActions
            isPending={isPending}
            isEdit={title.includes("Edit")}
            onClose={onClose}
          />
        </form>
      </ModalCard>
    </ModalOverlay>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="modal-header">
      <h2 className="modal-title">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        className="modal-close-btn"
      >
        ✕
      </button>
    </div>
  );
}

function ModalFormActions({
  isPending,
  isEdit,
  onClose,
}: {
  isPending: boolean;
  isEdit: boolean;
  onClose: () => void;
}) {
  return (
    <div className="modal-actions">
      <button type="submit" className={GRADIENT_SUBMIT_BTN} disabled={isPending}>
        {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="form-btn-cancel"
      >
        Cancel
      </button>
    </div>
  );
}