// import { cn } from "@/lib/utils";
// import type { ReactNode } from "react";

// export const MODAL_OVERLAY =
//   "fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-5 backdrop-blur-[4px]";

// export const MODAL_CARD =
//   "max-h-[90vh] w-full overflow-y-auto rounded-sm border border-[var(--card-border)] bg-[var(--card-bg)] p-10 shadow-[var(--shadow-sm)] backdrop-blur-xl";

// export const GRADIENT_SUBMIT_BTN =
//   "relative cursor-pointer border-2 border-transparent bg-[var(--bg-light)] px-[42px] py-4 font-[inherit] text-[0.9rem] font-extrabold uppercase tracking-[1px] text-[var(--text-main)] transition-[transform,color,box-shadow] duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] [background-clip:padding-box,border-box] [background-image:linear-gradient(var(--bg-light),var(--bg-light)),linear-gradient(135deg,var(--accent-gold),var(--accent-indigo))] [background-origin:border-box] hover:scale-[1.02] hover:text-[var(--accent-indigo)] hover:shadow-[0_15px_35px_rgba(129,140,248,0.2)] disabled:cursor-not-allowed disabled:opacity-60";

// export function ModalOverlay({
//   onClose,
//   children,
// }: {
//   onClose: () => void;
//   children: ReactNode;
// }) {
//   return (
//     <div
//       className={MODAL_OVERLAY}
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// export function ModalCard({
//   maxWidthClass,
//   children,
// }: {
//   maxWidthClass: string;
//   children: ReactNode;
// }) {
//   return <div className={cn(MODAL_CARD, maxWidthClass)}>{children}</div>;
// }


import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// কাস্টম CSS ক্লাস অ্যাসাইন করা হলো
export const MODAL_OVERLAY = "modal-overlay";
export const MODAL_CARD = "modal-card";
export const GRADIENT_SUBMIT_BTN = "gradient-submit-btn";

export function ModalOverlay({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={MODAL_OVERLAY}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}

export function ModalCard({
  maxWidthClass,
  children,
}: {
  maxWidthClass: string; // এখানে আগের ধাপের "modal-lg" বা "modal-md" আসবে
  children: ReactNode;
}) {
  return <div className={cn(MODAL_CARD, maxWidthClass)}>{children}</div>;
}