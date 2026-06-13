export const LOG_TYPES = ["daily", "weekly", "resource", "milestone"] as const;

export const NOTE_COLORS = [
  { label: "Default", value: "var(--card-bg)" },
  { label: "Gold", value: "rgba(240,177,51,0.08)" },
  { label: "Indigo", value: "rgba(129,140,248,0.08)" },
  { label: "Green", value: "rgba(74,222,128,0.08)" },
  { label: "Pink", value: "rgba(244,114,182,0.08)" },
] as const;

// Tailwind ক্লাসের বদলে কাস্টম CSS ক্লাস ব্যবহার করার জন্য আপডেট
export const MODAL_MAX_WIDTH = {
  skill: "modal-sm",      /* 440px */
  project: "modal-lg",    /* 600px */
  note: "modal-md",      /* 540px */
  learning: "modal-md-lg", /* 560px */
} as const;