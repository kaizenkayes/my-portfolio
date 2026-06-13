<<<<<<< HEAD
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
=======
interface ModalFormShellProps {
  title: string;
  maxWidth: string;
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
  error: string;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export function ModalFormShell({
  title,
<<<<<<< HEAD
  maxWidthClass,
=======
  maxWidth,
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
  error,
  isPending,
  onClose,
  onSubmit,
  children,
}: ModalFormShellProps) {
  return (
<<<<<<< HEAD
    <ModalOverlay onClose={onClose}>
      <ModalCard maxWidthClass={maxWidthClass}>
        <ModalHeader title={title} onClose={onClose} />
        <form onSubmit={onSubmit} className="modal-form">
          {children}
          {error && <p className="form-error-msg">{error}</p>}
=======
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-[4px] z-[2000] flex items-center justify-center p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <ModalCard maxWidth={maxWidth}>
        <ModalHeader title={title} onClose={onClose} />
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {children}
          {error && <p className="text-[0.85rem] text-red-400">{error}</p>}
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
          <ModalFormActions
            isPending={isPending}
            isEdit={title.includes("Edit")}
            onClose={onClose}
          />
        </form>
      </ModalCard>
<<<<<<< HEAD
    </ModalOverlay>
=======
    </div>
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
<<<<<<< HEAD
    <div className="modal-header">
      <h2 className="modal-title">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        className="modal-close-btn"
=======
    <div className="flex justify-between items-center mb-7">
      <h2 className="text-[1.2rem] font-black tracking-[-0.5px]">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        className="bg-transparent border-none cursor-pointer text-[var(--text-dim)] text-[1.2rem] hover:text-[var(--text-main)] transition-colors"
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
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
<<<<<<< HEAD
    <div className="modal-actions">
      <button type="submit" className={GRADIENT_SUBMIT_BTN} disabled={isPending}>
=======
    <div className="flex gap-3 mt-2">
      <button type="submit" className="btn-grad-border" disabled={isPending}>
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
        {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
      </button>
      <button
        type="button"
        onClick={onClose}
<<<<<<< HEAD
        className="form-btn-cancel"
=======
        className="bg-transparent border border-[var(--card-border)] text-[var(--text-dim)] px-6 py-4 cursor-pointer font-bold text-[0.85rem] tracking-[1px] uppercase hover:bg-white/5 transition-colors"
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
      >
        Cancel
      </button>
    </div>
  );
<<<<<<< HEAD
}
=======
}

function ModalCard({
  maxWidth,
  children,
}: {
  maxWidth: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="glass-card w-full overflow-y-auto max-h-[90vh]"
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
}
>>>>>>> 85540e2 (refactor: optimize auth, dashboard, public pages, and layouts)
