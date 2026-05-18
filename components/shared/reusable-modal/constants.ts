export const LOG_TYPES = ["daily", "weekly", "resource", "milestone"] as const;

export const NOTE_COLORS = [
  { label: "Default", value: "var(--card-bg)" },
  { label: "Gold", value: "rgba(240,177,51,0.08)" },
  { label: "Indigo", value: "rgba(129,140,248,0.08)" },
  { label: "Green", value: "rgba(74,222,128,0.08)" },
  { label: "Pink", value: "rgba(244,114,182,0.08)" },
] as const;

export const MODAL_WIDTHS = {
  skill: "440px",
  project: "600px",
  note: "540px",
  learning: "560px",
} as const;
