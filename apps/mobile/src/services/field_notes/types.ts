export type FieldNoteCategory =
  | "mud_bog"
  | "bridge_stile_gate"
  | "fallen_tree"
  | "livestock"
  | "water"
  | "weather"
  | "access"
  | "facilities"
  | "welcome"
  | "viewpoint"
  | "other";

export type FieldNoteSeverity = "info" | "watch" | "hazard";

export type FieldNoteSource = "explorer" | "steward" | "admin";

export type FieldNote = {
  id: string;
  category: FieldNoteCategory;
  categoryLabel: string;
  severity: FieldNoteSeverity;
  message?: string;
  source: FieldNoteSource;
  observedAt: string;
  expiresAt?: string;
};

export type CreateFieldNoteInput = {
  checkInId?: string;
  businessLocationId?: string;
  trailId?: string;
  category: FieldNoteCategory;
  severity?: FieldNoteSeverity;
  message?: string;
};
