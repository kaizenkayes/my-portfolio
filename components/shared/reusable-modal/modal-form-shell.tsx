interface ModalFormShellProps {
  title: string;
  maxWidth: string;
  error: string;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export function ModalFormShell({
  title,
  maxWidth,
  error,
  isPending,
  onClose,
  onSubmit,
  children,
}: ModalFormShellProps) {
  return (
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
          <ModalFormActions
            isPending={isPending}
            isEdit={title.includes("Edit")}
            onClose={onClose}
          />
        </form>
      </ModalCard>
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex justify-between items-center mb-7">
      <h2 className="text-[1.2rem] font-black tracking-[-0.5px]">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        className="bg-transparent border-none cursor-pointer text-[var(--text-dim)] text-[1.2rem] hover:text-[var(--text-main)] transition-colors"
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
    <div className="flex gap-3 mt-2">
      <button type="submit" className="btn-grad-border" disabled={isPending}>
        {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="bg-transparent border border-[var(--card-border)] text-[var(--text-dim)] px-6 py-4 cursor-pointer font-bold text-[0.85rem] tracking-[1px] uppercase hover:bg-white/5 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
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
